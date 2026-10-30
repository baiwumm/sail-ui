<script setup lang="ts">
import {Button} from "@sail-ui/vue/button";
import {ButtonGroup, ButtonGroupSeparator} from "@sail-ui/vue/button-group";
import {Checkbox, CheckboxContent, CheckboxControl, CheckboxIndicator} from "@sail-ui/vue/checkbox";
import {CheckboxGroup} from "@sail-ui/vue/checkbox-group";
import {Description} from "@sail-ui/vue/description";
import {FieldError} from "@sail-ui/vue/field-error";
import {Form} from "@sail-ui/vue/form";
import {Input, TextField} from "@sail-ui/vue/input";
import {InputGroup, InputGroupInput, InputGroupPrefix, InputGroupSuffix} from "@sail-ui/vue/input-group";
import {Label} from "@sail-ui/vue/label";
import {
  NumberField,
  NumberFieldDecrementButton,
  NumberFieldGroup,
  NumberFieldIncrementButton,
  NumberFieldInput
} from "@sail-ui/vue/number-field";
import {Radio, RadioContent, RadioControl, RadioIndicator} from "@sail-ui/vue/radio";
import {RadioGroup} from "@sail-ui/vue/radio-group";
import {
  SearchField,
  SearchFieldClearButton,
  SearchFieldGroup,
  SearchFieldInput,
  SearchFieldSearchIcon
} from "@sail-ui/vue/search-field";
import {
  Slider,
  SliderFill,
  SliderOutput,
  SliderThumb,
  SliderTrack
} from "@sail-ui/vue/slider";
import {Switch, SwitchContent, SwitchControl, SwitchThumb} from "@sail-ui/vue/switch";
import {SwitchGroup} from "@sail-ui/vue/switch-group";
import {ToggleButton} from "@sail-ui/vue/toggle-button";
import {ToggleButtonGroup, ToggleButtonGroupSeparator} from "@sail-ui/vue/toggle-button-group";
import {Toolbar} from "@sail-ui/vue/toolbar";
import {ref} from "vue";

const email = ref("");
const password = ref("");
const query = ref("sail ui");
const plan = ref("pro");
const volume = ref(40);
const quantity = ref(3);
const notifications = ref(true);
const analytics = ref(false);
const terms = ref<string[]>(["newsletter"]);
const format = ref<string[]>(["bold"]);
const submitted = ref("submitted");
const pressCount = ref(0);
const clickCount = ref(0);

function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  submitted.value = "submitted";
}
</script>

