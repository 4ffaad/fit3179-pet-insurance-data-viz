"use strict";

function makeDataUrlsAbsolute(spec, specUrl) {
  if (Array.isArray(spec)) {
    spec.forEach((item) => makeDataUrlsAbsolute(item, specUrl));
    return;
  }

  if (!spec || typeof spec !== "object") return;

  if (spec.data && typeof spec.data.url === "string") {
    spec.data.url = new URL(spec.data.url, specUrl).href;
  }

  Object.values(spec).forEach((value) => makeDataUrlsAbsolute(value, specUrl));
}

async function renderChart(host) {
  const fallback = host.nextElementSibling;

  try {
    const specUrl = new URL(host.dataset.spec, document.baseURI);
    const response = await fetch(specUrl);
    if (!response.ok) {
      throw new Error(`Could not load chart spec (${response.status})`);
    }

    const spec = await response.json();
    makeDataUrlsAbsolute(spec, specUrl);

    await window.vegaEmbed(host, spec, {
      actions: false,
      renderer: "svg",
    });

    host.dataset.rendered = "true";
    if (fallback instanceof HTMLImageElement) fallback.hidden = true;
  } catch (error) {
    host.hidden = true;
    console.error(`Chart failed to render: ${host.dataset.spec}`, error);
  }
}

document.querySelectorAll(".chart-host[data-spec]").forEach(renderChart);
