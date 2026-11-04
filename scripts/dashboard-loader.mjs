import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function withExtension(file) {
  const candidates = [
    file,
    `${file}.ts`,
    `${file}.tsx`,
    `${file}.mjs`,
    `${file}.js`,
    path.join(file, "index.ts"),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

export async function resolve(specifier, context, nextResolve) {
  let absolute = null;
  if (specifier.startsWith("@/")) {
    absolute = path.join(root, "src", specifier.slice(2));
  } else if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    context.parentURL?.startsWith("file:")
  ) {
    absolute = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
  }
  if (absolute) {
    const file = withExtension(absolute);
    if (file) {
      return { url: pathToFileURL(file).href, shortCircuit: true };
    }
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (!url.startsWith("file:") || (!url.endsWith(".ts") && !url.endsWith(".tsx"))) {
    return nextLoad(url, context);
  }
  const source = await readFile(fileURLToPath(url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
    fileName: url,
  });
  return { format: "module", source: outputText, shortCircuit: true };
}
