# FIT3179 — Australian Pet Insurance Visualisation

Private working repository for the FIT3179 Data Visualisation 2 assignment.

## What this repository currently contains

The project combines two main sources:

1. **Animal Medicines Australia — Pets in Australia 2025**
   - Australian pet ownership
   - Spending
   - Veterinary-care access
   - Owner-reported insurance participation

2. **PetSure — Pet Health Monitor current page**
   - Latest public age-condition tables available in this working pack
   - 2025 reference tables
   - Treatment-cost context among PetSure-insured pets

It also contains an official South Australian Dogs and Cats Online extract for the map section. That dataset is registration/ownership context, **not insurance data**.

The source register in `DV2_Pet_Insurance_Data_and_Viz_Plan.xlsx` contains the source URLs, dates, periods and limitations. Source checks in this working pack were made on **16 September 2026**.

## Start here

1. Open `DV2_Pet_Insurance_Data_and_Viz_Plan.xlsx`.
2. Read the `START_HERE` sheet.
3. Read `Source_Register`, `Map_Plan`, `Viz_Plan` and `VegaLite_Guide`.
4. Open `Vega_Lite_Beginner_Guide.md`.
5. Run the draft page locally using the instructions below.
6. Open `index.html` and inspect the four rendered starter visualisations. The fifth JSON file is a standalone state-population context template.
7. Replace the starter page with your final story gradually. Do not try to build all charts at once.

## Repository structure

```text
.
├── index.html                         # scrollable starter page
├── data/
│   ├── australian_states_simplified.topojson
│   └── sa_lga_simplified.topojson
├── web_data/                          # small CSV files used by Vega-Lite
├── specs/                             # human-readable Vega-Lite JSON files
├── DV2_Pet_Insurance_Data_and_Viz_Plan.xlsx
├── Vega_Lite_Beginner_Guide.md
└── pet-insurance-dataset-audit.md
```

## Run the draft page locally

Do not open the HTML with `file://`. Start a small local web server from the repository root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

The page loads Vega, Vega-Lite and Vega-Embed from pinned CDN major versions and loads the local CSV, TopoJSON and specification files.

## Vega-Lite workflow from the Week 8 lesson

For a map, follow this sequence:

1. Obtain a spatial layer.
2. Convert the spatial layer to TopoJSON with Mapshaper.
3. Inspect the TopoJSON `objects` key to find the `feature` name.
4. Set the `projection`.
5. Load the TopoJSON as the `geoshape` layer.
6. Join the observation CSV with `lookup`.
7. Add the visual encoding and tooltip.
8. Validate the join before styling the map.

For this project:

```text
SA geometry object: sa_lgas
SA geometry key:    properties.lga
CSV join key:       map_join_key
```

A choropleth should encode a rate such as `registered_rate_pct`. A proportional-symbol map should encode a count such as `total_animals`. A bin map should show explicit classification breaks and retain the raw rate in the tooltip.

## Required map plan

Use these three map idioms:

### 1. Choropleth

South Australian council polygons coloured by `registered_rate_pct`.

This shows a rate. It is not insurance uptake.

### 2. Proportional symbols

South Australian council totals with circle size mapped to `total_animals`.

The supplied longitude/latitude values are geometry-derived representative points. They are visual anchors for council areas, not locations of individual animals.

### 3. Bin map

South Australian council polygons classified into:

- Under 90%
- 90% to under 95%
- 95% or higher

Keep the exact rate in the tooltip.

Do not use the optional ACT dot-map idea unless the veterinary-premises register is rechecked and verified coordinates are obtained. Do not use a flow map without real origin-to-destination records.

## Suggested story order

1. Australians are increasingly pet owners.
2. Pet spending is substantial, but insurance protection is uneven.
3. Claims data shows the conditions and treatment costs faced among insured pets.
4. The South Australian map section shows registration and care geography as context.

The workbook contains a 15-chart plan. Select approximately 11–13 charts for the final page. At least eight should be genuinely advanced idioms according to your unit’s rubric. Do not count a normal line chart, bar chart, scatterplot or a pair of identical small multiples as multiple advanced charts.

