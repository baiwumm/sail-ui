import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {h} from "vue";

import Avatar from "../../avatar/avatar-root.vue";
import AvatarFallback from "../../avatar/avatar-fallback.vue";
import AvatarGroup from "../avatar-group.vue";
import AvatarGroupCount from "../avatar-group-count.vue";

const avatar = (name: string) =>
  h(Avatar, {key: name}, {default: () => h(AvatarFallback, null, {default: () => name})});

describe("AvatarGroup", () => {
  it("renders the group slot, overlap class, and every child below max", () => {
    const wrapper = mount(AvatarGroup, {
      props: {overlap: "ring"},
      slots: {default: () => [avatar("A"), avatar("B")]}
    });

    expect(wrapper.get("[data-slot='avatar-group']").classes()).toContain(
      "avatar-group--ring"
    );
    expect(wrapper.findAll("[data-slot='avatar-fallback']")).toHaveLength(2);
  });

  it("truncates children and appends a count at max", () => {
    const wrapper = mount(AvatarGroup, {
      props: {max: 2},
      slots: {default: () => [avatar("A"), avatar("B"), avatar("C")]}
    });

    expect(wrapper.findAll("[data-slot='avatar-fallback']")).toHaveLength(3);
    expect(wrapper.get("[data-slot='avatar-group-count']").text()).toBe("+1");
  });

  it("renders an explicit count and suppresses the automatic one", () => {
    const wrapper = mount(AvatarGroup, {
      props: {max: 1},
      slots: {
        default: () => [
          avatar("A"),
          avatar("B"),
          h(AvatarGroupCount, {"aria-label": "Two more"}, {default: () => "2+"})
        ]
      }
    });

    expect(wrapper.findAll("[data-slot='avatar-group-count']")).toHaveLength(1);
    expect(wrapper.get("[data-slot='avatar-group-count']").text()).toBe("2+");
    expect(wrapper.get("[data-slot='avatar-group-count']").attributes("aria-label")).toBe(
      "Two more"
    );
  });

  it("inherits size and color from the group context", () => {
    const wrapper = mount(AvatarGroup, {
      props: {color: "warning", size: "sm"},
      slots: {default: () => [avatar("A")]}
    });
    const avatarRoot = wrapper.get(".avatar");

    expect(avatarRoot.classes()).toContain("avatar--sm");
    expect(wrapper.get("[data-slot='avatar-fallback']").classes()).toContain(
      "avatar__fallback--warning"
    );
  });

  it("supports the grid modifier", () => {
    const wrapper = mount(AvatarGroup, {
      props: {isGrid: true},
      slots: {default: () => [avatar("A")]}
    });

    expect(wrapper.classes()).toContain("avatar-group--grid");
  });

  it("casts the boolean is-grid shorthand", () => {
    const wrapper = mount(AvatarGroup, {
      props: {isGrid: "" as unknown as boolean},
      slots: {default: () => [avatar("A")]}
    });

    expect(wrapper.classes()).toContain("avatar-group--grid");
  });
});
