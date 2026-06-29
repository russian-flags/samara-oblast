import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const assetsDir = join(root, "assets");
const srcDir = join(root, "src");
const settlementsSource = join(srcDir, "settlements.ts");
const sourceAssetFileName = "index.svg";

function q(value) {
  return JSON.stringify(value);
}

async function writeSource(path, lines) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${lines.join("\n")}\n`, "utf8");
}

function unwrapExpression(expression) {
  let current = expression;
  while (
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isParenthesizedExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function propertyNameText(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  return undefined;
}

function stringValue(expression, sourceFile) {
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
    return expression.text;
  }
  throw new Error(`Expected string literal in ${settlementsSource}: ${expression.getText(sourceFile)}`);
}

function stringArrayValue(expression, sourceFile) {
  const arrayNode = unwrapExpression(expression);
  if (!ts.isArrayLiteralExpression(arrayNode)) {
    throw new Error(`Expected string array in ${settlementsSource}: ${expression.getText(sourceFile)}`);
  }

  return arrayNode.elements.map((element) => stringValue(unwrapExpression(element), sourceFile));
}

function findSettlementsArray(sourceFile) {
  let arrayNode;

  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "settlements" &&
      node.initializer
    ) {
      const initializer = unwrapExpression(node.initializer);

      if (ts.isArrayLiteralExpression(initializer)) {
        arrayNode = initializer;
      }

      if (
        ts.isCallExpression(initializer) &&
        ts.isPropertyAccessExpression(initializer.expression) &&
        initializer.expression.expression.getText(sourceFile) === "Object" &&
        initializer.expression.name.text === "freeze" &&
        initializer.arguments.length
      ) {
        const argument = unwrapExpression(initializer.arguments[0]);
        if (ts.isArrayLiteralExpression(argument)) {
          arrayNode = argument;
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return arrayNode;
}

function validateSettlements(settlements) {
  const seen = new Set();

  for (const settlement of settlements) {
    for (const key of ["slug", "code", "nameRu", "nameEn"]) {
      if (!settlement[key]) {
        throw new Error(`Settlement is missing ${key}: ${JSON.stringify(settlement)}`);
      }
    }

    if (!Array.isArray(settlement.aliases)) {
      throw new Error(`Settlement is missing aliases array: ${JSON.stringify(settlement)}`);
    }

    if (seen.has(settlement.slug)) {
      throw new Error(`Duplicate settlement slug: ${settlement.slug}`);
    }
    seen.add(settlement.slug);
  }
}

async function loadSettlements() {
  const sourceText = await readFile(settlementsSource, "utf8");
  const sourceFile = ts.createSourceFile(
    settlementsSource,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const arrayNode = findSettlementsArray(sourceFile);

  if (!arrayNode) {
    throw new Error(`Unable to find exported settlements array in ${settlementsSource}`);
  }

  const settlements = arrayNode.elements.map((element) => {
    const objectNode = unwrapExpression(element);
    if (!ts.isObjectLiteralExpression(objectNode)) {
      throw new Error(`Expected settlement object in ${settlementsSource}: ${element.getText(sourceFile)}`);
    }

    const settlement = {};
    for (const property of objectNode.properties) {
      if (!ts.isPropertyAssignment(property)) {
        continue;
      }

      const key = propertyNameText(property.name);
      if (key === "slug" || key === "code" || key === "nameRu" || key === "nameEn") {
        settlement[key] = stringValue(unwrapExpression(property.initializer), sourceFile);
      } else if (key === "aliases") {
        settlement[key] = stringArrayValue(property.initializer, sourceFile);
      }
    }
    return settlement;
  });

  validateSettlements(settlements);
  return settlements;
}

async function assertFlagAssets(settlements) {
  const missing = [];

  for (const settlement of settlements) {
    const path = join(assetsDir, settlement.slug, sourceAssetFileName);

    try {
      const info = await stat(path);
      if (!info.isFile() || info.size === 0) {
        missing.push(`assets/${settlement.slug}/${sourceAssetFileName}`);
      }
    } catch {
      missing.push(`assets/${settlement.slug}/${sourceAssetFileName}`);
    }
  }

  if (missing.length) {
    const formatted = missing.slice(0, 30).map((path) => `  - ${path}`).join("\n");
    const overflow = missing.length <= 30 ? "" : `\n  ... and ${missing.length - 30} more`;
    throw new Error(`Local flag assets are missing:\n${formatted}${overflow}`);
  }
}

async function removeGeneratedPath(path) {
  const target = resolve(path);
  const srcRoot = resolve(srcDir);

  if (!target.startsWith(`${srcRoot}${sep}`)) {
    throw new Error(`Refusing to remove path outside src: ${target}`);
  }

  await rm(target, { force: true, recursive: true });
}

async function cleanGeneratedSource() {
  for (const generatedPath of [
    "assets",
    "flags",
    "loaders",
    "dynamic.ts",
    "flagLoaders.ts",
    "image.ts",
    "index.ts",
    "meta.ts",
    "types.ts",
  ]) {
    await removeGeneratedPath(join(srcDir, generatedPath));
  }

  await mkdir(join(srcDir, "loaders"), { recursive: true });
}

async function buildTypes(settlements) {
  const slugUnion = settlements.map((settlement) => q(settlement.slug)).join(" | ");

  await writeSource(join(srcDir, "types.ts"), [
    `export type SettlementSlug = ${slugUnion};`,
    "export type SettlementInput = SettlementSlug | string;",
    "",
    "export interface SettlementMeta {",
    "  readonly slug: SettlementSlug;",
    "  readonly code: string;",
    "  readonly nameRu: string;",
    "  readonly nameEn: string;",
    "  readonly aliases: readonly string[];",
    "}",
    "",
    "export type FlagImageAttributeValue = string | number | boolean | null | undefined;",
    "",
    "export interface FlagImageOptions {",
    "  readonly alt?: string;",
    '  readonly decoding?: "async" | "auto" | "sync";',
    '  readonly loading?: "eager" | "lazy";',
    "  readonly className?: string;",
    "  readonly title?: string;",
    "  readonly id?: string;",
    "  readonly width?: number;",
    "  readonly height?: number;",
    "  readonly style?: Partial<CSSStyleDeclaration>;",
    "  readonly dataset?: Record<string, FlagImageAttributeValue>;",
    "  readonly attributes?: Record<string, FlagImageAttributeValue>;",
    "}",
    "",
    "export type FlagImageFactory = (options?: FlagImageOptions) => HTMLImageElement;",
    "",
    "export interface FlagModule {",
    "  readonly src: string;",
    "  readonly createImage: FlagImageFactory;",
    "  readonly default: FlagImageFactory;",
    "}",
  ]);
}

async function buildImageHelper() {
  await writeSource(join(srcDir, "image.ts"), [
    'import type { FlagImageAttributeValue, FlagImageOptions } from "./types.js";',
    "",
    "function applyAttribute(image: HTMLImageElement, name: string, value: FlagImageAttributeValue): void {",
    "  if (value === undefined || value === null || value === false) {",
    "    image.removeAttribute(name);",
    "    return;",
    "  }",
    "",
    "  image.setAttribute(name, value === true ? \"\" : String(value));",
    "}",
    "",
    "export function createFlagImage(src: string, defaultAlt: string, options: FlagImageOptions = {}): HTMLImageElement {",
    "  const {",
    "    alt = defaultAlt,",
    '    decoding = "async",',
    '    loading = "lazy",',
    "    className,",
    "    title,",
    "    id,",
    "    width,",
    "    height,",
    "    style,",
    "    dataset,",
    "    attributes,",
    "  } = options;",
    "",
    "  const image = new Image();",
    "  image.src = src;",
    "  image.alt = alt;",
    "  image.decoding = decoding;",
    "  image.loading = loading;",
    "",
    "  if (className !== undefined) image.className = className;",
    "  if (title !== undefined) image.title = title;",
    "  if (id !== undefined) image.id = id;",
    "  if (width !== undefined) image.width = width;",
    "  if (height !== undefined) image.height = height;",
    "",
    "  if (style) {",
    "    for (const [name, value] of Object.entries(style)) {",
    "      if (value !== undefined && value !== null) {",
    "        image.style.setProperty(name.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`), String(value));",
    "      }",
    "    }",
    "  }",
    "",
    "  if (dataset) {",
    "    for (const [name, value] of Object.entries(dataset)) {",
    "      if (value === undefined || value === null || value === false) {",
    "        delete image.dataset[name];",
    "      } else {",
    "        image.dataset[name] = value === true ? \"\" : String(value);",
    "      }",
    "    }",
    "  }",
    "",
    "  if (attributes) {",
    "    for (const [name, value] of Object.entries(attributes)) {",
    "      applyAttribute(image, name, value);",
    "    }",
    "  }",
    "",
    "  return image;",
    "}",
  ]);
}

