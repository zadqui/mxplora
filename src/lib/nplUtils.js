// ─── UTILIDADES DE NLP ────────────────────────────────────────────────────────

/**
 * Normaliza un texto: minúsculas, sin acentos, sin espacios extremos.
 * Función interna compartida — no se exporta.
 */
export function normalizarTexto(texto) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Tokeniza una etiqueta en palabras individuales normalizadas.
 * "Comida Tradicional" → ["comida", "tradicional"]
 * Evita falsos positivos por subcadena (ej: "arte" vs "artesanias").
 *
 * @param {string} etiqueta
 * @returns {string[]}
 */
function tokenizarEtiqueta(etiqueta) {
  return normalizarTexto(etiqueta)
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Calcula la similitud entre el perfil de intereses del turista y las
 * etiquetas de un negocio usando Producto Punto Normalizado con tokenización exacta.
 *
 * Semántica del resultado:
 *   "¿Qué fracción de las etiquetas del negocio le interesan al turista,
 *    ponderada por cuánto le interesan?"
 *
 * Mejoras respecto a la versión anterior:
 *   - Tokenización exacta: elimina falsos positivos por subcadena.
 *   - Sin `break`: cada etiqueta acumula el peso de TODOS sus tokens
 *     que hagan match, pero cada par (token, interés) solo cuenta una vez.
 *   - Producto punto normalizado: respeta los pesos del perfil y la intensidad.
 *   - Denominador = max(tokensNegocio, tokensActivosTurista) para no
 *     penalizar negocios con pocas etiquetas ni perfiles dispersos (fix #8).
 *
 * @param {Record<string, number>} perfilTurista  - { "tacos": 0.9, "arte": 0.1, ... }
 * @param {string[]} etiquetasNegocioSucio        - ["Mexicana", "Tacos", "Bebidas"]
 * @returns {number} Score en [0, 1]
 */
export function calcularSimilitudEtiquetasDinamicas(perfilTurista, etiquetasNegocioSucio) {
  if (!etiquetasNegocioSucio || etiquetasNegocioSucio.length === 0) return 0;
  if (!perfilTurista || Object.keys(perfilTurista).length === 0) return 0;

  // Pre-construir mapa del perfil con claves ya normalizadas → O(1) lookup
  const perfilNormalizado = {};
  for (const [clave, peso] of Object.entries(perfilTurista)) {
    const claveNorm = normalizarTexto(clave);
    if (claveNorm) perfilNormalizado[claveNorm] = peso;
  }

  let scoreAcumulado = 0;
  let totalTokensNegocio = 0;

  for (const etiquetaMala of etiquetasNegocioSucio) {
    const tokens = tokenizarEtiqueta(etiquetaMala);
    if (tokens.length === 0) continue;

    totalTokensNegocio += tokens.length;

    // Rastreamos qué intereses ya sumaron para esta etiqueta
    // para que cada par (token, interés) solo cuente una vez.
    const interesesYaContados = new Set();

    for (const token of tokens) {
      if (token in perfilNormalizado && !interesesYaContados.has(token)) {
        scoreAcumulado += perfilNormalizado[token];
        interesesYaContados.add(token);
      }
    }
    // ↑ Sin `break`: todos los tokens de la etiqueta se evalúan,
    //   acumulando peso de múltiples intereses si hay múltiples matches.
  }

  // Denominador: max(tokens del negocio, intereses activos del turista)
  // Evita penalizar negocios con pocas etiquetas y perfiles dispersos (fix #8).
  const interesesActivos = Object.keys(perfilNormalizado).length;
  const denominador = Math.max(totalTokensNegocio, 1);

  return scoreAcumulado / denominador;
}
