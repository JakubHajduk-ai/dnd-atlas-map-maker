# Kontext projektu

Atlas je editor interaktívnych máp pre stolové RPG. Generuje statické HTML stránky.

## Architektúra

Dve oddelené aplikácie v jednom repe:

1. **Editor** — `src/shell.html` + `src/editor.css` + `src/editor.js`. Beží v prehliadači,
   drží projekt v pamäti a v IndexedDB, exportuje hotovú stránku.
2. **Prehliadač mapy** — `src/viewer.html`. Normálny HTML súbor, ktorý sa pri builde
   vloží do editora ako reťazec a pri exporte sa v ňom nahradia značky
   `__TITLE__`, `__SUBTITLE__`, `__ICONS__`, `__TYPES__`, `__DATA__`.

`build.mjs` ich poskladá do koreňového `index.html`. Build nemá závislosti a musí tak zostať.

## Pravidlá

- **Po každej zmene v `src/` spusti `node build.mjs`.** Bez toho sa `index.html` nezmení.
  `index.html` je build výstup — nikdy ho needituj ručne.
- **Nepridávaj npm závislosti, bundler ani framework.** Celá hodnota projektu je v tom,
  že výstup je jeden súbor, ktorý funguje aj z `file://`.
- **Žiadne externé requesty v `viewer.html`** okrem Google Fonts. Exportovaná mapa musí
  fungovať offline aj na hostingu bez konfigurácie.
- Editor aj prehliadač používajú ES5-ish štýl (`var`, `function`, žiadne moduly),
  aby oba súbory zostali vložiteľné ako obyčajný `<script>`. Drž sa toho.
- V `viewer.html` musí každý `</script>` vo vnútri reťazcov zostať písaný ako `<\/script>`;
  build zvyšok escapuje sám (`JSON.stringify` + rozbitie `</`).

## Jazyk

UI, komentáre, dokumentácia aj identifikátory v kóde sú po anglicky.

Texty v UI: sentence case, bez výkričníkov, bez „please“. Tlačidlo hovorí, čo sa stane
(„Download file“, nie „Submit“). Prázdne stavy sú výzva na akciu, nie ospravedlnenie.

## Vzhľad

Editor je tmavá konzola (bridlicová zeleň, mosadzné linky), panel v hotovej mape je pergamen.
Písma: Eczar na nadpisy, Vollkorn na text. Nepridávaj ďalšie rodiny.
Farby sú CSS premenné v `:root` — nové hodnoty pridávaj tam, nie inline.

## Dátový model

Popísaný v README. Kľúčové: súradnice bodov sú pomerné (0–1), nie pixelové.
Obrázky sú data URI. `hidden: true` znamená, že bod sa neexportuje.

## Čo sa oplatí testovať po zmene

- Nahratie mapy, pridanie bodu, ťahanie bodu, zoom kolieskom.
- Export a otvorenie výsledného súboru priamo z disku (`file://`).
- Náhľad v editore — beží v `<iframe srcdoc>` a musí ukazovať to isté, čo export.
- Mobilná šírka: panel v hotovej mape sa vysúva zdola, nie zboku.
