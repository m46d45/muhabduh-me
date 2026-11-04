import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const result = spawnSync(
  process.execPath,
  [
    "--no-experimental-strip-types",
    "--import",
    "./scripts/dashboard-register.mjs",
    "--test",
    "src/lib/dashboard/redact.test.ts",
    "src/lib/dashboard/decisions.test.ts",
    "src/lib/dashboard/importance.test.ts",
    "src/lib/dashboard/projects.test.ts",
    "src/lib/dashboard/session.test.ts",
    "src/lib/dashboard/handlers.test.ts",
  ],
  { cwd: root, stdio: "inherit" },
);
process.exit(result.status ?? 1);
