import {mount} from "@vue/test-utils";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import {dataSlots, renderSSR} from "@sail-ui/testing";

import {Button} from "../components/button";
import {ButtonGroup, ButtonGroupSeparator} from "../components/button-group";
import {Checkbox, CheckboxContent, CheckboxControl, CheckboxIndicator} from "../components/checkbox";
import {CheckboxGroup} from "../components/checkbox-group";
import {Form} from "../components/form";
import {Input, TextField} from "../components/input";
import {InputGroup, InputGroupInput, InputGroupPrefix, InputGroupSuffix, InputGroupTextArea} from "../components/input-group";
import {Label} from "../components/label";
import {Description} from "../components/description";
import {FieldError} from "../components/field-error";
import {
  NumberField,
  NumberFieldDecrementButton,
  NumberFieldGroup,
  NumberFieldIncrementButton,
  NumberFieldInput
} from "../components/number-field";
import {Radio, RadioContent, RadioControl, RadioIndicator} from "../components/radio";
import {RadioGroup} from "../components/radio-group";
import {
  SearchField,
  SearchFieldClearButton,
  SearchFieldGroup,
  SearchFieldInput,
  SearchFieldSearchIcon
} from "../components/search-field";
import {
  Slider,
  SliderFill,
  SliderMark,
  SliderMarks,
  SliderOutput,
  SliderStep,
  SliderSteps,
  SliderThumb,
  SliderTrack
} from "../components/slider";
import {Switch, SwitchContent, SwitchControl, SwitchIcon, SwitchThumb} from "../components/switch";
import {SwitchGroup} from "../components/switch-group";
import {Textarea} from "../components/textarea";
import {ToggleButton} from "../components/toggle-button";
import {ToggleButtonGroup, ToggleButtonGroupSeparator} from "../components/toggle-button-group";
import {Toolbar} from "../components/toolbar";

const stylesRoot = join(process.cwd(), "packages", "styles");
const slotSnapshot = JSON.parse(
  readFileSync(join(stylesRoot, "contracts", "data-slots.json"), "utf8")
) as {components: Record<string, string[]>};

const renderedSlots = new Set<string>();

/**
 * Every rendered slot has to exist upstream. Conditional upstream slots, such
 * as the indeterminate checkbox indicator, are covered by their own fixture.
 */
function expectUpstreamSlots(html: string, component: string, extras: string[] = []) {
  const expected = new Set([...(slotSnapshot.components[component] ?? []), ...extras]);

  for (const slot of dataSlots(html)) {
    renderedSlots.add(slot);
    expect(expected.has(slot), `${component} renders an unknown slot: ${slot}`).toBe(true);
  }
}

const pointer = (element: Element, type: string, init: PointerEventInit = {}) => {
  element.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      pointerId: 1,
      pointerType: "mouse",
      ...init
    })
  );
};

const focusWithKeyboard = async (element: HTMLElement) => {
  document.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Tab"}));
  element.focus();
  await nextTick();
};

afterEach(() => {
  document.body.replaceChildren();
});