async function buildFlagLoaders(settlements) {
  const loaderEntries = settlements.map(
    (settlement) => `  ${q(settlement.slug)}: () => import("./loaders/${settlement.slug}.js") as Promise<FlagModule>,`
  );

  await writeSource(join(srcDir, "flagLoaders.ts"), [
    'import type { FlagModule, SettlementSlug } from "./types.js";',
    "",
    "export const flagLoaders = Object.freeze({",
    ...loaderEntries,
    "}) as Readonly<Record<SettlementSlug, () => Promise<FlagModule>>>;",
  ]);
}

async function buildLoaderModules(settlements) {
  for (const settlement of settlements) {
    await writeSource(join(srcDir, "loaders", `${settlement.slug}.ts`), [
      'import type { FlagImageOptions } from "../types.js";',
      'import { createFlagImage } from "../image.js";',
      "",
      `export const src = new URL("../flags/${settlement.slug}.svg", import.meta.url).href;`,
      "",
      "export function createImage(options?: FlagImageOptions): HTMLImageElement {",
      `  return createFlagImage(src, ${q(`Флаг ${settlement.nameRu}`)}, options);`,
      "}",
      "",
      "export default createImage;",
    ]);
  }
}

async function buildMeta() {
  await writeSource(join(srcDir, "meta.ts"), [
    'import type { SettlementInput, SettlementSlug } from "./types.js";',
    'import { settlements, settlementSlugs } from "./settlements.js";',
    "",
    "export { settlements, settlementSlugs };",
    "",
    "const aliases = new Map<string, SettlementSlug>();",
    "",
    "export function normalizeSettlementInput(input: SettlementInput): string {",
    "  return String(input)",
    "    .trim()",
    "    .toLowerCase()",
    '    .replace(/\\u0451/g, "\\u0435")',
    '    .replace(/[\\s_]+/g, "-");',
    "}",
    "",
    "for (const settlement of settlements) {",
    "  for (const value of [",
    "    settlement.slug,",
    "    settlement.code,",
    "    settlement.nameRu,",
    "    settlement.nameEn,",
    "    ...settlement.aliases,",
    "  ]) {",
    "    aliases.set(normalizeSettlementInput(value), settlement.slug);",
    "  }",
    "}",
    "",
    "export function resolveSettlementSlug(input: SettlementInput): SettlementSlug | undefined {",
    "  return aliases.get(normalizeSettlementInput(input));",
    "}",
  ]);
}

