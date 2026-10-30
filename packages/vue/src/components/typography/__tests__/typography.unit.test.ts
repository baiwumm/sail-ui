import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";

import TypographyCode from "../typography-code.vue";
import TypographyHeading from "../typography-heading.vue";
import TypographyParagraph from "../typography-paragraph.vue";
import TypographyProse from "../typography-prose.vue";
import Typography from "../typography-root.vue";

describe("Typography", () => {
  it("renders body text as a p with the upstream attributes", () => {
    const wrapper = mount(Typography, {slots: {default: () => "Body"}});

    expect(wrapper.element.tagName).toBe("P");
    expect(wrapper.attributes("data-slot")).toBe("typography");
    expect(wrapper.attributes("data-type")).toBe("body");
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        "typography",
        "typography--body",
        "typography--align-start",
        "typography--color-default"
      ])
    );
  });

  it("maps type to the default element and data-type", () => {
    const heading = mount(Typography, {props: {type: "h2"}, slots: {default: () => "Title"}});

    expect(heading.element.tagName).toBe("H2");
    expect(heading.attributes("data-type")).toBe("h2");
    heading.unmount();

    const code = mount(Typography, {props: {type: "code"}, slots: {default: () => "npm"}});

    expect(code.element.tagName).toBe("CODE");
    expect(code.classes()).toContain("typography--code");
  });

  it("supports truncate, weight, align, and color classes", () => {
    const wrapper = mount(Typography, {
      props: {align: "center", color: "muted", truncate: true, weight: "semibold"}
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        "typography--align-center",
        "typography--color-muted",
        "typography--truncate",
        "typography--weight-semibold"
      ])
    );
  });

  it("renders headings by level", () => {
    const wrapper = mount(TypographyHeading, {
      props: {level: 3},
      slots: {default: () => "Heading"}
    });

    expect(wrapper.element.tagName).toBe("H3");
    expect(wrapper.attributes("data-type")).toBe("h3");
  });

  it("renders paragraphs by size", () => {
    const base = mount(TypographyParagraph, {slots: {default: () => "Text"}});
    expect(base.attributes("data-type")).toBe("body");
    base.unmount();

    const small = mount(TypographyParagraph, {
      props: {size: "sm"},
      slots: {default: () => "Text"}
    });
    expect(small.attributes("data-type")).toBe("body-sm");
    expect(small.classes()).toContain("typography--body-sm");
  });

  it("renders code and prose parts", () => {
    const code = mount(TypographyCode, {slots: {default: () => "npm run build"}});

    expect(code.element.tagName).toBe("CODE");
    expect(code.attributes("data-type")).toBe("code");
    code.unmount();

    const prose = mount(TypographyProse, {slots: {default: () => "Article"}});

    expect(prose.element.tagName).toBe("DIV");
    expect(prose.attributes("data-slot")).toBe("prose");
    expect(prose.classes()).toContain("typography-prose");
  });

  it("supports the as override on root and prose", () => {
    const root = mount(Typography, {props: {as: "span", type: "h1"}, slots: {default: () => "Title"}});

    expect(root.element.tagName).toBe("SPAN");
    root.unmount();

    const prose = mount(TypographyProse, {props: {as: "article"}});

    expect(prose.element.tagName).toBe("ARTICLE");
  });
});
