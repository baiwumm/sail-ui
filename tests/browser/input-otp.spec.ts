import {expect, test, type Page} from "@playwright/test";

async function centerInViewport(page: Page, testId: string) {
  await page.getByTestId(testId).evaluate((element) => element.scrollIntoView({block: "center"}));
}

test.describe("InputOtp", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("fills grouped slots with the keyboard and marks completion", async ({page}) => {
    const root = page.getByTestId("input-otp-basic");
    const values = root.locator("[data-slot='input-otp-slot-value']");

    await centerInViewport(page, "input-otp-basic");
    await root.locator("input.input-otp__input").first().click();
    await page.keyboard.type("123456");

    await expect(root).toHaveAttribute("data-complete", "true");
    await expect(values).toHaveText(["1", "2", "3", "4", "5", "6"]);

    await page.keyboard.press("Backspace");

    await expect(root).not.toHaveAttribute("data-complete");
    await expect(values).toHaveText(["1", "2", "3", "4", "5"]);
  });

  test("accepts a pasted code", async ({page}) => {
    const root = page.getByTestId("input-otp-four-digits");
    const values = root.locator("[data-slot='input-otp-slot-value']");

    await centerInViewport(page, "input-otp-four-digits");
    await root
      .locator("input.input-otp__input")
      .first()
      .evaluate((input) => {
        const data = new DataTransfer();

        data.setData("text/plain", "9876");
        input.dispatchEvent(
          new ClipboardEvent("paste", {bubbles: true, cancelable: true, clipboardData: data}),
        );
      });

    await expect(values).toHaveText(["9", "8", "7", "6"]);
    await expect(root).toHaveAttribute("data-complete", "true");
  });

  test("reflects a controlled value and clears it", async ({page}) => {
    const root = page.getByTestId("input-otp-controlled");
    const output = page.getByTestId("input-otp-controlled-value");

    await centerInViewport(page, "input-otp-controlled");
    await root.locator("input.input-otp__input").first().click();
    await page.keyboard.type("12");

    await expect(output).toContainText("Value: 12 (2/6)");
    await expect(root.locator("[data-slot='input-otp-slot-value']")).toHaveText(["1", "2"]);

    await output.getByRole("button", {name: "Clear"}).click();

    await expect(output).toHaveText("Enter a 6-digit code");
    await expect(root.locator("[data-slot='input-otp-slot-value']")).toHaveCount(0);
  });

  test("emits complete once the code is full", async ({page}) => {
    const root = page.getByTestId("input-otp-complete");
    const output = page.getByTestId("input-otp-complete-value");

    await centerInViewport(page, "input-otp-complete");
    await root.locator("input.input-otp__input").first().click();
    await page.keyboard.type("123456");

    await expect(output).toHaveText("Complete code: 123456");
    await expect(root).toHaveAttribute("data-complete", "true");
  });

  test("rejects characters outside the configured pattern", async ({page}) => {
    const root = page.getByTestId("input-otp-pattern");
    const output = page.getByTestId("input-otp-pattern-value");
    const values = root.locator("[data-slot='input-otp-slot-value']");

    await centerInViewport(page, "input-otp-pattern");
    await root.locator("input.input-otp__input").first().click();
    await page.keyboard.type("12");

    await expect(output).toHaveText("Value: empty");
    await expect(values).toHaveCount(0);

    await page.keyboard.type("ab");

    await expect(output).toHaveText("Value: ab");
    await expect(values).toHaveText(["a", "b"]);
  });

  test("exposes disabled, invalid, and variant states", async ({page}) => {
    const disabled = page.getByTestId("input-otp-disabled");

    await centerInViewport(page, "input-otp-disabled");

    await expect(disabled).toHaveAttribute("data-disabled", "true");
    await expect(disabled.locator("input.input-otp__input").first()).toBeDisabled();

    const invalid = page.getByTestId("input-otp-invalid");

    await centerInViewport(page, "input-otp-invalid");

    await expect(invalid).toHaveAttribute("data-invalid", "true");
    await expect(invalid.locator("[data-slot='input-otp-slot'][data-invalid='true']")).toHaveCount(
      6,
    );
    await expect(invalid.locator("[data-slot='input-otp-slot-value']")).toHaveText(["1", "2", "3"]);

    const secondary = page.getByTestId("input-otp-secondary");

    await centerInViewport(page, "input-otp-secondary");

    await expect(secondary).toHaveClass(/input-otp--secondary/);
    await expect(secondary.locator("[data-slot='input-otp-slot-value']")).toHaveText([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
    ]);
  });
});
