function resolveDataUrls(value, specUrl) {
  if (Array.isArray(value)) {
    value.forEach((item) => resolveDataUrls(item, specUrl));
    return;
  }
  if (!value || typeof value !== "object") return;
  if (typeof value.url === "string" && !/^(https?:|data:)/i.test(value.url)) {
    value.url = new URL(value.url, specUrl).href;
  }
  Object.values(value).forEach((item) => resolveDataUrls(item, specUrl));
}

const chartConfig = {
  background: "transparent",
  font: "Arial",
  view: { stroke: null },
  title: { font: "Georgia", fontSize: 19, fontWeight: 500, anchor: "start", color: "#123B55", offset: 10 },
  text: { font: "Arial", color: "#19394E" },
  axis: {
    labelFont: "Arial", titleFont: "Arial", labelFontSize: 14, titleFontSize: 14,
    labelColor: "#617483", titleColor: "#19394E", domainColor: "#D9E0E3",
    tickColor: "#D9E0E3", gridColor: "#E8EDF0", gridOpacity: 0.68,
  },
  legend: { labelFont: "Arial", titleFont: "Arial", labelFontSize: 13, titleFontSize: 13, labelColor: "#617483", titleColor: "#19394E" },
};

function isLocalDevelopment() {
  const hostname = window.location.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  return hostname === "localhost" || hostname === "::1" || hostname.startsWith("127.") || window.location.protocol === "file:";
}

function safeErrorDetail(error) {
  return `${error?.name || "Error"}: ${String(error?.message || error)
    .replace(/(?:file|https?):\/\/[^\s)]+/gi, "[resource]")
    .replace(/(?:\/Users\/[^/\s]+|\/home\/[^/\s]+)[^\s]*/g, "[local path]")
    .replace(/\s+/g, " ")
    .slice(0, 180)}`;
}

async function renderChart(container) {
  const specUrl = new URL(container.dataset.spec, document.baseURI);
  const response = await fetch(specUrl);
  if (!response.ok) throw new Error(`Could not load ${specUrl.pathname} (${response.status})`);

  const spec = await response.json();
  resolveDataUrls(spec, specUrl);
  const { view } = await vegaEmbed(container, spec, {
    actions: false,
    renderer: "svg",
    hover: true,
    tooltip: true,
    config: chartConfig,
  });
  container.setAttribute("aria-busy", "false");
  container.dataset.rendered = "true";
  return view;
}

async function renderAllCharts() {
  const containers = [...document.querySelectorAll(".chart-host[data-spec]")];
  if (!containers.length) return;

  if (typeof vegaEmbed !== "function") {
    const missing = [
      ["vega", window.vega],
      ["vega-lite", window.vegaLite],
      ["vega-embed", window.vegaEmbed],
    ].filter(([, library]) => !library).map(([name]) => name).join(", ");
    containers.forEach((container) => showChartError(container, "The chart library did not load. Check your internet connection and reload.", `Missing library: ${missing || "unknown"}`));
    return;
  }

  const results = new Array(containers.length);
  let nextIndex = 0;
  const renderNext = async () => {
    while (nextIndex < containers.length) {
      const index = nextIndex++;
      const container = containers[index];
      try {
        results[index] = { container, view: await renderChart(container) };
      } catch (error) {
        const detail = `${container.dataset.spec.split("/").pop()}: ${safeErrorDetail(error)}`;
        if (isLocalDevelopment()) console.error("Chart failed to render:", detail);
        showChartError(container, "This visualisation could not load. The source values and limitations are described in the text and source register below.", detail);
        results[index] = { container, view: null };
      }
    }
  };

  // Two concurrent charts keep requests below the limit of simple local servers.
  await Promise.all(Array.from({ length: Math.min(2, containers.length) }, renderNext));

  if (isLocalDevelopment()) {
    const rendered = results.filter(({ view }) => view).length;
    console.info(`Rendered ${rendered} of ${containers.length} Vega-Lite views.`);
  }
}

function showChartError(container, message, detail = "") {
  container.setAttribute("aria-busy", "false");
  const notice = document.createElement("div");
  notice.className = "chart-error";
  notice.setAttribute("role", "status");
  const summary = document.createElement("p");
  summary.textContent = message;
  notice.append(summary);
  if (detail && isLocalDevelopment()) {
    const diagnostic = document.createElement("code");
    diagnostic.className = "chart-error-detail";
    diagnostic.textContent = detail;
    notice.append(diagnostic);
  }
  container.replaceChildren(notice);
}

renderAllCharts();
