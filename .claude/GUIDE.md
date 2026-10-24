# Project Guide: MasterJayWeb

Tento projekt je webová aplikace postavená na **Vue.js** a **Vite**. Slouží primárně jako osobní landing page a agregátor odkazů (podobně jako Linktree).

## Struktura projektu

### 📂 `src/` - Zdrojový kód aplikace
Zde se nachází veškerá logika a komponenty aplikace.
- `assets/`: Statické zdroje, které jsou zpracovávány build nástrojem (např. obrázky, fonty).
- `components/`: Znovupoužitelné UI komponenty (např. tlačítka, karty, navigační prvky).
- `data/`: Datové soubory a konstanty (např. `socials.js` s definicemi sociálních sítí).
- `stores/`: Správa stavu aplikace (state management).
- `styles/`: Globální CSS styly a konfigurace vzhledu.
- `views/`: Hlavní stránky aplikace (top-level komponenty pro jednotlivé URL).
- `App.vue`: Hlavní vstupní komponenta aplikace.
- `main.js`: Inicializace Vue aplikace a připojení k DOMu.

### 📂 `public/` - Veřejné statické soubory
Soubory v této složce jsou kopírovány do kořene výsledného buildu bez změny.
- `links/`: Ikony a grafika specificky pro sekci s odkazy.
- `clicker/`: Assety pro clicker funkci/hru.
- `icon.png` atd.: Obecné ikony webu.

### 📂 `dist/` - Výstupní složka
Obsahuje zkompilovaný a optimalizovaný kód připravený k nasazení na server (generováno příkazem `npm run build`).

## Konfigurační soubory
- `package.json`: Definice závislostí, verzí a npm skriptů.
- `vite.config.js`: Konfigurace build nástroje Vite.
- `vercel.json`: Nastavení pro automatický deployment na platformu Vercel.
- `index.html`: Hlavní HTML šablona, do které se aplikace vkládá.
- `CNAME`: Konfigurace pro vlastní doménu.

## Rychlé starty
- `npm install`: Instalace závislostí.
- `npm run dev`: Spuštění vývojového serveru.
- `npm run build`: Vytvoření produkční verze v `dist/`.
