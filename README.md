# Australia’s pets: care, costs and insurance evidence

A FIT3179 Data Visualisation 2 story about pet ownership, household care costs, insurance barriers, reported complaints and insured-pet claims in Australia.

**Author:** Daffa Fariq Prasetyo · **Unit:** FIT3179 Data Visualisation 2 · **Updated:** 20 October 2026

## Preview locally

From this folder, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [http://localhost:8000/](http://localhost:8000/). The chart libraries load from public CDNs, so the first load needs an internet connection. Use the **Vega Viewer** extension by RandomFractals with these Vega-Lite 5 specifications: open a `.vl.json` file and run **Vega: Preview Vega Graph** from the Command Palette. Specs load local observations from `data/` using relative paths. The separate, older **Vega Preview** extension bundles Vega-Lite 2.5.2 and may reject these v5 specs.

## Project files

- `index.html`, `style.css`, `main.js`: the single-page visual story and Vega-Lite rendering.
- `charts/`: eleven numbered Vega-Lite chart specifications.
- `maps/`: three thematic map specifications: choropleth, proportional symbols and population tile cartogram.
- `data/`: source observations and compact geographic assets loaded by the specifications.
- `data/australia_data_sources.json`: source periods, caveats and measure decisions.
- `.github/workflows/pages.yml`: static-site deployment workflow.

The story combines five source owners: Animal Medicines Australia, PetSure, ASIC, Compare the Market Australia and the ABS. It keeps household survey results, insured claims, insurer complaints, quote-panel prices and population estimates separate. No national pet-insurance uptake or policy-mix series was found for this draft, so the page does not claim to measure industry growth or compare coverage tiers.

## GitHub Pages

In the repository’s **Settings → Pages**, set **Source** to **GitHub Actions**. The workflow publishes the static page when a change is pushed to `main`.
