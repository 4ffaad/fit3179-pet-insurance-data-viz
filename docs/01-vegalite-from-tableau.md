# Vega-Lite from a Tableau perspective

This project does not use a drag-and-drop chart builder. Vega-Lite uses **JSON code** to describe a chart. The browser reads that JSON and draws the visualisation.

You do not manually type the survey values into the chart code. The chart code points to a CSV file, then tells Vega-Lite which columns should become visual properties.

## The Tableau translation

| Tableau idea | Vega-Lite idea | Example in this project |
|---|---|---|
| Data source | `data.url` | `web_data/ama_ownership_trend.csv` |
| Columns shelf | `encoding.x` | `year` |
| Rows shelf | `encoding.y` | `household_pet_ownership_pct` |
| Marks card | `mark` | `line`, `bar`, `circle`, `geoshape` |
| Colour | `encoding.color` | `species` or `registered_rate_pct` |
| Size | `encoding.size` | `total_animals` |
| Label / hover details | `encoding.tooltip` | year, percentage, council |
| Filter | `transform.filter` | `datum.boundary_match === 'YES'` |
| Map layer | TopoJSON + `geoshape` | South Australian LGA boundaries |
| Relationship/join | `transform.lookup` | council CSV joined to council polygons |
| Dashboard layout | HTML + CSS | `index.html` |

The key difference is that Tableau stores these decisions in its interface, while Vega-Lite stores them in a readable JSON file.

## The four things every beginner chart needs

```text
data       Where the rows come from
mark       What shape is drawn
encoding   Which columns control position, colour, size and tooltip
transform  Optional filtering, grouping or joining
```

A chart is normally built in that order.

## First example: the ownership line chart

Open:

```text
specs/01_ama_ownership_trend.vl.json
```

The important part is:

```json
{
  "data": {
    "url": "web_data/ama_ownership_trend.csv"
  },
  "mark": {
    "type": "line",
    "point": true
  },
  "encoding": {
    "x": {
      "field": "year",
      "type": "temporal"
    },
    "y": {
      "field": "household_pet_ownership_pct",
      "type": "quantitative"
    },
    "tooltip": [
      {"field": "year", "type": "temporal"},
      {"field": "household_pet_ownership_pct", "type": "quantitative"}
    ]
  }
}
```

Read it like this:

- Load `web_data/ama_ownership_trend.csv`.
- Draw a line with points.
- Put `year` on the horizontal axis.
- Put `household_pet_ownership_pct` on the vertical axis.
- Show both fields when the user hovers.

The CSV header is the contract. If the CSV says `household_pet_ownership_pct`, the JSON must use exactly that spelling.

## Second example: insurance reported by species

This is the simplest insurance chart in the project. Create a new file:

```text
specs/06_ama_insurance_by_species.vl.json
```

Paste this into it:

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "title": "Owners reporting pet insurance, by species",
  "description": "AMA 2025 survey response; this is owner-reported participation, not an insurer market-share estimate.",
  "data": {
    "url": "web_data/ama_insurance_2025.csv"
  },
  "mark": {
    "type": "bar",
    "tooltip": true
  },
  "encoding": {
    "x": {
      "field": "species",
      "type": "nominal",
      "title": "Species",
      "sort": ["Dogs", "Cats"]
    },
    "y": {
      "field": "owners_reporting_insurance_pct",
      "type": "quantitative",
      "title": "Owners reporting insurance (%)",
      "scale": {"domain": [0, 100]}
    },
    "color": {
      "field": "species",
      "type": "nominal",
      "legend": null
    },
    "tooltip": [
      {"field": "species", "type": "nominal", "title": "Species"},
      {
        "field": "owners_reporting_insurance_pct",
        "type": "quantitative",
        "title": "Owners reporting insurance (%)",
        "format": ".1f"
      },
      {
        "field": "avg_annual_pet_insurance_spend_per_owning_household_aud",
        "type": "quantitative",
        "title": "Average annual household spend (AUD)",
        "format": ",.0f"
      }
    ]
  }
}
```

This is the Tableau equivalent of:

1. Drag `species` to Columns.
2. Drag `owners_reporting_insurance_pct` to Rows.
3. Change Marks to Bar.
4. Drag `species` to Colour.
5. Add the percentage and average spend to Tooltip.

The chart will not be correct if you use `owners_not_reporting_insurance_pct` by mistake. Always check the field name and its definition in the workbook before using it.

## How to see the chart locally

From the project folder:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/
```

The supplied `index.html` already loads the ownership chart and the three map examples. To load the insurance chart, add a container to the HTML:

```html
<div id="insurance" class="chart"></div>
```

Then add the specification to the JavaScript list:

```javascript
['insurance', 'specs/06_ama_insurance_by_species.vl.json']
```

Refresh the browser. The browser is the renderer; the JSON is the chart specification.

## How to edit safely

Change one thing at a time:

```json
"mark": {"type": "bar"}
```

Try changing `bar` to `point`, save, refresh, and observe what changes.

Then try:

- Change `encoding.color` to another field.
- Change the `y` field to `owners_not_reporting_insurance_pct`.
- Add a tooltip field.
- Change the title so it states the population and period accurately.

Do not change values in the CSV to make a visual pattern look better. Change the visual encoding or the explanatory text instead.

## How maps differ

A normal chart has one table. A map usually has two:

```text
TopoJSON = shapes
CSV      = observations to colour or size
```

For the South Australian choropleth:

```text
properties.lga = map_join_key
```

That is the map equivalent of joining two Tableau tables. The `lookup` transform performs the join. If the two keys do not match exactly, the map will have blank or uncoloured councils.

The three map types in this project are:

- Choropleth: council colour represents `registered_rate_pct`.
- Proportional symbols: circle size represents `total_animals`.
- Bin map: council colour represents explicit rate classes.

These are registration-context maps. They are not pet-insurance uptake maps.

## Beginner workflow for the assignment

1. Start with one CSV and one ordinary chart.
2. Confirm the chart loads locally.
3. Add a tooltip and a source note.
4. Build the next chart by copying the pattern and changing the field names.
5. Only after ordinary charts work, build the maps.
6. Keep every chart specification in `specs/` and every chart CSV in `web_data/`.
7. Use the workbook to check definitions, denominators, periods and caveats.

The goal is not to memorise JSON. The goal is to understand the translation:

```text
Tableau shelf or Marks-card decision → one Vega-Lite JSON property
```

Official references:

- Vega-Lite specification: <https://vega.github.io/vega-lite/docs/spec.html>
- Encodings: <https://vega.github.io/vega-lite/docs/encoding.html>
- Data: <https://vega.github.io/vega-lite/docs/data.html>
- Lookup joins: <https://vega.github.io/vega-lite/docs/lookup.html>
- Geoshape maps: <https://vega.github.io/vega-lite/docs/geoshape.html>
