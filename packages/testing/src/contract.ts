export function dataSlots(html: string): string[] {
  return [...html.matchAll(/data-slot="([^"]+)"/g)].map((match) => match[1]!);
}

export function hasDataSlot(html: string, slot: string): boolean {
  return dataSlots(html).includes(slot);
}

export function dataSlotsOfTag(html: string, tag: string): string[] {
  const pattern = new RegExp(`<${tag}\\b[^>]*data-slot="([^"]+)"`, "g");

  return [...html.matchAll(pattern)].map((match) => match[1]!);
}
