<script setup lang="ts">
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertTitle,
} from "@sail-ui/vue/alert";
import {Avatar, AvatarFallback} from "@sail-ui/vue/avatar";
import {AvatarGroup} from "@sail-ui/vue/avatar-group";
import {Badge, BadgeAnchor} from "@sail-ui/vue/badge";
import {Breadcrumbs, BreadcrumbsItem} from "@sail-ui/vue/breadcrumbs";
import {Button} from "@sail-ui/vue/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@sail-ui/vue/card";
import {Chip} from "@sail-ui/vue/chip";
import {CloseButton} from "@sail-ui/vue/close-button";
import {Description} from "@sail-ui/vue/description";
import {EmptyState} from "@sail-ui/vue/empty-state";
import {ErrorMessage} from "@sail-ui/vue/error-message";
import {FieldError} from "@sail-ui/vue/field-error";
import {FieldGroup, Fieldset, FieldsetActions, FieldsetLegend} from "@sail-ui/vue/fieldset";
import {Header} from "@sail-ui/vue/header";
import {Input, TextField} from "@sail-ui/vue/input";
import {Kbd, KbdAbbr, KbdContent} from "@sail-ui/vue/kbd";
import {Label} from "@sail-ui/vue/label";
import {Link, LinkIcon} from "@sail-ui/vue/link";
import {
  ProgressBar,
  ProgressBarFill,
  ProgressBarOutput,
  ProgressBarTrack,
} from "@sail-ui/vue/progress-bar";
import {
  ProgressCircle,
  ProgressCircleFillCircle,
  ProgressCircleTrack,
  ProgressCircleTrackCircle,
} from "@sail-ui/vue/progress-circle";
import {Separator} from "@sail-ui/vue/separator";
import {Skeleton} from "@sail-ui/vue/skeleton";
import {Spinner} from "@sail-ui/vue/spinner";
import {Surface} from "@sail-ui/vue/surface";
import {
  Typography,
  TypographyCode,
  TypographyHeading,
  TypographyParagraph,
  TypographyProse,
} from "@sail-ui/vue/typography";

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
</script>

