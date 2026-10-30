import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  Badge,
  BadgeAnchor,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Chip,
  CloseButton,
  Code,
  Description,
  EmptyState,
  ErrorMessage,
  FieldError,
  FieldGroup,
  Fieldset,
  FieldsetActions,
  FieldsetLegend,
  Header,
  Heading,
  Input,
  Kbd,
  KbdAbbr,
  KbdContent,
  Label,
  Link,
  LinkIcon,
  Paragraph,
  ProgressBar,
  ProgressBarFill,
  ProgressBarOutput,
  ProgressBarTrack,
  ProgressCircle,
  ProgressCircleFillCircle,
  ProgressCircleTrack,
  ProgressCircleTrackCircle,
  Prose,
  Separator,
  Skeleton,
  Spinner,
  Surface,
  TextField,
  Typography,
} from "@heroui/react";

const alertStatuses = ["default", "accent", "success", "warning", "danger"] as const;
const alertCopy = {
  default: {
    title: "New version available",
    description: "Refresh to get the latest features.",
  },
  accent: {
    title: "Update required",
    description: "Restart the app to continue.",
  },
  success: {
    title: "Changes saved",
    description: "Your profile has been updated.",
  },
  warning: {
    title: "Storage almost full",
    description: "Free up space to keep syncing.",
  },
  danger: {
    title: "Upload failed",
    description: "Check your connection and try again.",
  },
} as const;

const avatarSizes = [
  {label: "SM", size: "sm"},
  {label: "MD", size: "md"},
  {label: "LG", size: "lg"},
] as const;

const avatarColors = [
  {label: "DF", color: "default"},
  {label: "AC", color: "accent"},
  {label: "SC", color: "success"},
  {label: "WR", color: "warning"},
  {label: "DG", color: "danger"},
] as const;

const badgeColors = [
  {color: "default", value: "1"},
  {color: "accent", value: "2"},
  {color: "success", value: "3"},
  {color: "warning", value: "4"},
  {color: "danger", value: "5"},
] as const;

const badgeSizes = [
  {size: "sm", value: "1"},
  {size: "md", value: "2"},
  {size: "lg", value: "3"},
] as const;

const cardVariants = [
  {variant: "default", title: "Default", description: "Standard card appearance"},
  {variant: "secondary", title: "Secondary", description: "Medium prominence"},
  {variant: "tertiary", title: "Tertiary", description: "Higher prominence"},
  {variant: "transparent", title: "Transparent", description: "Minimal prominence"},
] as const;

const chipVariants = ["primary", "secondary", "soft", "tertiary"] as const;
const chipColors = ["default", "accent", "success", "warning", "danger"] as const;
const chipSizes = ["sm", "md", "lg"] as const;
const linkItems = ["Blog", "Docs", "Source"];
const barSizes = [
  {size: "sm", label: "Small", value: 40},
  {size: "md", label: "Medium", value: 60},
  {size: "lg", label: "Large", value: 80},
] as const;
const barColors = [
  {color: "default", label: "Default"},
  {color: "accent", label: "Accent"},
  {color: "success", label: "Success"},
  {color: "warning", label: "Warning"},
  {color: "danger", label: "Danger"},
] as const;
const circleSizes = [
  {size: "sm", value: 40},
  {size: "md", value: 60},
  {size: "lg", value: 80},
] as const;
const spinnerColors = ["accent", "current", "success", "warning", "danger"] as const;
const spinnerSizes = ["sm", "md", "lg", "xl"] as const;

