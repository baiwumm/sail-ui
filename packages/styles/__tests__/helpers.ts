import {execFileSync} from "node:child_process";
import {copyFileSync, cpSync, mkdirSync, mkdtempSync, rmSync} from "node:fs";
import {join, resolve} from "node:path";

export const packageRoot = resolve(process.cwd(), "packages", "styles");
const fixturesRoot = join(packageRoot, ".fixtures");

export interface RunResult {
  status: number;
  stdout: string;
  stderr: string;
}

export interface StylesFixture {
  root: string;
  run: (script: string, args?: string[]) => RunResult;
  dispose: () => void;
}

export function createStylesFixture(options: {generated?: boolean} = {}): StylesFixture {
  mkdirSync(fixturesRoot, {recursive: true});

  const root = mkdtempSync(join(fixturesRoot, "case-"));
  const entries =
    options.generated === false
      ? ["contracts", "scripts", "upstream"]
      : ["contracts", "generated", "scripts", "upstream"];

  for (const entry of entries) {
    cpSync(join(packageRoot, entry), join(root, entry), {recursive: true});
  }

  copyFileSync(join(packageRoot, "manifest.json"), join(root, "manifest.json"));

  return {
    root,
    run(script, args = []) {
      try {
        const stdout = execFileSync(
          process.execPath,
          [join(root, "scripts", script), ...args],
          {cwd: root, encoding: "utf8", stdio: "pipe"}
        );

        return {status: 0, stdout, stderr: ""};
      } catch (error) {
        const failure = error as {status?: number; stdout?: string; stderr?: string};

        return {
          status: failure.status ?? 1,
          stdout: failure.stdout ?? "",
          stderr: failure.stderr ?? ""
        };
      }
    },
    dispose() {
      rmSync(root, {recursive: true, force: true});
    }
  };
}
