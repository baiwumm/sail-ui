import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import {Button} from "../components/button";
import {ButtonGroup, ButtonGroupSeparator} from "../components/button-group";
import {
  Checkbox,
  CheckboxContent,
  CheckboxControl,
  CheckboxIndicator,
} from "../components/checkbox";
import {CheckboxGroup} from "../components/checkbox-group";
import {Form} from "../components/form";
import {Input, TextField} from "../components/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupPrefix,
  InputGroupSuffix,
} from "../components/input-group";
import {Label} from "../components/label";
import {
  NumberField,
  NumberFieldDecrementButton,
  NumberFieldGroup,
  NumberFieldIncrementButton,
  NumberFieldInput,
} from "../components/number-field";
import {Radio, RadioContent, RadioControl, RadioIndicator} from "../components/radio";
import {RadioGroup} from "../components/radio-group";
import {
  SearchField,
  SearchFieldClearButton,
  SearchFieldGroup,
  SearchFieldInput,
  SearchFieldSearchIcon,
} from "../components/search-field";
import {
  Slider,
  SliderFill,
  SliderMark,
  SliderMarks,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "../components/slider";
import {Switch, SwitchContent, SwitchControl, SwitchThumb} from "../components/switch";
import {SwitchGroup} from "../components/switch-group";
import {Textarea} from "../components/textarea";
import {ToggleButton} from "../components/toggle-button";
import {ToggleButtonGroup, ToggleButtonGroupSeparator} from "../components/toggle-button-group";
import {Toolbar} from "../components/toolbar";

const Page = defineComponent({
  setup() {
    return () =>
      h("main", [
        h(
          Form,
          {name: "demo"},
          {
            default: () => [
              h(
                TextField,
                {isInvalid: true, name: "email"},
                {
                  default: () => [
                    h(Label, null, {default: () => "Email"}),
                    h(Input, {placeholder: "you@example.com"}),
                    h(Textarea, {name: "message"}),
                  ],
                },
              ),
            ],
          },
        ),
        h(ButtonGroup, null, {
          default: () => [
            h(Button, {type: "submit"}, {default: () => "Send"}),
            h(ButtonGroupSeparator),
            h(Button, {isDisabled: true}, {default: () => "Cancel"}),
          ],
        }),
        h(
          CheckboxGroup,
          {name: "options"},
          {
            default: () => [
              h(
                Checkbox,
                {value: "a"},
                {
                  default: () => [
                    h(CheckboxContent, null, {
                      default: () => [
                        h(CheckboxControl, null, {default: () => [h(CheckboxIndicator)]}),
                        h(Label, null, {default: () => "Accept"}),
                      ],
                    }),
                  ],
                },
              ),
            ],
          },
        ),
        h(
          RadioGroup,
          {modelValue: "a"},
          {
            default: () => [
              h(
                Radio,
                {value: "a"},
                {
                  default: () => [
                    h(RadioContent, null, {
                      default: () => [
                        h(RadioControl, null, {default: () => [h(RadioIndicator)]}),
                        "A",
                      ],
                    }),
                  ],
                },
              ),
            ],
          },
        ),
        h(
          Switch,
          {modelValue: true},
          {
            default: () => [
              h(SwitchContent, null, {
                default: () => [h(SwitchControl, null, {default: () => [h(SwitchThumb)]})],
              }),
            ],
          },
        ),
        h(SwitchGroup, null, {default: () => [h(Switch)]}),
        h(InputGroup, null, {
          default: () => [
            h(InputGroupPrefix, null, {default: () => "@"}),
            h(InputGroupInput),
            h(InputGroupSuffix, null, {default: () => ".com"}),
          ],
        }),
        h(
          SearchField,
          {modelValue: "sail"},
          {
            default: () => [
              h(SearchFieldGroup, null, {
                default: () => [
                  h(SearchFieldSearchIcon),
                  h(SearchFieldInput),
                  h(SearchFieldClearButton),
                ],
              }),
            ],
          },
        ),
        h(
          NumberField,
          {modelValue: 5, name: "quantity"},
          {
            default: () => [
              h(NumberFieldGroup, null, {
                default: () => [
                  h(NumberFieldDecrementButton),
                  h(NumberFieldInput),
                  h(NumberFieldIncrementButton),
                ],
              }),
            ],
          },
        ),
        h(
          Slider,
          {modelValue: 30},
          {
            default: () => [
              h(SliderOutput),
              h(SliderTrack, null, {
                default: () => [h(SliderFill), h(SliderThumb)],
              }),
              h(SliderMarks, null, {default: () => [h(SliderMark, {value: 20})]}),
            ],
          },
        ),
        h(Toolbar, null, {
          default: () => [
            h(
              ToggleButtonGroup,
              {type: "multiple", modelValue: ["bold"]},
              {
                default: () => [
                  h(ToggleButton, {value: "bold"}, {default: () => "Bold"}),
                  h(ToggleButtonGroupSeparator),
                  h(ToggleButton, {value: "italic"}, {default: () => "Italic"}),
                ],
              },
            ),
          ],
        }),
      ]);
  },
});

describe("T04 server rendering", () => {
  it("renders every form control on the server", async () => {
    const html = await renderSSR(Page);

    for (const slot of [
      "button",
      "button-group",
      "button-group-separator",
      "checkbox",
      "checkbox-content",
      "checkbox-control",
      "checkbox-group",
      "checkbox-indicator",
      "input",
      "input-group",
      "input-group-input",
      "input-group-prefix",
      "input-group-suffix",
      "label",
      "number-field",
      "number-field-decrement-button",
      "number-field-group",
      "number-field-increment-button",
      "number-field-input",
      "radio",
      "radio-content",
      "radio-control",
      "radio-group",
      "radio-indicator",
      "search-field",
      "search-field-clear-button",
      "search-field-group",
      "search-field-input",
      "search-field-search-icon",
      "slider",
      "slider-fill",
      "slider-mark",
      "slider-marks",
      "slider-output",
      "slider-thumb",
      "slider-track",
      "switch",
      "switch-content",
      "switch-control",
      "switch-group",
      "switch-group-items",
      "switch-thumb",
      "textfield",
      "textarea",
      "toggle-button",
      "toggle-button-group",
      "toggle-button-group-separator",
      "toolbar",
    ]) {
      expect(html, slot).toContain(`data-slot="${slot}"`);
    }

    expect(html).toContain("<form");
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('role="toolbar"');
    expect(html).toContain('role="spinbutton"');
    expect(html).toContain('role="switch"');
  });

  it("is deterministic across renders", async () => {
    const first = await renderSSR(Page);
    const second = await renderSSR(Page);

    expect(second).toBe(first);
  });
});
