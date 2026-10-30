import {
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  Description,
  FieldError,
  Form,
  Input,
  InputGroup,
  Label,
  NumberField,
  Radio,
  RadioGroup,
  SearchField,
  Slider,
  Switch,
  SwitchGroup,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar
} from "@heroui/react";
import {useState} from "react";

export default function Forms() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("sail ui");
  const [plan, setPlan] = useState("pro");
  const [volume, setVolume] = useState(40);
  const [quantity, setQuantity] = useState(3);
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [terms, setTerms] = useState(["newsletter"]);
  const [format, setFormat] = useState(new Set(["bold"]));
  const [pressCount, setPressCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  return (
    <section
      id="forms"
      className="flex flex-col gap-8"
    >
      <h2 className="text-lg font-semibold">Forms</h2>

      <div
        id="forms-login"
        className="flex flex-col gap-3"
      >
        <h3 className="text-sm font-medium">Sign in</h3>
        <Form
          className="flex w-full max-w-sm flex-col gap-3"
          onSubmit={(event) => event.preventDefault()}
        >
          <TextField fullWidth>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </TextField>
          <TextField
            fullWidth
            isInvalid
          >
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <FieldError>Password must be at least 8 characters.</FieldError>
          </TextField>
          <Button
            type="submit"
            data-click-count={clickCount}
            data-press-count={pressCount}
            onPress={() => setPressCount((count) => count + 1)}
            onClick={() => setClickCount((count) => count + 1)}
          >
            Sign in
          </Button>
        </Form>
      </div>

      <div
        id="forms-settings"
        className="flex flex-col gap-4"
      >
        <h3 className="text-sm font-medium">Settings</h3>
        <SwitchGroup className="max-w-sm">
          <Switch
            isSelected={notifications}
            onChange={setNotifications}
          >
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              Notifications
            </Switch.Content>
          </Switch>
          <Switch
            isSelected={analytics}
            onChange={setAnalytics}
          >
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              Analytics
            </Switch.Content>
          </Switch>
        </SwitchGroup>
        <RadioGroup
          className="max-w-sm"
          value={plan}
          onChange={setPlan}
        >
          <Radio value="free">
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              Free
            </Radio.Content>
          </Radio>
          <Radio value="pro">
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              Pro
            </Radio.Content>
          </Radio>
        </RadioGroup>
        <div className="flex w-full max-w-sm flex-col gap-2">
          <Slider
            value={volume}
            onChange={(value) => setVolume(value as number)}
          >
            <Label>Volume</Label>
            <Slider.Output />
            <Slider.Track>
              <Slider.Fill />
              <Slider.Thumb />
            </Slider.Track>
          </Slider>
        </div>
        <NumberField
          className="max-w-sm"
          value={quantity}
          maxValue={10}
          minValue={0}
          onChange={setQuantity}
        >
          <Label>Quantity</Label>
          <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input />
            <NumberField.IncrementButton />
          </NumberField.Group>
        </NumberField>
      </div>

      <div
        id="forms-search"
        className="flex flex-col gap-3"
      >
        <h3 className="text-sm font-medium">Search</h3>
        <SearchField
          className="max-w-sm"
          value={query}
          onChange={setQuery}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search components" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
        <InputGroup className="max-w-sm">
          <InputGroup.Prefix>@</InputGroup.Prefix>
          <InputGroup.Input placeholder="sail" />
          <InputGroup.Suffix>.ui</InputGroup.Suffix>
        </InputGroup>
      </div>

      <div
        id="forms-toolbar"
        className="flex flex-col gap-3"
      >
        <h3 className="text-sm font-medium">Toolbar</h3>
        <Toolbar>
          <ToggleButtonGroup
            selectionMode="multiple"
            selectedKeys={format}
            onSelectionChange={(keys) => setFormat(new Set(Array.from(keys) as string[]))}
          >
            <ToggleButton id="bold">Bold</ToggleButton>
            <ToggleButtonGroup.Separator />
            <ToggleButton id="italic">Italic</ToggleButton>
            <ToggleButtonGroup.Separator />
            <ToggleButton id="underline">Underline</ToggleButton>
          </ToggleButtonGroup>
          <ButtonGroup>
            <Button size="sm">Left</Button>
            <ButtonGroup.Separator />
            <Button size="sm">Right</Button>
          </ButtonGroup>
        </Toolbar>
      </div>

      <div
        id="forms-states"
        className="flex flex-col gap-3"
      >
        <h3 className="text-sm font-medium">States</h3>
        <CheckboxGroup
          className="max-w-sm"
          value={terms}
          onChange={setTerms}
        >
          <Checkbox value="newsletter">
            <Checkbox.Content>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              Newsletter
            </Checkbox.Content>
            <Description>Weekly product updates.</Description>
          </Checkbox>
          <Checkbox
            isDisabled
            value="beta"
          >
            <Checkbox.Content>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              Beta channel
            </Checkbox.Content>
          </Checkbox>
        </CheckboxGroup>
        <TextField
          className="max-w-sm"
          fullWidth
          isDisabled
        >
          <Label>Disabled field</Label>
          <Input placeholder="Unavailable" />
        </TextField>
        <TextField
          className="max-w-sm"
          fullWidth
          isInvalid
        >
          <Label>Invalid field</Label>
          <Input placeholder="Broken" />
          <FieldError>This field is required.</FieldError>
        </TextField>
      </div>
    </section>
  );
}
