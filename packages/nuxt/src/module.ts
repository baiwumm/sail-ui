import type {NuxtModule} from "@nuxt/schema";

import type {SailUIProviderProps} from "./runtime/provider";

import {existsSync, readFileSync} from "node:fs";
import {dirname, isAbsolute, join, relative} from "node:path";

import {
  addComponent,
  addImports,
  addTemplate,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
} from "@nuxt/kit";
import tailwindcss from "@tailwindcss/vite";

export interface SailUIModuleOptions extends SailUIProviderProps {
  /**
   * Prefix applied to every auto-imported component name.
   *
   * `S` (default) yields `<SButton>`, `<SToastProvider>`, …; an empty string
   * registers the bare export names (`<Button>`, …) and is more likely to
   * collide with app components.
   *
   * @default "S"
   */
  prefix?: string;
  /**
   * Inject the `@sail-ui/styles/css` entry (theme + components) into the app.
   *
   * @default true
   */
  styles?: boolean;
  /**
   * Wire Tailwind CSS v4 through `@tailwindcss/vite`, matching the upstream
   * HeroUI build order.
   *
   * @default true
   */
  tailwind?: boolean;
  /**
   * Wrap the app root with `SailUIProvider` (Reka `ConfigProvider` defaults +
   * the toast region) so `useToast()` works without touching `app.vue`.
   *
   * @default true
   */
  wrapApp?: boolean;
}

type VuePackageExports = {exports?: Record<string, unknown>};

const isComponentExport = (value: unknown): boolean => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as {
    __name?: unknown;
    name?: unknown;
    render?: unknown;
    setup?: unknown;
  };

  return (
    typeof candidate.render === "function" ||
    typeof candidate.setup === "function" ||
    (typeof candidate.name === "string" && candidate.name.startsWith("Sail")) ||
    typeof candidate.__name === "string"
  );
};

async function readVuePackage(
  resolver: ReturnType<typeof createResolver>,
): Promise<VuePackageExports> {
  try {
    const packagePath = await resolver.resolvePath("@sail-ui/vue/package.json");

    return JSON.parse(readFileSync(packagePath, "utf8")) as VuePackageExports;
  } catch {
    // Some resolvers refuse the "./package.json" export; fall back to the
    // package root inferred from the main entry.
    const entryPath = await resolver.resolvePath("@sail-ui/vue");
    const packagePath = join(dirname(dirname(entryPath)), "package.json");

    return JSON.parse(readFileSync(packagePath, "utf8")) as VuePackageExports;
  }
}

/** Locates the user app component the same way Nuxt's `resolveApp` does. */
const findUserAppComponent = (srcDir: string, rootDir: string): string | undefined => {
  for (const dir of [srcDir, rootDir]) {
    for (const name of ["app.vue", "App.vue", "app.ts", "app.js"]) {
      const candidate = join(dir, name);

      if (existsSync(candidate)) {
        return candidate;
      }
    }
  }

  return undefined;
};

const module: NuxtModule<SailUIModuleOptions> = defineNuxtModule<SailUIModuleOptions>({
  meta: {
    name: "@sail-ui/nuxt",
    configKey: "sailUI",
    compatibility: {nuxt: "^4.0.0"},
  },
  defaults: {
    dir: undefined,
    locale: undefined,
    prefix: "S",
    styles: true,
    tailwind: true,
    wrapApp: true,
  },
  async setup(resolvedOptions, nuxt) {
    const resolver = createResolver(import.meta.url);
    const prefix = resolvedOptions.prefix ?? "";

    if (resolvedOptions.styles) {
      nuxt.options.css.push("@sail-ui/styles/css");
    }

    if (resolvedOptions.tailwind) {
      extendViteConfig((config) => {
        config.plugins = config.plugins ?? [];
        config.plugins.push(tailwindcss());
      });
    }

    // Introspect the built component package so auto-imports always match the
    // published exports without maintaining a hand-written manifest.
    const resolverVuePackage = await readVuePackage(resolver);
    const families = Object.keys(resolverVuePackage.exports ?? {}).filter(
      (key) => key !== "." && key !== "./package.json",
    );

    const registered = new Set<string>();

    for (const family of families) {
      const modulePath = `@sail-ui/vue/${family.slice(2)}`;
      const exports = (await import(modulePath)) as Record<string, unknown>;

      for (const [exportName, value] of Object.entries(exports)) {
        if (!isComponentExport(value)) {
          continue;
        }

        // Some parts are re-exported from their family barrel and their own
        // subpath (ListBoxItem, MenuItem, …); register the first occurrence.
        if (registered.has(exportName)) {
          continue;
        }

        registered.add(exportName);

        addComponent({
          export: exportName,
          filePath: modulePath,
          mode: "all",
          name: `${prefix}${exportName}`,
        });
      }
    }

    addImports({from: "@sail-ui/vue/toast", name: "useToast"});

    if (resolvedOptions.wrapApp) {
      const appFile = findUserAppComponent(nuxt.options.srcDir, nuxt.options.rootDir);

      if (appFile) {
        const buildDir = nuxt.options.buildDir;
        const userAppSpecifier = isAbsolute(appFile)
          ? relative(buildDir, appFile).replaceAll("\\", "/")
          : appFile;
        const userAppImport = userAppSpecifier.startsWith(".")
          ? userAppSpecifier
          : `./${userAppSpecifier}`;

        // Nuxt generates `app-component.mjs` as a plain re-export of the user
        // app component; writing our template with the same filename after the
        // core template replaces it and mounts SailUIProvider around the app.
        addTemplate({
          filename: "app-component.mjs",
          getContents: () => `
import { defineComponent, h } from "vue";

import { SailUIProvider } from "@sail-ui/nuxt/runtime/provider";

import UserApp from ${JSON.stringify(userAppImport)};

export default defineComponent({
  name: "SailUIAppWrapper",
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h(
      SailUIProvider,
      ${JSON.stringify({
        dir: resolvedOptions.dir,
        locale: resolvedOptions.locale,
      })},
      { default: () => h(UserApp, attrs, slots) },
    );
  },
});
`,
        });
      }
    }
  },
});

export default module;
