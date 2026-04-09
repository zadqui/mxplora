import { createClient } from '@supabase/supabase-js';

// ─── SUPABASE (solo anon key + RLS — sin privilegios de escritura) ────────────
// Esta clave es pública por diseño. La seguridad la dan las RLS policies en
// Supabase: la tabla `negocios` debe tener SELECT habilitado para anon.
const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ─── DEFINICIONES DE HERRAMIENTAS (formato Anthropic tool_use) ────────────────
export const TOOL_DEFINITIONS = [
  {
    name: 'business_search',
    description:
      'Busca y rankea negocios locales certificados en MXplora según las preferencias ' +
      'del turista, su ubicación y el algoritmo de recomendación. Úsala cuando el turista ' +
      'pida recomendaciones, un itinerario, dónde comer, actividades culturales, ' +
      'zona de fans del Mundial, artesanías, o cualquier sugerencia de lugar. ' +
      'También úsala para construir itinerarios personalizados.',
    input_schema: {
      type: 'object',
      properties: {
        turistaId: {
          type: 'string',
          description: 'UUID del turista autenticado. Omitir si no está disponible — el sistema lo provee cuando el turista está logueado.',
        },
        categoria: {
          type: 'string',
          enum: ['comida', 'cultura', 'artesanias', 'entretenimiento', 'transporte', 'hospedaje'],
          description: 'Categoría principal para filtrar. Omitir para buscar en todas.',
        },
        lat: {
          type: 'number',
          description: 'Latitud actual del turista. Omitir si no está disponible.',
        },
        lng: {
          type: 'number',
          description: 'Longitud actual del turista. Omitir si no está disponible.',
        },
        radioKm: {
          type: 'number',
          description: 'Radio de búsqueda en kilómetros. Default 15.',
        },
      },
      required: [], // todos los campos son opcionales — el sistema los inyecta si están disponibles
    },
  },
  {
    name: 'get_business_info',
    description:
      'Obtiene información detallada de un negocio específico: horarios, descripción, ' +
      'rango de precios, menú resumido, dirección y etiquetas. Úsala cuando el turista ' +
      'pregunta por un negocio en particular ("¿a qué hora abre X?", "¿cuánto cuesta?", ' +
      '"¿qué sirven?", "¿dónde queda exactamente?").',
    input_schema: {
      type: 'object',
      properties: {
        negocioId: {
          type: 'string',
          description: 'UUID (perfil_id) del negocio en Supabase.',
        },
        nombreNegocio: {
          type: 'string',
          description:
            'Nombre comercial del negocio, como alternativa al UUID si no se tiene el ID.',
        },
      },
      required: [],
    },
  },
];

// ─── EJECUTORES ───────────────────────────────────────────────────────────────

/**
 * Llama al endpoint /api/test-algorithms con los parámetros indicados.
 * Devuelve los top-N resultados del ranking para no inflar el contexto.
 *
 * @param {object} input  Campos del tool: turistaId, categoria, lat, lng, radioKm
 * @param {string} origin URL base del servidor (ej: http://localhost:3000)
 * @returns {string}      JSON serializado para devolver al modelo
 */
async function ejecutarBuscarNegocios(input, origin) {
  const { turistaId, categoria, lat, lng, radioKm = 15 } = input;

  // Solo añadir turistaId si es un valor real — nunca mandar "undefined" o null
  // ya que el endpoint devuelve 403 si el turistaId no coincide con el usuario autenticado.
  // Sin turistaId, el endpoint usa el fallback anónimo.
  const params = new URLSearchParams({ radioKm: String(radioKm) });
  if (turistaId && turistaId !== 'undefined') params.set('turistaId', turistaId);
  if (categoria)                              params.set('categoria', categoria);
  if (lat  != null)                           params.set('lat',  String(lat));
  if (lng  != null)                           params.set('lng',  String(lng));

  let data;
  try {
    const res = await fetch(`${origin}/api/test-algorithms?${params.toString()}`, {
      headers: process.env.INTERNAL_API_SECRET
        ? { Authorization: `Bearer ${process.env.INTERNAL_API_SECRET}` }
        : {},
    });

    if (!res.ok) {
      const err = await res.text();
      // Devolver lista vacía en vez de un error que confunda al modelo
      return JSON.stringify({ top_negocios: [], total_encontrados: 0, error_interno: res.status });
    }

    data = await res.json();
  } catch (err) {
    return JSON.stringify({ error: `No se pudo contactar el algoritmo: ${err.message}` });
  }

  // Devolvemos solo los campos útiles para el chat (evitar ruido de scores internos)
  const TOP_N = 5;
  const ranking = (data.ranking ?? []).slice(0, TOP_N).map((n) => ({
    id:          n.perfil_id,   // puede ser undefined si el endpoint no lo incluye
    nombre:      n.nombre,
    categoria:   n.categoria,
    distanciaKm: n.distanciaKm,
    etiquetas:   n.etiquetas_evaluadas ?? [],
    score:       n.score,
  }));

  return JSON.stringify({
    turista:       data.turista,
    top_negocios:  ranking,
    total_encontrados: data.meta?.total_negocios ?? 0,
    ubicacion_es_default: data.ubicacion_turista?.es_default ?? true,
  });
}

/**
 * Consulta Supabase (anon key + RLS) para obtener el detalle público
 * de un negocio: solo columnas que el turista puede ver.
 *
 * @param {object} input  Campos: negocioId?, nombreNegocio?
 * @returns {string}      JSON serializado para devolver al modelo
 */
async function ejecutarDetalleNegocio(input) {
  const { negocioId, nombreNegocio } = input;

  if (!negocioId && !nombreNegocio) {
    return JSON.stringify({ error: 'Se requiere negocioId o nombreNegocio.' });
  }

  // Columnas públicas — NUNCA incluir datos sensibles del negocio (ej: correo interno)
  const COLUMNAS_PUBLICAS =
    'perfil_id, nombre_comercial, categoria_principal, descripcion, ' +
    'horario_apertura, horario_cierre, dias_operacion, ' +
    'precio_rango, menu_resumido, direccion, ' +
    'latitud, longitud, etiquetas, telefono_publico, url_maps';

  let query = supabasePublic
    .from('negocios')
    .select(COLUMNAS_PUBLICAS);

  if (negocioId) {
    query = query.eq('perfil_id', negocioId);
  } else {
    // Búsqueda por nombre — ilike para tolerancia a mayúsculas
    query = query.ilike('nombre_comercial', `%${nombreNegocio}%`);
  }

  const { data, error } = await query.limit(1).single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return JSON.stringify({ error: `No encontré el negocio "${nombreNegocio ?? negocioId}" en MXplora.` });
    }
    return JSON.stringify({ error: `Error consultando Supabase: ${error.message}` });
  }

  return JSON.stringify(data);
}

// ─── DISPATCHER ───────────────────────────────────────────────────────────────

/**
 * Recibe un tool_use block de Anthropic y ejecuta la herramienta correspondiente.
 *
 * @param {{ name: string, input: object }} toolUse  Bloque tool_use del modelo
 * @param {string}                          origin   URL base del servidor
 * @returns {Promise<string>}                        Resultado serializado en JSON
 */
export async function ejecutarTool(toolUse, origin) {
  switch (toolUse.name) {
    case 'business_search':
      return ejecutarBuscarNegocios(toolUse.input, origin);

    case 'get_business_info':
      return ejecutarDetalleNegocio(toolUse.input);

    default:
      return JSON.stringify({ error: `Unknown tool: ${toolUse.name}` });
  }
}
