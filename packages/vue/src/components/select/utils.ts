import type {AcceptableValue} from "reka-ui";

type Comparator = string | ((value: AcceptableValue, currentValue: AcceptableValue) => boolean);

export function valuesEqual(
  value: AcceptableValue | undefined,
  currentValue: AcceptableValue | undefined,
  by: Comparator | undefined,
): boolean {
  if (value === undefined || currentValue === undefined) {
    return false;
  }

  if (typeof by === "function") {
    return by(value, currentValue);
  }

  if (typeof by === "string") {
    return (
      (value as Record<string, unknown>)?.[by] === (currentValue as Record<string, unknown>)?.[by]
    );
  }

  if (value === null || currentValue === null) {
    return value === currentValue;
  }

  if (typeof value !== "object" || typeof currentValue !== "object") {
    return value === currentValue;
  }

  return JSON.stringify(value) === JSON.stringify(currentValue);
}
