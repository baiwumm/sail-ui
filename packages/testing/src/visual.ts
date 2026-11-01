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
  let actualImage = PNG.sync.read(actual) as PNG;
  let expectedImage = PNG.sync.read(expected) as PNG;

  if (actualImage.width !== expectedImage.width || actualImage.height !== expectedImage.height) {
    const widthDelta = Math.abs(actualImage.width - expectedImage.width);
    const heightDelta = Math.abs(actualImage.height - expectedImage.height);

    if (widthDelta > 2 || heightDelta > 2) {
      throw new Error(
        `Screenshot dimensions differ: ${actualImage.width}x${actualImage.height} vs ${expectedImage.width}x${expectedImage.height}`,
      );
    }

    // Region shots of overlays positioned at fractional coordinates round to
    // sizes that differ by a pixel; compare the common top-left area.
    const width = Math.min(actualImage.width, expectedImage.width);
    const height = Math.min(actualImage.height, expectedImage.height);

    actualImage = cropImage(actualImage, width, height);
    expectedImage = cropImage(expectedImage, width, height);
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

function cropImage(image: PNG, width: number, height: number): PNG {
  const cropped = new PNG({width, height});

  for (let y = 0; y < height; y += 1) {
    const sourceStart = (y * image.width + 0) * 4;
    const sourceEnd = sourceStart + width * 4;
    const targetStart = (y * width + 0) * 4;

    image.data.copy(cropped.data, targetStart, sourceStart, sourceEnd);
  }

  return cropped;
}
