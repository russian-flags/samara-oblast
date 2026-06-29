import type { SettlementInput, SettlementSlug } from "./types.js";
import { settlements, settlementSlugs } from "./settlements.js";

export { settlements, settlementSlugs };

const aliases = new Map<string, SettlementSlug>();

export function normalizeSettlementInput(input: SettlementInput): string {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/\u0451/g, "\u0435")
    .replace(/[\s_]+/g, "-");
}

for (const settlement of settlements) {
  for (const value of [
    settlement.slug,
    settlement.code,
    settlement.nameRu,
    settlement.nameEn,
    ...settlement.aliases,
  ]) {
    aliases.set(normalizeSettlementInput(value), settlement.slug);
  }
}

export function resolveSettlementSlug(input: SettlementInput): SettlementSlug | undefined {
  return aliases.get(normalizeSettlementInput(input));
}
