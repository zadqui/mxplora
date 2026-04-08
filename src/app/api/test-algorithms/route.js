import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calcularDistanciaHaversine } from '../../../lib/mathUtils';
import { calcularVectorTurista } from '../../../lib/CalcularVector';
import { calcularSimilitudEtiquetasDinamicas } from '../../../lib/nplUtils';

// ─── CLIENTE SUPABASE (solo para lectura interna del servidor) ────────────────
// La service role key se usa únicamente en este contexto de servidor (Next.js
// API Route). Nunca se expone al cliente. El endpoint está protegido por JWT.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const DEFAULT_PESOS = { alpha: 0.5, beta: 0.2, gamma: 0.2, delta: 0.1 };

// Fallback geográfico: centro de Mérida
const LAT_DEFAULT = 20.9674;
const LNG_DEFAULT = -89.5926;

// Ventana de tiempo para calcular popularidad derivada (fix #6)
const DIAS_POPULARIDAD = 90;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/**
 * Extrae y valida el JWT del header Authorization.
 * Retorna el turista_id si el token es válido, o null si no lo es.
 *
 * Fix #7: protege el endpoint contra acceso sin autenticación.
 * Cualquier UUID puede ser consultado si no hay verificación — esto lo cierra.
 *
 * @param {Request} request
 * @returns {Promise<string|null>} userId autenticado o null
 */
async function autenticarRequest(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);

  // Verificamos el JWT contra Supabase Auth
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  return user.id;
}

/**
 * Normaliza los pesos para que sumen exactamente 1.0.
 * Fix #5: evita scores no comparables entre consultas con pesos arbitrarios.
 *
 * Si la suma es 0 (todos en cero), retorna los pesos por defecto.
 *
 * @param {{ alpha: number, beta: number, gamma: number, delta: number }} pesos
 * @returns {{ alpha: number, beta: number, gamma: number, delta: number }}
 */
function normalizarPesos(pesos) {
  const suma = pesos.alpha + pesos.beta + pesos.gamma + pesos.delta;
  if (suma === 0) return DEFAULT_PESOS;
  return {
    alpha: pesos.alpha / suma,
    beta:  pesos.beta  / suma,
    gamma: pesos.gamma / suma,
    delta: pesos.delta / suma,
  };
}

/**
 * Calcula la popularidad de cada negocio a partir de eventos reales.
 * Fix #6: reemplaza el placeholder `popularidad ?? 0.75` que hacía
 * que β·popularidad fuera una constante sin poder discriminatorio.
 *
 * Métrica: conteo ponderado de eventos (visit + reseña pesan más)
 * normalizado entre 0 y 1 respecto al negocio más popular del conjunto.
 *
 * Pesos internos de popularidad:
 *   visit: 3, resena: 5, save: 2, click: 1
 *
 * @param {string[]} negociosIds
 * @param {number}   diasVentana
 * @returns {Promise<Record<string, number>>} { negocio_id: score [0,1] }
 */
async function calcularPopularidadNegocios(negociosIds, diasVentana = DIAS_POPULARIDAD) {
  const desde = new Date(Date.now() - diasVentana * 24 * 60 * 60 * 1000).toISOString();

  const { data: eventos, error } = await supabase
    .from('eventos_usuario')
    .select('negocio_id, tipo')
    .in('negocio_id', negociosIds)
    .gte('fecha_evento', desde);

  if (error || !eventos) return {};

  const PESOS_POP = { visit: 3, resena: 5, save: 2, click: 1 };

  const conteos = {};
  for (const e of eventos) {
    const peso = PESOS_POP[e.tipo] ?? 0;
    conteos[e.negocio_id] = (conteos[e.negocio_id] ?? 0) + peso;
  }

  // Normalizar entre 0 y 1
  const maximo = Math.max(...Object.values(conteos), 1);
  const popularidadNormalizada = {};
  for (const id of negociosIds) {
    popularidadNormalizada[id] = (conteos[id] ?? 0) / maximo;
  }

  return popularidadNormalizada;
}

