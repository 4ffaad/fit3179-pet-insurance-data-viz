# Pet insurance in Malaysia

A FIT3179 Data Visualisation 2 project about pet insurance awareness, published policy terms, price expectations, selected claim examples and Selangor district context.

**Author:** Daffa Fariq Prasetyo · **Unit:** FIT3179 Data Visualisation 2 · **Updated:** 15 October 2026

## Preview locally

From this folder, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [http://localhost:8000/](http://localhost:8000/). Vega, Vega-Lite and Vega-Embed load from public CDNs, so the first load needs an internet connection. The same page can be opened with VS Code Live Server.

To preview an individual `.json` spec in VS Code, use **Vega: Preview Vega Graph** from the **Vega Viewer** extension. The specs use Vega-Lite 5 and local `../data/` paths. Use the page preview for coordinated interactions across charts and maps.

## Project files

- `index.html`, `style.css`, `main.js`: the responsive story and chart interactions.
- `charts/`: six Vega-Lite chart specifications.
- `maps/`: four Vega-Lite map specifications.
- `data/`: three shared CSV tables and the geographic boundary files used by the charts.
- `.github/workflows/pages.yml`: deploys the static site when a commit reaches `main`.

The ten visualisations use Vega-Lite 5 specifications. Each spec reads the local source tables; source links and limitations are listed in the page. The Peninsular Malaysia overview uses the cylindrical Mercator projection and nearby country boundaries. The Selangor maps show district-level study context only.

## GitHub Pages

In the repository's **Settings → Pages**, set **Source** to **GitHub Actions**. The workflow publishes the HTML, styles, JavaScript, chart specs, maps and data after a push to `main`.