describe("T04 data-slot parity", () => {
  it("Button and ButtonGroup render their upstream slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(ButtonGroup, null, {
            default: () => [
              h(Button, null, {default: () => "A"}),
              h(ButtonGroupSeparator),
              h(Button, null, {default: () => "B"})
            ]
          });
      }
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "button-group", ["button"]);
    expect(html).toContain('data-slot="button-group-separator"');
    expect(html).toContain("button-group--horizontal");
  });

  it("Checkbox and CheckboxGroup render their upstream slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h("div", null, [
            h(Checkbox, {value: "terms", modelValue: "indeterminate"}, {
              default: () => [
                h(CheckboxContent, null, {
                  default: () => [
                    h(CheckboxControl, null, {default: () => [h(CheckboxIndicator)]}),
                    h(Label, null, {default: () => "Accept"})
                  ]
                })
              ]
            }),
            h(CheckboxGroup, null, {
              default: () => [
                h(Checkbox, {value: "terms"}, {
                  default: () => [
                    h(CheckboxContent, null, {
                      default: () => [
                        h(CheckboxControl, null, {default: () => [h(CheckboxIndicator)]}),
                        h(Label, null, {default: () => "Accept"})
                      ]
                    })
                  ]
                })
              ]
            })
          ]);
      }
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "checkbox", ["checkbox-group", "label"]);
    expect(html).toContain('data-slot="checkbox-default-indicator--checkmark"');
    expect(html).toContain('role="group"');
  });

  it("Radio and RadioGroup render their upstream slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(RadioGroup, null, {
            default: () => [
              h(Radio, {value: "a"}, {
                default: () => [
                  h(RadioContent, null, {
                    default: () => [
                      h(RadioControl, null, {default: () => [h(RadioIndicator)]}),
                      "A"
                    ]
                  })
                ]
              })
            ]
          });
      }
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "radio", ["radio-group"]);
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('data-orientation="vertical"');
  });

  it("Switch and SwitchGroup render their upstream slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(SwitchGroup, null, {
            default: () => [
              h(Switch, null, {
                default: () => [
                  h(SwitchContent, null, {
                    default: () => [
                      h(SwitchControl, null, {
                        default: () => [h(SwitchThumb), h(SwitchIcon)]
                      }),
                      "Enable"
                    ]
                  })
                ]
              })
            ]
          });
      }
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "switch", ["switch-group", "switch-group-items"]);
    expect(html).toContain('data-slot="switch-group-items"');
  });

  it("InputGroup renders its upstream slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(InputGroup, null, {
            default: () => [
              h(InputGroupPrefix, null, {default: () => "@"}),
              h(InputGroupInput),
              h(InputGroupTextArea),
              h(InputGroupSuffix, null, {default: () => ".com"})
            ]
          });
      }
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "input-group");
    expect(html).toContain('data-slot="input-group-input"');
  });

  it("SearchField renders its upstream slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(SearchField, null, {
            default: () => [
              h(SearchFieldGroup, null, {
                default: () => [
                  h(SearchFieldSearchIcon),
                  h(SearchFieldInput),
                  h(SearchFieldClearButton)
                ]
              })
            ]
          });
      }
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "search-field", ["close-button-icon"]);
    expect(html).toContain('slot="clear"');
    expect(html).toContain('data-empty="true"');
  });

  it("NumberField renders its upstream slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(NumberField, null, {
            default: () => [
              h(NumberFieldGroup, null, {
                default: () => [
                  h(NumberFieldDecrementButton),
                  h(NumberFieldInput),
                  h(NumberFieldIncrementButton)
                ]
              })
            ]
          });
      }
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "number-field");
    expect(html).toContain('slot="increment"');
    expect(html).toContain('slot="decrement"');
    expect(html).toContain('role="spinbutton"');
  });

  it("Slider renders its upstream slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(Slider, {modelValue: 40}, {
            default: () => [
              h(SliderOutput),
              h(SliderTrack, null, {
                default: () => [
                  h(SliderFill),
                  h(SliderSteps, null, {
                    default: () => [h(SliderStep)]
                  }),
                  h(SliderThumb)
                ]
              }),
              h(SliderMarks, null, {
                default: () => [h(SliderMark, {value: 20})]
              })
            ]
          });
      }
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "slider");
    expect(html).toContain('role="slider"');
    expect(html).toContain('data-slot="slider-step"');
  });

  it("ToggleButton, ToggleButtonGroup, and Toolbar render their upstream slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(Toolbar, null, {
            default: () => [
              h(ToggleButtonGroup, {type: "multiple"}, {
                default: () => [
                  h(ToggleButton, {value: "bold"}, {default: () => "B"}),
                  h(ToggleButtonGroupSeparator),
                  h(ToggleButton, {value: "italic"}, {default: () => "I"})
                ]
              })
            ]
          });
      }
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "toolbar", [
      "toggle-button",
      "toggle-button-group",
      "toggle-button-group-separator"
    ]);
    expect(html).toContain('role="toolbar"');
  });

  it("Textarea and TextField keep the upstream slots", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(TextField, {isInvalid: true}, {
            default: () => [
              h(Label, null, {default: () => "Message"}),
              h(Input),
              h(Textarea),
              h(Description, null, {default: () => "Tell us more."}),
              h(FieldError, null, {default: () => "Too short."})
            ]
          });
      }
    });
    const html = await renderSSR(host);

    expectUpstreamSlots(html, "textarea", [
      "textfield",
      "label",
      "input",
      "description",
      "field-error"
    ]);
  });

  it("Form renders no data-slot, like the upstream component", async () => {
    const html = await renderSSR(Form, {slots: {default: () => "form"}});

    expect(dataSlots(html)).toEqual([]);
    expect(html).toContain("<form");
  });

  it("covers every upstream slot of the form controls", () => {
    const components = [
      "button",
      "button-group",
      "checkbox",
      "checkbox-group",
      "input",
      "input-group",
      "number-field",
      "radio",
      "radio-group",
      "search-field",
      "slider",
      "switch",
      "switch-group",
      "textarea",
      "textfield",
      "toggle-button",
      "toggle-button-group",
      "toolbar"
    ];

    for (const component of components) {
      for (const slot of slotSnapshot.components[component] ?? []) {
        expect(renderedSlots.has(slot), `${component} is missing the slot ${slot}`).toBe(
          true
        );
      }
    }
  });
});

