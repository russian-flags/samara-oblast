# @russian-flags/samara-oblast

[Русская версия](./README.md)

An ESM collection of SVG flags and city metadata for Samara Oblast, Russia. The package structure mirrors `@russian-flags/moscow-oblast`: local SVG files live in `assets/<slug>/index.svg`, build output copies them to `dist/flags/<slug>.svg`, and JavaScript/TypeScript consumers get lazy loaders.

The list is based on the "Cities" section of the Russian Wikipedia page ["Urban localities in Samara Oblast"](https://ru.wikipedia.org/wiki/Городские_населённые_пункты_Самарской_области): 11 cities. Urban-type settlements are not included.

The README shows built SVG files from `dist/flags/<slug>.svg` so the images are available in the published npm package too.

## Cities

| City | Flag | slug |
| --- | --- | --- |
| Zhigulyovsk | <img src="./dist/flags/zhigulevsk.svg" width="120" alt="Flag of Zhigulyovsk"> | `zhigulevsk` |
| Kinel | <img src="./dist/flags/kinel.svg" width="120" alt="Flag of Kinel"> | `kinel` |
| Neftegorsk | <img src="./dist/flags/neftegorsk.svg" width="120" alt="Flag of Neftegorsk"> | `neftegorsk` |
| Novokuybyshevsk | <img src="./dist/flags/novokuybyshevsk.svg" width="120" alt="Flag of Novokuybyshevsk"> | `novokuybyshevsk` |
| Oktyabrsk | <img src="./dist/flags/oktyabrsk.svg" width="120" alt="Flag of Oktyabrsk"> | `oktyabrsk` |
| Otradny | <img src="./dist/flags/otradnyy.svg" width="120" alt="Flag of Otradny"> | `otradnyy` |
| Pokhvistnevo | <img src="./dist/flags/pohvistnevo.svg" width="120" alt="Flag of Pokhvistnevo"> | `pohvistnevo` |
| Samara | <img src="./dist/flags/samara.svg" width="120" alt="Flag of Samara"> | `samara` |
| Syzran | <img src="./dist/flags/syzran.svg" width="120" alt="Flag of Syzran"> | `syzran` |
| Tolyatti | <img src="./dist/flags/tolyatti.svg" width="120" alt="Flag of Tolyatti"> | `tolyatti` |
| Chapayevsk | <img src="./dist/flags/chapaevsk.svg" width="120" alt="Flag of Chapayevsk"> | `chapaevsk` |

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
