# Vega-Lite beginner guide for this project

## The mental model

Vega-Lite is a declarative JSON grammar. You describe:

1. **data** — usually a relative CSV/JSON URL;
2. **mark** — bar, line, point, rect, rule or geoshape;
3. **encoding** — which fields control x, y, colour, size, shape and tooltip;
4. optional **transform**, **projection**, **layer**, **repeat** and **params**.

Official references: [specification](https://vega.github.io/vega-lite/docs/spec.html), [encodings](https://vega.github.io/vega-lite/docs/encoding.html), [geoshape](https://vega.github.io/vega-lite/docs/geoshape.html), [projections](https://vega.github.io/vega-lite/docs/projection.html), and [lookup](https://vega.github.io/vega-lite/docs/lookup.html).

## First working chart

Put `ama_ownership_trend.csv` in the repository's `web_data/` folder and use this JSON in the Vega Editor. The supplied specs use root-relative `web_data/` and `data/` paths; if you paste the JSON into the editor, change those paths to match the editor's file location:

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "title": "Australian households with at least one pet",
  "description": "AMA national survey waves; 2025 reference point is March 2025.",
  "data": {
    "url": "web_data/ama_ownership_trend.csv"
  },
  "mark": {
    "type": "line",
    "point": true,
    "tooltip": true
  },
  "encoding": {
    "x": {
      "field": "year",
      "type": "temporal",
      "title": "Survey year"
    },
    "y": {
      "field": "household_pet_ownership_pct",
      "type": "quantitative",
      "title": "Households with a pet (%)",
      "scale": {
        "domain": [
          0,
          100
        ]
      }
    },
    "tooltip": [
      {
        "field": "year",
        "type": "temporal",
        "title": "Year"
      },
      {
        "field": "household_pet_ownership_pct",
        "type": "quantitative",
        "title": "Households (%)",
        "format": ".1f"
      }
    ]
  },
  "config": {
    "view": {
      "stroke": null
    },
    "axis": {
      "labelFont": "Aptos",
      "titleFont": "Aptos"
    },
    "title": {
      "font": "Aptos Display"
    }
  }
}
```

The important mapping is:

- `x` = year;
- `y` = household ownership percentage;
- `mark` = line plus points;
- `tooltip` = the values shown on hover.

## Choropleth map pattern

A choropleth has two datasets: polygons and observations. `lookup` matches a key in one table to a key in the other. The official Vega-Lite example uses the same pattern: <https://vega.github.io/vega-lite/examples/geo_choropleth.html>.

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "title": "State population context \u2014 31 December 2025",
  "description": "Tutorial choropleth template. This is population context, not pet-insurance uptake.",
  "data": {
    "url": "data/australian_states_simplified.topojson",
    "format": {
      "type": "topojson",
      "feature": "australian_states"
    }
  },
  "transform": [
    {
      "lookup": "properties.state_name_2021",
      "from": {
        "data": {
          "url": "web_data/abs_state_population_2025.csv"
        },
        "key": "state_or_territory",
        "fields": [
          "population_000_31_dec_2025",
          "annual_change_pct"
        ]
      }
    }
  ],
  "projection": {
    "type": "mercator"
  },
  "mark": {
    "type": "geoshape",
    "stroke": "white",
    "strokeWidth": 0.7
  },
  "encoding": {
    "color": {
      "field": "population_000_31_dec_2025",
      "type": "quantitative",
      "title": "Population (000s)"
    },
    "tooltip": [
      {
        "field": "properties.state_name_2021",
        "type": "nominal",
        "title": "State/territory"
      },
      {
        "field": "population_000_31_dec_2025",
        "type": "quantitative",
        "title": "Population (000s)",
        "format": ",.1f"
      },
      {
        "field": "annual_change_pct",
        "type": "quantitative",
        "title": "Annual change (%)",
        "format": ".1f"
      }
    ]
  },
  "config": {
    "view": {
      "stroke": null
    },
    "axis": {
      "labelFont": "Aptos",
      "titleFont": "Aptos"
    },
    "legend": {
      "labelFont": "Aptos",
      "titleFont": "Aptos"
    },
    "title": {
      "font": "Aptos Display"
    }
  }
}
```

For your SA council version, replace the geometry URL with a small, clearly labelled generalised copy of the official SA LGA GeoJSON, and use the `03_sa_choropleth_template.vl.json` file.

## How the three map idioms differ

- **Choropleth:** polygon colour encodes a rate or percentage. Good for registered share, not raw counts.
- **Proportional symbol:** circle area/size encodes a count. Good for recorded animals by council. Avoid using colour and size for unrelated measures unless the legend is clear.
- **Dot map:** each dot represents a real location/event. The ACT veterinary-premises source has 48 addresses but no coordinates, so do not guess dot positions. Re-check the source and obtain verified coordinates before using it.
- **Bin map:** colour encodes explicit classes. State the class method and breaks.
- **Flow map:** requires actual origin → destination records. The current project has none; do not draw decorative flows.

## Debugging checklist

1. Open the JSON in the [Vega Editor](https://vega.github.io/editor/).
2. Check that every relative URL is correct.
3. Check that field names exactly match the CSV header, including underscores and capitalisation.
4. Give every numeric field `type: quantitative`; years can be `temporal` or `ordinal` depending on the chart.
5. For maps, inspect the geometry key and observation key. A mismatch produces a blank/uncoloured map.
6. Add `tooltip` before adding interactions.
7. Test from the same folder structure that GitHub Pages will use.

## Recommended build order

1. Build the AMA line chart.
2. Build the AMA treemap.
3. Build the PetSure age heatmap.
4. Build the policy matrix with layered text.
5. Build the ABS choropleth tutorial template.
6. Build the SA choropleth after the official LGA geometry is reduced and keys are checked.
7. Only then attempt the proportional-symbol and dot maps.

## Source and caveat rule

Each chart should have a visible source note, a reference period and a population caveat. For PetSure, say **“among PetSure-insured pets”**. For SA DACO, say **“recorded animals in South Australia’s Dogs and Cats Online extract”**. Do not turn either into a national insurance map.
