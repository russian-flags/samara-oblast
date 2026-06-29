import type { FlagImageOptions, FlagModule, SettlementInput } from "./types.js";
import { flagLoaders } from "./flagLoaders.js";
import { resolveSettlementSlug } from "./meta.js";

export function getFlagModuleLoader(input: SettlementInput): (() => Promise<FlagModule>) | undefined {
  const slug = resolveSettlementSlug(input);
  return slug ? flagLoaders[slug] : undefined;
}

export async function loadFlagModule(input: SettlementInput): Promise<FlagModule> {
  const loader = getFlagModuleLoader(input);
  if (!loader) {
    throw new Error(`Unknown Samara Oblast settlement: ${String(input)}`);
  }
  return loader();
}

export async function loadFlagImage(input: SettlementInput, options?: FlagImageOptions): Promise<HTMLImageElement> {
  const module = await loadFlagModule(input);
  return module.createImage(options);
}

export function preloadFlag(input: SettlementInput): void {
  void getFlagModuleLoader(input)?.();
}

export const loadFlag = loadFlagImage;