describe("T04 interactive state contract", () => {
  it("Checkbox reports selected, indeterminate, and disabled states", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Checkbox, {modelValue: "indeterminate", isDisabled: true}, {
              default: () => [
                h(CheckboxContent, null, {
                  default: () => [h(CheckboxControl, null, {default: () => [h(CheckboxIndicator)]})]
                })
              ]
            });
        }
      }),
      {attachTo: document.body}
    );
    const root = wrapper.get('[data-slot="checkbox"]');
    const content = wrapper.get('[data-slot="checkbox-content"]');

    expect(root.attributes("data-indeterminate")).toBe("true");
    expect(root.attributes("data-disabled")).toBe("true");
    expect(root.attributes("data-selected")).toBeUndefined();
    expect(content.attributes("data-indeterminate")).toBe("true");

    const indicator = wrapper.get('[data-slot="checkbox-indicator"]');

    expect(indicator.find('[data-slot="checkbox-default-indicator--indeterminate"]').exists()).toBe(
      true
    );

    wrapper.unmount();
  });

  it("CheckboxGroup toggles array values", async () => {
    const values = ref<string[]>(["a"]);

    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(CheckboxGroup, {"modelValue": values.value, "onUpdate:modelValue": (next: string[]) => (values.value = next)}, {
              default: () => [
                h(Checkbox, {value: "a"}, {default: () => "A"}),
                h(Checkbox, {value: "b"}, {default: () => "B"})
              ]
            });
        }
      }),
      {attachTo: document.body}
    );

    await nextTick();

    const checkboxes = wrapper.findAll('[data-slot="checkbox"]');

    expect(checkboxes[0]!.attributes("data-selected")).toBe("true");
    expect(checkboxes[1]!.attributes("data-selected")).toBeUndefined();

    wrapper.unmount();
  });

  it("Radio exposes the selected state and native group name", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(RadioGroup, {modelValue: "b"}, {
              default: () => [
                h(Radio, {value: "a"}, {
                  default: () => [h(RadioContent, null, {default: () => "A"})]
                }),
                h(Radio, {value: "b"}, {
                  default: () => [h(RadioContent, null, {default: () => "B"})]
                })
              ]
            });
        }
      }),
      {attachTo: document.body}
    );

    const radios = wrapper.findAll('[data-slot="radio"]');

    expect(radios[0]!.attributes("data-selected")).toBeUndefined();
    expect(radios[1]!.attributes("data-selected")).toBe("true");

    const inputs = wrapper.findAll('input[type="radio"]');

    expect(inputs[0]!.attributes("name")).toBe(inputs[1]!.attributes("name"));
    expect(inputs[1]!.attributes("checked")).toBeDefined();
    expect(inputs[0]!.attributes("tabindex")).toBe("-1");

    wrapper.unmount();
  });

  it("Switch exposes the selected state and the switch role", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Switch, {modelValue: true}, {
              default: () => [
                h(SwitchContent, null, {
                  default: () => [h(SwitchControl, null, {default: () => [h(SwitchThumb)]})]
                })
              ]
            });
        }
      }),
      {attachTo: document.body}
    );

    expect(wrapper.get('[data-slot="switch"]').attributes("data-selected")).toBe("true");
    expect(wrapper.get('[data-slot="switch-content"]').attributes("data-selected")).toBe("true");
    expect(wrapper.findAll('input[role="switch"]')).toHaveLength(1);

    wrapper.unmount();
  });

  it("ToggleButton exposes pressed, selected, and hover states", async () => {
    const wrapper = mount(ToggleButton, {
      attachTo: document.body,
      props: {modelValue: true},
      slots: {default: "Bold"}
    });
    const button = wrapper.get('[data-slot="toggle-button"]');

    expect(button.attributes("aria-pressed")).toBe("true");
    expect(button.attributes("data-selected")).toBe("true");

    pointer(button.element, "pointerenter");
    await nextTick();
    expect(button.attributes("data-hovered")).toBe("true");

    pointer(button.element, "pointerdown", {button: 0});
    await nextTick();
    expect(button.attributes("data-pressed")).toBe("true");

    pointer(button.element, "pointerup");
    await nextTick();
    expect(button.attributes("data-pressed")).toBeUndefined();

    wrapper.unmount();
  });

  it("ToggleButtonGroup renders radio semantics for single selection", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(ToggleButtonGroup, {type: "single", modelValue: "a"}, {
              default: () => [
                h(ToggleButton, {value: "a"}, {default: () => "A"}),
                h(ToggleButton, {value: "b"}, {default: () => "B"})
              ]
            });
        }
      }),
      {attachTo: document.body}
    );

    expect(wrapper.get('[data-slot="toggle-button-group"]').attributes("role")).toBe(
      "radiogroup"
    );

    const buttons = wrapper.findAll('[data-slot="toggle-button"]');

    expect(buttons[0]!.attributes("aria-checked")).toBe("true");
    expect(buttons[0]!.attributes("data-selected")).toBe("true");
    expect(buttons[1]!.attributes("aria-checked")).toBe("false");

    wrapper.unmount();
  });

  it("Slider reports the fill range and the thumb value", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Slider, {modelValue: 30}, {
              default: () => [
                h(SliderOutput),
                h(SliderTrack, null, {
                  default: () => [h(SliderFill), h(SliderThumb)]
                })
              ]
            });
        }
      }),
      {attachTo: document.body}
    );

    const track = wrapper.get('[data-slot="slider-track"]');
    const fill = wrapper.get('[data-slot="slider-fill"]');
    const thumb = wrapper.get('[data-slot="slider-thumb"]');

    expect(track.attributes("data-fill-start")).toBe("true");
    expect(fill.attributes("style")).toContain("width: 30%");
    expect(thumb.attributes("aria-valuenow")).toBe("30");
    expect(thumb.attributes("role")).toBe("slider");

    wrapper.unmount();
  });

  it("Input reports hover and focus states", async () => {
    const wrapper = mount(Input, {attachTo: document.body});
    const input = wrapper.get('[data-slot="input"]');

    pointer(input.element, "pointerenter");
    await nextTick();
    expect(input.attributes("data-hovered")).toBe("true");

    await focusWithKeyboard(input.element as HTMLElement);
    expect(input.attributes("data-focus-visible")).toBe("true");
    expect(input.attributes("data-focused")).toBe("true");

    wrapper.unmount();
  });

  it("SearchField clears the value and reports the empty state", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(SearchField, {modelValue: "sail"}, {
              default: () => [
                h(SearchFieldGroup, null, {
                  default: () => [h(SearchFieldInput), h(SearchFieldClearButton)]
                })
              ]
            });
        }
      }),
      {attachTo: document.body}
    );

    expect(wrapper.get('[data-slot="search-field"]').attributes("data-empty")).toBeUndefined();

    await wrapper.get('[data-slot="search-field-clear-button"]').trigger("click");
    await nextTick();

    expect(wrapper.get('[data-slot="search-field"]').attributes("data-empty")).toBe("true");

    wrapper.unmount();
  });

  it("Checkbox content reports hover, press, and focus states", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Checkbox, null, {
              default: () => [
                h(CheckboxContent, null, {
                  default: () => [h(CheckboxControl, null, {default: () => [h(CheckboxIndicator)]})]
                })
              ]
            });
        }
      }),
      {attachTo: document.body}
    );
    const content = wrapper.get('[data-slot="checkbox-content"]');

    pointer(content.element, "pointerenter");
    await nextTick();
    expect(content.attributes("data-hovered")).toBe("true");

    pointer(content.element, "pointerdown", {button: 0});
    await nextTick();
    expect(content.attributes("data-pressed")).toBe("true");

    pointer(content.element, "pointerup");
    await nextTick();
    expect(content.attributes("data-pressed")).toBeUndefined();

    const input = wrapper.get('input[type="checkbox"]');

    await focusWithKeyboard(input.element as HTMLElement);
    expect(content.attributes("data-focus-visible")).toBe("true");
    expect(content.attributes("data-focused")).toBe("true");

    wrapper.unmount();
  });

  it("Radio and Switch content report hover and press states", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h("div", null, [
              h(Radio, {value: "a"}, {
                default: () => [h(RadioContent, null, {default: () => "A"})]
              }),
              h(Switch, null, {
                default: () => [
                  h(SwitchContent, null, {default: () => "Enable"})
                ]
              })
            ]);
        }
      }),
      {attachTo: document.body}
    );

    const radioContent = wrapper.get('[data-slot="radio-content"]');
    const switchContent = wrapper.get('[data-slot="switch-content"]');

    pointer(radioContent.element, "pointerenter");
    pointer(switchContent.element, "pointerenter");
    await nextTick();

    expect(radioContent.attributes("data-hovered")).toBe("true");
    expect(switchContent.attributes("data-hovered")).toBe("true");

    pointer(radioContent.element, "pointerdown", {button: 0});
    await nextTick();
    expect(radioContent.attributes("data-pressed")).toBe("true");

    wrapper.unmount();
  });

  it("NumberField, InputGroup, and SearchField report group states", async () => {
    const numberField = mount(
      defineComponent({
        setup() {
          return () =>
            h(NumberField, null, {
              default: () => [
                h(NumberFieldGroup, null, {default: () => [h(NumberFieldInput)]})
              ]
            });
        }
      }),
      {attachTo: document.body}
    );
    const group = numberField.get('[data-slot="number-field-group"]');

    pointer(group.element, "pointerenter");
    await nextTick();
    expect(group.attributes("data-hovered")).toBe("true");

    (group.element as HTMLElement).querySelector("input")?.focus();
    await nextTick();
    expect(group.attributes("data-focus-within")).toBe("true");

    numberField.unmount();

    const inputGroup = mount(
      defineComponent({
        setup() {
          return () =>
            h(InputGroup, {isInvalid: true}, {
              default: () => [h(InputGroupInput)]
            });
        }
      }),
      {attachTo: document.body}
    );
    const inputGroupRoot = inputGroup.get('[data-slot="input-group"]');

    expect(inputGroupRoot.attributes("data-invalid")).toBe("true");

    pointer(inputGroupRoot.element, "pointerenter");
    await nextTick();
    expect(inputGroupRoot.attributes("data-hovered")).toBe("true");

    inputGroup.unmount();

    const searchField = mount(
      defineComponent({
        setup() {
          return () =>
            h(SearchField, {isDisabled: true}, {
              default: () => [
                h(SearchFieldGroup, null, {default: () => [h(SearchFieldInput)]})
              ]
            });
        }
      }),
      {attachTo: document.body}
    );

    expect(searchField.get('[data-slot="search-field-group"]').attributes("data-disabled")).toBe(
      "true"
    );
    expect(searchField.get('[data-slot="search-field"]').attributes("data-disabled")).toBe("true");

    searchField.unmount();
  });

  it("Slider reports dragging, direction, and fill states", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Slider, {modelValue: 100}, {
              default: () => [
                h(SliderTrack, null, {
                  default: () => [h(SliderFill), h(SliderThumb)]
                }),
                h(SliderMarks, null, {default: () => [h(SliderMark, {value: 20})]})
              ]
            });
        }
      }),
      {attachTo: document.body}
    );

    const track = wrapper.get('[data-slot="slider-track"]');
    const thumb = wrapper.get('[data-slot="slider-thumb"]');

    expect(track.attributes("data-fill-end")).toBe("true");
    expect(wrapper.get('[data-slot="slider-marks"]').attributes("data-direction")).toBe("ltr");

    pointer(thumb.element, "pointerdown", {button: 0});
    await nextTick();
    expect(thumb.attributes("data-dragging")).toBe("true");

    wrapper.unmount();
  });

  it("Textarea reports hover, focus, invalid, and disabled states", async () => {
    const wrapper = mount(Textarea, {attachTo: document.body, props: {isInvalid: true}});
    const textarea = wrapper.get('[data-slot="textarea"]');

    expect(textarea.attributes("data-invalid")).toBe("true");

    pointer(textarea.element, "pointerenter");
    await nextTick();
    expect(textarea.attributes("data-hovered")).toBe("true");

    await focusWithKeyboard(textarea.element as HTMLElement);
    expect(textarea.attributes("data-focus-visible")).toBe("true");
    expect(textarea.attributes("data-focused")).toBe("true");

    wrapper.unmount();
  });

  it("Form emits submit and invalid events", async () => {
    const wrapper = mount(Form, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(Input, {name: "email", required: true}),
          h(Button, {type: "submit"}, {default: () => "Send"})
        ]
      }
    });

    await wrapper.get("form").trigger("submit");
    expect(wrapper.emitted("submit")).toHaveLength(1);

    wrapper.unmount();
  });
});
