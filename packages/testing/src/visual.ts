import pixelmatch from "pixelmatch";
import {PNG} from "pngjs";

export interface ComparisonResult {
  diffPixels: number;
  totalPixels: number;
  ratio: number;
}

export function compareScreenshots(
  actual: Buffer,
  expected: Buffer,
  threshold = 0.1,
): ComparisonResult {
  const actualImage = PNG.sync.read(actual);
  const expectedImage = PNG.sync.read(expected);

  if (
    actualImage.width !== expectedImage.width ||
    actualImage.height !== expectedImage.height
  ) {
    throw new Error(
      `Screenshot dimensions differ: ${actualImage.width}x${actualImage.height} vs ${expectedImage.width}x${expectedImage.height}`,
    );
  }

  const diff = new PNG({
    width: actualImage.width,
    height: actualImage.height,
  });
  const diffPixels = pixelmatch(
    actualImage.data,
    expectedImage.data,
    diff.data,
    actualImage.width,
    actualImage.height,
    {threshold},
  );
  const totalPixels = actualImage.width * actualImage.height;

  return {diffPixels, ratio: diffPixels / totalPixels, totalPixels};
}
