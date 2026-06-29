# @russian-flags/samara-oblast

[Русская версия](./README.md)

An ESM collection of SVG flags and city metadata for Samara Oblast, Russia. The package structure mirrors `@russian-flags/moscow-oblast`: local SVG files live in `assets/<slug>/index.svg`, build output copies them to `dist/flags/<slug>.svg`, and JavaScript/TypeScript consumers get lazy loaders.

The list is based on the "Cities" section of the Russian Wikipedia page ["Urban localities in Samara Oblast"](https://ru.wikipedia.org/wiki/Городские_населённые_пункты_Самарской_области): 11 cities. Urban-type settlements are not included.

The README shows source SVG files from `assets/<slug>/index.svg` so images render on GitHub without committing the build-only `dist` directory.

## Cities

| City | Flag | slug |
| --- | --- | --- |
| Zhigulyovsk | <img src="./assets/zhigulevsk/index.svg" width="120" alt="Flag of Zhigulyovsk"> | `zhigulevsk` |
| Kinel | <img src="./assets/kinel/index.svg" width="120" alt="Flag of Kinel"> | `kinel` |
| Neftegorsk | <img src="./assets/neftegorsk/index.svg" width="120" alt="Flag of Neftegorsk"> | `neftegorsk` |
| Novokuybyshevsk | <img src="./assets/novokuybyshevsk/index.svg" width="120" alt="Flag of Novokuybyshevsk"> | `novokuybyshevsk` |
| Oktyabrsk | <img src="./assets/oktyabrsk/index.svg" width="120" alt="Flag of Oktyabrsk"> | `oktyabrsk` |
| Otradny | <img src="./assets/otradnyy/index.svg" width="120" alt="Flag of Otradny"> | `otradnyy` |
| Pokhvistnevo | <img src="./assets/pohvistnevo/index.svg" width="120" alt="Flag of Pokhvistnevo"> | `pohvistnevo` |
| Samara | <img src="./assets/samara/index.svg" width="120" alt="Flag of Samara"> | `samara` |
| Syzran | <img src="./assets/syzran/index.svg" width="120" alt="Flag of Syzran"> | `syzran` |
| Tolyatti | <img src="./assets/tolyatti/index.svg" width="120" alt="Flag of Tolyatti"> | `tolyatti` |
| Chapayevsk | <img src="./assets/chapaevsk/index.svg" width="120" alt="Flag of Chapayevsk"> | `chapaevsk` |

## Features

- 11 local SVG flags in `assets/<slug>/index.svg`.
- ESM build with TypeScript types.
- Lazy loaders for every flag.
- City lookup by slug, code, Russian/English name, or alias.
- Direct SVG imports through `flags/<slug>` or `svg/<slug>`.

## Installation

```bash
npm install @russian-flags/samara-oblast
```

For a local check from the project directory:

```bash
npm install .
```

## Quick Start

```js
import { loadFlag, settlements } from "@russian-flags/samara-oblast";

console.log(settlements.length); // 11

const image = await loadFlag("samara", {
  alt: "Flag of Samara",
  className: "flag",
});

document.body.append(image);
```

## Direct SVG Imports

```js
import samaraFlag from "@russian-flags/samara-oblast/flags/samara";
import samaraSvg from "@russian-flags/samara-oblast/svg/samara";

console.log(samaraFlag);
console.log(samaraSvg);
```

Imports with the extension are supported too:

```js
import samaraFlag from "@russian-flags/samara-oblast/flags/samara.svg";
import samaraSvg from "@russian-flags/samara-oblast/svg/samara.svg";
```

## Lookup

```js
import {
  resolveSettlementSlug,
  settlementSlugs,
  settlements,
} from "@russian-flags/samara-oblast";

console.log(settlementSlugs.includes("samara")); // true
console.log(resolveSettlementSlug("Самара")); // "samara"
console.log(resolveSettlementSlug("Togliatti")); // "tolyatti"
console.log(resolveSettlementSlug("Безенчук")); // undefined
```

Input is normalized: surrounding spaces are removed, case does not matter, `ё` is treated as `е`, and spaces or `_` are converted to `-`.

## API

| Export | Description |
| --- | --- |
| `settlements` | Metadata array `{ slug, code, nameRu, nameEn, aliases }`. |
| `settlementSlugs` | Array of all available slugs. |
| `normalizeSettlementInput(input)` | Normalizes user input before lookup. |
| `resolveSettlementSlug(input)` | Returns a slug by slug, code, name, or alias. |
| `getFlagModuleLoader(input)` | Returns a lazy flag module loader or `undefined`. |
| `loadFlagModule(input)` | Lazily imports a flag module. |
| `loadFlagImage(input, options)` | Loads a flag and returns an `HTMLImageElement`. |
| `loadFlag(input, options)` | Alias for `loadFlagImage`. |
| `preloadFlag(input)` | Starts module loading without waiting for the result. |
| `createFlagImage(src, defaultAlt, options)` | Creates and configures an `<img>` for an SVG flag. |

## Development

```bash
npm install
npm test
npm run pack:dry
```
