export function readCssTime(name: string, fallback: number): number {
  if (typeof window === "undefined" || typeof getComputedStyle !== "function") {
    return fallback;
  }

  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const match = /^(-?\d*\.?\d+)(ms|s)?$/.exec(raw);

  if (!match) {
    return fallback;
  }

  const value = Number(match[1]);

  if (!Number.isFinite(value)) {
    return fallback;
  }

  return match[2] === "s" ? value * 1000 : value;
}