async function buildDynamic() {
  await writeSource(join(srcDir, "dynamic.ts"), [
    'import type { FlagImageOptions, FlagModule, SettlementInput } from "./types.js";',
    'import { flagLoaders } from "./flagLoaders.js";',
    'import { resolveSettlementSlug } from "./meta.js";',
    "",
    "export function getFlagModuleLoader(input: SettlementInput): (() => Promise<FlagModule>) | undefined {",
    "  const slug = resolveSettlementSlug(input);",
    "  return slug ? flagLoaders[slug] : undefined;",
    "}",
    "",
    "export async function loadFlagModule(input: SettlementInput): Promise<FlagModule> {",
    "  const loader = getFlagModuleLoader(input);",
    "  if (!loader) {",
    "    throw new Error(`Unknown Samara Oblast settlement: ${String(input)}`);",
    "  }",
    "  return loader();",
    "}",
    "",
    "export async function loadFlagImage(input: SettlementInput, options?: FlagImageOptions): Promise<HTMLImageElement> {",
    "  const module = await loadFlagModule(input);",
    "  return module.createImage(options);",
    "}",
    "",
    "export function preloadFlag(input: SettlementInput): void {",
    "  void getFlagModuleLoader(input)?.();",
    "}",
    "",
    "export const loadFlag = loadFlagImage;",
  ]);
}

async function buildIndex() {
  await writeSource(join(srcDir, "index.ts"), [
    'export * from "./types.js";',
    'export * from "./meta.js";',
    'export * from "./image.js";',
    'export * from "./dynamic.js";',
  ]);
}

const settlements = await loadSettlements();

await assertFlagAssets(settlements);
await cleanGeneratedSource();
await buildTypes(settlements);
await buildImageHelper();
await buildLoaderModules(settlements);
await buildFlagLoaders(settlements);
await buildMeta();
await buildDynamic();
await buildIndex();

console.log("generated ts src:", `${settlements.length} settlements`);