<template>
  <section
    id="forms"
    class="flex flex-col gap-8"
  >
    <h2 class="text-lg font-semibold">
      Forms
    </h2>

    <div
      id="forms-login"
      class="flex flex-col gap-3"
    >
      <h3 class="text-sm font-medium">
        Sign in
      </h3>
      <Form
        class="flex w-full max-w-sm flex-col gap-3"
        @submit="handleSubmit"
      >
        <TextField full-width>
          <Label>Email</Label>
          <Input
            v-model="email"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
        </TextField>
        <TextField
          is-invalid
          full-width
        >
          <Label>Password</Label>
          <Input
            v-model="password"
            name="password"
            placeholder="••••••••"
            type="password"
          />
          <FieldError>Password must be at least 8 characters.</FieldError>
        </TextField>
        <Button
          type="submit"
          :data-click-count="clickCount"
          :data-press-count="pressCount"
          @click="clickCount += 1"
          @press="pressCount += 1"
        >
          Sign in
        </Button>
      </Form>
    </div>

    <div
      id="forms-settings"
      class="flex flex-col gap-4"
    >
      <h3 class="text-sm font-medium">
        Settings
      </h3>
      <SwitchGroup class="max-w-sm">
        <Switch v-model="notifications">
          <SwitchContent>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
            Notifications
          </SwitchContent>
        </Switch>
        <Switch v-model="analytics">
          <SwitchContent>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
            Analytics
          </SwitchContent>
        </Switch>
      </SwitchGroup>
      <RadioGroup
        v-model="plan"
        class="max-w-sm"
      >
        <Radio value="free">
          <RadioContent>
            <RadioControl>
              <RadioIndicator />
            </RadioControl>
            Free
          </RadioContent>
        </Radio>
        <Radio value="pro">
          <RadioContent>
            <RadioControl>
              <RadioIndicator />
            </RadioControl>
            Pro
          </RadioContent>
        </Radio>
      </RadioGroup>
      <div class="flex w-full max-w-sm flex-col gap-2">
        <Slider v-model="volume">
          <Label>Volume</Label>
          <SliderOutput />
          <SliderTrack>
            <SliderFill />
            <SliderThumb />
          </SliderTrack>
        </Slider>
      </div>
      <NumberField
        v-model="quantity"
        class="max-w-sm"
        :max="10"
        :min="0"
      >
        <Label>Quantity</Label>
        <NumberFieldGroup>
          <NumberFieldDecrementButton />
          <NumberFieldInput />
          <NumberFieldIncrementButton />
        </NumberFieldGroup>
      </NumberField>
    </div>

    <div
      id="forms-search"
      class="flex flex-col gap-3"
    >
      <h3 class="text-sm font-medium">
        Search
      </h3>
      <SearchField
        v-model="query"
        class="max-w-sm"
      >
        <SearchFieldGroup>
          <SearchFieldSearchIcon />
          <SearchFieldInput placeholder="Search components" />
          <SearchFieldClearButton />
        </SearchFieldGroup>
      </SearchField>
      <InputGroup class="max-w-sm">
        <InputGroupPrefix>
          @
        </InputGroupPrefix>
        <InputGroupInput placeholder="sail" />
        <InputGroupSuffix>
          .ui
        </InputGroupSuffix>
      </InputGroup>
    </div>

    <div
      id="forms-toolbar"
      class="flex flex-col gap-3"
    >
      <h3 class="text-sm font-medium">
        Toolbar
      </h3>
      <Toolbar>
        <ToggleButtonGroup
          v-model="format"
          type="multiple"
        >
          <ToggleButton value="bold">
            Bold
          </ToggleButton>
          <ToggleButtonGroupSeparator />
          <ToggleButton value="italic">
            Italic
          </ToggleButton>
          <ToggleButtonGroupSeparator />
          <ToggleButton value="underline">
            Underline
          </ToggleButton>
        </ToggleButtonGroup>
        <ButtonGroup>
          <Button size="sm">
            Left
          </Button>
          <ButtonGroupSeparator />
          <Button size="sm">
            Right
          </Button>
        </ButtonGroup>
      </Toolbar>
    </div>

    <div
      id="forms-states"
      class="flex flex-col gap-3"
    >
      <h3 class="text-sm font-medium">
        States
      </h3>
      <CheckboxGroup
        v-model="terms"
        class="max-w-sm"
      >
        <Checkbox value="newsletter">
          <CheckboxContent>
            <CheckboxControl>
              <CheckboxIndicator />
            </CheckboxControl>
            Newsletter
          </CheckboxContent>
          <Description>Weekly product updates.</Description>
        </Checkbox>
        <Checkbox
          is-disabled
          value="beta"
        >
          <CheckboxContent>
            <CheckboxControl>
              <CheckboxIndicator />
            </CheckboxControl>
            Beta channel
          </CheckboxContent>
        </Checkbox>
      </CheckboxGroup>
      <TextField
        is-disabled
        class="max-w-sm"
        full-width
      >
        <Label>Disabled field</Label>
        <Input placeholder="Unavailable" />
      </TextField>
      <TextField
        is-invalid
        class="max-w-sm"
        full-width
      >
        <Label>Invalid field</Label>
        <Input placeholder="Broken" />
        <FieldError>This field is required.</FieldError>
      </TextField>
    </div>
  </section>
</template>
