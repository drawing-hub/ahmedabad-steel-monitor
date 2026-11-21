# Ahmedabad Steel Monitor (GitHub Pages + GitHub Actions)
No Python or always-on computer required.

1. Create a PUBLIC GitHub repository (for example `steel-monitor`).
2. Upload `index.html`, `fetch.mjs`, `data/rates.json` and `.github/workflows/update.yml` preserving paths. GitHub web upload may require creating nested files via Add file > Create new file and typing their paths.
3. Repository Settings > Actions > General > Workflow permissions: select Read and write permissions, Save.
4. Actions > Daily steel rate update > Run workflow. Inspect run logs and `data/rates.json`.
5. Settings > Pages > Build and deployment > Deploy from a branch > main / (root) > Save.
6. Open `https://YOUR_USERNAME.github.io/steel-monitor/` after Pages deploys.

IMPORTANT: This is a deployable proof of concept, not a guaranteed live-price feed. The source page may block fetching or use dynamic markup. The strict parser intentionally shows no rates rather than inventing values. Test and adapt to the website's permitted API/HTML. It cannot guarantee all six materials: ISMC is not independently verified; MS Beam is a category proxy and NOT a verified ISMB designation; HR/CR Coil is NOT a quoted cut-sheet rate. Do not rely on proxy prices for purchases. Scheduled GitHub Actions may be delayed or disabled after inactivity. Only changed price observations are appended, so the history is not a complete daily snapshot.
