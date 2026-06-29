import assert from "node:assert/strict";
import {
  normalizeSettlementInput,
  resolveSettlementSlug,
  settlementSlugs,
  settlements,
} from "../dist/meta.js";

assert.ok(Object.isFrozen(settlements), "settlements should be frozen");
assert.ok(Object.isFrozen(settlementSlugs), "settlementSlugs should be frozen");
assert.equal(settlements.length, 11);
assert.equal(settlementSlugs.length, settlements.length);
assert.deepEqual(
  settlementSlugs,
  settlements.map((settlement) => settlement.slug)
);
assert.equal(new Set(settlementSlugs).size, settlementSlugs.length);

assert.deepEqual(settlementSlugs, [
  "zhigulevsk",
  "kinel",
  "neftegorsk",
  "novokuybyshevsk",
  "oktyabrsk",
  "otradnyy",
  "pohvistnevo",
  "samara",
  "syzran",
  "tolyatti",
  "chapaevsk",
]);

assert.equal(normalizeSettlementInput("  OTRADNYY  "), "otradnyy");
assert.equal(normalizeSettlementInput("NOVOKUYBYSHEVSK"), "novokuybyshevsk");
assert.equal(normalizeSettlementInput("Жигулёвск"), "жигулевск");
assert.equal(normalizeSettlementInput("ЖИГУЛЕВСК"), "жигулевск");

for (const settlement of settlements) {
  assert.equal(typeof settlement.nameRu, "string");
  assert.equal(typeof settlement.nameEn, "string");
  assert.ok(Array.isArray(settlement.aliases), "settlement aliases should be an array");
  assert.equal(resolveSettlementSlug(settlement.slug), settlement.slug);
  assert.equal(resolveSettlementSlug(settlement.code), settlement.slug);
  assert.equal(resolveSettlementSlug(settlement.nameRu), settlement.slug);
  assert.equal(resolveSettlementSlug(settlement.nameEn), settlement.slug);
  for (const alias of settlement.aliases) {
    assert.equal(resolveSettlementSlug(alias), settlement.slug);
  }
}

assert.equal(resolveSettlementSlug(" Самара "), "samara");
assert.equal(resolveSettlementSlug("Жигулевск"), "zhigulevsk");
assert.equal(resolveSettlementSlug("Zhigulevsk"), "zhigulevsk");
assert.equal(resolveSettlementSlug("Togliatti"), "tolyatti");
assert.equal(resolveSettlementSlug("Otradny"), "otradnyy");
assert.equal(resolveSettlementSlug("Pohvistnevo"), "pohvistnevo");
assert.equal(resolveSettlementSlug("Chapaevsk"), "chapaevsk");
assert.equal(resolveSettlementSlug("bezencuk"), undefined);
assert.equal(resolveSettlementSlug("Безенчук"), undefined);
