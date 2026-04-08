export function calcularDistanciaHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const aRad = (lat) => lat * (Math.PI / 180);

  const dLat = aRad(lat2 - lat1);
  const dLon = aRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(aRad(lat1)) * Math.cos(aRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calcularSimilitudCoseno(v1, v2) {
  const keys = ['gastronomia', 'cultura', 'entretenimiento', 'artesanias', 'aventura_naturaleza'];

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const key of keys) {
    dotProduct += v1[key] * v2[key];
    normA += Math.pow(v1[key], 2);
    normB += Math.pow(v2[key], 2);
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
