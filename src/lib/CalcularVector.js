import { normalizarTexto } from './nplUtils.js';

// ─── PESOS POR TIPO DE EVENTO ─────────────────────────────────────────────────
const PESOS = {
  view:   0.5,
  click:  1.0,
  save:   2.0,
  ignore: -0.5,
  visit:  3.0,
  resena: 4.0,
};

// ─── PARÁMETROS DE SUAVIZADO BAYESIANO ───────────────────────────────────────
const PESO_ONBOARDING = 1.0;
const PRIOR_STRENGTH  = 10.0;
const PRIOR_MEAN      = 0.5;

// ─── PARÁMETROS DE DECAY ──────────────────────────────────────────────────────
//
// Cambio #4 — Soft decay de dos velocidades (reemplaza el hard cut-off de 90 días)
//
// Antes: cualquier evento con más de 90 días era eliminado completamente.
// Problema: turistas recurrentes perdían todo su historial de visitas anteriores.
//
// Ahora: dos zonas de memoria con distintas velocidades de olvido.
//
//   Zona reciente  (0–90 días):  lambda = 0.0231  → a 90 días queda ~12% del peso original
//   Zona histórica (90–365 días): lambda = 0.0050  → decae muy lento, preserva ~16% a 365 días
//   Más de 365 días: se descarta (ruido de señal demasiado débil)
//
// Visualización del peso efectivo según días:
//   día  0:  1.00  (peso completo)
//   día 30:  0.50
//   día 90:  0.12  (zona reciente → zona histórica)
//   día 180: 0.07
//   día 365: 0.02  → umbral de descarte
//
const DECAY_RECIENTE  = 0.0231;   // Zona 0–90 días
const DECAY_HISTORICO = 0.0050;   // Zona 90–365 días
const HORIZONTE_DIAS  = 365;      // Más allá de esto, se descarta

/**
 * Calcula el factor de decay temporal según la zona en la que cae el evento.
 *
 * @param {number} diasAtras - Días transcurridos desde el evento
 * @returns {number} Factor de decay en (0, 1], o 0 si supera el horizonte
 */
function calcularDecay(diasAtras) {
  if (diasAtras > HORIZONTE_DIAS) return 0;

  if (diasAtras <= 90) {
    // Zona reciente: decay rápido
    return Math.exp(-DECAY_RECIENTE * diasAtras);
  }

  // Zona histórica: anclar en el valor que tenía al día 90 y aplicar
  // decay lento desde ahí. Esto garantiza continuidad en la frontera.
  const decayEn90    = Math.exp(-DECAY_RECIENTE * 90);
  const diasExtra    = diasAtras - 90;
  return decayEn90 * Math.exp(-DECAY_HISTORICO * diasExtra);
}

/**
 * Calcula el vector de perfil de etiquetas del turista a partir de:
 *   - Sus eventos de comportamiento (clics, saves, visitas, reseñas…)
 *   - Sus intereses declarados en el onboarding
 *
 * Retorna un objeto { etiqueta: score [0,1], ..., confidence: [0,1] }
 *
 * @param {Array}    eventos   - Eventos del turista con etiquetas_negocio
 * @param {string[]} intereses - Intereses declarados en onboarding
 * @returns {Record<string, number>}
 */
export function calcularVectorTurista(eventos, intereses = []) {
  const ahora = Date.now();

  const sumasPorEtiqueta   = {};
  const pesoAbsPorEtiqueta = {};

  // Sembrar con los intereses del onboarding como prior
  for (const interes of intereses) {
    const clave = normalizarTexto(interes);
    if (!clave) continue;
    sumasPorEtiqueta[clave]   = PESO_ONBOARDING;
    pesoAbsPorEtiqueta[clave] = PESO_ONBOARDING;
  }

  // Filtrar eventos dentro del horizonte usando soft decay (fix #4)
  // Ya no hay un hard cut-off: calcularDecay devuelve 0 para eventos
  // más viejos que HORIZONTE_DIAS, lo que los excluye naturalmente.
  const eventosDentroHorizonte = (eventos ?? []).filter(e => {
    const diasAtras = (ahora - new Date(e.fecha_evento).getTime()) / (1000 * 60 * 60 * 24);
    return diasAtras <= HORIZONTE_DIAS;
  });

  let volumenEventos = 0;

  for (const e of eventosDentroHorizonte) {
    const diasAtras    = (ahora - new Date(e.fecha_evento).getTime()) / (1000 * 60 * 60 * 24);
    const decayFactor  = calcularDecay(diasAtras);
    const pesoAplicado = PESOS[e.tipo] ?? 0.0;
    const pesoEfectivo = pesoAplicado * decayFactor;
    const pesoAbsEfect = Math.abs(pesoAplicado) * decayFactor;

    for (const etiqueta of (e.etiquetas_negocio ?? [])) {
      const clave = normalizarTexto(etiqueta);
      if (!clave) continue;
      sumasPorEtiqueta[clave]   = (sumasPorEtiqueta[clave]   ?? 0) + pesoEfectivo;
      pesoAbsPorEtiqueta[clave] = (pesoAbsPorEtiqueta[clave] ?? 0) + pesoAbsEfect;
    }

    volumenEventos += pesoAbsEfect;
  }

  // Suavizado bayesiano por etiqueta
  const resultado = {};

  for (const clave of Object.keys(sumasPorEtiqueta)) {
    const volumenEtiqueta = pesoAbsPorEtiqueta[clave] ?? 0;
    const rawScore = volumenEtiqueta > 0
      ? sumasPorEtiqueta[clave] / volumenEtiqueta
      : PRIOR_MEAN;

    const suavizado =
      (volumenEtiqueta * rawScore + PRIOR_STRENGTH * PRIOR_MEAN) /
      (volumenEtiqueta + PRIOR_STRENGTH);

    resultado[clave] = Math.min(1.0, Math.max(0.0, suavizado));
  }

  resultado.confidence = Math.min(1.0, volumenEventos / (volumenEventos + PRIOR_STRENGTH));
  return resultado;
}
