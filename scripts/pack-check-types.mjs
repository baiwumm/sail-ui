// Consumer type resolution for the packed tarballs: the published types must
// resolve under the two module strategies a real consumer uses.
import {execSync} from "node:child_process";
import {join} from "node:path";

const tempDir = process.env.SAIL_PACK_CHECK_DIR;

if (!tempDir) {
  throw new Error("SAIL_PACK_CHECK_DIR is required");
}

const consumer = `import {Button} from "@sail-ui/vue/button";
import {ToastProvider, useToast} from "@sail-ui/vue/toast";
import {Table} from "@sail-ui/vue/table";
import {buttonVariants} from "@sail-ui/styles";

const classes: string = buttonVariants({variant: "danger"});
const component: typeof Button = Button;
const provider: typeof ToastProvider = ToastProvider;
void useToast;
void Table;
void classes;
`;

const contents = [
  {
    file: "consumer.ts",
    value: consumer,
  },
  {
    file: "tsconfig.consumer.json",
    value: JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          noEmit: true,
          target: "es2022",
          module: "esnext",
          skipLibCheck: true,
        },
      },
      null,
      2,
    ),
  },
];

for (const {file, value} of contents) {
  const {writeFileSync} = await import("node:fs");

  writeFileSync(join(tempDir, file), value);
}

for (const resolution of ["bundler", "node16"]) {
  execSync(
    [
      "node node_modules/typescript/bin/tsc",
      "consumer.ts",
      "--strict",
      "--noEmit",
      "--target es2022",
      "--skipLibCheck",
      `--moduleResolution ${resolution}`,
      resolution === "node16" ? "--module node16" : "--module esnext",
    ].join(" "),
    {stdio: "inherit", cwd: tempDir},
  );
  console.log(`pack:check types ok (${resolution})`);
}