// ─── ENDPOINT GET ─────────────────────────────────────────────────────────────
// URL: /api/test-algorithms?turistaId=UUID&categoria=comida
//      &lat=20.96&lng=-89.59
//      &alpha=0.5&beta=0.2&gamma=0.2&delta=0.1
//
// Headers requeridos:
//   Authorization: Bearer <supabase_jwt>
export async function GET(request) {
  // ── Autenticación comentado temporalemente ──────────────────────────────────────────────────
  /*
  const usuarioAutenticadoId = await autenticarRequest(request);
  if (!usuarioAutenticadoId) {
    console.log(request.headers.get('authorization'));
    return NextResponse.json(
      { error: 'No autorizado — incluye un Bearer token válido en el header Authorization' },
      { status: 401 }
    );
  }
  */
  const usuarioAutenticadoId = 'bcab80eb-b979-4d48-8112-fa58620e448f'; // Temporal para testing sin auth

  const { searchParams } = new URL(request.url);
  const turistaId       = searchParams.get('turistaId');
  const filtroCategoria = searchParams.get('categoria');

  // ── Fix #7: el usuario solo puede consultar su propio perfil ───────────────
  if (turistaId !== usuarioAutenticadoId) {
    return NextResponse.json(
      { error: 'Prohibido — solo puedes consultar tu propio perfil' },
      { status: 403 }
    );
  }

  if (!turistaId) {
    return NextResponse.json(
      { error: 'Falta turistaId — usa ?turistaId=UUID' },
      { status: 400 }
    );
  }

  // ── Fix #3: Ubicación dinámica del turista ─────────────────────────────────
  const latTurista = parseFloat(searchParams.get('lat')  ?? '') || LAT_DEFAULT;
  const lngTurista = parseFloat(searchParams.get('lng')  ?? '') || LNG_DEFAULT;
  const ubicacionEsDefault = !searchParams.get('lat') || !searchParams.get('lng');

  // ── Fix #5: Pesos normalizados ─────────────────────────────────────────────
  const pesosRaw = {
    alpha: parseFloat(searchParams.get('alpha') ?? '') || DEFAULT_PESOS.alpha,
    beta:  parseFloat(searchParams.get('beta')  ?? '') || DEFAULT_PESOS.beta,
    gamma: parseFloat(searchParams.get('gamma') ?? '') || DEFAULT_PESOS.gamma,
    delta: parseFloat(searchParams.get('delta') ?? '') || DEFAULT_PESOS.delta,
  };
  const pesos = normalizarPesos(pesosRaw);

  try {
    // ── Eventos del turista ───────────────────────────────────────────────────
    const { data: eventos, error: eventosError } = await supabase
      .from('eventos_usuario')
      .select('negocio_id, tipo, fecha_evento, negocios(etiquetas)')
      .eq('turista_id', turistaId);

    if (eventosError) throw eventosError;

    const eventosConEtiquetas = (eventos ?? []).map(e => ({
      ...e,
      etiquetas_negocio: e.negocios?.etiquetas ?? [],
    }));

    // ── Perfil del turista ────────────────────────────────────────────────────
    const { data: turistaInfo } = await supabase
      .from('turistas')
      .select('nombre, pais_origen, perfil_id, intereses')
      .eq('perfil_id', turistaId)
      .single();

    // ── Negocios (con filtro opcional de categoría) ───────────────────────────
    let queryNegocios = supabase
      .from('negocios')
      .select('perfil_id, nombre_comercial, categoria_principal, latitud, longitud, etiquetas');

    if (filtroCategoria) {
      queryNegocios = queryNegocios.eq('categoria_principal', filtroCategoria);
    }

    const { data: negocios, error: negError } = await queryNegocios;
    if (negError) throw negError;

    // ── Fix #6: Popularidad derivada de eventos reales ────────────────────────
    const negociosIds = negocios.map(n => n.perfil_id);
    const popularidadMap = await calcularPopularidadNegocios(negociosIds);

    // ── Vector de perfil del turista ──────────────────────────────────────────
    const vectorData = calcularVectorTurista(eventosConEtiquetas, turistaInfo?.intereses ?? []);
    const { confidence, ...perfilEtiquetasTurista } = vectorData;

    // ── Scoring ───────────────────────────────────────────────────────────────
    const resultados = negocios.map((n) => {
      const similitud   = calcularSimilitudEtiquetasDinamicas(perfilEtiquetasTurista, n.etiquetas);
      const distanciaKm = calcularDistanciaHaversine(latTurista, lngTurista, n.latitud, n.longitud);
      
      const RADIO_DEFAULT_KM = 15;
      const radioKm = parseFloat(searchParams.get('radioKm') ?? '') || RADIO_DEFAULT_KM;
      const proximidad = Math.exp(-distanciaKm / radioKm);

      // Fix #6: popularidad real en lugar de 0.75 hardcodeado
      // Popularidad local 
      const popularidadGlobal = popularidadMap[n.perfil_id] ?? 0;
      const popularidad = popularidadGlobal * proximidad;

      const scoreFinal =
        pesos.alpha * similitud   +
        pesos.beta  * popularidad +
        pesos.gamma * proximidad  +
        pesos.delta * 0.8; // δ reservado para boost futuro (ej: certificación)

      return {
        nombre:    n.nombre_comercial,
        categoria: n.categoria_principal,
        score:     +scoreFinal.toFixed(4),
        descomposicion: {
          'α·similitud':   +(pesos.alpha * similitud).toFixed(4),
          'β·popularidad': +(pesos.beta  * popularidad).toFixed(4),
          'γ·proximidad':  +(pesos.gamma * proximidad).toFixed(4),
          'δ·boost':       +(pesos.delta * 0.8).toFixed(4),
        },
        distanciaKm:         +distanciaKm.toFixed(2),
        similitud:           +similitud.toFixed(4),
        popularidad:         +popularidad.toFixed(4),
        etiquetas_evaluadas: n.etiquetas,
      };
    });

    resultados.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      turista: {
        nombre:      turistaInfo?.nombre,
        pais_origen: turistaInfo?.pais_origen,
        id:          turistaId,
      },
      perfil_etiquetas_calculado: perfilEtiquetasTurista,
      confidence: +(confidence ?? 0).toFixed(3),
      pesos_usados: pesos,
      ubicacion_turista: {
        lat: latTurista,
        lng: lngTurista,
        es_default: ubicacionEsDefault,
      },
      ranking: resultados,
      meta: {
        total_negocios:    resultados.length,
        filtro_aplicado:   filtroCategoria || 'Ninguno',
        top_recomendacion: resultados[0]?.nombre,
        timestamp:         new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error en test-algorithms:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