## What you must complete

- [ ] Confirm the AMA question bases and sample sizes before writing final claims.
- [ ] Recheck the current PetSure page and add any missing current table that is genuinely published.
- [ ] Use the wording **“among PetSure-insured pets”** on PetSure charts.
- [ ] Use the wording **“recorded animals in South Australia’s Dogs and Cats Online extract”** on SA maps.
- [ ] Add concise annotations and visible source notes to every chart.
- [ ] Build the final 11–13-chart page in one scrollable layout.
- [ ] Keep the full width usable on a small laptop without horizontal scrolling.
- [ ] Add your name, authorship date and AI acknowledgement.
- [ ] Test the page from a local HTTP server.
- [ ] Test the page after pushing to GitHub.
- [ ] Check that every JSON specification is human-readable in the repository.
- [ ] Ask your tutor whether the three SA registration maps are acceptable as the geographic section.

## Important data rules

Do not:

- call registered animals insured animals;
- call PetSure claims a census of Australian pets;
- use APRA “Other Accident” as a pet-insurance series;
- use commercial market-size forecasts as if they were official observations;
- distribute national values across states yourself;
- draw decorative flow lines;
- guess dot-map coordinates;
- silently hide unmatched SA council names.

## Git workflow

After editing the page or specifications:

```bash
git status
git add index.html specs web_data data README.md
git commit -m "Build FIT3179 visualisation draft"
git push
```

Before each push:

```bash
git diff --cached --stat
git diff --cached --check
```

## Confirm or change the repository to private

This repository has already been created as **private** at:

```text
https://github.com/4ffaad/fit3179-pet-insurance-data-viz
```

To check it in the GitHub website:

1. Sign in to GitHub.
2. Open the repository link above.
3. Select **Settings** in the repository navigation bar.
4. In the left menu, select **General** if it is not already selected.
5. Scroll to **Danger Zone**.
6. Find **Change repository visibility**.
7. The current visibility should say **Private**.
8. If it does not, select **Change visibility**, choose **Private**, read the warning and confirm the change.

You can also confirm it from a terminal with GitHub CLI:

```bash
gh repo view 4ffaad/fit3179-pet-insurance-data-viz --json isPrivate,nameWithOwner
```

It should report:

```json
{"isPrivate":true,"nameWithOwner":"4ffaad/fit3179-pet-insurance-data-viz"}
```

If you ever need to change it back to private from the terminal, GitHub CLI requires an explicit consequence acknowledgement:

```bash
gh repo edit 4ffaad/fit3179-pet-insurance-data-viz \\
  --visibility private \\
  --accept-visibility-change-consequences
```

## Privacy and final submission

Keep this repository **private while you are developing**. Do not add passwords, API keys, access tokens, private class material or unrelated personal files.

The assignment requires a publicly accessible visualisation. GitHub Pages availability for private repositories depends on the GitHub account/plan and repository settings. Before submission, confirm with your tutor whether:

- a private repository can publish the required public page on your account; or
- you need a separate public submission repository containing only the final approved webpage, JSON specifications, small CSV files and source metadata.

Do not make this working repository public until you have checked that no private notes, credentials or unrelated files are included.

## AI acknowledgement wording

You can adapt this wording for the submission:

> AI tools assisted with source discovery, spreadsheet organisation and Vega-Lite scaffolding. The author checked the linked sources, retained source limitations, selected the final visual encodings and verified the final implementation.

## Primary references

- AMA: https://animalmedicinesaustralia.org.au/resources/pets-in-australia-a-national-survey-of-pets-and-people-3/
- PetSure: https://petsure.com.au/pet-health-monitor/
- South Australian Dogs and Cats Online: https://data.sa.gov.au/data/dataset/11b13cf9-e361-4625-850c-f703e27a146b
- FIT3179 Vega-Lite examples: https://github.com/FIT3179/Vega-Lite
- Vega-Lite documentation: https://vega.github.io/vega-lite/docs/
