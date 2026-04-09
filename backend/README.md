# Backend Python -> R

Ce backend fournit un orchestrateur Python qui pilote les scripts R du projet
en mode batch, sans passer par Shiny.

## Verification rapide

```bash
python3 backend/run_job.py check
```

## Bootstrap des packages R

```bash
python3 backend/run_job.py bootstrap
```

Cette commande verifie les packages R necessaires au backend batch et installe
ceux qui manquent dans une librairie utilisateur dediee.

## Lancer un job

```bash
python3 backend/run_job.py run \
  --input /chemin/vers/corpus.txt \
  --config backend/examples/job-config.json
```

Le job cree un dossier dans `backend/jobs/<job_id>/` avec :

- `status.json`
- `results.json`
- `stdout.log`
- `stderr.log`
- `exports/`

Le dossier `exports/` est compatible avec l'UI Tauri actuelle, qui peut ensuite
charger et afficher les PNG, CSV et HTML produits.