<template>
  <section id="alert" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Alert</h2>
    <div class="grid w-full max-w-xl gap-3">
      <Alert v-for="status in alertStatuses" :key="status" :status="status">
        <AlertIndicator />
        <AlertContent>
          <AlertTitle>{{ alertCopy[status].title }}</AlertTitle>
          <AlertDescription>{{ alertCopy[status].description }}</AlertDescription>
        </AlertContent>
      </Alert>
    </div>
  </section>

  <section id="avatar" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Avatar</h2>
    <div class="flex flex-wrap items-center gap-3">
      <Avatar v-for="item in avatarSizes" :key="item.size" :size="item.size">
        <AvatarFallback>{{ item.label }}</AvatarFallback>
      </Avatar>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <Avatar v-for="item in avatarColors" :key="item.color" :color="item.color">
        <AvatarFallback>{{ item.label }}</AvatarFallback>
      </Avatar>
      <Avatar color="accent" variant="soft">
        <AvatarFallback>SO</AvatarFallback>
      </Avatar>
    </div>
    <div class="flex flex-wrap items-center gap-6">
      <AvatarGroup :max="3" size="md">
        <Avatar><AvatarFallback>A</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>C</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>D</AvatarFallback></Avatar>
      </AvatarGroup>
      <AvatarGroup overlap="ring" size="lg">
        <Avatar><AvatarFallback>E</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>F</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>G</AvatarFallback></Avatar>
      </AvatarGroup>
      <AvatarGroup is-grid size="sm">
        <Avatar><AvatarFallback>H</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>I</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>J</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>K</AvatarFallback></Avatar>
      </AvatarGroup>
    </div>
  </section>

  <section id="badge" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Badge</h2>
    <div class="flex flex-wrap items-center gap-6">
      <BadgeAnchor v-for="item in badgeColors" :key="item.color">
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Badge :color="item.color">
          {{ item.value }}
        </Badge>
      </BadgeAnchor>
    </div>
    <div class="flex flex-wrap items-center gap-6">
      <BadgeAnchor v-for="item in badgeSizes" :key="item.size">
        <Avatar :size="item.size">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Badge :size="item.size" color="danger">
          {{ item.value }}
        </Badge>
      </BadgeAnchor>
    </div>
    <div class="flex flex-wrap items-center gap-6">
      <BadgeAnchor>
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Badge variant="primary"> Primary </Badge>
      </BadgeAnchor>
      <BadgeAnchor>
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Badge variant="secondary"> Secondary </Badge>
      </BadgeAnchor>
      <BadgeAnchor>
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Badge variant="soft"> Soft </Badge>
      </BadgeAnchor>
    </div>
    <div class="flex flex-wrap items-center gap-6">
      <BadgeAnchor>
        <Avatar>
          <AvatarFallback>TL</AvatarFallback>
        </Avatar>
        <Badge placement="top-left" size="sm"> 1 </Badge>
      </BadgeAnchor>
      <BadgeAnchor>
        <Avatar>
          <AvatarFallback>TR</AvatarFallback>
        </Avatar>
        <Badge placement="top-right" size="sm"> 2 </Badge>
      </BadgeAnchor>
      <BadgeAnchor>
        <Avatar>
          <AvatarFallback>BL</AvatarFallback>
        </Avatar>
        <Badge placement="bottom-left" size="sm"> 3 </Badge>
      </BadgeAnchor>
      <BadgeAnchor>
        <Avatar>
          <AvatarFallback>BR</AvatarFallback>
        </Avatar>
        <Badge placement="bottom-right" size="sm"> 4 </Badge>
      </BadgeAnchor>
    </div>
  </section>

  <section id="breadcrumbs" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Breadcrumbs</h2>
    <Breadcrumbs>
      <BreadcrumbsItem href="#"> Home </BreadcrumbsItem>
      <BreadcrumbsItem href="#"> Products </BreadcrumbsItem>
      <BreadcrumbsItem href="#"> Electronics </BreadcrumbsItem>
      <BreadcrumbsItem>Laptop</BreadcrumbsItem>
    </Breadcrumbs>
    <Breadcrumbs is-disabled>
      <BreadcrumbsItem href="#"> Home </BreadcrumbsItem>
      <BreadcrumbsItem href="#"> Products </BreadcrumbsItem>
      <BreadcrumbsItem href="#"> Electronics </BreadcrumbsItem>
      <BreadcrumbsItem>Laptop</BreadcrumbsItem>
    </Breadcrumbs>
  </section>

  <section id="card" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Card</h2>
    <div class="flex flex-wrap items-stretch gap-4">
      <Card
        v-for="item in cardVariants"
        :key="item.variant"
        :variant="item.variant"
        class="w-[240px]"
      >
        <CardHeader>
          <CardTitle>{{ item.title }}</CardTitle>
          <CardDescription>{{ item.description }}</CardDescription>
        </CardHeader>
        <CardContent>Content area</CardContent>
        <CardFooter>Last updated today</CardFooter>
      </Card>
    </div>
  </section>

  <section id="chip" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Chip</h2>
    <div class="flex flex-wrap items-center gap-3">
      <Chip v-for="variant in chipVariants" :key="variant" :variant="variant" color="accent">
        {{ variant }}
      </Chip>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <Chip v-for="color in chipColors" :key="color" :color="color">
        {{ color }}
      </Chip>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <Chip v-for="size in chipSizes" :key="size" :size="size" color="success">
        {{ size }}
      </Chip>
    </div>
  </section>

  <section id="close-button" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">CloseButton</h2>
    <div class="flex flex-wrap items-center gap-4">
      <CloseButton />
      <CloseButton aria-label="Dismiss dialog" />
      <CloseButton is-disabled />
    </div>
  </section>

  <section id="fieldset" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Fieldset</h2>
    <div class="flex flex-wrap items-start gap-6">
      <Fieldset class="w-80">
        <FieldsetLegend>Account</FieldsetLegend>
        <Description>Update your account details.</Description>
        <FieldGroup>
          <TextField>
            <Label>Name</Label>
            <Input placeholder="Ada Lovelace" />
            <Description>Displayed on your profile.</Description>
          </TextField>
          <TextField is-invalid>
            <Label>Email</Label>
            <Input placeholder="ada@example.com" />
            <FieldError>Enter a valid email address.</FieldError>
          </TextField>
        </FieldGroup>
        <FieldsetActions>
          <Button type="button" variant="secondary"> Cancel </Button>
          <Button type="button"> Save </Button>
        </FieldsetActions>
      </Fieldset>
      <Fieldset is-disabled class="w-80">
        <FieldsetLegend>Billing</FieldsetLegend>
        <Description>Managed by your workspace.</Description>
        <FieldGroup>
          <TextField>
            <Label>Company</Label>
            <Input placeholder="Acme Inc." />
          </TextField>
          <TextField is-invalid>
            <Label>VAT ID</Label>
            <Input placeholder="EU123456" />
            <FieldError>Enter a valid VAT ID.</FieldError>
          </TextField>
        </FieldGroup>
        <FieldsetActions>
          <Button type="button" variant="secondary"> Cancel </Button>
          <Button type="button"> Save </Button>
        </FieldsetActions>
      </Fieldset>
    </div>
  </section>

  <section id="header" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Header</h2>
    <Header>Team members</Header>
  </section>

  <section id="kbd" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Kbd</h2>
    <div class="flex flex-wrap items-center gap-3">
      <Kbd>
        <KbdAbbr key-value="command" />
        <KbdContent>K</KbdContent>
      </Kbd>
      <Kbd>
        <KbdAbbr key-value="command" />
        <KbdAbbr key-value="shift" />
        <KbdContent>K</KbdContent>
      </Kbd>
      <Kbd variant="light">
        <KbdAbbr key-value="command" />
        <KbdContent>C</KbdContent>
      </Kbd>
      <Kbd>
        <KbdAbbr key-value="up" />
      </Kbd>
      <Kbd>
        <KbdAbbr key-value="down" />
      </Kbd>
      <Kbd>
        <KbdAbbr key-value="left" />
      </Kbd>
      <Kbd>
        <KbdAbbr key-value="right" />
      </Kbd>
    </div>
  </section>

  <section id="link" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Link</h2>
    <div class="flex flex-wrap items-center gap-6">
      <Link href="#">
        Read the documentation
        <LinkIcon />
      </Link>
      <Link is-disabled href="#">
        Disabled link
        <LinkIcon />
      </Link>
      <Link aria-current="page" href="#">
        Current page
        <LinkIcon />
      </Link>
    </div>
  </section>

  <section id="progress" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Progress</h2>
    <div class="flex w-full max-w-xl flex-col gap-4">
      <ProgressBar v-for="item in barSizes" :key="item.size" :size="item.size" :value="item.value">
        <Label>{{ item.label }}</Label>
        <ProgressBarOutput />
        <ProgressBarTrack>
          <ProgressBarFill />
        </ProgressBarTrack>
      </ProgressBar>
    </div>
    <div class="flex w-full max-w-xl flex-col gap-4">
      <ProgressBar v-for="item in barColors" :key="item.color" :color="item.color" :value="50">
        <Label>{{ item.label }}</Label>
        <ProgressBarOutput />
        <ProgressBarTrack>
          <ProgressBarFill />
        </ProgressBarTrack>
      </ProgressBar>
    </div>
    <div class="flex w-full max-w-xl flex-col gap-4">
      <ProgressBar is-indeterminate>
        <Label>Loading</Label>
        <ProgressBarTrack>
          <ProgressBarFill />
        </ProgressBarTrack>
      </ProgressBar>
      <ProgressBar is-disabled :value="60">
        <Label>Disabled</Label>
        <ProgressBarOutput />
        <ProgressBarTrack>
          <ProgressBarFill />
        </ProgressBarTrack>
      </ProgressBar>
    </div>
    <div class="flex flex-wrap items-center gap-6">
      <ProgressCircle
        v-for="item in circleSizes"
        :key="item.size"
        :size="item.size"
        :value="item.value"
        aria-label="Loading"
      >
        <ProgressCircleTrack>
          <ProgressCircleTrackCircle />
          <ProgressCircleFillCircle />
        </ProgressCircleTrack>
      </ProgressCircle>
    </div>
    <div class="flex flex-wrap items-center gap-6">
      <ProgressCircle
        v-for="item in barColors"
        :key="item.color"
        :color="item.color"
        :value="60"
        aria-label="Loading"
      >
        <ProgressCircleTrack>
          <ProgressCircleTrackCircle />
          <ProgressCircleFillCircle />
        </ProgressCircleTrack>
      </ProgressCircle>
    </div>
    <div class="flex flex-wrap items-center gap-6">
      <ProgressCircle is-indeterminate aria-label="Loading">
        <ProgressCircleTrack>
          <ProgressCircleTrackCircle />
          <ProgressCircleFillCircle />
        </ProgressCircleTrack>
      </ProgressCircle>
      <ProgressCircle is-disabled :value="60" aria-label="Loading">
        <ProgressCircleTrack>
          <ProgressCircleTrackCircle />
          <ProgressCircleFillCircle />
        </ProgressCircleTrack>
      </ProgressCircle>
    </div>
  </section>

  <section id="separator" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Separator</h2>
    <div class="flex w-full max-w-md flex-col gap-3">
      <Separator variant="default" />
      <Separator variant="secondary" />
      <Separator variant="tertiary" />
    </div>
    <div class="flex h-10 items-center gap-4">
      <span v-for="(item, index) in linkItems" :key="item" class="text-sm">
        {{ item }}
        <Separator
          v-if="index < linkItems.length - 1"
          class="mx-2 inline-flex"
          orientation="vertical"
        />
      </span>
    </div>
  </section>

  <section id="skeleton" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Skeleton</h2>
    <div class="flex flex-wrap items-center gap-6">
      <Skeleton class="h-24 w-64 rounded-xl" />
      <div class="flex w-64 flex-col gap-2">
        <Skeleton class="h-3 w-3/5 rounded-lg" />
        <Skeleton class="h-3 w-4/5 rounded-lg" />
        <Skeleton class="h-3 w-2/5 rounded-lg" />
      </div>
      <Skeleton class="size-12 rounded-full" />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Skeleton animation-type="pulse" class="h-6 w-48 rounded-md" />
      <Skeleton animation-type="none" class="h-6 w-48 rounded-md" />
    </div>
  </section>

  <section id="spinner" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Spinner</h2>
    <div class="flex flex-wrap items-center gap-6">
      <Spinner v-for="color in spinnerColors" :key="color" :color="color" />
    </div>
    <div class="flex flex-wrap items-center gap-6">
      <Spinner v-for="size in spinnerSizes" :key="size" :size="size" />
    </div>
  </section>

  <section id="surface" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Surface</h2>
    <div class="flex flex-wrap items-stretch gap-4">
      <Surface variant="default" class="flex w-56 flex-col gap-1 rounded-2xl p-4">
        <span class="text-sm font-semibold">Default</span>
        <span class="text-xs text-muted">Standard surface</span>
      </Surface>
      <Surface variant="secondary" class="flex w-56 flex-col gap-1 rounded-2xl p-4">
        <span class="text-sm font-semibold">Secondary</span>
        <span class="text-xs text-muted">Medium prominence</span>
      </Surface>
      <Surface variant="tertiary" class="flex w-56 flex-col gap-1 rounded-2xl p-4">
        <span class="text-sm font-semibold">Tertiary</span>
        <span class="text-xs text-muted">Higher prominence</span>
      </Surface>
      <Surface variant="transparent" class="flex w-56 flex-col gap-1 rounded-2xl p-4">
        <span class="text-sm font-semibold">Transparent</span>
        <span class="text-xs text-muted">Minimal prominence</span>
      </Surface>
    </div>
  </section>

  <section id="text" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Text</h2>
    <div class="flex flex-col gap-2">
      <Label>Email</Label>
      <Description>We never share your email.</Description>
      <ErrorMessage>Something went wrong.</ErrorMessage>
    </div>
  </section>

  <section id="typography" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Typography</h2>
    <div class="flex flex-col gap-2">
      <TypographyHeading :level="1"> Heading level 1 </TypographyHeading>
      <TypographyHeading :level="2"> Heading level 2 </TypographyHeading>
      <TypographyHeading :level="3"> Heading level 3 </TypographyHeading>
      <TypographyParagraph>
        Body copy with <TypographyCode>inline code</TypographyCode> and a
        <Link href="#"> link </Link>
        inside.
      </TypographyParagraph>
      <TypographyParagraph size="sm"> Small body copy for secondary content. </TypographyParagraph>
      <TypographyParagraph size="xs"> Extra small body copy for captions. </TypographyParagraph>
      <Typography weight="normal"> Normal weight </Typography>
      <Typography weight="medium"> Medium weight </Typography>
      <Typography weight="semibold"> Semibold weight </Typography>
      <Typography weight="bold"> Bold weight </Typography>
      <Typography color="muted" type="body-sm"> Muted secondary text </Typography>
      <Typography class="w-64" align="center"> Centered text </Typography>
      <Typography class="w-48" truncate>
        Truncated text that should not wrap onto a second line
      </Typography>
      <TypographyProse>
        <h2>Prose heading</h2>
        <p>Prose paragraph rendered with the typography scale.</p>
        <p>Inline <code>code</code> is styled by the prose wrapper.</p>
      </TypographyProse>
    </div>
  </section>

  <section id="empty-state" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">EmptyState</h2>
    <div class="flex flex-wrap items-start gap-4">
      <EmptyState />
      <EmptyState>No projects yet</EmptyState>
    </div>
  </section>
</template>
