import {
  AlertDialog,
  Button,
  Description,
  Drawer,
  FieldError,
  Input,
  Label,
  ListBox,
  Modal,
  Popover,
  Select,
  Sheet,
  TextField,
  Tooltip,
} from "@heroui/react";
import {useEffect, useState} from "react";

import CalendarDemo from "./Calendar";
import Collections from "./Collections";
import Colors from "./Colors";
import ComboBoxes from "./ComboBoxes";
import DataDemo from "./Data";
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

// Overlay visual matrix (tests/visual): one overlay per placement.
const alertDialogPlacements = ["auto", "top", "center", "bottom"] as const;
const edgePlacements = ["bottom", "top", "left", "right"] as const;
const popoverPlacements = ["bottom", "top", "left", "right"] as const;
const tooltipPlacements = ["top", "bottom", "left", "right"] as const;

export default function App() {
  const [inputValue, setInputValue] = useState("heroui.com");
  const [state, setState] = useState<string | null>("california");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("animations") === "slow") {
      document.documentElement.dataset.animations = "slow";
    }

    if (params.get("theme") === "dark") {
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
            Button · Input · Overlays · Select · Collections · Forms · Display & feedback · Calendar
            · Date pickers · Date &amp; time fields · Combo box · Colors
          </p>
        </div>
        <Button variant="outline" size="sm" onPress={toggleTheme}>
          {isDark ? "Light" : "Dark"}
        </Button>
      </header>

      <section id="overlays" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Overlay matrix</h2>
        <div className="flex flex-wrap items-center gap-3">
          {alertDialogPlacements.map((placement) => (
            <AlertDialog key={placement}>
              <Button variant="secondary">Dialog {placement}</Button>
              <AlertDialog.Backdrop>
                <AlertDialog.Container placement={placement}>
                  <AlertDialog.Dialog className="sm:max-w-[400px]">
                    <AlertDialog.CloseTrigger />
                    <AlertDialog.Header>
                      <AlertDialog.Icon status="danger" />
                      <AlertDialog.Heading>Delete project permanently?</AlertDialog.Heading>
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                      <p>
                        This will permanently delete <strong>Sail UI</strong> and all of its data.
                        This action cannot be undone.
                      </p>
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                      <Button slot="close" variant="tertiary">
                        Cancel
                      </Button>
                      <Button slot="close" variant="danger">
                        Delete project
                      </Button>
                    </AlertDialog.Footer>
                  </AlertDialog.Dialog>
                </AlertDialog.Container>
              </AlertDialog.Backdrop>
            </AlertDialog>
          ))}

          {edgePlacements.map((placement) => (
            <Drawer key={placement}>
              <Button variant="secondary">Drawer {placement}</Button>
              <Drawer.Backdrop>
                <Drawer.Content placement={placement}>
                  <Drawer.Dialog>
                    <Drawer.CloseTrigger />
                    {placement === "bottom" && <Drawer.Handle />}
                    <Drawer.Header>
                      <Drawer.Heading>Drawer</Drawer.Heading>
                    </Drawer.Header>
                    <Drawer.Body>
                      <p>Sliding panel from the {placement} edge with a scrollable body.</p>
                    </Drawer.Body>
                    <Drawer.Footer>
                      <Button slot="close" variant="tertiary">
                        Cancel
                      </Button>
                      <Button slot="close">Save</Button>
                    </Drawer.Footer>
                  </Drawer.Dialog>
                </Drawer.Content>
              </Drawer.Backdrop>
            </Drawer>
          ))}

          {edgePlacements.map((placement) => (
            <Sheet key={placement} placement={placement}>
              <Sheet.Trigger>
                <Button variant="secondary">Sheet {placement}</Button>
              </Sheet.Trigger>
              <Sheet.Backdrop>
                <Sheet.Content>
                  <Sheet.Dialog>
                    <Sheet.CloseTrigger />
                    {placement === "bottom" && <Sheet.Handle />}
                    <Sheet.Header>
                      <Sheet.Heading>Sheet</Sheet.Heading>
                    </Sheet.Header>
                    <Sheet.Body>
                      <p>Sheet panel from the {placement} edge.</p>
                    </Sheet.Body>
                    <Sheet.Footer>
                      <Sheet.Close>
                        <Button variant="secondary">Close</Button>
                      </Sheet.Close>
                    </Sheet.Footer>
                  </Sheet.Dialog>
                </Sheet.Content>
              </Sheet.Backdrop>
            </Sheet>
          ))}

          {popoverPlacements.map((placement) => (
            <Popover key={placement}>
              <Button variant="secondary">Popover {placement}</Button>
              <Popover.Content placement={placement}>
                <Popover.Arrow />
                <Popover.Dialog className="w-64">
                  <Popover.Heading>Popover title</Popover.Heading>
                  <p className="text-sm text-muted">Anchored content with an arrow.</p>
                </Popover.Dialog>
              </Popover.Content>
            </Popover>
          ))}

          {tooltipPlacements.map((placement) => (
            <Tooltip key={placement} delay={0}>
              <Button variant="secondary">Tooltip {placement}</Button>
              <Tooltip.Content placement={placement} showArrow>
                <Tooltip.Arrow />
                Tooltip content
              </Tooltip.Content>
            </Tooltip>
          ))}
        </div>
      </section>

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
      <DataDemo />
      <Gallery />
    </main>
  );
}
