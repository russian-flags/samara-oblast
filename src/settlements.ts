import type { SettlementMeta, SettlementSlug } from "./types.js";

export const settlements = Object.freeze([
  {
    slug: "zhigulevsk",
    code: "ZHIGULEVSK",
    nameRu: "Жигулёвск",
    nameEn: "Zhigulyovsk",
    aliases: ["Zhigulevsk"],
  },
  {
    slug: "kinel",
    code: "KINEL",
    nameRu: "Кинель",
    nameEn: "Kinel",
    aliases: [],
  },
  {
    slug: "neftegorsk",
    code: "NEFTEGORSK",
    nameRu: "Нефтегорск",
    nameEn: "Neftegorsk",
    aliases: [],
  },
  {
    slug: "novokuybyshevsk",
    code: "NOVOKUYBYSHEVSK",
    nameRu: "Новокуйбышевск",
    nameEn: "Novokuybyshevsk",
    aliases: [],
  },
  {
    slug: "oktyabrsk",
    code: "OKTYABRSK",
    nameRu: "Октябрьск",
    nameEn: "Oktyabrsk",
    aliases: [],
  },
  {
    slug: "otradnyy",
    code: "OTRADNYY",
    nameRu: "Отрадный",
    nameEn: "Otradny",
    aliases: ["Otradnyy"],
  },
  {
    slug: "pohvistnevo",
    code: "POHVISTNEVO",
    nameRu: "Похвистнево",
    nameEn: "Pokhvistnevo",
    aliases: ["Pohvistnevo"],
  },
  {
    slug: "samara",
    code: "SAMARA",
    nameRu: "Самара",
    nameEn: "Samara",
    aliases: [],
  },
  {
    slug: "syzran",
    code: "SYZRAN",
    nameRu: "Сызрань",
    nameEn: "Syzran",
    aliases: [],
  },
  {
    slug: "tolyatti",
    code: "TOLYATTI",
    nameRu: "Тольятти",
    nameEn: "Tolyatti",
    aliases: ["Togliatti"],
  },
  {
    slug: "chapaevsk",
    code: "CHAPAEVSK",
    nameRu: "Чапаевск",
    nameEn: "Chapayevsk",
    aliases: ["Chapaevsk"],
  },
]) as readonly SettlementMeta[];

export const settlementSlugs = Object.freeze(settlements.map((settlement) => settlement.slug)) as readonly SettlementSlug[];