export default function Gallery() {
  return (
    <>
      <section id="alert" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Alert</h2>
        <div className="grid w-full max-w-xl gap-3">
          {alertStatuses.map((status) => (
            <Alert key={status} status={status}>
              <AlertIndicator />
              <AlertContent>
                <AlertTitle>{alertCopy[status].title}</AlertTitle>
                <AlertDescription>{alertCopy[status].description}</AlertDescription>
              </AlertContent>
            </Alert>
          ))}
        </div>
      </section>

      <section id="avatar" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Avatar</h2>
        <div className="flex flex-wrap items-center gap-3">
          {avatarSizes.map((item) => (
            <Avatar key={item.size} size={item.size}>
              <AvatarFallback>{item.label}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {avatarColors.map((item) => (
            <Avatar key={item.color} color={item.color}>
              <AvatarFallback>{item.label}</AvatarFallback>
            </Avatar>
          ))}
          <Avatar color="accent" variant="soft">
            <AvatarFallback>SO</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <AvatarGroup max={3} size="md">
            <Avatar>
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
          </AvatarGroup>
          <AvatarGroup overlap="ring" size="lg">
            <Avatar>
              <AvatarFallback>E</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>F</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>G</AvatarFallback>
            </Avatar>
          </AvatarGroup>
          <AvatarGroup isGrid size="sm">
            <Avatar>
              <AvatarFallback>H</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>I</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>K</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        </div>
      </section>

      <section id="badge" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Badge</h2>
        <div className="flex flex-wrap items-center gap-6">
          {badgeColors.map((item) => (
            <BadgeAnchor key={item.color}>
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Badge color={item.color}>{item.value}</Badge>
            </BadgeAnchor>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-6">
          {badgeSizes.map((item) => (
            <BadgeAnchor key={item.size}>
              <Avatar size={item.size}>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Badge size={item.size} color="danger">
                {item.value}
              </Badge>
            </BadgeAnchor>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <BadgeAnchor>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Badge variant="primary">Primary</Badge>
          </BadgeAnchor>
          <BadgeAnchor>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Badge variant="secondary">Secondary</Badge>
          </BadgeAnchor>
          <BadgeAnchor>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Badge variant="soft">Soft</Badge>
          </BadgeAnchor>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <BadgeAnchor>
            <Avatar>
              <AvatarFallback>TL</AvatarFallback>
            </Avatar>
            <Badge placement="top-left" size="sm">
              1
            </Badge>
          </BadgeAnchor>
          <BadgeAnchor>
            <Avatar>
              <AvatarFallback>TR</AvatarFallback>
            </Avatar>
            <Badge placement="top-right" size="sm">
              2
            </Badge>
          </BadgeAnchor>
          <BadgeAnchor>
            <Avatar>
              <AvatarFallback>BL</AvatarFallback>
            </Avatar>
            <Badge placement="bottom-left" size="sm">
              3
            </Badge>
          </BadgeAnchor>
          <BadgeAnchor>
            <Avatar>
              <AvatarFallback>BR</AvatarFallback>
            </Avatar>
            <Badge placement="bottom-right" size="sm">
              4
            </Badge>
          </BadgeAnchor>
        </div>
      </section>

      <section id="breadcrumbs" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Breadcrumbs</h2>
        <Breadcrumbs>
          <BreadcrumbsItem href="#">Home</BreadcrumbsItem>
          <BreadcrumbsItem href="#">Products</BreadcrumbsItem>
          <BreadcrumbsItem href="#">Electronics</BreadcrumbsItem>
          <BreadcrumbsItem>Laptop</BreadcrumbsItem>
        </Breadcrumbs>
        <Breadcrumbs isDisabled>
          <BreadcrumbsItem href="#">Home</BreadcrumbsItem>
          <BreadcrumbsItem href="#">Products</BreadcrumbsItem>
          <BreadcrumbsItem href="#">Electronics</BreadcrumbsItem>
          <BreadcrumbsItem>Laptop</BreadcrumbsItem>
        </Breadcrumbs>
      </section>

      <section id="card" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Card</h2>
        <div className="flex flex-wrap items-stretch gap-4">
          {cardVariants.map((item) => (
            <Card key={item.variant} variant={item.variant} className="w-[240px]">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>Content area</CardContent>
              <CardFooter>Last updated today</CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section id="chip" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Chip</h2>
        <div className="flex flex-wrap items-center gap-3">
          {chipVariants.map((variant) => (
            <Chip key={variant} variant={variant} color="accent">
              {variant}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {chipColors.map((color) => (
            <Chip key={color} color={color}>
              {color}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {chipSizes.map((size) => (
            <Chip key={size} size={size} color="success">
              {size}
            </Chip>
          ))}
        </div>
      </section>

      <section id="close-button" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">CloseButton</h2>
        <div className="flex flex-wrap items-center gap-4">
          <CloseButton />
          <CloseButton aria-label="Dismiss dialog" />
          <CloseButton isDisabled />
        </div>
      </section>

      <section id="fieldset" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Fieldset</h2>
        <div className="flex flex-wrap items-start gap-6">
          <Fieldset className="w-80">
            <FieldsetLegend>Account</FieldsetLegend>
            <Description>Update your account details.</Description>
            <FieldGroup>
              <TextField>
                <Label>Name</Label>
                <Input placeholder="Ada Lovelace" />
                <Description>Displayed on your profile.</Description>
              </TextField>
              <TextField isInvalid>
                <Label>Email</Label>
                <Input placeholder="ada@example.com" />
                <FieldError>Enter a valid email address.</FieldError>
              </TextField>
            </FieldGroup>
            <FieldsetActions>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
              <Button type="button">Save</Button>
            </FieldsetActions>
          </Fieldset>
          <Fieldset disabled className="w-80">
            <FieldsetLegend>Billing</FieldsetLegend>
            <Description>Managed by your workspace.</Description>
            <FieldGroup>
              <TextField>
                <Label>Company</Label>
                <Input placeholder="Acme Inc." />
              </TextField>
              <TextField isInvalid>
                <Label>VAT ID</Label>
                <Input placeholder="EU123456" />
                <FieldError>Enter a valid VAT ID.</FieldError>
              </TextField>
            </FieldGroup>
            <FieldsetActions>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
              <Button type="button">Save</Button>
            </FieldsetActions>
          </Fieldset>
        </div>
      </section>

      <section id="header" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Header</h2>
        <Header>Team members</Header>
      </section>

      <section id="kbd" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Kbd</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Kbd>
            <KbdAbbr keyValue="command" />
            <KbdContent>K</KbdContent>
          </Kbd>
          <Kbd>
            <KbdAbbr keyValue="command" />
            <KbdAbbr keyValue="shift" />
            <KbdContent>K</KbdContent>
          </Kbd>
          <Kbd variant="light">
            <KbdAbbr keyValue="command" />
            <KbdContent>C</KbdContent>
          </Kbd>
          <Kbd>
            <KbdAbbr keyValue="up" />
          </Kbd>
          <Kbd>
            <KbdAbbr keyValue="down" />
          </Kbd>
          <Kbd>
            <KbdAbbr keyValue="left" />
          </Kbd>
          <Kbd>
            <KbdAbbr keyValue="right" />
          </Kbd>
        </div>
      </section>

      <section id="link" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Link</h2>
        <div className="flex flex-wrap items-center gap-6">
          <Link href="#">
            Read the documentation
            <LinkIcon />
          </Link>
          <Link isDisabled href="#">
            Disabled link
            <LinkIcon />
          </Link>
          <Link aria-current="page" href="#">
            Current page
            <LinkIcon />
          </Link>
        </div>
      </section>

      <section id="progress" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Progress</h2>
        <div className="flex w-full max-w-xl flex-col gap-4">
          {barSizes.map((item) => (
            <ProgressBar key={item.size} size={item.size} value={item.value}>
              <Label>{item.label}</Label>
              <ProgressBarOutput />
              <ProgressBarTrack>
                <ProgressBarFill />
              </ProgressBarTrack>
            </ProgressBar>
          ))}
        </div>
        <div className="flex w-full max-w-xl flex-col gap-4">
          {barColors.map((item) => (
            <ProgressBar key={item.color} color={item.color} value={50}>
              <Label>{item.label}</Label>
              <ProgressBarOutput />
              <ProgressBarTrack>
                <ProgressBarFill />
              </ProgressBarTrack>
            </ProgressBar>
          ))}
        </div>
        <div className="flex w-full max-w-xl flex-col gap-4">
          <ProgressBar isIndeterminate>
            <Label>Loading</Label>
            <ProgressBarTrack>
              <ProgressBarFill />
            </ProgressBarTrack>
          </ProgressBar>
          <ProgressBar aria-disabled="true" value={60}>
            <Label>Disabled</Label>
            <ProgressBarOutput />
            <ProgressBarTrack>
              <ProgressBarFill />
            </ProgressBarTrack>
          </ProgressBar>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          {circleSizes.map((item) => (
            <ProgressCircle
              key={item.size}
              size={item.size}
              value={item.value}
              aria-label="Loading"
            >
              <ProgressCircleTrack>
                <ProgressCircleTrackCircle />
                <ProgressCircleFillCircle />
              </ProgressCircleTrack>
            </ProgressCircle>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-6">
          {barColors.map((item) => (
            <ProgressCircle key={item.color} color={item.color} value={60} aria-label="Loading">
              <ProgressCircleTrack>
                <ProgressCircleTrackCircle />
                <ProgressCircleFillCircle />
              </ProgressCircleTrack>
            </ProgressCircle>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <ProgressCircle isIndeterminate aria-label="Loading">
            <ProgressCircleTrack>
              <ProgressCircleTrackCircle />
              <ProgressCircleFillCircle />
            </ProgressCircleTrack>
          </ProgressCircle>
          <ProgressCircle aria-disabled="true" value={60} aria-label="Loading">
            <ProgressCircleTrack>
              <ProgressCircleTrackCircle />
              <ProgressCircleFillCircle />
            </ProgressCircleTrack>
          </ProgressCircle>
        </div>
      </section>

      <section id="separator" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Separator</h2>
        <div className="flex w-full max-w-md flex-col gap-3">
          <Separator variant="default" />
          <Separator variant="secondary" />
          <Separator variant="tertiary" />
        </div>
        <div className="flex h-10 items-center gap-4">
          {linkItems.map((item, index) => (
            <span key={item} className="text-sm">
              {item}
              {index < linkItems.length - 1 && (
                <Separator className="mx-2 inline-flex" orientation="vertical" />
              )}
            </span>
          ))}
        </div>
      </section>

      <section id="skeleton" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Skeleton</h2>
        <div className="flex flex-wrap items-center gap-6">
          <Skeleton className="h-24 w-64 rounded-xl" />
          <div className="flex w-64 flex-col gap-2">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
            <Skeleton className="h-3 w-2/5 rounded-lg" />
          </div>
          <Skeleton className="size-12 rounded-full" />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton animationType="pulse" className="h-6 w-48 rounded-md" />
          <Skeleton animationType="none" className="h-6 w-48 rounded-md" />
        </div>
      </section>

      <section id="spinner" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Spinner</h2>
        <div className="flex flex-wrap items-center gap-6">
          {spinnerColors.map((color) => (
            <Spinner key={color} color={color} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-6">
          {spinnerSizes.map((size) => (
            <Spinner key={size} size={size} />
          ))}
        </div>
      </section>

      <section id="surface" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Surface</h2>
        <div className="flex flex-wrap items-stretch gap-4">
          <Surface variant="default" className="flex w-56 flex-col gap-1 rounded-2xl p-4">
            <span className="text-sm font-semibold">Default</span>
            <span className="text-xs text-muted">Standard surface</span>
          </Surface>
          <Surface variant="secondary" className="flex w-56 flex-col gap-1 rounded-2xl p-4">
            <span className="text-sm font-semibold">Secondary</span>
            <span className="text-xs text-muted">Medium prominence</span>
          </Surface>
          <Surface variant="tertiary" className="flex w-56 flex-col gap-1 rounded-2xl p-4">
            <span className="text-sm font-semibold">Tertiary</span>
            <span className="text-xs text-muted">Higher prominence</span>
          </Surface>
          <Surface variant="transparent" className="flex w-56 flex-col gap-1 rounded-2xl p-4">
            <span className="text-sm font-semibold">Transparent</span>
            <span className="text-xs text-muted">Minimal prominence</span>
          </Surface>
        </div>
      </section>

      <section id="text" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Text</h2>
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Description>We never share your email.</Description>
          <ErrorMessage>Something went wrong.</ErrorMessage>
        </div>
      </section>

      <section id="typography" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Typography</h2>
        <div className="flex flex-col gap-2">
          <Heading level={1}>Heading level 1</Heading>
          <Heading level={2}>Heading level 2</Heading>
          <Heading level={3}>Heading level 3</Heading>
          <Paragraph>
            Body copy with <Code>inline code</Code> and a <Link href="#">link</Link> inside.
          </Paragraph>
          <Paragraph size="sm">Small body copy for secondary content.</Paragraph>
          <Paragraph size="xs">Extra small body copy for captions.</Paragraph>
          <Typography weight="normal">Normal weight</Typography>
          <Typography weight="medium">Medium weight</Typography>
          <Typography weight="semibold">Semibold weight</Typography>
          <Typography weight="bold">Bold weight</Typography>
          <Typography color="muted" type="body-sm">
            Muted secondary text
          </Typography>
          <Typography className="w-64" align="center">
            Centered text
          </Typography>
          <Typography className="w-48" truncate>
            Truncated text that should not wrap onto a second line
          </Typography>
          <Prose>
            <h2>Prose heading</h2>
            <p>Prose paragraph rendered with the typography scale.</p>
            <p>
              Inline <code>code</code> is styled by the prose wrapper.
            </p>
          </Prose>
        </div>
      </section>

      <section id="empty-state" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">EmptyState</h2>
        <div className="flex flex-wrap items-start gap-4">
          <EmptyState />
          <EmptyState>No projects yet</EmptyState>
        </div>
      </section>
    </>
  );
}
