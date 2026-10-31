import {
  Button,
  Description,
  FieldError,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextField,
} from "@heroui/react";
import {useEffect, useState} from "react";

import CalendarDemo from "./Calendar";
import Collections from "./Collections";
import Colors from "./Colors";
import ComboBoxes from "./ComboBoxes";
import DateFields from "./DateFields";
import DatePickers from "./DatePickers";
import Forms from "./Forms";
import Gallery from "./Gallery";

const states = [
  {id: "florida", label: "Florida"},
  {id: "delaware", label: "Delaware"},
  {id: "california", label: "California"},
  {id: "texas", label: "Texas"},
  {id: "new-york", label: "New York"},
  {id: "washington", label: "Washington"},
];

export default function App() {
  const [inputValue, setInputValue] = useState("heroui.com");
  const [state, setState] = useState<string | null>("california");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = new URLSearchParams(window.location.search).get("theme");

    if (theme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleTheme() {
    setIsDark((current) => !current);
    document.documentElement.classList.toggle("dark", !isDark);
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 p-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Sail UI playground</h1>
          <p className="text-sm text-muted">
            Button · Input · Modal · Select · Collections · Forms · Display & feedback · Calendar ·
            Date pickers · Date &amp; time fields · Combo box · Colors
          </p>
        </div>
        <Button variant="outline" size="sm" onPress={toggleTheme}>
          {isDark ? "Light" : "Dark"}
        </Button>
      </header>

      <section id="buttons" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Button</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button isDisabled>Disabled</Button>
          <Button isPending>
            <span
              aria-label="Loading"
              className="spinner spinner--current spinner--sm"
              role="status"
            >
              <svg aria-hidden="true" className="spinner__icon" fill="none" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeDasharray="42 16"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
            </span>
            Loading
          </Button>
          <Button isIconOnly aria-label="Add item" variant="secondary">
            <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
              <path
                d="M8 2v12M2 8h12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </svg>
          </Button>
          <Button
            className="custom-button"
            data-testid="attrs-button"
            style={{letterSpacing: "0.04em"}}
          >
            Attrs
          </Button>
        </div>
      </section>

      <section id="input" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Input</h2>
        <div className="flex flex-wrap items-start gap-6">
          <TextField className="max-w-sm" fullWidth>
            <Label>Domain</Label>
            <Input
              placeholder="domain"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <Description>Use a domain you own.</Description>
          </TextField>
          <TextField className="max-w-sm" fullWidth isInvalid>
            <Label>Email</Label>
            <Input placeholder="you@example.com" />
            <FieldError>Enter a valid email address.</FieldError>
          </TextField>
          <TextField className="max-w-sm" fullWidth isDisabled>
            <Label>API key</Label>
            <Input defaultValue="sk_live_***" />
            <Description>Managed by your workspace.</Description>
          </TextField>
        </div>
        <p className="text-sm text-muted">
          Controlled value: <span data-testid="input-value">{inputValue}</span>
        </p>
      </section>

      <section id="modal" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Modal</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Modal>
            <Button variant="secondary">Open Modal</Button>
            <Modal.Backdrop>
              <Modal.Container>
                <Modal.Dialog className="sm:max-w-[360px]">
                  <Modal.CloseTrigger />
                  <Modal.Header>
                    <Modal.Icon className="bg-default text-foreground">
                      <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                        <path
                          d="M5 15c6 0 9-3 9-9 3 3 4 6 4 9a5 5 0 0 1-10 0 8 8 0 0 1-3-0Z"
                          stroke="currentColor"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </Modal.Icon>
                    <Modal.Heading>Welcome to Sail UI</Modal.Heading>
                  </Modal.Header>
                  <Modal.Body>
                    <p>A Vue 3 port of the HeroUI v3 CSS and DOM contract, built on Reka UI.</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button slot="close" variant="secondary">
                      Cancel
                    </Button>
                    <Button slot="close">Continue</Button>
                  </Modal.Footer>
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        </div>
      </section>

      <section id="select" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Select</h2>
        <div className="flex flex-wrap items-start gap-6">
          <Select
            className="w-64"
            placeholder="Select one"
            value={state}
            onChange={(value) => setState(value as string | null)}
          >
            <Label>State</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.ClearButton />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {states.map((item) => (
                  <ListBox.Item key={item.id} id={item.id} textValue={item.label}>
                    {item.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <p className="text-sm text-muted">
            Selected: <span data-testid="select-value">{state ?? "none"}</span>
          </p>
        </div>
      </section>

      <Collections />
      <Forms />
      <CalendarDemo />
      <DateFields />
      <DatePickers />
      <ComboBoxes />
      <Colors />
      <Gallery />
    </main>
  );
}
