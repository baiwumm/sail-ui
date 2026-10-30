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

export interface DataElement {
  tag: string;
  attributes: Record<string, string | null>;
}

const TAG_PATTERN = /<([a-z][a-z0-9-]*)\b([^>]*)>/gi;
const ATTRIBUTE_PATTERN = /([^\s=/>]+)(?:="([^"]*)")?/g;

export function dataElements(html: string): DataElement[] {
  const elements: DataElement[] = [];

  for (const tagMatch of html.matchAll(TAG_PATTERN)) {
    const attributes: Record<string, string | null> = {};

    for (const attributeMatch of tagMatch[2]!.matchAll(ATTRIBUTE_PATTERN)) {
      const name = attributeMatch[1]!;

      if (name.startsWith("data-")) {
        attributes[name] = attributeMatch[2] ?? null;
      }
    }

    if (Object.keys(attributes).length > 0) {
      elements.push({tag: tagMatch[1]!.toLowerCase(), attributes});
    }
  }

  return elements;
}

export function dataAttributesOfSlot(
  html: string,
  slot: string
): Array<Record<string, string | null>> {
  return dataElements(html)
    .filter((element) => element.attributes["data-slot"] === slot)
    .map((element) => element.attributes);
}

export function hasDataAttribute(
  html: string,
  name: string,
  value?: string
): boolean {
  return dataElements(html).some(
    (element) =>
      name in element.attributes &&
      (value === undefined || element.attributes[name] === value)
  );
}

export function dataAttributesInCss(css: string): string[] {
  return [
    ...new Set(
      [...css.matchAll(/\[(data-[a-z0-9-]+)/g)].map((match) => match[1]!)
    )
  ].sort();
}
