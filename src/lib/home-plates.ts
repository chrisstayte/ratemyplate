export type PlateNumberRow = {
  plateNumber: string;
};

/** Prefer recent plates, then shuffle in memory — avoids `ORDER BY RANDOM()`. */
export function selectTypingPlateNumbers(
  candidates: PlateNumberRow[],
  limit = 20
): string[] {
  const shuffled = [...candidates];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, limit).map((row) => row.plateNumber);
}
