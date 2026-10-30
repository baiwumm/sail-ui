import type {MaybeRefOrGetter} from "vue";

import {computed, toValue} from "vue";

export interface ProgressStateOptions {
  value: MaybeRefOrGetter<number | null | undefined>;
  minValue: MaybeRefOrGetter<number>;
  maxValue: MaybeRefOrGetter<number>;
  isIndeterminate: MaybeRefOrGetter<boolean | undefined>;
  valueLabel?: MaybeRefOrGetter<string | undefined>;
  formatOptions?: MaybeRefOrGetter<Intl.NumberFormatOptions | undefined>;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function useProgressState(options: ProgressStateOptions) {
  const formatter = computed(
    () => new Intl.NumberFormat(undefined, toValue(options.formatOptions) ?? {style: "percent"}),
  );
  const isIndeterminate = computed(() => Boolean(toValue(options.isIndeterminate)));
  const minValue = computed(() => toValue(options.minValue));
  const maxValue = computed(() => toValue(options.maxValue));
  const currentValue = computed(() => {
    const value = toValue(options.value);

    return clamp(value ?? 0, minValue.value, maxValue.value);
  });
  const range = computed(() => maxValue.value - minValue.value);
  const ratio = computed(() =>
    range.value === 0 ? 0 : (currentValue.value - minValue.value) / range.value,
  );
  const percentage = computed(() =>
    isIndeterminate.value ? undefined : range.value === 0 ? 0 : ratio.value * 100,
  );
  const valueText = computed(() => {
    if (isIndeterminate.value) {
      return undefined;
    }

    const label = toValue(options.valueLabel);

    if (label) {
      return label;
    }

    const formatOptions = toValue(options.formatOptions) ?? {style: "percent"};
    const valueToFormat = formatOptions.style === "percent" ? ratio.value : currentValue.value;

    return formatter.value.format(valueToFormat);
  });

  return {
    currentValue,
    isIndeterminate,
    maxValue,
    minValue,
    percentage,
    valueText,
  };
}
