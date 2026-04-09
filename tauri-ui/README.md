# Tauri UI MVP

Ce dossier initialise la **couche UI Tauri** demandée pour démarrer la migration.

## Contenu

- `src/`: interface locale (HTML/CSS/JS) avec les 4 écrans MVP:
  - chargement corpus,
  - paramétrage analyse,
  - exécution + logs + progression,
  - listing des résultats.
- `src-tauri/`: shell Rust/Tauri pour empaqueter l'UI desktop.

## Prérequis

- Node.js 20+
- Rust (toolchain stable)
- Sur Linux: dépendances WebKitGTK/Tauri installées

## Lancer depuis un éditeur de code (VS Code, Cursor, etc.)

1. Ouvrir le dépôt `tauri-iramuteq-lite` dans votre éditeur.
2. Ouvrir un terminal intégré.
3. Se placer dans le dossier UI:

```bash
cd tauri-ui
```

4. Installer les dépendances JS:

```bash
npm install
```

5. Démarrer l'application desktop Tauri en mode dev:

```bash
npm run dev
```

Une fenêtre desktop **IRaMuTeQ Lite** s'ouvre alors.

## Lancer sans éditeur (terminal uniquement)

Depuis la racine du repo:

```bash
cd /workspace/tauri-iramuteq-lite/tauri-ui
npm install
npm run dev
```

## Limite actuelle

Le bouton "Lancer l'analyse" simule un job. L'intégration backend Python (FastAPI/CLI) sera branchée à l'étape suivante via un appel HTTP local (`POST /jobs`).
