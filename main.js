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
  title: { font: "Georgia", fontSize: 19, fontWeight: 700, anchor: "start", color: "#1D4F7A", offset: 10 },
  text: { font: "Arial", color: "#24364B" },
  axis: {
    labelFont: "Arial", titleFont: "Arial", labelFontSize: 14, titleFontSize: 14,
    labelColor: "#536678", titleColor: "#24364B", domainColor: "#D8E0E7",
    tickColor: "#D8E0E7", gridColor: "#E8EDF2", gridOpacity: 0.68,
  },
  legend: { labelFont: "Arial", titleFont: "Arial", labelFontSize: 13, titleFontSize: 13, labelColor: "#536678", titleColor: "#24364B" },
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
  const { view } = await vegaEmbed(container, spec, { actions: false, renderer: "svg", config: chartConfig });
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

  const claimChart = results.find(({ container, view }) => container.dataset.sync === "claim" && view);
  if (claimChart && typeof claimChart.view.addSignalListener === "function") {
    claimChart.view.addSignalListener("selected_claim", () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const svg = claimChart.container.querySelector(".vega-embed svg");
      svg?.animate?.([{ opacity: 0.78 }, { opacity: 1 }], { duration: 180, easing: "ease-out" });
    });
  }

  const districtViews = results.filter(({ container, view }) => container.dataset.sync === "district" && view).map(({ view }) => view);
  if (districtViews.length) {
    const districtNames = new Set(["Gombak", "Hulu Langat", "Hulu Selangor", "Klang", "Kuala Langat", "Kuala Selangor", "Petaling", "Sabak Bernam", "Sepang"]);
    let selectedDistrict = "All districts";
    let districtUpdate = Promise.resolve();
    const updateDistrict = (district) => {
      const selection = districtNames.has(district) ? district : "All districts";
      selectedDistrict = selection;
      districtUpdate = districtUpdate.then(async () => {
        try {
          await Promise.all(districtViews.map((view) => view.signal("selected_district", selection).runAsync()));
        } catch (error) {
          if (isLocalDevelopment()) console.error("District map selection failed:", safeErrorDetail(error));
        }
      });
    };

    districtViews.forEach((view) => view.addEventListener("click", (_event, item) => {
      const district = item?.datum?.properties?.district_join ?? item?.datum?.district_join_label;
      if (!districtNames.has(district)) return;
      updateDistrict(selectedDistrict === district ? "All districts" : district);
    }));

  }

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
