import type { FlagModule, SettlementSlug } from "./types.js";

export const flagLoaders = Object.freeze({
  "zhigulevsk": () => import("./loaders/zhigulevsk.js") as Promise<FlagModule>,
  "kinel": () => import("./loaders/kinel.js") as Promise<FlagModule>,
  "neftegorsk": () => import("./loaders/neftegorsk.js") as Promise<FlagModule>,
  "novokuybyshevsk": () => import("./loaders/novokuybyshevsk.js") as Promise<FlagModule>,
  "oktyabrsk": () => import("./loaders/oktyabrsk.js") as Promise<FlagModule>,
  "otradnyy": () => import("./loaders/otradnyy.js") as Promise<FlagModule>,
  "pohvistnevo": () => import("./loaders/pohvistnevo.js") as Promise<FlagModule>,
  "samara": () => import("./loaders/samara.js") as Promise<FlagModule>,
  "syzran": () => import("./loaders/syzran.js") as Promise<FlagModule>,
  "tolyatti": () => import("./loaders/tolyatti.js") as Promise<FlagModule>,
  "chapaevsk": () => import("./loaders/chapaevsk.js") as Promise<FlagModule>,
}) as Readonly<Record<SettlementSlug, () => Promise<FlagModule>>>;
