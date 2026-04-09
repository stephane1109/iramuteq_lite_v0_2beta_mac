import { closeParameterDialogs, createProgressionController } from "./progression.js";

const corpusFileInput = document.getElementById("corpusFile");
const importCorpusBtn = document.getElementById("importCorpusBtn");
const downloadResultsBtn = document.getElementById("downloadResultsBtn");
const fileInfo = document.getElementById("fileInfo");
const downloadResultsStatus = document.getElementById("downloadResultsStatus");
const analysisHistory = document.getElementById("analysisHistory");
const sidebarStatus = document.getElementById("sidebarStatus");
const progress = document.getElementById("progress");
const progressLabel = document.getElementById("progressLabel");
const runProgressDialog = document.getElementById("runProgressDialog");
const runProgressTitle = document.getElementById("runProgressTitle");
const runProgressMessage = document.getElementById("runProgressMessage");
const runProgressBar = document.getElementById("runProgressBar");
const runProgressValue = document.getElementById("runProgressValue");
const startupBootstrapDialog = document.getElementById("startupBootstrapDialog");
const startupBootstrapTitle = document.getElementById("startupBootstrapTitle");
const startupBootstrapMessage = document.getElementById("startupBootstrapMessage");
const startupBootstrapBar = document.getElementById("startupBootstrapBar");
const startupBootstrapValue = document.getElementById("startupBootstrapValue");
const imagePreviewDialog = document.getElementById("imagePreviewDialog");
const imagePreviewKicker = document.getElementById("imagePreviewKicker");
const imagePreviewTitle = document.getElementById("imagePreviewTitle");
const imagePreviewContent = document.getElementById("imagePreviewContent");
const closeImagePreviewBtn = document.getElementById("closeImagePreviewBtn");
const chdTermContextMenu = document.getElementById("chdTermContextMenu");
const termSegmentsDialog = document.getElementById("termSegmentsDialog");
const termSegmentsKicker = document.getElementById("termSegmentsKicker");
const termSegmentsTitle = document.getElementById("termSegmentsTitle");
const termSegmentsMeta = document.getElementById("termSegmentsMeta");
const termSegmentsList = document.getElementById("termSegmentsList");
const termSegmentsFooter = document.getElementById("termSegmentsFooter");
const termSegmentsStatus = document.getElementById("termSegmentsStatus");
const saveChi2PngBtn = document.getElementById("saveChi2PngBtn");
const buildSubcorpusBtn = document.getElementById("buildSubcorpusBtn");
const closeTermSegmentsBtn = document.getElementById("closeTermSegmentsBtn");
const logs = document.getElementById("logs");
const corpusPreview = document.getElementById("corpusPreview");
const analysisSteps = document.getElementById("analysisSteps");
const analysisSummary = document.getElementById("analysisSummary");
const zipfChart = document.getElementById("zipfChart");
const chdDendrogramSelect = document.getElementById("chdDendrogramSelect");
const chdConfigDialog = document.getElementById("chdConfigDialog");
const chdConfigDialogContent = document.getElementById("chdConfigDialogContent");
const closeChdDialogBtn = document.getElementById("closeChdDialogBtn");
const launchChdDialogBtn = document.getElementById("launchChdDialogBtn");
const simiConfigDialog = document.getElementById("simiConfigDialog");
const simiConfigDialogContent = document.getElementById("simiConfigDialogContent");
const closeSimiDialogBtn = document.getElementById("closeSimiDialogBtn");
const launchSimiDialogBtn = document.getElementById("launchSimiDialogBtn");
const ldaConfigDialog = document.getElementById("ldaConfigDialog");
const ldaConfigDialogContent = document.getElementById("ldaConfigDialogContent");
const closeLdaDialogBtn = document.getElementById("closeLdaDialogBtn");
const launchLdaDialogBtn = document.getElementById("launchLdaDialogBtn");
const afcTermsZoomInBtn = document.getElementById("afcTermsZoomInBtn");
const afcTermsZoomOutBtn = document.getElementById("afcTermsZoomOutBtn");
const afcTermsZoomResetBtn = document.getElementById("afcTermsZoomResetBtn");
const simiZoomInBtn = document.getElementById("simiZoomInBtn");
const simiZoomOutBtn = document.getElementById("simiZoomOutBtn");
const simiZoomResetBtn = document.getElementById("simiZoomResetBtn");
const simiZoomValue = document.getElementById("simiZoomValue");
const annotationImportBtn = document.getElementById("annotationImportBtn");
const annotationImportCsv = document.getElementById("annotationImportCsv");
const annotationDownloadCsvBtn = document.getElementById("annotationDownloadCsvBtn");
const annotationCorpusText = document.getElementById("annotationCorpusText");
const annotationCorpusColored = document.getElementById("annotationCorpusColored");
const annotationSelection = document.getElementById("annotationSelection");
const annotationNorm = document.getElementById("annotationNorm");
const annotationMorpho = document.getElementById("annotationMorpho");
const annotationAddEntryBtn = document.getElementById("annotationAddEntryBtn");
const annotationRemoveKey = document.getElementById("annotationRemoveKey");
const annotationRemoveEntryBtn = document.getElementById("annotationRemoveEntryBtn");
const annotationDictTable = document.getElementById("annotationDictTable");
const annotationSaveStatus = document.getElementById("annotationSaveStatus");
const helpMarkdownContent = document.getElementById("helpMarkdownContent");
const helpMorphoMarkdownContent = document.getElementById("helpMorphoMarkdownContent");
const helpLdaMarkdownContent = document.getElementById("helpLdaMarkdownContent");

const topNavLinks = Array.from(document.querySelectorAll("[data-tab-target]"));
const panels = Array.from(document.querySelectorAll("[data-panel]"));
const chdSubNavLinks = Array.from(document.querySelectorAll("[data-subtab-target]"));
const chdSubPanels = Array.from(document.querySelectorAll("[data-subpanel]"));
const ldaSubNavLinks = Array.from(document.querySelectorAll("[data-lda-subtab-target]"));
const ldaSubPanels = Array.from(document.querySelectorAll("[data-lda-subpanel]"));
const chdConfigSourceCards = Array.from(document.querySelectorAll("[data-chd-config-source]"));
const simiConfigSourceCards = Array.from(document.querySelectorAll("[data-simi-config-source]"));
const ldaConfigSourceCards = Array.from(document.querySelectorAll("[data-lda-config-source]"));

const resultContainers = {
  chdDendrogramme: document.getElementById("chdDendrogramme"),
  chdStatsTable: document.getElementById("chdStatsTable"),
  chdConcordancier: document.getElementById("chdConcordancier"),
  chdWordclouds: document.getElementById("chdWordclouds"),
  afcClassesPlot: document.getElementById("afcClassesPlot"),
  afcTermsPlot: document.getElementById("afcTermsPlot"),
  afcTermsTable: document.getElementById("afcTermsTable"),
  afcVarsPlot: document.getElementById("afcVarsPlot"),
  afcVarsTable: document.getElementById("afcVarsTable"),
  afcEigTable: document.getElementById("afcEigTable"),
  ldaBubblePlot: document.getElementById("ldaBubblePlot"),
  ldaHeatmap: document.getElementById("ldaHeatmap"),
  ldaNetwork: document.getElementById("ldaNetwork"),
  ldaWordclouds: document.getElementById("ldaWordclouds"),
  ldaTopTerms: document.getElementById("ldaTopTerms"),
  ldaSegments: document.getElementById("ldaSegments"),
  ldaDocTopics: document.getElementById("ldaDocTopics"),
  ldaTopicWords: document.getElementById("ldaTopicWords"),
  simiGraph: document.getElementById("simiGraph")
};

const appState = {
  corpusFileName: null,
  exportsFolderName: null,
  outputDir: null,
  exportEntries: [],
  analysisHistory: [],
  activeAnalysisHistoryId: null,
  corpusText: "",
  afcStarredVariablesChoices: [],
  simiTermsChoices: [],
  simiTermsOrdered: [],
  simiTermsLoading: false,
  simiTermsError: null,
  objectUrls: [],
  bootstrapPromise: null,
  bootstrapReady: false,
  chdDendrogramFiles: new Map(),
  chdSegmentsByClass: new Map(),
  afcTermsZoom: 1,
  simiZoom: 1,
  expressionAnnotations: [],
  chdContextMenu: null,
  termSegmentsExport: null,
  termChartExport: null
};

const MORPHO_CATEGORIES = [
  "ADJ",
  "ADJ_DEM",
  "ADJ_IND",
  "ADJ_INT",
  "ADJ_NUM",
  "ADJ_POS",
  "ADJ_SUP",
  "ADV",
  "ADV_SUP",
  "ART_DEF",
  "ART_IND",
  "AUX",
  "CON",
  "NOM",
  "NOM_SUP",
  "ONO",
  "PRE",
  "PRO_DEM",
  "PRO_IND",
  "PRO_PER",
  "PRO_POS",
  "PRO_REL",
  "VER",
  "VER_SUP",
  "AUTRE_FORME"
];

const ANNOTATION_MORPHO_CATEGORIES = MORPHO_CATEGORIES.filter(
  (category) => category !== "AUTRE_FORME"
);

const progression = createProgressionController({
  dialog: runProgressDialog,
  titleElement: runProgressTitle,
  messageElement: runProgressMessage,
  progressBarElement: runProgressBar,
  progressValueElement: runProgressValue,
  mainProgressElement: progress,
  mainProgressLabelElement: progressLabel
});

const bootstrapProgression = createProgressionController({
  dialog: startupBootstrapDialog,
  titleElement: startupBootstrapTitle,
  messageElement: startupBootstrapMessage,
  progressBarElement: startupBootstrapBar,
  progressValueElement: startupBootstrapValue
});

function getTauriInvoke() {
  return window.__TAURI__?.core?.invoke ?? null;
}

async function openExternalUrl(url) {
  const safeUrl = String(url || "").trim();
  if (!safeUrl) return;

  const tauriInvoke = getTauriInvoke();
  if (!tauriInvoke) {
    window.open(safeUrl, "_blank", "noopener,noreferrer");
    return;
  }

  try {
    await tauriInvoke("open_external_url", { url: safeUrl });
  } catch (error) {
    log(`[error] Ouverture du lien externe impossible : ${error?.message || String(error)}`);
  }
}

async function revealInFileManager(path) {
  const safePath = String(path || "").trim();
  if (!safePath) return;

  const tauriInvoke = getTauriInvoke();
  if (!tauriInvoke) return;

  try {
    await tauriInvoke("reveal_in_file_manager", { path: safePath });
  } catch (error) {
    log(`[error] Impossible d'ouvrir l'emplacement de l'archive : ${error?.message || String(error)}`);
  }
}

function setDownloadResultsStatus(message, { isError = false } = {}) {
  if (!downloadResultsStatus) return;
  downloadResultsStatus.textContent = message;
  downloadResultsStatus.classList.toggle("is-error", isError);
}

function artifactDataToText(artifact) {
  if (!artifact) return "";
  if (artifact.encoding === "base64") {
    const bytes = decodeBase64ToBytes(artifact.data || "");
    return new TextDecoder("utf-8").decode(bytes);
  }
  return String(artifact.data || "");
}

function artifactDataToObjectUrl(artifact) {
  if (!artifact) return "";
  const bits = artifact.encoding === "base64" ? [decodeBase64ToBytes(artifact.data || "")] : [artifact.data || ""];
  const blob = new Blob(bits, { type: artifact.mimeType || "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  appState.objectUrls.push(url);
  return url;
}

function renderInlineMarkdown(text) {
  let html = String(text || "");
  html = html.replace(/`([^`]+)`/g, (_match, code) => `<code>${escapeHtml(code)}</code>`);
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
    const safeHref = String(href || "").replace(/"/g, "&quot;");
    return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
  return html;
}

async function renderMarkdownIntoContainer(container, markdownText, options = {}) {
  if (!container) return;

  const lines = String(markdownText || "").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let index = 0;

  const flushParagraph = (buffer) => {
    if (!buffer.length) return;
    blocks.push(`<p>${renderInlineMarkdown(buffer.join(" ").trim())}</p>`);
    buffer.length = 0;
  };

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push(`<h${level}>${renderInlineMarkdown(headingMatch[2])}</h${level}>`);
      index += 1;
      continue;
    }

    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      const alt = imageMatch[1] || "";
      const imagePath = imageMatch[2] || "";
      let imageHtml = `<p>${escapeHtml(alt || imagePath)}</p>`;
      const tauriInvoke = getTauriInvoke();
      if (tauriInvoke) {
        try {
          const asset = await tauriInvoke("read_help_file", { relativePath: imagePath });
          const src = artifactDataToObjectUrl(asset);
          imageHtml = `<figure class="markdown-figure"><img src="${src}" alt="${escapeHtml(alt)}" /><figcaption>${escapeHtml(alt)}</figcaption></figure>`;
        } catch (error) {
          imageHtml = `<p class="markdown-image-error">Image introuvable : ${escapeHtml(imagePath)}</p>`;
          log(`[error] Lecture image d'aide impossible (${imagePath}) : ${error?.message || String(error)}`);
        }
      }
      blocks.push(imageHtml);
      index += 1;
      continue;
    }

    if (/^>\s+/.test(trimmed)) {
      const quoteLines = [];
      while (index < lines.length && /^>\s+/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s+/, ""));
        index += 1;
      }
      blocks.push(`<blockquote>${renderInlineMarkdown(quoteLines.join(" "))}</blockquote>`);
      continue;
    }

    if (/^-\s+/.test(trimmed)) {
      const items = [];
      while (index < lines.length && /^-\s+/.test(lines[index].trim())) {
        items.push(`<li>${renderInlineMarkdown(lines[index].trim().replace(/^-\s+/, ""))}</li>`);
        index += 1;
      }
      blocks.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(`<li>${renderInlineMarkdown(lines[index].trim().replace(/^\d+\.\s+/, ""))}</li>`);
        index += 1;
      }
      blocks.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    const paragraph = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6})\s+/.test(lines[index].trim()) &&
      !/^-\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim()) &&
      !/^>\s+/.test(lines[index].trim()) &&
      !/^!\[/.test(lines[index].trim())
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    flushParagraph(paragraph);
  }

  container.innerHTML = blocks.join("\n");
}

async function loadHelpMarkdown(container, relativePath) {
  if (!container) return;
  const tauriInvoke = getTauriInvoke();
  if (!tauriInvoke) {
    container.innerHTML = `<p>Le chargement de <code>${escapeHtml(relativePath)}</code> est disponible dans Tauri.</p>`;
    return;
  }

  try {
    const artifact = await tauriInvoke("read_help_file", { relativePath });
    const markdownText = artifactDataToText(artifact);
    await renderMarkdownIntoContainer(container, markdownText, { relativePath });
  } catch (error) {
    container.innerHTML = `<p>Impossible de lire <code>${escapeHtml(relativePath)}</code> : ${escapeHtml(error?.message || String(error))}</p>`;
    log(`[error] Lecture aide impossible (${relativePath}) : ${error?.message || String(error)}`);
  }
}

function updateDownloadResultsState() {
  const hasResults = Boolean(appState.outputDir) && Array.isArray(appState.exportEntries) && appState.exportEntries.length > 0;
  if (downloadResultsBtn) {
    downloadResultsBtn.disabled = !hasResults;
  }
  if (!hasResults) {
    setDownloadResultsStatus("Le téléchargement se fait depuis chaque analyse lancée.", { isError: false });
  }
}

function getAnalysisKindLabel(analysisKind) {
  if (analysisKind === "lda") return "LDA";
  if (analysisKind === "simi") return "Similitudes";
  return "CHD";
}

function formatAnalysisDateTime(value) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  } catch (_error) {
    return "";
  }
}

function getAnalysisHistoryLabel(entry) {
  const kindLabel = getAnalysisKindLabel(entry?.analysisKind);
  const dateLabel = formatAnalysisDateTime(entry?.createdAt);
  return dateLabel ? `${kindLabel} · ${dateLabel}` : kindLabel;
}

function sanitizeFilenameSegment(value) {
  return String(value || "")
    .trim()
    .replace(/\.[^.]+$/, "")
    .replace(/[^\p{L}\p{N}_-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function getAnalysisHistoryArchiveBaseName(entry) {
  const corpusPart = sanitizeFilenameSegment(entry?.corpusName) || "iramuteq";
  const kindPart = sanitizeFilenameSegment(getAnalysisKindLabel(entry?.analysisKind)) || "analyse";
  const createdAt = entry?.createdAt ? new Date(entry.createdAt) : new Date();
  const datePart = Number.isNaN(createdAt.getTime())
    ? "resultats"
    : [
        createdAt.getFullYear(),
        String(createdAt.getMonth() + 1).padStart(2, "0"),
        String(createdAt.getDate()).padStart(2, "0"),
        String(createdAt.getHours()).padStart(2, "0"),
        String(createdAt.getMinutes()).padStart(2, "0")
      ].join("");
  return `${corpusPart}_${kindPart}_${datePart}`;
}

async function activateAnalysisHistoryEntry(entryId) {
  const entry = appState.analysisHistory.find((item) => item.id === entryId);
  if (!entry || !Array.isArray(entry.artifacts) || !entry.artifacts.length) {
    log("[error] Réouverture de l'analyse impossible : aucun export mémorisé.");
    return;
  }

  appState.activeAnalysisHistoryId = entry.id;
  appState.outputDir = entry.outputDir || null;

  const virtualFiles = entry.artifacts.map((artifact) =>
    createVirtualFileFromArtifact(artifact, entry.folderName || entry.jobId || entry.id)
  );

  await handleExportsFolderSelection(virtualFiles, entry.navigationTarget || "resultats_chd");
  renderAnalysisSteps(Array.isArray(entry.logs) ? entry.logs : []);
  renderAnalysisSummary(entry.summary || null);
  renderZipfChart(entry.summary || null);

  if (sidebarStatus) sidebarStatus.textContent = "";
  log(`[info] Résultats rechargés : ${getAnalysisHistoryLabel(entry)}.`);
  renderAnalysisHistory();
}

function renderAnalysisHistory() {
  if (!analysisHistory) return;

  analysisHistory.innerHTML = "";

  if (!Array.isArray(appState.analysisHistory) || !appState.analysisHistory.length) {
    const empty = document.createElement("p");
    empty.className = "muted analysis-history-empty";
    empty.textContent = "Les analyses lancées s'afficheront ici.";
    analysisHistory.appendChild(empty);
    return;
  }

  appState.analysisHistory.forEach((entry) => {
    const item = document.createElement("div");
    item.className = `analysis-history-item${entry.id === appState.activeAnalysisHistoryId ? " is-active" : ""}`;

    const mainButton = document.createElement("button");
    mainButton.type = "button";
    mainButton.className = "analysis-history-item-main";

    const title = document.createElement("span");
    title.className = "analysis-history-item-title";
    title.textContent = getAnalysisHistoryLabel(entry);

    const meta = document.createElement("span");
    meta.className = "analysis-history-item-meta";
    meta.textContent = entry.corpusName || "Corpus courant";

    mainButton.appendChild(title);
    mainButton.appendChild(meta);
    mainButton.addEventListener("click", () => {
      void activateAnalysisHistoryEntry(entry.id);
    });

    const downloadButton = document.createElement("button");
    downloadButton.type = "button";
    downloadButton.className = "secondary-button analysis-history-download";
    downloadButton.textContent = "Télécharger";
    downloadButton.addEventListener("click", () => {
      void downloadResultsArchive({
        outputDir: entry.outputDir,
        entryCount: Array.isArray(entry.artifacts) ? entry.artifacts.length : 0,
        archiveBaseName: getAnalysisHistoryArchiveBaseName(entry),
        pendingButton: downloadButton
      });
    });

    item.appendChild(mainButton);
    item.appendChild(downloadButton);
    analysisHistory.appendChild(item);
  });
}

function rememberAnalysisHistoryEntry(entry) {
  if (!entry || !Array.isArray(entry.artifacts) || !entry.artifacts.length) {
    return;
  }

  const normalizedEntry = {
    id: entry.id || entry.jobId || `${entry.analysisKind || "chd"}-${Date.now()}`,
    jobId: entry.jobId || null,
    analysisKind: entry.analysisKind || "chd",
    createdAt: entry.createdAt || new Date().toISOString(),
    corpusName: entry.corpusName || appState.corpusFileName || "",
    folderName: entry.folderName || entry.jobId || "exports",
    outputDir: entry.outputDir || null,
    navigationTarget: entry.navigationTarget || "resultats_chd",
    summary: entry.summary || null,
    logs: Array.isArray(entry.logs) ? entry.logs : [],
    artifacts: entry.artifacts
  };

  appState.analysisHistory = [
    normalizedEntry,
    ...appState.analysisHistory.filter((item) => item.id !== normalizedEntry.id)
  ];
  appState.activeAnalysisHistoryId = normalizedEntry.id;
  renderAnalysisHistory();
}

function splitCsvValues(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeStarredVariableName(value) {
  return String(value || "")
    .trim()
    .replace(/^\*/, "")
    .trim();
}

function extractStarredVariablesFromCorpusText(text) {
  const variables = new Map();
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const tokenPattern = /\*([A-Za-zÀ-ÖØ-öø-ÿ0-9][A-Za-zÀ-ÖØ-öø-ÿ0-9_-]*)/g;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("****")) return;

    const matches = [...trimmed.matchAll(tokenPattern)].map((match) => `*${match[1]}`);
    matches.forEach((token) => {
      const withoutStar = normalizeStarredVariableName(token);
      if (!withoutStar) return;
      const variableName = withoutStar.includes("_") ? withoutStar.split("_")[0] : withoutStar;
      if (!variableName) return;
      const key = variableName.toLowerCase();
      if (!variables.has(key)) {
        variables.set(key, variableName);
      }
    });
  });

  return [...variables.values()].sort((left, right) =>
    left.localeCompare(right, undefined, { sensitivity: "base" })
  );
}

function renderAfcStarredVariablesPicker(card, options = {}) {
  if (!card) return;

  const { resetSelection = false } = options;
  const hiddenInput = card.querySelector("[data-afc-starred-selected-input]");
  const select = card.querySelector("[data-afc-starred-available-select]");
  const list = card.querySelector("[data-afc-starred-selected-list]");
  if (!hiddenInput || !select || !list) return;

  const available = [...appState.afcStarredVariablesChoices];
  const allowedMap = new Map(available.map((value) => [value.toLowerCase(), value]));
  const currentSelection = splitCsvValues(hiddenInput.value)
    .map((value) => normalizeStarredVariableName(value))
    .filter(Boolean);

  let selected = currentSelection
    .map((value) => allowedMap.get(value.toLowerCase()) || null)
    .filter(Boolean);

  if (resetSelection) {
    selected = [];
  }

  hiddenInput.value = [...new Set(selected)].join(", ");

  select.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choisir une variable";
  select.appendChild(placeholder);

  available
    .filter((value) => !selected.some((selectedValue) => selectedValue.toLowerCase() === value.toLowerCase()))
    .forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });

  list.innerHTML = "";
  list.hidden = false;
  if (!available.length) {
    list.appendChild(createEmptyState("Aucune variable étoilée détectée dans le corpus."));
    hiddenInput.value = "";
    return;
  }

  if (!selected.length) {
    list.hidden = true;
    return;
  }

  selected.forEach((value) => {
    const chip = document.createElement("div");
    chip.className = "chip-item";

    const label = document.createElement("span");
    label.className = "chip-item-label";
    label.textContent = value;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "chip-item-remove";
    removeButton.setAttribute("aria-label", `Retirer ${value}`);
    removeButton.textContent = "×";
    removeButton.addEventListener("click", () => {
      hiddenInput.value = selected.filter((item) => item.toLowerCase() !== value.toLowerCase()).join(", ");
      renderAfcStarredVariablesPicker(card);
    });

    chip.appendChild(label);
    chip.appendChild(removeButton);
    list.appendChild(chip);
  });
}

function renderAfcStarredVariablesPickers(scope = document, options = {}) {
  scope
    .querySelectorAll("[data-afc-starred-variables-card]")
    .forEach((card) => renderAfcStarredVariablesPicker(card, options));
}

function resetSimiTermsState() {
  appState.simiTermsChoices = [];
  appState.simiTermsOrdered = [];
  appState.simiTermsLoading = false;
  appState.simiTermsError = null;
}

function syncSimiTermsChoicesFromChdStats(parsed) {
  resetSimiTermsState();

  if (!parsed || !Array.isArray(parsed.headers) || !Array.isArray(parsed.rows) || !parsed.rows.length) {
    return;
  }

  const termIndex = headerIndex(parsed.headers, ["terme", "forme"]);
  const frequencyIndex = headerIndex(parsed.headers, ["frequency", "occ_total", "occ_st", "eff_total"]);
  if (termIndex === -1 || frequencyIndex === -1) {
    return;
  }

  const termsMap = new Map();
  parsed.rows.forEach((row) => {
    const term = String(row[termIndex] || "").trim();
    if (!term) return;
    const frequency = Number.parseFloat(String(row[frequencyIndex] || "").replace(",", "."));
    const safeFrequency = Number.isFinite(frequency) ? frequency : 0;
    const existing = termsMap.get(term);
    if (!existing || safeFrequency > existing.frequency) {
      termsMap.set(term, {
        term,
        frequency: safeFrequency,
        label: `${term} (${Math.round(safeFrequency)})`
      });
    }
  });

  const choices = [...termsMap.values()].sort((left, right) => {
    if (right.frequency !== left.frequency) return right.frequency - left.frequency;
    return left.term.localeCompare(right.term, undefined, { sensitivity: "base" });
  });

  appState.simiTermsChoices = choices;
  appState.simiTermsOrdered = choices.map((choice) => choice.term);
}

function renderSimiTermsPicker(context, options = {}) {
  if (!context) return;
  const { resetSelection = false } = options;

  const hiddenInput = context.querySelector("[data-simi-terms-input]");
  const topTermsInput = context.querySelector("[data-simi-top-terms-input]");
  const meta = context.querySelector("[data-simi-terms-meta]");
  const list = context.querySelector("[data-simi-terms-list]");
  if (!hiddenInput || !topTermsInput || !meta || !list) return;

  list.innerHTML = "";

  const limit = Math.max(1, Number(topTermsInput.value) || 100);
  const choices = appState.simiTermsChoices.slice(0, limit);
  if (!choices.length) {
    meta.textContent = "Realisez d'abord une CHD pour alimenter les termes de similitudes.";
    list.appendChild(
      createEmptyState("Aucune CHD disponible. Lancez une CHD, puis revenez ici pour utiliser ses termes les plus fréquents.")
    );
    hiddenInput.value = "";
    return;
  }

  const currentSelection = splitCsvValues(hiddenInput.value);
  const allowedTerms = new Set(choices.map((choice) => choice.term));
  const selectedTerms = (resetSelection || !currentSelection.length
    ? choices.map((choice) => choice.term)
    : currentSelection).filter((term) => allowedTerms.has(term));

  hiddenInput.value = selectedTerms.join(", ");
  meta.textContent = `${selectedTerms.length} mot(s) retenu(s) sur ${choices.length} proposé(s) à partir des termes les plus fréquents de la CHD.`;

  if (!selectedTerms.length) {
    list.appendChild(createEmptyState("Aucun mot retenu. Le top des termes sera alors réappliqué par défaut."));
    return;
  }

  const choicesByTerm = new Map(choices.map((choice) => [choice.term, choice]));
  selectedTerms.forEach((term) => {
    const choice = choicesByTerm.get(term);
    if (!choice) return;

    const chip = document.createElement("div");
    chip.className = "selected-term-chip";

    const label = document.createElement("span");
    label.className = "selected-term-chip-label";
    label.textContent = choice.label;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "selected-term-chip-remove";
    removeButton.setAttribute("aria-label", `Exclure ${choice.term}`);
    removeButton.textContent = "×";
    removeButton.addEventListener("click", () => {
      hiddenInput.value = selectedTerms.filter((item) => item !== term).join(", ");
      renderSimiTermsPicker(context);
    });

    chip.appendChild(label);
    chip.appendChild(removeButton);
    list.appendChild(chip);
  });
}

function renderSimiTermsPickers(scope = document, options = {}) {
  scope.querySelectorAll("[data-simi-config-card]").forEach((card) => renderSimiTermsPicker(card, options));
}

function renderMorphoPicker(card) {
  if (!card) return;
  const hiddenInput = card.querySelector("[data-morpho-selected-input]");
  const select = card.querySelector("[data-morpho-available-select]");
  const list = card.querySelector("[data-morpho-selected-list]");
  if (!hiddenInput || !select || !list) return;

  const selected = splitCsvValues(hiddenInput.value).map((value) => value.toUpperCase());
  const uniqueSelected = [...new Set(selected)].filter((value) => MORPHO_CATEGORIES.includes(value));
  hiddenInput.value = uniqueSelected.join(", ");

  select.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choisir une catégorie";
  select.appendChild(placeholder);

  MORPHO_CATEGORIES.filter((category) => !uniqueSelected.includes(category)).forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  list.innerHTML = "";
  if (!uniqueSelected.length) {
    list.appendChild(createEmptyState("Aucune catégorie sélectionnée."));
    return;
  }

  uniqueSelected.forEach((category) => {
    const chip = document.createElement("div");
    chip.className = "chip-item";

    const label = document.createElement("span");
    label.className = "chip-item-label";
    label.textContent = category;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "chip-item-remove";
    removeButton.setAttribute("aria-label", `Retirer ${category}`);
    removeButton.textContent = "×";
    removeButton.addEventListener("click", () => {
      hiddenInput.value = uniqueSelected.filter((item) => item !== category).join(", ");
      renderMorphoPicker(card);
    });

    chip.appendChild(label);
    chip.appendChild(removeButton);
    list.appendChild(chip);
  });
}

function renderMorphoPickers(scope = document) {
  scope.querySelectorAll("[data-chd-morpho-card]").forEach((card) => renderMorphoPicker(card));
}

function renderLdaMorphoPicker(card) {
  if (!card) return;
  const hiddenInput = card.querySelector("[data-lda-morpho-selected-input]");
  const select = card.querySelector("[data-lda-morpho-available-select]");
  const list = card.querySelector("[data-lda-morpho-selected-list]");
  if (!hiddenInput || !select || !list) return;

  const selected = splitCsvValues(hiddenInput.value).map((value) => value.toUpperCase());
  const uniqueSelected = [...new Set(selected)].filter((value) => MORPHO_CATEGORIES.includes(value));
  hiddenInput.value = uniqueSelected.join(", ");

  select.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choisir une catégorie";
  select.appendChild(placeholder);

  MORPHO_CATEGORIES.filter((category) => !uniqueSelected.includes(category)).forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  list.innerHTML = "";
  if (!uniqueSelected.length) {
    list.appendChild(createEmptyState("Aucune catégorie sélectionnée."));
    return;
  }

  uniqueSelected.forEach((category) => {
    const chip = document.createElement("div");
    chip.className = "chip-item";

    const label = document.createElement("span");
    label.className = "chip-item-label";
    label.textContent = category;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "chip-item-remove";
    removeButton.setAttribute("aria-label", `Retirer ${category}`);
    removeButton.textContent = "×";
    removeButton.addEventListener("click", () => {
      hiddenInput.value = uniqueSelected.filter((item) => item !== category).join(", ");
      renderLdaMorphoPicker(card);
    });

    chip.appendChild(label);
    chip.appendChild(removeButton);
    list.appendChild(chip);
  });
}

function renderLdaMorphoPickers(scope = document) {
  scope.querySelectorAll("[data-lda-morpho-card]").forEach((card) => renderLdaMorphoPicker(card));
}

function renderClassificationModeCard(card) {
  if (!card) return;
  const hiddenInput = card.querySelector("#classificationMode, [data-source-id='classificationMode']");
  const radios = Array.from(card.querySelectorAll("[data-classification-radio]"));
  const rstFields = card.querySelector("[data-rst-fields]");
  if (!hiddenInput || !radios.length || !rstFields) return;

  const currentValue = hiddenInput.value === "double" ? "double" : "simple";
  hiddenInput.value = currentValue;
  radios.forEach((radio) => {
    radio.checked = radio.value === currentValue;
  });
  rstFields.hidden = currentValue !== "double";
  rstFields.style.display = currentValue === "double" ? "grid" : "none";
}

function renderClassificationModeCards(scope = document) {
  scope.querySelectorAll("[data-classification-mode-card]").forEach((card) => renderClassificationModeCard(card));
}

function buildAnalysesConfig(analysisKind = "chd") {
  switch (analysisKind) {
    case "lda":
      return {
        chd: false,
        afc: false,
        simi: false,
        lda: true
      };
    case "simi":
      return {
        chd: false,
        afc: false,
        simi: true,
        lda: false
      };
    case "chd":
    default:
      return {
        chd: true,
        afc: true,
        simi: false,
        lda: false
      };
  }
}

function computeDendrogramSizing() {
  const paneWidth = Math.round(resultContainers.chdDendrogramme?.getBoundingClientRect().width || 0);
  const viewportWidth = Math.round(window.innerWidth || 0);
  const baseWidth = paneWidth > 0 ? paneWidth : Math.max(960, viewportWidth - 180);
  const displayWidth = Math.max(880, Math.min(1600, baseWidth));
  const pixelRatio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const exportWidth = Math.max(1200, Math.min(2400, Math.round(displayWidth * pixelRatio)));
  const exportHeight = Math.max(620, Math.round(exportWidth * 0.52));

  return {
    displayWidth,
    exportWidth,
    exportHeight
  };
}

function syncDendrogramSizing() {
  const { displayWidth } = computeDendrogramSizing();
  resultContainers.chdDendrogramme?.style.setProperty("--dendrogram-display-width", `${displayWidth}px`);
}

function buildJobConfig(analysisKind = "chd") {
  const simiThresholdValue = Number(document.getElementById("simiThreshold").value);
  const dendrogramSizing = computeDendrogramSizing();
  const expressionAnnotations = appState.expressionAnnotations.map((entry) => ({
    dic_mot: normalizeAnnotationSelectionValue(entry.dic_mot),
    dic_norm: normalizeAnnotationSelectionValue(entry.dic_norm),
    dic_morpho: String(entry.dic_morpho || "").trim()
  }));

  return {
    analyses: buildAnalysesConfig(analysisKind),
    segment_size: Number(document.getElementById("segmentSize").value) || 40,
    segmenter_sur_ponctuation_forte: document.getElementById("useStrongPunctuation").checked,
    min_docfreq: Number(document.getElementById("minFreq").value) || 1,
    max_p: Number(document.getElementById("maxP").value) || 0.05,
    filtrer_affichage_pvalue: document.getElementById("filterPvalue").checked,
    k_iramuteq: Number(document.getElementById("kIramuteq").value) || 3,
    iramuteq_max_formes: Number(document.getElementById("iramuteqMaxFormes").value) || 20000,
    iramuteq_mincl_mode: document.getElementById("minclMode").value,
    iramuteq_mincl: Number(document.getElementById("minclManual").value) || 1,
    iramuteq_classif_mode: document.getElementById("classificationMode").value,
    iramuteq_rst1: Number(document.getElementById("rst1").value) || 12,
    iramuteq_rst2: Number(document.getElementById("rst2").value) || 14,
    iramuteq_svd_method: document.getElementById("svdMethod").value,
    iramuteq_stats_mode: document.getElementById("statsMode").value,
    source_dictionnaire: document.getElementById("dictionarySource").value,
    lexique_utiliser_lemmes: document.getElementById("useLemmas").checked,
    expression_utiliser_dictionnaire: document.getElementById("useExpressions").checked,
    utiliser_add_expression: document.getElementById("useAnnotationExpressions").checked,
    expression_annotations: expressionAnnotations,
    nettoyage_caracteres: document.getElementById("cleanChars").checked,
    supprimer_ponctuation: document.getElementById("removePunctuation").checked,
    supprimer_chiffres: document.getElementById("removeDigits").checked,
    supprimer_apostrophes: document.getElementById("removeApostrophes").checked,
    remplacer_tirets_espaces: document.getElementById("replaceHyphen").checked,
    retirer_stopwords: document.getElementById("removeStopwords").checked,
    filtrage_morpho: document.getElementById("morphoFilter").checked,
    pos_lexique_a_conserver: splitCsvValues(document.getElementById("posKeep").value),
    morpho_exclure_etre_verbe: document.getElementById("excludeEtre").checked,
    morpho_conserver_hors_lexique: document.getElementById("keepUnknownForms").checked,
    afc_reduire_chevauchement: document.getElementById("reduceOverlap").checked,
    afc_taille_mots: document.getElementById("wordSizeMode").value,
    afc_variables_etoilees: splitCsvValues(document.getElementById("afcStarredVariables").value),
    top_n: Number(document.getElementById("topNWords").value) || 20,
    simi_method: document.getElementById("simiMethod").value,
    simi_seuil: Number.isFinite(simiThresholdValue) && simiThresholdValue > 0 ? simiThresholdValue : null,
    simi_top_terms: Number(document.getElementById("simiTopTerms").value) || 100,
    simi_terms_selected: splitCsvValues(document.getElementById("simiTermsSelected").value),
    simi_max_tree: document.getElementById("simiMaxTree").checked,
    simi_layout: document.getElementById("simiLayout").value,
    simi_edge_labels: document.getElementById("simiEdgeLabels").checked,
    simi_edge_width_by_index: document.getElementById("simiEdgeWidth").checked,
    simi_vertex_text_by_freq: document.getElementById("simiVertexText").checked,
    simi_communities: document.getElementById("simiCommunities").checked,
    simi_community_method: document.getElementById("simiCommunityMethod").value,
    simi_halo: document.getElementById("simiHalo").checked,
    chd_dendrogram_width_px: dendrogramSizing.exportWidth,
    chd_dendrogram_height_px: dendrogramSizing.exportHeight,
    lda_mode_unite: document.getElementById("language").value,
    lda_k: Math.max(2, Number(document.getElementById("ldaK").value) || 6),
    lda_n_terms: Math.max(3, Number(document.getElementById("ldaTerms").value) || 8),
    lda_min_df: Math.max(1, Number(document.getElementById("ldaMinDf").value) || 1),
    lda_max_df: Math.min(1, Math.max(0.01, Number(document.getElementById("ldaMaxDf").value) || 0.95)),
    lda_max_iter: Math.max(1, Number(document.getElementById("ldaMaxIter").value) || 100),
    lda_ngram_range: splitCsvValues(document.getElementById("ldaNgramRange").value),
    lda_segment_size: Number(document.getElementById("ldaSegmentSize").value) || 40,
    lda_segmenter_sur_ponctuation_forte: document.getElementById("ldaStrongPunctuation").checked,
    lda_retirer_stopwords: document.getElementById("ldaStopwords").checked,
    lda_filtrage_morpho: document.getElementById("ldaMorpho").checked,
    lda_pos_keep: splitCsvValues(document.getElementById("ldaPosKeep").value)
  };
}

function decodeBase64ToBytes(base64Value) {
  const binary = window.atob(base64Value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function createVirtualFileFromArtifact(artifact, folderName) {
  const bits = artifact.encoding === "base64" ? [decodeBase64ToBytes(artifact.data)] : [artifact.data];
  const filename = artifact.relativePath.split("/").pop() || artifact.relativePath;
  const file = new File(bits, filename, {
    type: artifact.mimeType || "application/octet-stream"
  });
  Object.defineProperty(file, "virtualRelativePath", {
    value: `${folderName}/${artifact.relativePath}`,
    configurable: true
  });
  return file;
}

async function ensureDependenciesReady() {
  if (appState.bootstrapPromise) {
    return appState.bootstrapPromise;
  }

  const tauriInvoke = getTauriInvoke();
  if (!tauriInvoke) {
    appState.bootstrapReady = true;
    return Promise.resolve({ success: true, message: "Bootstrap ignore hors Tauri." });
  }

  appState.bootstrapPromise = (async () => {
    bootstrapProgression.open(
      "Vérification de l'environnement",
      "Vérification des dépendances R et Python nécessaires au lancement."
    );
    bootstrapProgression.set(8, "Analyse des dépendances...");
    if (sidebarStatus) sidebarStatus.textContent = "Vérification des dépendances";
    log("[info] Vérification des dépendances R et Python nécessaires au lancement.");

    try {
      bootstrapProgression.set(42, "Installation des dépendances manquantes si nécessaire...");
      const payload = await tauriInvoke("bootstrap_dependencies");
      if (payload.success) {
        appState.bootstrapReady = true;
        if (Array.isArray(payload.installedNow) && payload.installedNow.length) {
          log(`[info] Dépendances installées : ${payload.installedNow.join(", ")}`);
        } else {
          log("[info] Dépendances R/Python déjà disponibles.");
        }
        if (payload.library) {
          log(`[info] Librairie R utilisateur: ${payload.library}`);
        }
        if (payload.rscript) {
          log(`[info] Rscript détecté : ${payload.rscript}`);
        }
        if (payload.python) {
          log(`[info] Python détecté : ${payload.python}`);
        }
        if (sidebarStatus) sidebarStatus.textContent = "";
        bootstrapProgression.set(100, "Environnement prêt.");
      } else {
        appState.bootstrapReady = false;
        appState.bootstrapPromise = null;
        if (sidebarStatus) sidebarStatus.textContent = "Packages incomplets";
        log(`[error] ${payload.message || "Bootstrap des packages en échec."}`);
        if (Array.isArray(payload.missingAfter) && payload.missingAfter.length) {
          log(`[error] Dépendances encore manquantes : ${payload.missingAfter.join(", ")}`);
        }
        if (payload.rscript) {
          log(`[info] Rscript utilisé : ${payload.rscript}`);
        }
        if (payload.python) {
          log(`[info] Python utilisé : ${payload.python}`);
        }
        bootstrapProgression.set(100, "Certaines dépendances restent manquantes.");
      }
      setTimeout(() => bootstrapProgression.close(), 320);
      return payload;
    } catch (error) {
      appState.bootstrapReady = false;
      appState.bootstrapPromise = null;
      if (sidebarStatus) sidebarStatus.textContent = "Packages incomplets";
      log(`[error] Bootstrap impossible : ${error?.message || String(error)}`);
      bootstrapProgression.set(100, "Échec du bootstrap de démarrage.");
      setTimeout(() => bootstrapProgression.close(), 400);
      return { success: false, message: error?.message || String(error) };
    }
  })();

  return appState.bootstrapPromise;
}

function log(message) {
  logs.textContent += `\n${message}`;
  logs.scrollTop = logs.scrollHeight;
}

function activateTopTab(target) {
  topNavLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.tabTarget === target);
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === target;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

function activateChdSubTab(target) {
  chdSubNavLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.subtabTarget === target);
  });

  chdSubPanels.forEach((panel) => {
    const isActive = panel.dataset.subpanel === target;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

function activateLdaSubTab(target) {
  ldaSubNavLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.ldaSubtabTarget === target);
  });

  ldaSubPanels.forEach((panel) => {
    const isActive = panel.dataset.ldaSubpanel === target;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

function normalizePath(value) {
  return value.replace(/\\/g, "/").replace(/^\/+/, "").toLowerCase();
}

function getRelativePath(file) {
  const rawPath = file.virtualRelativePath || file.webkitRelativePath || file.name;
  const parts = rawPath.replace(/\\/g, "/").split("/");
  return parts.length > 1 ? parts.slice(1).join("/") : parts[0];
}

function getFileSizeLabel(file) {
  const sizeKo = Math.max(1, Math.round(file.size / 1024));
  return `${sizeKo} Ko`;
}

function getArchiveBaseName() {
  const rawName = String(appState.corpusFileName || "").trim();
  if (rawName) {
    return rawName.replace(/\.[^.]+$/, "") || rawName;
  }
  return appState.exportsFolderName || "iramuteq-resultats";
}

function getSubcorpusFileName({ term = "", classLabel = "", scope = "classe" } = {}) {
  const corpusBaseName = getArchiveBaseName();
  const normalizedTerm = String(term || "").trim() || "forme";
  const normalizedClass = String(classLabel || "").trim();
  if (scope === "classes") {
    return `${corpusBaseName}_sous-corpus_${normalizedTerm}_toutes-les-classes.txt`;
  }
  if (normalizedClass) {
    return `${corpusBaseName}_sous-corpus_${normalizedTerm}_classe-${normalizedClass}.txt`;
  }
  return `${corpusBaseName}_sous-corpus_${normalizedTerm}.txt`;
}

async function downloadResultsArchive({ outputDir, entryCount = 0, archiveBaseName, pendingButton = null } = {}) {
  if (!outputDir || !entryCount) {
    log("[error] Aucun résultat disponible à télécharger.");
    setDownloadResultsStatus("Aucun résultat n'est disponible pour créer l'archive.", { isError: true });
    return;
  }

  const tauriInvoke = getTauriInvoke();
  if (!tauriInvoke) {
    log("[error] Le téléchargement des résultats n'est disponible que dans Tauri.");
    setDownloadResultsStatus("Cette action n'est disponible que dans l'application Tauri.", { isError: true });
    return;
  }

  const button = pendingButton instanceof HTMLButtonElement ? pendingButton : downloadResultsBtn;
  const defaultLabel = button?.textContent || "Télécharger";

  try {
    if (button) {
      button.disabled = true;
      button.textContent = "Préparation...";
    }
    if (sidebarStatus) sidebarStatus.textContent = "Préparation de l'archive";
    setDownloadResultsStatus("Création de l'archive des résultats en cours...", { isError: false });
    const safeArchiveBaseName = String(archiveBaseName || "").trim() || "iramuteq-resultats";
    log(`[info] Préparation de l'archive des résultats (${entryCount} fichier(s)).`);

    try {
      const payload = await tauriInvoke("save_results_archive", {
        outputDir,
        archiveName: `${safeArchiveBaseName}.zip`
      });
      if (sidebarStatus) sidebarStatus.textContent = "Archive enregistrée";
      setDownloadResultsStatus(`Archive enregistrée : ${payload.savedPath || payload.filename}`, { isError: false });
      log(`[info] Archive des résultats enregistrée : ${payload.savedPath || payload.filename}`);
      await revealInFileManager(payload.savedPath || payload.filename);
      log("[info] Emplacement de l'archive ouvert dans le gestionnaire de fichiers.");
    } catch (nativeError) {
      log("[info] Enregistrement natif indisponible, tentative de téléchargement direct.");
      const payload = await tauriInvoke("download_results_archive", {
        outputDir,
        archiveName: `${safeArchiveBaseName}.zip`
      });
      const bytes = decodeBase64ToBytes(payload.data);
      const blob = new Blob([bytes], { type: payload.mimeType || "application/zip" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = payload.filename || `${safeArchiveBaseName}.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      if (sidebarStatus) sidebarStatus.textContent = "Archive préparée";
      setDownloadResultsStatus(
        `Le navigateur a préparé l'archive ${payload.filename || `${safeArchiveBaseName}.zip`}. Vérifie ton dossier Téléchargements.`,
        { isError: false }
      );
      log(`[info] Archive des résultats préparée : ${payload.filename || `${safeArchiveBaseName}.zip`}`);
      log(`[info] Cause du fallback : ${nativeError?.message || String(nativeError)}`);
    }
  } catch (error) {
    if (sidebarStatus) sidebarStatus.textContent = "Échec du téléchargement";
    setDownloadResultsStatus(`Téléchargement impossible : ${error?.message || String(error)}`, { isError: true });
    log(`[error] Téléchargement des résultats impossible : ${error?.message || String(error)}`);
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = defaultLabel;
    }
    updateDownloadResultsState();
  }
}

function getChi2ChartFileName(term = "") {
  const corpusBaseName = getArchiveBaseName();
  const normalizedTerm = String(term || "").trim() || "forme";
  return `${corpusBaseName}_chi2_${normalizedTerm}_classes.png`;
}

function setTermSegmentsSaveStatus(message, { isError = false } = {}) {
  if (!termSegmentsStatus) return;
  termSegmentsStatus.textContent = message || "";
  termSegmentsStatus.classList.toggle("is-error", isError);
}

function setTermSegmentsExportState({ segments = [], filename = "", visible = false } = {}) {
  const cleanSegments = Array.isArray(segments)
    ? segments
        .map((segment) => String(segment || "").trim())
        .filter(Boolean)
    : [];

  appState.termSegmentsExport = visible
    ? {
        segments: cleanSegments,
        filename: String(filename || "").trim()
      }
    : null;

  if (termSegmentsFooter) {
    termSegmentsFooter.hidden = !visible && !appState.termChartExport?.visible;
  }

  if (buildSubcorpusBtn) {
    buildSubcorpusBtn.hidden = !visible;
    buildSubcorpusBtn.disabled = !visible || !cleanSegments.length;
  }

  setTermSegmentsSaveStatus("");
}

function setTermChartExportState({ visible = false, filename = "" } = {}) {
  appState.termChartExport = visible
    ? {
        visible: true,
        filename: String(filename || "").trim()
      }
    : null;

  if (saveChi2PngBtn) {
    saveChi2PngBtn.hidden = !visible;
    saveChi2PngBtn.disabled = !visible;
  }

  if (termSegmentsFooter) {
    termSegmentsFooter.hidden = !visible && !appState.termSegmentsExport;
  }

  setTermSegmentsSaveStatus("");
}

function buildSubcorpusContent(segments) {
  if (!Array.isArray(segments)) return "";
  return segments
    .map((segment) => String(segment || "").trim())
    .filter(Boolean)
    .join("\n\n");
}

function clearObjectUrls() {
  appState.objectUrls.forEach((url) => URL.revokeObjectURL(url));
  appState.objectUrls = [];
}

function clearContainer(container) {
  container.innerHTML = "";
}

function createObjectUrl(file) {
  const url = URL.createObjectURL(file);
  appState.objectUrls.push(url);
  return url;
}

function createEmptyState(message) {
  const wrapper = document.createElement("div");
  wrapper.className = "empty-state";
  wrapper.textContent = message;
  return wrapper;
}

function renderResults(files) {
  appState.exportEntries = files;
  updateDownloadResultsState();
  if (Array.isArray(files) && files.length > 0) {
    setDownloadResultsStatus("Les résultats sont prêts. Chaque analyse lancée peut être téléchargée depuis sa ligne.", {
      isError: false
    });
  }
}

function normalizeAnnotationApostrophes(value) {
  return String(value || "").replace(/[’`´ʼʹ]/g, "'");
}

function normalizeAnnotationSelectionValue(value) {
  return normalizeAnnotationApostrophes(String(value || "").trim().toLowerCase());
}

function buildAnnotationNormValue(value) {
  return normalizeAnnotationSelectionValue(value)
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_]/gu, "");
}

function normalizeAnnotationMorphoValue(value) {
  const normalized = String(value || "").trim().toUpperCase();
  if (!normalized) {
    return "";
  }
  if (normalized === "AUTRE_FORME") {
    return "";
  }
  return ANNOTATION_MORPHO_CATEGORIES.includes(normalized) ? normalized : "";
}

function populateAnnotationMorphoOptions() {
  if (!(annotationMorpho instanceof HTMLSelectElement)) return;

  const currentValue = normalizeAnnotationMorphoValue(annotationMorpho.value);
  annotationMorpho.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choisir une catégorie (optionnel)";
  annotationMorpho.appendChild(placeholder);

  ANNOTATION_MORPHO_CATEGORIES.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    annotationMorpho.appendChild(option);
  });

  annotationMorpho.value = currentValue;
}

function escapeAnnotationRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sortAnnotationEntries(entries) {
  return [...entries].sort((left, right) => left.dic_mot.localeCompare(right.dic_mot, undefined, { sensitivity: "base" }));
}

function updateAnnotationSelectionFields(value) {
  const selectedText = String(value || "").trim();
  if (!selectedText) return;
  if (annotationSelection) annotationSelection.value = selectedText;
  if (annotationNorm) annotationNorm.value = buildAnnotationNormValue(selectedText);
}

function getAnnotationSelectionFromTextarea() {
  if (!(annotationCorpusText instanceof HTMLTextAreaElement)) return "";
  const start = annotationCorpusText.selectionStart ?? 0;
  const end = annotationCorpusText.selectionEnd ?? 0;
  if (end <= start) return "";
  return annotationCorpusText.value.slice(start, end).trim();
}

function renderAnnotationDictionaryTable() {
  if (!annotationDictTable) return;
  if (!appState.expressionAnnotations.length) {
    clearContainer(annotationDictTable);
    annotationDictTable.appendChild(createEmptyState("Aucune entrée annotée."));
    return;
  }

  renderTable(
    annotationDictTable,
    {
      headers: ["dic_mot", "dic_norm", "dic_morpho"],
      rows: appState.expressionAnnotations.map((entry) => [
        entry.dic_mot,
        entry.dic_norm,
        entry.dic_morpho || ""
      ])
    },
    {
      title: "Dictionnaire d'expressions (session)",
      maxRows: 300,
      onCellClick: ({ row }) => ({
        clickable: true,
        onClick: () => {
          fillAnnotationEditor({
            dic_mot: row[0],
            dic_norm: row[1],
            dic_morpho: row[2]
          });
          log(`[info] Entrée chargée dans l'éditeur : ${row[0]}`);
        }
      })
    }
  );
}

function renderAnnotationPreview() {
  if (!annotationCorpusColored) return;
  const text = annotationCorpusText?.value ?? appState.corpusText ?? "";

  clearContainer(annotationCorpusColored);

  if (!text.trim()) {
    annotationCorpusColored.textContent = "Aucun texte à annoter pour le moment.";
    return;
  }

  if (!appState.expressionAnnotations.length) {
    annotationCorpusColored.textContent = text;
    return;
  }

  const entries = sortAnnotationEntries(appState.expressionAnnotations)
    .map((entry) => entry.dic_mot)
    .filter(Boolean)
    .sort((left, right) => right.length - left.length);

  let html = escapeHtml(text);
  entries.forEach((entry) => {
    const normalized = normalizeAnnotationApostrophes(entry);
    const escaped = escapeAnnotationRegex(normalized).replace(/'/g, "['’`´ʼʹ]");
    const regex = new RegExp(`(?<![\\p{L}\\p{N}_])(${escaped})(?![\\p{L}\\p{N}_])`, "giu");
    html = html.replace(regex, "<span class=\"highlight\">$1</span>");
  });

  annotationCorpusColored.innerHTML = html;
}

function fillAnnotationEditor(entry = {}) {
  if (annotationSelection) annotationSelection.value = String(entry.dic_mot || "");
  if (annotationNorm) annotationNorm.value = String(entry.dic_norm || "");
  if (annotationMorpho) annotationMorpho.value = normalizeAnnotationMorphoValue(entry.dic_morpho);
  if (annotationRemoveKey) annotationRemoveKey.value = String(entry.dic_mot || "");
}

function setAnnotationSaveStatus(message, { isError = false } = {}) {
  if (!annotationSaveStatus) return;
  annotationSaveStatus.textContent = message;
  annotationSaveStatus.classList.toggle("is-error", isError);
}

function setAnnotationEntries(entries, { imported = false, persist = true } = {}) {
  const dedupedEntries = new Map();
  entries
    .map((entry) => ({
      dic_mot: normalizeAnnotationSelectionValue(entry.dic_mot),
      dic_norm: normalizeAnnotationSelectionValue(entry.dic_norm),
      dic_morpho: normalizeAnnotationMorphoValue(entry.dic_morpho)
    }))
    .filter((entry) => entry.dic_mot && entry.dic_norm)
    .forEach((entry) => {
      dedupedEntries.set(entry.dic_mot, entry);
    });

  appState.expressionAnnotations = sortAnnotationEntries([...dedupedEntries.values()]);

  renderAnnotationDictionaryTable();
  try {
    renderAnnotationPreview();
  } catch (error) {
    log(`[error] Prévisualisation d'annotation indisponible : ${error?.message || String(error)}`);
  }

  if (imported) {
    log(`[info] Dictionnaire d'annotation importé : ${appState.expressionAnnotations.length} entrée(s).`);
  }

  if (persist) {
    void persistAnnotationEntries();
  }
}

function parseAnnotationCsv(text) {
  const parsed = parseCsv(text);
  if (!parsed.headers.length) return [];

  const normalizedHeaders = parsed.headers.map((header) => String(header || "").trim().toLowerCase());
  const motIndex = normalizedHeaders.indexOf("dic_mot");
  const normIndex = normalizedHeaders.indexOf("dic_norm");
  const morphoIndex = normalizedHeaders.indexOf("dic_morpho");
  if (motIndex === -1 || normIndex === -1) {
    throw new Error("Colonnes attendues: dic_mot et dic_norm.");
  }

  return parsed.rows
    .map((row) => ({
      dic_mot: row[motIndex] || "",
      dic_norm: row[normIndex] || "",
      dic_morpho: morphoIndex === -1 ? "" : normalizeAnnotationMorphoValue(row[morphoIndex])
    }))
    .filter((entry) => String(entry.dic_mot || "").trim() && String(entry.dic_norm || "").trim());
}

function buildAnnotationCsvContent() {
  const rows = [["dic_mot", "dic_norm", "dic_morpho"]];
  appState.expressionAnnotations.forEach((entry) => {
    rows.push([entry.dic_mot, entry.dic_norm, entry.dic_morpho || ""]);
  });

  return rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell || "").replaceAll("\"", "\"\"")}"`)
        .join(";")
    )
    .join("\n");
}

async function persistAnnotationEntries() {
  const tauriInvoke = getTauriInvoke();
  if (!tauriInvoke) return;

  try {
    const payload = await tauriInvoke("write_annotation_dictionary_file", {
      content: buildAnnotationCsvContent()
    });
    log(`[info] Dictionnaire d'annotation sauvegardé : ${payload.entriesCount} entrée(s).`);
    setAnnotationSaveStatus(`Fichier enregistré dans Application Support : ${payload.path}`);
  } catch (error) {
    log(`[error] Sauvegarde du dictionnaire d'annotation impossible : ${error?.message || String(error)}`);
    setAnnotationSaveStatus(
      `Sauvegarde impossible : ${error?.message || String(error)}`,
      { isError: true }
    );
  }
}

async function resetAnnotationEntriesOnStartup() {
  const tauriInvoke = getTauriInvoke();
  if (!tauriInvoke) return;

  try {
    const payload = await tauriInvoke("reset_annotation_dictionary_file");
    appState.expressionAnnotations = [];
    renderAnnotationDictionaryTable();
    renderAnnotationPreview();
    fillAnnotationEditor({});
    setAnnotationSaveStatus(`Le dictionnaire utilisateur sera enregistré ici : ${payload.path}`);
    if (payload?.removed) {
      log("[info] Dictionnaire utilisateur add_expression_fr.csv réinitialisé au démarrage.");
    }
  } catch (error) {
    log(`[error] Réinitialisation du dictionnaire d'annotation impossible : ${error?.message || String(error)}`);
    setAnnotationSaveStatus(
      `Initialisation du dictionnaire impossible : ${error?.message || String(error)}`,
      { isError: true }
    );
  }
}

function renderImage(container, file, altText) {
  clearContainer(container);

  if (!file) {
    container.appendChild(createEmptyState("Aucun fichier image disponible."));
    return;
  }

  const image = document.createElement("img");
  image.className = "result-image";
  image.alt = altText;
  image.src = createObjectUrl(file);
  container.appendChild(image);
  if (container === resultContainers.afcTermsPlot) {
    applyAfcTermsZoom();
  }
  if (container === resultContainers.simiGraph) {
    applySimiZoom();
  }
}

function renderImageGallery(container, items, emptyMessage, options = {}) {
  clearContainer(container);
  const { onImageClick = null } = options;

  if (!items.length) {
    container.appendChild(createEmptyState(emptyMessage));
    return;
  }

  const gallery = document.createElement("div");
  gallery.className = "result-gallery";

  items.forEach(({ title, file }) => {
    const card = document.createElement("article");
    card.className = "result-gallery-item";

    const heading = document.createElement("h4");
    heading.textContent = title;
    card.appendChild(heading);

    const image = document.createElement("img");
    image.alt = title;
    image.src = createObjectUrl(file);
    if (typeof onImageClick === "function") {
      image.classList.add("is-clickable");
      image.addEventListener("click", () => onImageClick({ title, file, src: image.src }));
    }
    card.appendChild(image);

    gallery.appendChild(card);
  });

  container.appendChild(gallery);
}

function renderSelectableChdDendrogram() {
  const selectedValue = chdDendrogramSelect?.value || "iramuteq";
  const file = appState.chdDendrogramFiles.get(selectedValue) || null;
  const altText = selectedValue === "factoextra" ? "Dendrogramme CHD factoextra" : "Dendrogramme CHD IRaMuTeQ";
  syncDendrogramSizing();
  renderImage(resultContainers.chdDendrogramme, file, altText);
}

function openImagePreview(title, src, kicker = "Résultat") {
  if (imagePreviewKicker) {
    imagePreviewKicker.textContent = kicker;
  }
  if (imagePreviewTitle) {
    imagePreviewTitle.textContent = title;
  }
  if (imagePreviewContent) {
    imagePreviewContent.innerHTML = "";
    const image = document.createElement("img");
    image.src = src;
    image.alt = title;
    imagePreviewContent.appendChild(image);
  }
  if (imagePreviewDialog && !imagePreviewDialog.open) {
    if (typeof imagePreviewDialog.showModal === "function") {
      imagePreviewDialog.showModal();
    } else if (typeof imagePreviewDialog.show === "function") {
      imagePreviewDialog.show();
    }
  }
}

function closeImagePreview() {
  if (imagePreviewDialog?.open) {
    imagePreviewDialog.close();
  }
  if (imagePreviewContent) {
    imagePreviewContent.innerHTML = "";
  }
}

function applySimiZoom() {
  if (simiZoomValue) {
    simiZoomValue.textContent = `${Math.round(appState.simiZoom * 100)}%`;
  }

  const media = resultContainers.simiGraph?.querySelector(".embedded-frame, .result-image");
  if (!(media instanceof HTMLElement)) return;

  media.style.width = `${Math.round(appState.simiZoom * 100)}%`;
  media.style.maxWidth = "none";
}

function setSimiZoom(nextZoom) {
  const zoom = Math.min(3, Math.max(0.4, Number(nextZoom) || 1));
  appState.simiZoom = zoom;
  applySimiZoom();
}

function applyAfcTermsZoom() {
  const container = resultContainers.afcTermsPlot;
  const media = resultContainers.afcTermsPlot?.querySelector(".result-image");
  if (!(media instanceof HTMLElement) || !(container instanceof HTMLElement)) return;

  const containerWidth = Math.max(0, Math.round(container.getBoundingClientRect().width || 0));
  const baseWidth = Math.max(320, Math.min(containerWidth || 800, 800));
  const targetWidth = Math.round(baseWidth * appState.afcTermsZoom);

  media.style.width = `${targetWidth}px`;
  media.style.maxWidth = "none";
  media.style.margin = "0 auto";
}

function setAfcTermsZoom(nextZoom) {
  const zoom = Math.min(3, Math.max(0.4, Number(nextZoom) || 1));
  appState.afcTermsZoom = zoom;
  applyAfcTermsZoom();
}

function openTermSegmentsDialog(classLabel, term) {
  const normalizedClass = normalizeClassValue(classLabel);
  const normalizedTerm = String(term || "").trim();
  const segments = (appState.chdSegmentsByClass.get(normalizedClass) || [])
    .filter((segment) => segmentContainsTerm(segment, normalizedTerm))
    .slice(0, 300);
  const filename = getSubcorpusFileName({
    term: normalizedTerm,
    classLabel: normalizedClass,
    scope: "classe"
  });

  if (termSegmentsKicker) {
    termSegmentsKicker.textContent = "Segments trouvés";
  }

  if (termSegmentsTitle) {
    termSegmentsTitle.textContent = `Classe ${normalizedClass} - forme: ${normalizedTerm}`;
  }

  if (termSegmentsMeta) {
    termSegmentsMeta.textContent = segments.length
      ? `Segments trouvés : ${segments.length}`
      : "Aucun segment trouvé pour cette forme dans la classe sélectionnée.";
  }

  if (termSegmentsList) {
    termSegmentsList.innerHTML = "";

    if (!appState.chdSegmentsByClass.size) {
      termSegmentsList.appendChild(
        createEmptyState("Le fichier segments_par_classe.txt est absent ou vide dans les exports.")
      );
    } else if (!segments.length) {
      termSegmentsList.appendChild(
        createEmptyState("Aucun segment trouvé pour cette forme dans la classe sélectionnée.")
      );
    } else {
      segments.forEach((segment) => {
        const paragraph = document.createElement("p");
        paragraph.className = "segment-popup-item";
        paragraph.innerHTML = highlightSegmentTerm(segment, normalizedTerm);
        termSegmentsList.appendChild(paragraph);
      });
    }
  }

  setTermSegmentsExportState({
    segments,
    filename,
    visible: true
  });

  if (termSegmentsDialog && !termSegmentsDialog.open) {
    if (typeof termSegmentsDialog.showModal === "function") {
      termSegmentsDialog.showModal();
    } else if (typeof termSegmentsDialog.show === "function") {
      termSegmentsDialog.show();
    }
  }
}

function closeTermSegmentsDialog() {
  setTermSegmentsExportState();
  setTermChartExportState();
  if (termSegmentsDialog?.open) {
    termSegmentsDialog.close();
  }
}

async function saveCurrentSubcorpus() {
  const exportState = appState.termSegmentsExport;
  const content = buildSubcorpusContent(exportState?.segments || []);
  if (!content) {
    setTermSegmentsSaveStatus("Aucun segment n'est disponible pour construire le sous-corpus.", { isError: true });
    return;
  }

  const filename = String(exportState?.filename || "sous-corpus.txt").trim() || "sous-corpus.txt";
  const tauriInvoke = getTauriInvoke();

  try {
    if (buildSubcorpusBtn) {
      buildSubcorpusBtn.disabled = true;
      buildSubcorpusBtn.textContent = "Préparation...";
    }

    setTermSegmentsSaveStatus("Construction du sous-corpus en cours...");

    if (tauriInvoke) {
      const payload = await tauriInvoke("save_text_export", {
        content,
        filename
      });
      const savedPath = payload.savedPath || payload.filename;
      setTermSegmentsSaveStatus(`Sous-corpus enregistré : ${savedPath}`);
      log(`[info] Sous-corpus enregistré : ${savedPath}`);
      await revealInFileManager(savedPath);
      return;
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setTermSegmentsSaveStatus(`Le navigateur a préparé ${filename}. Vérifie ton dossier Téléchargements.`);
  } catch (error) {
    const message = error?.message || String(error);
    setTermSegmentsSaveStatus(`Sous-corpus impossible à enregistrer : ${message}`, { isError: true });
    log(`[error] Construction du sous-corpus impossible : ${message}`);
  } finally {
    if (buildSubcorpusBtn) {
      buildSubcorpusBtn.disabled = !(appState.termSegmentsExport?.segments || []).length;
      buildSubcorpusBtn.textContent = "Construire un sous-corpus";
    }
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",").pop() : "";
      if (!base64) {
        reject(new Error("Conversion base64 impossible."));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => {
      reject(reader.error || new Error("Lecture du blob impossible."));
    };
    reader.readAsDataURL(blob);
  });
}

async function buildChi2ChartPngBlob() {
  const svg = termSegmentsList?.querySelector(".chi2-comparison-chart");
  if (!(svg instanceof SVGElement)) {
    throw new Error("Le graphique χ² n'est pas disponible.");
  }

  const viewBox = svg.viewBox?.baseVal;
  const width = Math.max(400, Math.round(viewBox?.width || svg.clientWidth || 860));
  const height = Math.max(260, Math.round(viewBox?.height || svg.clientHeight || 360));
  const serializer = new XMLSerializer();
  const svgMarkup = serializer.serializeToString(svg);
  const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await new Promise((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => reject(new Error("Chargement du graphique impossible."));
      nextImage.src = svgUrl;
    });

    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas indisponible pour l'export PNG.");
    }

    context.fillStyle = "#fffaf7";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.scale(scale, scale);
    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
          return;
        }
        reject(new Error("Création du PNG impossible."));
      }, "image/png");
    });

    return blob;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

async function saveCurrentChi2Chart() {
  const chartState = appState.termChartExport;
  if (!chartState?.visible) {
    setTermSegmentsSaveStatus("Aucun graphique χ² n'est disponible à enregistrer.", { isError: true });
    return;
  }

  const filename = String(chartState.filename || "chi2-classes.png").trim() || "chi2-classes.png";
  const tauriInvoke = getTauriInvoke();

  try {
    if (saveChi2PngBtn) {
      saveChi2PngBtn.disabled = true;
      saveChi2PngBtn.textContent = "Préparation...";
    }

    setTermSegmentsSaveStatus("Préparation du graphique χ² en PNG...");
    const pngBlob = await buildChi2ChartPngBlob();

    if (tauriInvoke) {
      const base64Data = await blobToBase64(pngBlob);
      const payload = await tauriInvoke("save_png_export", {
        data: base64Data,
        filename
      });
      const savedPath = payload.savedPath || payload.filename;
      setTermSegmentsSaveStatus(`Graphique enregistré : ${savedPath}`);
      log(`[info] Graphique χ² enregistré : ${savedPath}`);
      await revealInFileManager(savedPath);
      return;
    }

    const url = URL.createObjectURL(pngBlob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setTermSegmentsSaveStatus(`Le navigateur a préparé ${filename}. Vérifie ton dossier Téléchargements.`);
  } catch (error) {
    const message = error?.message || String(error);
    setTermSegmentsSaveStatus(`Enregistrement du graphique impossible : ${message}`, { isError: true });
    log(`[error] Enregistrement du graphique χ² impossible : ${message}`);
  } finally {
    if (saveChi2PngBtn) {
      saveChi2PngBtn.disabled = !appState.termChartExport?.visible;
      saveChi2PngBtn.textContent = "Enregistrer en PNG";
    }
  }
}

function openTermResultDialog({ kicker, title, meta, contentNode, subcorpus = null }) {
  if (termSegmentsKicker) {
    termSegmentsKicker.textContent = kicker || "Résultat CHD";
  }

  if (termSegmentsTitle) {
    termSegmentsTitle.textContent = title || "Action CHD";
  }

  if (termSegmentsMeta) {
    termSegmentsMeta.textContent = meta || "";
  }

  if (termSegmentsList) {
    termSegmentsList.innerHTML = "";
    if (contentNode) {
      termSegmentsList.appendChild(contentNode);
    } else {
      termSegmentsList.appendChild(createEmptyState("Aucun résultat disponible."));
    }
  }

  if (subcorpus && typeof subcorpus === "object") {
    setTermSegmentsExportState({
      segments: subcorpus.segments || [],
      filename: subcorpus.filename || "",
      visible: true
    });
  } else {
    setTermSegmentsExportState();
  }

  setTermChartExportState();

  if (termSegmentsDialog && !termSegmentsDialog.open) {
    if (typeof termSegmentsDialog.showModal === "function") {
      termSegmentsDialog.showModal();
    } else if (typeof termSegmentsDialog.show === "function") {
      termSegmentsDialog.show();
    }
  }
}

function formatActionNumber(value, { digits = 3 } = {}) {
  const numeric = Number.parseFloat(value);
  if (!Number.isFinite(numeric)) return "N/A";
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(numeric);
}

function formatActionInteger(value) {
  const numeric = Number.parseFloat(value);
  if (!Number.isFinite(numeric)) return "N/A";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(numeric);
}

function buildSegmentsContent(segments, term) {
  if (!Array.isArray(segments) || !segments.length) {
    return createEmptyState("Aucun segment trouvé.");
  }

  const fragment = document.createDocumentFragment();
  segments.forEach((segment) => {
    const paragraph = document.createElement("p");
    paragraph.className = "segment-popup-item";
    paragraph.innerHTML = highlightSegmentTerm(segment, term);
    fragment.appendChild(paragraph);
  });
  return fragment;
}

function buildSegmentsByClassesContent(classes, term) {
  if (!Array.isArray(classes) || !classes.length) {
    return createEmptyState("Aucun segment trouvé dans les classes.");
  }

  const wrapper = document.createElement("div");
  wrapper.className = "segments-popup-list";

  classes.forEach((entry) => {
    const section = document.createElement("section");
    section.className = "term-action-group";

    const heading = document.createElement("h3");
    heading.textContent = `Classe ${normalizeClassValue(entry.classLabel)}`;
    section.appendChild(heading);

    const meta = document.createElement("p");
    meta.className = "term-action-group-meta";
    meta.textContent = `${formatActionInteger(entry.count)} segment(s)`;
    section.appendChild(meta);

    section.appendChild(buildSegmentsContent(entry.segments || [], term));
    wrapper.appendChild(section);
  });

  return wrapper;
}

function formatChi2AxisTick(value) {
  const numeric = Number.parseFloat(value);
  if (!Number.isFinite(numeric)) return "";
  const abs = Math.abs(numeric);
  const digits = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits
  }).format(numeric);
}

function getNiceAxisStep(range, targetTicks = 6) {
  const safeRange = Math.max(1, Number.parseFloat(range) || 1);
  const roughStep = safeRange / Math.max(2, targetTicks);
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const normalized = roughStep / magnitude;

  let multiplier = 10;
  if (normalized <= 1) multiplier = 1;
  else if (normalized <= 2) multiplier = 2;
  else if (normalized <= 5) multiplier = 5;

  return multiplier * magnitude;
}

function buildChi2Content(payload) {
  const classes = Array.isArray(payload?.classes) ? payload.classes : [];
  if (!classes.length) {
    return createEmptyState("Aucune valeur de χ² disponible pour cette forme.");
  }

  const wrapper = document.createElement("div");
  wrapper.className = "term-action-group";

  const chartWidth = 920;
  const chartHeight = 360;
  const values = classes.map((entry) => Number.parseFloat(entry?.chi2)).filter(Number.isFinite);
  const maxAbs = Math.max(1, ...values.map((value) => Math.abs(value)));
  const yMax = maxAbs * 1.12;
  const gridValues = [];
  const gridStep = getNiceAxisStep(yMax * 2, 6);
  for (let current = -Math.ceil(yMax / gridStep) * gridStep; current <= yMax + gridStep * 0.5; current += gridStep) {
    gridValues.push(current);
  }
  if (!gridValues.some((tick) => Math.abs(tick) < 1e-9)) {
    gridValues.push(0);
    gridValues.sort((left, right) => left - right);
  }

  const longestTickLabel = Math.max(...gridValues.map((tick) => formatChi2AxisTick(tick).length), 1);
  const margin = {
    top: 18,
    right: 28,
    bottom: 92,
    left: Math.max(76, 18 + longestTickLabel * 8)
  };
  const plotWidth = chartWidth - margin.left - margin.right;
  const plotHeight = chartHeight - margin.top - margin.bottom;
  const zeroY = margin.top + plotHeight * 0.5;
  const barSlot = plotWidth / Math.max(classes.length, 1);
  const barWidth = Math.min(60, Math.max(22, barSlot * 0.56));

  const yToPx = (value) => margin.top + ((yMax - value) / (2 * yMax)) * plotHeight;

  const svgParts = [
    `<svg viewBox="0 0 ${chartWidth} ${chartHeight}" class="chi2-comparison-chart" role="img" aria-label="χ² par classe pour la forme sélectionnée">`,
    `<rect x="0" y="0" width="${chartWidth}" height="${chartHeight}" fill="#fffaf7" rx="18" ry="18"></rect>`
  ];

  gridValues.forEach((tick) => {
    const y = yToPx(tick);
    const isZero = Math.abs(tick) < 1e-9;
    svgParts.push(
      `<line x1="${margin.left}" y1="${y}" x2="${chartWidth - margin.right}" y2="${y}" stroke="${isZero ? "#3b302c" : "#d9cfc8"}" stroke-width="${isZero ? 1.6 : 1}" stroke-dasharray="${isZero ? "" : "4 5"}"></line>`
    );
    svgParts.push(
      `<text x="${margin.left - 10}" y="${y + 4}" text-anchor="end" font-size="11" fill="#6f625b">${escapeHtml(formatChi2AxisTick(tick))}</text>`
    );
  });

  classes.forEach((entry, index) => {
    const value = Number.parseFloat(entry?.chi2);
    const safeValue = Number.isFinite(value) ? value : 0;
    const centerX = margin.left + index * barSlot + barSlot / 2;
    const y = yToPx(safeValue);
    const rectY = safeValue >= 0 ? y : zeroY;
    const rectHeight = Math.max(2, Math.abs(zeroY - y));
    const fill = entry?.isSelected ? "#c72318" : "#ef3b2d";
    const stroke = entry?.isSelected ? "#4b110d" : "#6b2019";
    const label = escapeHtml(`Classe ${normalizeClassValue(entry?.classLabel)}`);

    svgParts.push(
      `<rect x="${centerX - barWidth / 2}" y="${rectY}" width="${barWidth}" height="${rectHeight}" fill="${fill}" stroke="${stroke}" stroke-width="1.6" rx="2" ry="2"></rect>`
    );
    svgParts.push(
      `<text x="${centerX}" y="${chartHeight - 16}" text-anchor="end" transform="rotate(-65 ${centerX} ${chartHeight - 16})" font-size="11" fill="#2e2723">${label}</text>`
    );
  });

  svgParts.push(`</svg>`);

  const chart = document.createElement("div");
  chart.className = "chi2-comparison-chart-wrap";
  chart.innerHTML = svgParts.join("");
  wrapper.appendChild(chart);

  const selectedClassLabel = payload?.selectedClassLabel ? `Classe ${normalizeClassValue(payload.selectedClassLabel)}` : "Classe sélectionnée";
  const stats = [
    ["Classe", selectedClassLabel],
    ["χ²", formatActionNumber(payload?.selectedChi2)],
    ["p.value", formatActionNumber(payload?.selectedPValue, { digits: 6 })],
    ["Type", payload?.type || "N/A"]
  ];

  const grid = document.createElement("dl");
  grid.className = "term-stats-grid";

  stats.forEach(([label, value]) => {
    const card = document.createElement("div");
    card.className = "term-stat-card";

    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;

    card.append(dt, dd);
    grid.appendChild(card);
  });

  wrapper.appendChild(grid);
  return wrapper;
}

function renderChdActionResult(result) {
  const action = String(result?.action || "");
  const term = String(result?.term || "").trim();
  const title = result?.title || "Action CHD";
  const meta = result?.meta || "";

  if (action === "chi2-class") {
    openTermResultDialog({
      kicker: "χ² par classe",
      title,
      meta,
      contentNode: buildChi2Content(result.payload || {})
    });
    setTermChartExportState({
      visible: true,
      filename: getChi2ChartFileName(term)
    });
    return;
  }

  if (action === "segments-all-classes") {
    const classes = result?.payload?.classes || [];
    const segments = classes.flatMap((entry) =>
      Array.isArray(entry?.segments) ? entry.segments.map((segment) => String(segment || "")) : []
    );
    openTermResultDialog({
      kicker: "Segments dans les classes",
      title,
      meta,
      contentNode: buildSegmentsByClassesContent(classes, term),
      subcorpus: {
        segments,
        filename: getSubcorpusFileName({
          term,
          scope: "classes"
        })
      }
    });
    return;
  }

  const segments = Array.isArray(result?.payload?.segments) ? result.payload.segments : [];
  openTermResultDialog({
    kicker: "Segments trouvés",
    title,
    meta,
    contentNode: buildSegmentsContent(segments, term),
    subcorpus: {
      segments,
      filename: getSubcorpusFileName({
        term,
        classLabel: result?.payload?.classLabel || result?.classLabel || "",
        scope: "classe"
      })
    }
  });
}

function closeChdTermContextMenu() {
  appState.chdContextMenu = null;
  if (!chdTermContextMenu) return;
  chdTermContextMenu.hidden = true;
  chdTermContextMenu.style.left = "";
  chdTermContextMenu.style.top = "";
  chdTermContextMenu.style.visibility = "";
}

function openChdTermContextMenu({ event, term, classLabel }) {
  if (!chdTermContextMenu) return;

  event.preventDefault();
  event.stopPropagation();

  const normalizedClass = normalizeClassValue(classLabel);
  const normalizedTerm = String(term || "").trim();
  if (!normalizedTerm) return;

  appState.chdContextMenu = {
    term: normalizedTerm,
    classLabel: normalizedClass
  };

  chdTermContextMenu.hidden = false;
  chdTermContextMenu.style.left = "0px";
  chdTermContextMenu.style.top = "0px";
  chdTermContextMenu.style.visibility = "hidden";

  const menuRect = chdTermContextMenu.getBoundingClientRect();
  const left = Math.max(10, Math.min(event.clientX, window.innerWidth - menuRect.width - 10));
  const top = Math.max(10, Math.min(event.clientY, window.innerHeight - menuRect.height - 10));

  chdTermContextMenu.style.left = `${left}px`;
  chdTermContextMenu.style.top = `${top}px`;
  chdTermContextMenu.style.visibility = "visible";
}

async function invokeChdAction(action) {
  const current = appState.chdContextMenu;
  closeChdTermContextMenu();

  if (!current?.term || !appState.outputDir) {
    log("[error] Action CHD impossible : aucune forme ou aucun dossier d'exports disponible.");
    return;
  }

  const tauriInvoke = getTauriInvoke();
  if (!tauriInvoke) {
    log("[error] Les actions CHD au clic droit sont disponibles uniquement dans l'application Tauri.");
    return;
  }

  try {
    log(`[info] Action CHD : ${action} pour la forme ${current.term}.`);
    const result = await tauriInvoke("run_chd_action", {
      outputDir: appState.outputDir,
      action,
      term: current.term,
      classLabel: current.classLabel
    });
    if (Array.isArray(result?.logs)) {
      result.logs.forEach((line) => {
        if (line) log(`[info] ${line}`);
      });
    }
    renderChdActionResult(result);
  } catch (error) {
    log(`[error] Action CHD impossible : ${error?.message || String(error)}`);
  }
}

function createEmbeddedFrame(htmlText, className = "embedded-frame") {
  const iframe = document.createElement("iframe");
  iframe.className = className;
  iframe.srcdoc = htmlText;
  return iframe;
}

function getConcordancierInjectedStyle() {
  return `
<style>
  h1, h2, h3 {
    line-height: 1.08 !important;
    letter-spacing: 0;
  }
  h1 {
    font-size: 1rem !important;
    margin: 0 0 0.18rem !important;
  }
  h2 {
    font-size: 0.9rem !important;
    margin: 0 0 0.14rem !important;
  }
  h3 {
    font-size: 0.78rem !important;
    margin: 0 0 0.3rem !important;
    font-weight: 500 !important;
  }
  h2.classe-heading,
  .classe-heading {
    font-size: 1.8rem !important;
    line-height: 1.02 !important;
    color: #b42318 !important;
    font-weight: 700 !important;
    margin: 0 0 0.42rem !important;
  }
</style>`;
}

function buildConcordancierHtmlDocument(headHtml, bodyHtml) {
  return `<!DOCTYPE html><html><head>${headHtml || ""}${getConcordancierInjectedStyle()}</head><body>${bodyHtml || ""}</body></html>`;
}

function renderConcordancierFrame(container, htmlText, emptyMessage) {
  clearContainer(container);

  if (!htmlText) {
    container.appendChild(createEmptyState(emptyMessage));
    return;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const classBlocks = Array.from(doc.querySelectorAll(".classe-bloc"));

    if (!classBlocks.length) {
      container.appendChild(createEmbeddedFrame(buildConcordancierHtmlDocument(doc.head?.innerHTML || "", doc.body?.innerHTML || htmlText)));
      return;
    }

    const bodyChildren = Array.from(doc.body?.children || []);
    const firstBlock = classBlocks[0];
    const commonHeaderHtml = bodyChildren
      .slice(0, Math.max(0, bodyChildren.indexOf(firstBlock)))
      .map((node) => node.outerHTML)
      .join("");

    const tabs = document.createElement("div");
    tabs.className = "concordancier-class-tabs";

    const panels = document.createElement("div");
    panels.className = "concordancier-class-panels";

    const activateClassTab = (activeIndex) => {
      tabs.querySelectorAll(".concordancier-class-tab").forEach((button, index) => {
        button.classList.toggle("is-active", index === activeIndex);
      });
      panels.querySelectorAll(".concordancier-class-panel").forEach((panel, index) => {
        panel.hidden = index !== activeIndex;
        panel.classList.toggle("is-active", index === activeIndex);
      });
    };

    classBlocks.forEach((block, index) => {
      const heading = block.querySelector(".classe-heading, h2");
      const classLabel = String(heading?.textContent || `Classe ${index + 1}`).trim();

      const button = document.createElement("button");
      button.type = "button";
      button.className = "secondary-button concordancier-class-tab";
      button.textContent = `Concor ${classLabel}`;
      button.addEventListener("click", () => activateClassTab(index));
      tabs.appendChild(button);

      const panel = document.createElement("div");
      panel.className = "concordancier-class-panel";
      panel.hidden = index !== 0;
      panel.appendChild(
        createEmbeddedFrame(
          buildConcordancierHtmlDocument(
            doc.head?.innerHTML || "",
            `${commonHeaderHtml}${block.outerHTML}`
          ),
          "embedded-frame embedded-frame--concordancier"
        )
      );
      panels.appendChild(panel);
    });

    container.appendChild(tabs);
    container.appendChild(panels);
    activateClassTab(0);
  } catch (error) {
    log(`[error] Découpage du concordancier par classe impossible : ${error?.message || String(error)}`);
    container.appendChild(createEmbeddedFrame(`${getConcordancierInjectedStyle()}${htmlText}`));
  }
}

function renderHtmlFrame(container, htmlText, emptyMessage) {
  if (container === resultContainers.chdConcordancier) {
    renderConcordancierFrame(container, htmlText, emptyMessage);
    return;
  }

  clearContainer(container);

  if (!htmlText) {
    container.appendChild(createEmptyState(emptyMessage));
    return;
  }

  const iframe = createEmbeddedFrame(htmlText);
  container.appendChild(iframe);
  if (container === resultContainers.simiGraph) {
    applySimiZoom();
  }
}

function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] || "";
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  return semicolonCount > commaCount ? ";" : ",";
}

function parseDelimited(text, delimiter) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (character === "\"") {
      if (inQuotes && text[index + 1] === "\"") {
        field += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === delimiter && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && text[index + 1] === "\n") {
        index += 1;
      }

      row.push(field);
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      field = "";
      continue;
    }

    field += character;
  }

  row.push(field);
  if (row.some((cell) => cell.length > 0)) {
    rows.push(row);
  }

  return rows;
}

function parseCsv(text) {
  const delimiter = detectDelimiter(text);
  const rows = parseDelimited(text, delimiter);

  if (!rows.length) {
    return { headers: [], rows: [] };
  }

  const headers = rows[0].map((cell, index) => {
    const value = String(cell ?? "");
    return index === 0 ? value.replace(/^\ufeff/, "") : value;
  });
  const body = rows.slice(1).map((row) => {
    const normalizedRow = [...row];
    while (normalizedRow.length < headers.length) {
      normalizedRow.push("");
    }
    return normalizedRow.slice(0, headers.length);
  });

  return { headers, rows: body };
}

function normalizeClassValue(rawValue) {
  const raw = String(rawValue || "").trim();
  if (!raw) return "Sans classe";
  const stripped = raw.replace(/^classe\s+/i, "").replace(/:$/, "").trim() || raw;
  const numeric = Number.parseFloat(stripped.replace(",", "."));
  if (Number.isFinite(numeric)) {
    return String(Number.isInteger(numeric) ? numeric : numeric);
  }
  return stripped;
}

function parseSegmentsByClassText(text) {
  const groups = new Map();
  let currentClass = null;

  String(text || "").split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    const headerMatch = trimmed.match(/^Classe\s+(.+?)\s*:\s*$/i);
    if (headerMatch) {
      currentClass = normalizeClassValue(headerMatch[1]);
      if (!groups.has(currentClass)) groups.set(currentClass, []);
      return;
    }
    if (!currentClass || !trimmed) return;
    groups.get(currentClass).push(trimmed);
  });

  return groups;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildLooseTermRegex(term, flags = "iu") {
  return new RegExp(`(^|[^\\p{L}\\p{N}_])(${escapeRegex(term)})($|[^\\p{L}\\p{N}_])`, flags);
}

function segmentContainsTerm(segment, term) {
  return buildLooseTermRegex(term).test(String(segment || ""));
}

function highlightSegmentTerm(segment, term) {
  const regex = buildLooseTermRegex(term, "giu");
  return String(segment || "").replace(
    regex,
    (_match, prefix, core, suffix) => `${escapeHtml(prefix)}<mark>${escapeHtml(core)}</mark>${escapeHtml(suffix)}`
  );
}

function buildLdaTopicTermLookup(parsed, maxTermsPerTopic = 20) {
  const topicGroups = parseLdaTopicGroups(parsed);
  if (!topicGroups?.topics?.length) return new Map();

  const lookup = new Map();
  topicGroups.topics.forEach((topic) => {
    const canonicalTopic = canonicalizeTopicLabel(topic);
    let entries = (topicGroups.topicMap.get(topic) || [])
      .filter((entry) => entry && entry.term && Number.isFinite(entry.prob) && entry.prob > 0);
    if (Number.isFinite(maxTermsPerTopic) && maxTermsPerTopic > 0) {
      entries = entries.slice(0, maxTermsPerTopic);
    }
    const terms = entries
      .map((entry) => String(entry.term).trim())
      .filter(Boolean);
    lookup.set(canonicalTopic, terms);
  });

  return lookup;
}

function highlightLdaSegmentTerms(segment, terms) {
  const source = String(segment || "");
  const termList = [...new Set((terms || []).map((term) => String(term || "").trim()).filter(Boolean))]
    .sort((left, right) => right.length - left.length);

  if (!source || !termList.length) {
    return escapeHtml(source);
  }

  const matches = [];
  const overlaps = (start, end) => matches.some((item) => start < item.end && end > item.start);
  const collectTermMatches = (term) => {
    const regex = buildLooseTermRegex(term, "giu");
    let found = false;
    let match;
    while ((match = regex.exec(source)) !== null) {
      const prefix = match[1] || "";
      const core = match[2] || "";
      if (!core) continue;
      const start = match.index + prefix.length;
      const end = start + core.length;
      if (overlaps(start, end)) continue;
      matches.push({ start, end });
      found = true;
    }
    return found;
  };

  termList.forEach((term) => {
    const foundExact = collectTermMatches(term);
    if (!foundExact && term.includes(" ")) {
      const parts = term
        .split(/\s+/)
        .map((part) => part.trim())
        .filter((part) => part.length >= 3);
      parts.forEach((part) => {
        collectTermMatches(part);
      });
    }
  });

  if (!matches.length) {
    return escapeHtml(source);
  }

  matches.sort((left, right) => left.start - right.start);
  let cursor = 0;
  let html = "";
  matches.forEach((match) => {
    html += escapeHtml(source.slice(cursor, match.start));
    html += `<mark class="lda-segment-mark">${escapeHtml(source.slice(match.start, match.end))}</mark>`;
    cursor = match.end;
  });
  html += escapeHtml(source.slice(cursor));
  return html;
}

function renderTable(container, parsed, options = {}) {
  clearContainer(container);

  if (!parsed || !parsed.headers.length) {
    container.appendChild(createEmptyState(options.emptyMessage || "Aucun tableau disponible."));
    return;
  }

  const title = options.title || null;
  const maxRows = Number.isFinite(options.maxRows) ? options.maxRows : 80;
  const visibleRows = parsed.rows.slice(0, maxRows);
  const onCellClick = typeof options.onCellClick === "function" ? options.onCellClick : null;
  const rowClassName = typeof options.rowClassName === "function" ? options.rowClassName : null;
  const cellClassName = typeof options.cellClassName === "function" ? options.cellClassName : null;
  const cellRenderer = typeof options.cellRenderer === "function" ? options.cellRenderer : null;

  if (title) {
    const caption = document.createElement("p");
    caption.className = "result-table-caption";
    caption.textContent =
      parsed.rows.length > maxRows
        ? `${title} · ${visibleRows.length} lignes affichées sur ${parsed.rows.length}`
        : `${title} · ${parsed.rows.length} lignes`;
    container.appendChild(caption);
  }

  const wrap = document.createElement("div");
  wrap.className = "result-table-wrap";

  const table = document.createElement("table");
  table.className = "result-table";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  parsed.headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header || " ";
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  visibleRows.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    if (rowClassName) {
      const className = rowClassName({ row, rowIndex, headers: parsed.headers });
      if (className) {
        String(className)
          .split(/\s+/)
          .filter(Boolean)
          .forEach((name) => tr.classList.add(name));
      }
    }
    row.forEach((cell, columnIndex) => {
      const td = document.createElement("td");
      const payload = { cell, row, rowIndex, columnIndex, headers: parsed.headers };
      const renderedCell = cellRenderer ? cellRenderer(payload) : null;
      if (cellClassName) {
        const className = cellClassName(payload);
        if (className) {
          String(className)
            .split(/\s+/)
            .filter(Boolean)
            .forEach((name) => td.classList.add(name));
        }
      }
      if (renderedCell?.className) {
        String(renderedCell.className)
          .split(/\s+/)
          .filter(Boolean)
          .forEach((name) => td.classList.add(name));
      }
      if (onCellClick) {
        const clickPayload = payload;
        const cellOptions = onCellClick(clickPayload);
        if (cellOptions?.clickable) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "cell-button";
          if (cellOptions.className) {
            String(cellOptions.className)
              .split(/\s+/)
              .filter(Boolean)
              .forEach((name) => button.classList.add(name));
          }
          if (renderedCell?.html !== undefined) {
            button.innerHTML = renderedCell.html;
          } else {
            button.textContent = renderedCell?.text ?? cell;
          }
          button.addEventListener("click", () => cellOptions.onClick?.(clickPayload));
          if (typeof cellOptions.onContextMenu === "function") {
            button.addEventListener("contextmenu", (event) => {
              cellOptions.onContextMenu?.(event, clickPayload);
            });
          }
          td.appendChild(button);
        } else {
          if (renderedCell?.html !== undefined) {
            td.innerHTML = renderedCell.html;
          } else {
            td.textContent = renderedCell?.text ?? cell;
          }
        }
      } else {
        if (renderedCell?.html !== undefined) {
          td.innerHTML = renderedCell.html;
        } else {
          td.textContent = renderedCell?.text ?? cell;
        }
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  container.appendChild(wrap);
}

function formatSummaryValue(value) {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "number") return new Intl.NumberFormat("fr-FR").format(value);
  return String(value);
}

function renderAnalysisSteps(logLines) {
  clearContainer(analysisSteps);

  if (!Array.isArray(logLines) || !logLines.length) {
    analysisSteps.appendChild(createEmptyState("Les étapes s'afficheront après le lancement d'une analyse."));
    return;
  }

  const list = document.createElement("ol");
  list.className = "steps-list";

  logLines.forEach((line) => {
    const item = document.createElement("li");
    item.textContent = String(line).replace(/^\[[^\]]+\]\s*/, "").trim() || String(line);
    list.appendChild(item);
  });

  analysisSteps.appendChild(list);
}

function renderAnalysisSummary(summary) {
  clearContainer(analysisSummary);

  if (!summary || typeof summary !== "object" || !Object.keys(summary).length) {
    analysisSummary.appendChild(createEmptyState("La synthèse du corpus apparaîtra après l'analyse."));
    return;
  }

  const metrics = [
    ["Corpus", summary.corpus],
    ["Nombre de textes", summary.n_texts],
    ["Nombre de segments", summary.n_segments],
    ["Nombre d'occurrences", summary.n_tokens],
    ["Nombre de formes", summary.n_formes],
    ["Nombre d'hapax", summary.n_hapax],
    ["Nombre de classes", summary.n_classes]
  ];

  const grid = document.createElement("div");
  grid.className = "summary-grid";

  metrics.forEach(([label, value]) => {
    const card = document.createElement("article");
    card.className = "summary-card";

    const title = document.createElement("p");
    title.className = "summary-label";
    title.textContent = label;

    const body = document.createElement("strong");
    body.className = "summary-value";
    body.textContent = formatSummaryValue(value);

    card.appendChild(title);
    card.appendChild(body);
    grid.appendChild(card);
  });

  analysisSummary.appendChild(grid);
}

function renderZipfChart(summary) {
  clearContainer(zipfChart);

  const zipf = Array.isArray(summary?.zipf) ? summary.zipf : [];
  if (!zipf.length) {
    zipfChart.appendChild(createEmptyState("Le graphique Zipf sera disponible après l'analyse."));
    return;
  }

  const width = 1000;
  const height = 1000;
  const padding = 84;
  const points = zipf
    .map((item) => ({
      x: Number(item.log_rang),
      y: Number(item.log_frequence),
      pred: Number(item.log_pred)
    }))
    .filter((item) => Number.isFinite(item.x) && Number.isFinite(item.y));

  if (points.length < 2) {
    zipfChart.appendChild(createEmptyState("Pas assez de points pour tracer la loi de Zipf."));
    return;
  }

  const maxX = Math.max(...points.map((item) => item.x));
  const maxY = Math.max(...points.map((item) => item.y));
  const minX = Math.min(...points.map((item) => item.x));
  const minY = Math.min(...points.map((item) => item.y));
  const scaleX = (value) =>
    padding + ((value - minX) / Math.max(1e-9, maxX - minX)) * (width - padding * 2);
  const scaleY = (value) =>
    height - padding - ((value - minY) / Math.max(1e-9, maxY - minY)) * (height - padding * 2);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("class", "zipf-svg");

  const plotLeft = padding;
  const plotRight = width - padding;
  const plotTop = padding;
  const plotBottom = height - padding;
  const gridSteps = 5;

  for (let index = 0; index <= gridSteps; index += 1) {
    const x = plotLeft + ((plotRight - plotLeft) / gridSteps) * index;
    const y = plotTop + ((plotBottom - plotTop) / gridSteps) * index;

    const vGrid = document.createElementNS("http://www.w3.org/2000/svg", "line");
    vGrid.setAttribute("x1", String(x));
    vGrid.setAttribute("y1", String(plotTop));
    vGrid.setAttribute("x2", String(x));
    vGrid.setAttribute("y2", String(plotBottom));
    vGrid.setAttribute("stroke", "#E6E6E6");
    vGrid.setAttribute("stroke-width", "1");
    vGrid.setAttribute("stroke-dasharray", "2 6");
    svg.appendChild(vGrid);

    const hGrid = document.createElementNS("http://www.w3.org/2000/svg", "line");
    hGrid.setAttribute("x1", String(plotLeft));
    hGrid.setAttribute("y1", String(y));
    hGrid.setAttribute("x2", String(plotRight));
    hGrid.setAttribute("y2", String(y));
    hGrid.setAttribute("stroke", "#E6E6E6");
    hGrid.setAttribute("stroke-width", "1");
    hGrid.setAttribute("stroke-dasharray", "2 6");
    svg.appendChild(hGrid);
  }

  const axes = [
    { x1: padding, y1: height - padding, x2: width - padding, y2: height - padding },
    { x1: padding, y1: padding, x2: padding, y2: height - padding }
  ];

  axes.forEach((axis) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    Object.entries(axis).forEach(([key, value]) => line.setAttribute(key, String(value)));
    line.setAttribute("stroke", "#8d867d");
    line.setAttribute("stroke-width", "1.5");
    svg.appendChild(line);
  });

  points.forEach((item) => {
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", String(scaleX(item.x)));
    dot.setAttribute("cy", String(scaleY(item.y)));
    dot.setAttribute("r", "4.6");
    dot.setAttribute("fill", "#2C7FB8");
    dot.setAttribute("fill-opacity", "0.7");
    svg.appendChild(dot);
  });

  const predPoints = points.filter((item) => Number.isFinite(item.pred));
  if (predPoints.length >= 2) {
    const predPolyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    predPolyline.setAttribute(
      "points",
      predPoints.map((item) => `${scaleX(item.x)},${scaleY(item.pred)}`).join(" ")
    );
    predPolyline.setAttribute("fill", "none");
    predPolyline.setAttribute("stroke", "#D7301F");
    predPolyline.setAttribute("stroke-width", "2.6");
    svg.appendChild(predPolyline);
  }

  const xTicks = [minX, (minX + maxX) / 2, maxX];
  const yTicks = [minY, (minY + maxY) / 2, maxY];

  xTicks.forEach((value) => {
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", String(scaleX(value)));
    label.setAttribute("y", String(height - padding + 28));
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("fill", "#5f5a53");
    label.setAttribute("font-size", "16");
    label.textContent = value.toFixed(2);
    svg.appendChild(label);
  });

  yTicks.forEach((value) => {
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", String(padding - 14));
    label.setAttribute("y", String(scaleY(value) + 5));
    label.setAttribute("text-anchor", "end");
    label.setAttribute("fill", "#5f5a53");
    label.setAttribute("font-size", "16");
    label.textContent = value.toFixed(2);
    svg.appendChild(label);
  });

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", String(width / 2));
  title.setAttribute("y", "44");
  title.setAttribute("text-anchor", "middle");
  title.setAttribute("fill", "#171717");
  title.setAttribute("font-size", "28");
  title.setAttribute("font-weight", "700");
  title.textContent = "Loi de Zipf";
  svg.appendChild(title);

  const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  xLabel.setAttribute("x", String(width / 2));
  xLabel.setAttribute("y", String(height - 24));
  xLabel.setAttribute("text-anchor", "middle");
  xLabel.setAttribute("fill", "#171717");
  xLabel.setAttribute("font-size", "21");
  xLabel.textContent = "log(rang)";
  svg.appendChild(xLabel);

  const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  yLabel.setAttribute("x", "22");
  yLabel.setAttribute("y", String(height / 2));
  yLabel.setAttribute("text-anchor", "middle");
  yLabel.setAttribute("fill", "#171717");
  yLabel.setAttribute("font-size", "21");
  yLabel.setAttribute("transform", `rotate(-90 22 ${height / 2})`);
  yLabel.textContent = "log(fréquence)";
  svg.appendChild(yLabel);

  const legendX = width - 270;
  const legendY = 94;

  const pointLegend = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  pointLegend.setAttribute("cx", String(legendX));
  pointLegend.setAttribute("cy", String(legendY));
  pointLegend.setAttribute("r", "4.6");
  pointLegend.setAttribute("fill", "#2C7FB8");
  pointLegend.setAttribute("fill-opacity", "0.7");
  svg.appendChild(pointLegend);

  const pointLegendText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  pointLegendText.setAttribute("x", String(legendX + 14));
  pointLegendText.setAttribute("y", String(legendY + 5));
  pointLegendText.setAttribute("fill", "#171717");
  pointLegendText.setAttribute("font-size", "16");
  pointLegendText.textContent = "Donnees";
  svg.appendChild(pointLegendText);

  const lineLegend = document.createElementNS("http://www.w3.org/2000/svg", "line");
  lineLegend.setAttribute("x1", String(legendX - 5));
  lineLegend.setAttribute("y1", String(legendY + 28));
  lineLegend.setAttribute("x2", String(legendX + 5));
  lineLegend.setAttribute("y2", String(legendY + 28));
  lineLegend.setAttribute("stroke", "#D7301F");
  lineLegend.setAttribute("stroke-width", "2.6");
  svg.appendChild(lineLegend);

  const lineLegendText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  lineLegendText.setAttribute("x", String(legendX + 14));
  lineLegendText.setAttribute("y", String(legendY + 33));
  lineLegendText.setAttribute("fill", "#171717");
  lineLegendText.setAttribute("font-size", "16");
  lineLegendText.textContent = "Regression log-log";
  svg.appendChild(lineLegendText);

  zipfChart.appendChild(svg);
}

async function renderCsvFromFile(container, file, options = {}) {
  if (!file) {
    clearContainer(container);
    container.appendChild(createEmptyState(options.emptyMessage || "Aucun fichier CSV disponible."));
    return;
  }

  try {
    const text = await file.text();
    renderTable(container, parseCsv(text), options);
  } catch (error) {
    clearContainer(container);
    container.appendChild(createEmptyState("Impossible de lire le tableau CSV."));
    log(`[error] Lecture CSV impossible (${file.name}): ${error.message}`);
  }
}

function sortTopicLabels(labels) {
  return [...labels].sort((left, right) => {
    const leftNum = Number.parseInt(String(left).replace(/[^\d-]/g, ""), 10);
    const rightNum = Number.parseInt(String(right).replace(/[^\d-]/g, ""), 10);
    if (Number.isFinite(leftNum) && Number.isFinite(rightNum)) return leftNum - rightNum;
    return String(left).localeCompare(String(right), undefined, { numeric: true });
  });
}

function getLdaTopicColor(index) {
  const palette = [
    "#9f2f2a",
    "#2c7a7b",
    "#b7791f",
    "#6b46c1",
    "#2f855a",
    "#c05621",
    "#285e61",
    "#97266d"
  ];
  return palette[index % palette.length];
}

async function renderLdaTopTermsByTopic(container, file, options = {}) {
  clearContainer(container);

  if (!file) {
    container.appendChild(createEmptyState(options.emptyMessage || "Aucun export CSV de top termes LDA n'a été trouvé."));
    return;
  }

  try {
    const parsed = parseCsv(await file.text());
    if (!parsed.headers.length) {
      container.appendChild(createEmptyState(options.emptyMessage || "Aucun export CSV de top termes LDA n'a été trouvé."));
      return;
    }

    const wideMatrix = parseLdaWideTopicMatrix(parsed);
    if (wideMatrix) {
      const title = document.createElement("h3");
      title.className = "result-table-section-title";
      title.textContent = options.heading || "Mots les plus probables par topic";
      container.appendChild(title);

      const caption = document.createElement("p");
      caption.className = "result-table-caption";
      caption.textContent = `${wideMatrix.topics.length} topic(s) détecté(s) dans ${file.name}.`;
      container.appendChild(caption);

      const stack = document.createElement("div");
      stack.className = "lda-topic-sections";

      wideMatrix.topics.forEach((topic) => {
        const rows = wideMatrix.topicMap.get(topic) || [];
        const topicMaxProb = rows.length ? rows[0].prob : 0;
        const topicSumProb = rows.reduce((sum, entry) => sum + (Number.isFinite(entry.prob) ? entry.prob : 0), 0);
        const rowsWithRelative = rows.map((entry) => ({
          ...entry,
          relativeProb: topicSumProb > 0 ? entry.prob / topicSumProb : Number.NaN
        }));
        const topicMaxRelative = rowsWithRelative.length
          ? Math.max(...rowsWithRelative.map((entry) => entry.relativeProb).filter((value) => Number.isFinite(value)))
          : 0;

        const section = document.createElement("section");
        section.className = "lda-topic-section";

        const heading = document.createElement("h4");
        heading.className = "lda-topic-section-title";
        heading.textContent = topic.replaceAll("_", " ");
        section.appendChild(heading);

        const tableHost = document.createElement("div");
        tableHost.className = "lda-topic-section-table";
        section.appendChild(tableHost);

        const parsedTable = {
          headers: ["Rang", "Mot", "Probabilité LDA réelle", "Score relatif (mots retenus)"],
          rows: rowsWithRelative.map((entry, index) => [
            String(index + 1),
            entry.term,
            formatTableNumber(entry.prob, 6),
            formatTableNumber(entry.relativeProb, 6)
          ])
        };

        renderTable(tableHost, parsedTable, {
          maxRows: parsedTable.rows.length,
          rowClassName: ({ rowIndex }) => {
            if (rowIndex === 0) return "is-lda-term-strong";
            if (rowIndex === 1) return "is-lda-term-medium";
            if (rowIndex === 2) return "is-lda-term-soft";
            return "";
          },
          cellClassName: ({ columnIndex }) => {
            if (columnIndex === 1) return "lda-term-cell";
            if (columnIndex === 2) return "lda-probability-cell";
            if (columnIndex === 3) return "lda-relative-score-cell";
            return "";
          },
          cellRenderer: ({ cell, columnIndex }) => {
            if (columnIndex !== 2 && columnIndex !== 3) return null;
            const probText = String(cell || "");
            const value = parseTableNumber(probText);
            const scaleMax = columnIndex === 2 ? topicMaxProb : topicMaxRelative;
            const relativeWidth = Number.isFinite(value) && Number.isFinite(scaleMax) && scaleMax > 0
              ? Math.max(8, Math.min(100, (value / scaleMax) * 100))
              : 8;
            const meterClass = columnIndex === 2 ? "lda-probability-meter" : "lda-relative-meter";
            const barClass = columnIndex === 2 ? "lda-probability-bar" : "lda-relative-bar";
            return {
              html: `<div class="${meterClass}"><span class="${barClass}" style="width:${relativeWidth}%"></span><strong class="lda-probability-value">${escapeHtml(probText)}</strong></div>`
            };
          }
        });

        stack.appendChild(section);
      });

      container.appendChild(stack);
      return;
    }

    const topicIndex = headerIndex(parsed.headers, ["topic"]);
    const termIndex = headerIndex(parsed.headers, ["term", "terme"]);
    const probIndex = headerIndex(parsed.headers, ["prob", "probability", "poids"]);

    if (topicIndex === -1 || termIndex === -1 || probIndex === -1) {
      renderTable(container, parsed, {
        title: options.title || "Top termes par topic",
        emptyMessage: options.emptyMessage
      });
      return;
    }

    const groups = new Map();
    parsed.rows.forEach((row) => {
      const topic = String(row[topicIndex] || "").trim();
      const term = String(row[termIndex] || "").trim();
      const prob = parseTableNumber(row[probIndex]);
      if (!topic || !term || !Number.isFinite(prob)) return;
      if (!groups.has(topic)) groups.set(topic, []);
      groups.get(topic).push({ term, prob });
    });

    if (!groups.size) {
      container.appendChild(createEmptyState(options.emptyMessage || "Aucun top terme LDA exploitable n'a été trouvé."));
      return;
    }

    const title = document.createElement("h3");
    title.className = "result-table-section-title";
    title.textContent = options.heading || "Mots les plus probables par topic";
    container.appendChild(title);

    const caption = document.createElement("p");
    caption.className = "result-table-caption";
    caption.textContent = `${groups.size} topic(s) détecté(s) dans ${file.name}.`;
    container.appendChild(caption);

    const stack = document.createElement("div");
    stack.className = "lda-topic-sections";

    sortTopicLabels([...groups.keys()]).forEach((topic) => {
      const rows = [...groups.get(topic)].sort((left, right) => right.prob - left.prob);
      const topicMaxProb = rows.length ? rows[0].prob : 0;
      const topicSumProb = rows.reduce((sum, entry) => sum + (Number.isFinite(entry.prob) ? entry.prob : 0), 0);
      const rowsWithRelative = rows.map((entry) => ({
        ...entry,
        relativeProb: topicSumProb > 0 ? entry.prob / topicSumProb : Number.NaN
      }));
      const topicMaxRelative = rowsWithRelative.length
        ? Math.max(...rowsWithRelative.map((entry) => entry.relativeProb).filter((value) => Number.isFinite(value)))
        : 0;

      const section = document.createElement("section");
      section.className = "lda-topic-section";

      const heading = document.createElement("h4");
      heading.className = "lda-topic-section-title";
      heading.textContent = topic.replaceAll("_", " ");
      section.appendChild(heading);

      const tableHost = document.createElement("div");
      tableHost.className = "lda-topic-section-table";
      section.appendChild(tableHost);

      const parsedTable = {
        headers: ["Rang", "Mot", "Probabilité LDA réelle", "Score relatif (mots retenus)"],
        rows: rowsWithRelative.map((entry, index) => [
          String(index + 1),
          entry.term,
          formatTableNumber(entry.prob, 6),
          formatTableNumber(entry.relativeProb, 6)
        ])
      };

      renderTable(tableHost, parsedTable, {
        maxRows: 200,
        rowClassName: ({ rowIndex }) => {
          if (rowIndex === 0) return "is-lda-term-strong";
          if (rowIndex === 1) return "is-lda-term-medium";
          if (rowIndex === 2) return "is-lda-term-soft";
          return "";
        },
        cellClassName: ({ columnIndex }) => {
          if (columnIndex === 1) return "lda-term-cell";
          if (columnIndex === 2) return "lda-probability-cell";
          if (columnIndex === 3) return "lda-relative-score-cell";
          return "";
        },
        cellRenderer: ({ cell, columnIndex }) => {
          if (columnIndex !== 2 && columnIndex !== 3) return null;
          const probText = String(cell || "");
          const value = parseTableNumber(probText);
          const scaleMax = columnIndex === 2 ? topicMaxProb : topicMaxRelative;
          const relativeWidth = Number.isFinite(value) && Number.isFinite(scaleMax) && scaleMax > 0
            ? Math.max(8, Math.min(100, (value / scaleMax) * 100))
            : 8;
          const meterClass = columnIndex === 2 ? "lda-probability-meter" : "lda-relative-meter";
          const barClass = columnIndex === 2 ? "lda-probability-bar" : "lda-relative-bar";
          return {
            html: `<div class="${meterClass}"><span class="${barClass}" style="width:${relativeWidth}%"></span><strong class="lda-probability-value">${escapeHtml(probText)}</strong></div>`
          };
        }
      });

      stack.appendChild(section);
    });

    container.appendChild(stack);
  } catch (error) {
    clearContainer(container);
    container.appendChild(createEmptyState("Impossible de lire les top termes LDA."));
    log(`[error] Lecture CSV impossible (${file.name}): ${error.message}`);
  }
}

async function renderLdaTopicSegments(container, file, options = {}) {
  clearContainer(container);

  if (!file) {
    container.appendChild(createEmptyState(options.emptyMessage || "Aucun export CSV de segments LDA n'a été trouvé."));
    return;
  }

  try {
    const fileText = await file.text();
    const groups = new Map();
    const skippedSegments = [];
    const normalizedFileName = String(file.name || file.path || "").toLowerCase();
    let topicTermLookup = new Map();

    if (options.topTermsFile) {
      try {
        const topTermsParsed = parseCsv(await options.topTermsFile.text());
        topicTermLookup = buildLdaTopicTermLookup(topTermsParsed, Number.isFinite(options.highlightTermsPerTopic) ? options.highlightTermsPerTopic : 20);
      } catch (error) {
        log(`[warn] Lecture des mots saillants LDA impossible (${options.topTermsFile.name}): ${error.message}`);
      }
    }

    const pushEntry = ({ docId, texte, topicLabel, dominantProb, segmentExploitable = true, retainedTermsCount = 0, distribution = [] }) => {
      const cleanedText = String(texte || "").replace(/\s+/g, " ").trim();
      const cleanedDocId = String(docId || "").trim();
      const cleanedTopic = String(topicLabel || "").trim();
      if (!cleanedText || !cleanedDocId) return;
      const numericDistribution = Array.isArray(distribution)
        ? distribution.map((value) => Number(value)).filter((value) => Number.isFinite(value))
        : [];
      const inferredUniform = numericDistribution.length > 1 && (Math.max(...numericDistribution) - Math.min(...numericDistribution) < 1e-9);
      if (!segmentExploitable || inferredUniform || !cleanedTopic) {
        skippedSegments.push({
          docId: cleanedDocId,
          texte: cleanedText,
          retainedTermsCount: Number.isFinite(retainedTermsCount) ? retainedTermsCount : 0
        });
        return;
      }
      if (!groups.has(cleanedTopic)) groups.set(cleanedTopic, []);
      groups.get(cleanedTopic).push({
        docId: cleanedDocId,
        texte: cleanedText,
        dominantProb
      });
    };

    if (normalizedFileName.endsWith(".json")) {
      const payload = JSON.parse(fileText);
      const units = Array.isArray(payload?.unites) ? payload.unites : [];
      units.forEach((unit) => {
        const scores = Array.isArray(unit?.distribution_topics) ? unit.distribution_topics.map((value) => Number(value)) : [];
        let dominantTopic = Number.parseInt(String(unit?.topic_dominant ?? "").replace(/[^\d-]/g, ""), 10);
        let dominantProb = Number.NaN;
        const retainedTermsCount = Number.parseInt(String(unit?.nb_termes_retenus ?? "0"), 10);
        const segmentExploitable = Boolean(unit?.segment_exploitable ?? true);
        if (!Number.isFinite(dominantTopic) && scores.length) {
          let bestIndex = -1;
          let bestScore = -Infinity;
          scores.forEach((score, index) => {
            if (Number.isFinite(score) && score > bestScore) {
              bestScore = score;
              bestIndex = index;
            }
          });
          dominantTopic = bestIndex >= 0 ? bestIndex + 1 : Number.NaN;
          dominantProb = Number.isFinite(bestScore) ? bestScore : Number.NaN;
        } else if (Number.isFinite(dominantTopic) && scores.length >= dominantTopic) {
          dominantProb = Number(scores[dominantTopic - 1]);
        }

        pushEntry({
          docId: unit?.identifiant,
          texte: unit?.texte,
          topicLabel: Number.isFinite(dominantTopic) ? `Topic_${dominantTopic}` : "Topic_inconnu",
          dominantProb,
          segmentExploitable,
          retainedTermsCount,
          distribution: scores
        });
      });
    } else {
      const parsed = parseCsv(fileText);
      if (!parsed.headers.length) {
        container.appendChild(createEmptyState(options.emptyMessage || "Aucun export CSV de segments LDA n'a été trouvé."));
        return;
      }

      const textIndex = headerIndex(parsed.headers, ["texte", "text", "segment", "segment_texte"]);
      const docIdIndex = headerIndex(parsed.headers, ["doc_id", "document", "doc"]);
      const dominantTopicIndex = headerIndex(parsed.headers, ["topic_dominant", "topic dominant"]);
      const dominantProbIndex = headerIndex(parsed.headers, ["prob_topic_dominant", "prob topic dominant", "prob_dominante"]);
      const retainedTermsIndex = headerIndex(parsed.headers, ["nb_termes_retenus", "nb termes retenus"]);
      const exploitableIndex = headerIndex(parsed.headers, ["segment_exploitable", "segment exploitable"]);
      const topicColumns = parsed.headers
        .map((header, index) => ({ header: String(header || "").trim(), index }))
        .filter(({ header }) => /^topic[_\s-]*\d+/i.test(header));

      if (textIndex === -1 || docIdIndex === -1) {
        container.appendChild(
          createEmptyState("Les segments de texte LDA ne sont pas disponibles dans ce run. Relancez LDA avec la version actuelle.")
        );
        return;
      }

      parsed.rows.forEach((row) => {
        const texte = row[textIndex];
        const docId = row[docIdIndex];
        const retainedTermsCount = retainedTermsIndex !== -1 ? Number.parseInt(String(row[retainedTermsIndex] || "0"), 10) : 0;
        const exploitableRaw = exploitableIndex !== -1 ? String(row[exploitableIndex] || "").trim().toLowerCase() : "";
        const segmentExploitable = exploitableIndex !== -1
          ? ["1", "true", "vrai", "yes", "oui"].includes(exploitableRaw)
          : true;

        let topicLabel = "";
        if (dominantTopicIndex !== -1) {
          const rawTopic = String(row[dominantTopicIndex] || "").trim();
          const rawNumeric = Number.parseInt(rawTopic.replace(/[^\d-]/g, ""), 10);
          if (Number.isFinite(rawNumeric)) {
            topicLabel = `Topic_${rawNumeric}`;
          } else if (rawTopic) {
            topicLabel = canonicalizeTopicLabel(rawTopic).replace(/^topic_/, "Topic_");
          }
        }

        let dominantProb = dominantProbIndex !== -1 ? parseTableNumber(row[dominantProbIndex]) : Number.NaN;
        if (!topicLabel && topicColumns.length) {
          let bestTopic = "";
          let bestProb = -Infinity;
          topicColumns.forEach(({ header, index }) => {
            const prob = parseTableNumber(row[index]);
            if (!Number.isFinite(prob)) return;
            if (prob > bestProb) {
              bestProb = prob;
              bestTopic = header;
            }
          });
          topicLabel = bestTopic || "";
          dominantProb = Number.isFinite(bestProb) ? bestProb : dominantProb;
        }

        pushEntry({
          docId,
          texte,
          topicLabel: topicLabel || "Topic_inconnu",
          dominantProb,
          segmentExploitable,
          retainedTermsCount,
          distribution: topicColumns.map(({ index }) => parseTableNumber(row[index]))
        });
      });
    }

    const topics = sortTopicLabels([...groups.keys()]);
    if (!topics.length) {
      container.appendChild(createEmptyState("Aucun segment LDA exploitable n'a été trouvé."));
      return;
    }

    const heading = document.createElement("h3");
    heading.className = "result-table-section-title";
    heading.textContent = options.heading || "Segments de texte par topic";
    container.appendChild(heading);

    const caption = document.createElement("p");
    caption.className = "result-table-caption";
    caption.textContent = `${topics.length} topic(s) détecté(s) dans ${file.name}.`;
    container.appendChild(caption);

    const explanation = document.createElement("p");
    explanation.className = "field-help";
    explanation.textContent = "La probabilité dominante correspond à la probabilité que le segment appartienne à ce topic, et non au score d'un mot isolé.";
    container.appendChild(explanation);

    if (skippedSegments.length) {
      const warning = document.createElement("p");
      warning.className = "field-help field-help--alert";
      warning.textContent = `${skippedSegments.length} segment(s) ne contiennent aucun terme ou n-gramme retenu par le modèle et ne sont donc pas affichés dans les topics.`;
      container.appendChild(warning);
    }

    const tabs = document.createElement("div");
    tabs.className = "local-tabs";
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Topics LDA");
    container.appendChild(tabs);

    const panels = document.createElement("div");
    panels.className = "lda-segment-panels";
    container.appendChild(panels);

    const activateTopic = (activeTopic) => {
      tabs.querySelectorAll(".local-tab-button").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.ldaTopicTab === activeTopic);
      });
      panels.querySelectorAll(".lda-segment-panel").forEach((panel) => {
        panel.hidden = panel.dataset.ldaTopicPanel !== activeTopic;
      });
    };

    topics.forEach((topic, topicIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `local-tab-button${topicIndex === 0 ? " is-active" : ""}`;
      button.dataset.ldaTopicTab = topic;
      button.textContent = topic.replaceAll("_", " ");
      button.addEventListener("click", () => activateTopic(topic));
      tabs.appendChild(button);

      const panel = document.createElement("section");
      panel.className = "lda-segment-panel";
      panel.dataset.ldaTopicPanel = topic;
      panel.hidden = topicIndex !== 0;

      const entries = [...(groups.get(topic) || [])].sort((left, right) => {
        const leftProb = Number.isFinite(left.dominantProb) ? left.dominantProb : -Infinity;
        const rightProb = Number.isFinite(right.dominantProb) ? right.dominantProb : -Infinity;
        if (rightProb !== leftProb) return rightProb - leftProb;
        return left.docId.localeCompare(right.docId, undefined, { numeric: true });
      });

      const info = document.createElement("p");
      info.className = "result-table-caption lda-segment-caption";
      info.textContent = `${entries.length} segment(s) dominés par ${topic.replaceAll("_", " ")}.`;
      panel.appendChild(info);

      const tableHost = document.createElement("div");
      panel.appendChild(tableHost);

      const highlightTerms = topicTermLookup.get(canonicalizeTopicLabel(topic)) || [];
      renderTable(tableHost, {
        headers: ["Segment de texte", "Probabilité du topic dans le segment", "doc_id"],
        rows: entries.map((entry) => [
          entry.texte,
          Number.isFinite(entry.dominantProb) ? formatTableNumber(entry.dominantProb, 6) : "",
          entry.docId
        ])
      }, {
        title: "Segments affichés",
        maxRows: Number.isFinite(options.maxRows) ? options.maxRows : 120,
        cellClassName: ({ columnIndex }) => {
          if (columnIndex === 0) return "lda-segment-text-cell";
          if (columnIndex === 1) return "lda-segment-prob-cell";
          if (columnIndex === 2) return "lda-segment-id-cell";
          return "";
        },
        cellRenderer: ({ cell, columnIndex }) => {
          if (columnIndex === 0) {
            return {
              html: `<div class="lda-segment-text">${highlightLdaSegmentTerms(String(cell || ""), highlightTerms)}</div>`
            };
          }
          return null;
        }
      });

      panels.appendChild(panel);
    });
  } catch (error) {
    clearContainer(container);
    container.appendChild(createEmptyState("Impossible de lire les segments LDA."));
    log(`[error] Lecture CSV impossible (${file.name}): ${error.message}`);
  }
}

async function renderLdaTopTermsMatrix(container, file, options = {}) {
  clearContainer(container);

  if (!file) {
    container.appendChild(createEmptyState(options.emptyMessage || "Aucun export CSV de top termes LDA n'a été trouvé."));
    return;
  }

  try {
    const parsed = parseCsv(await file.text());
    const isFallbackTopTermsFile = /(^|\/)top_terms\.csv$/i.test(String(file?.name || "")) || /(^|\/)top_terms\.csv$/i.test(String(file?.path || ""));
    if (!parsed.headers.length) {
      container.appendChild(createEmptyState(options.emptyMessage || "Aucun export CSV de top termes LDA n'a été trouvé."));
      return;
    }

    const wideMatrix = parseLdaWideTopicMatrix(parsed);
    if (wideMatrix) {
      const matrixParsed = {
        headers: ["Terme", ...wideMatrix.topics.map((topic) => topic.replaceAll("_", " "))],
        rows: parsed.rows
          .map((row) => {
            const term = String(row[wideMatrix.termIndex] || "").trim();
            if (!term) return null;
            return [
              term,
              ...wideMatrix.topicColumns.map(({ index }) => {
                  const prob = parseTableNumber(row[index]);
                  return Number.isFinite(prob) ? formatTableNumber(prob, 6) : "";
                })
            ];
          })
          .filter(Boolean)
      };

      const title = document.createElement("h3");
      title.className = "result-table-section-title";
      title.textContent = "Tableau général des probabilités par mot";
      container.appendChild(title);

      if (isFallbackTopTermsFile) {
        const warning = document.createElement("p");
        warning.className = "field-help field-help--alert";
        warning.textContent = "Affichage partiel : ce tableau provient de top_terms.csv. Certaines probabilités peuvent manquer tant que topic_term_matrix.csv n'est pas exporté.";
        container.appendChild(warning);
      }

      renderTable(container, matrixParsed, {
        title: options.title || "Probabilités mot × topic",
        maxRows: matrixParsed.rows.length,
        cellClassName: ({ row, columnIndex }) => {
          if (columnIndex === 0) return "lda-matrix-term-cell";
          const numericValues = row
            .slice(1)
            .map((value) => parseTableNumber(String(value || "")))
            .filter((value) => Number.isFinite(value));
          if (!numericValues.length) return "";
          const current = parseTableNumber(String(row[columnIndex] || ""));
          const maxValue = Math.max(...numericValues);
          if (Number.isFinite(current) && Math.abs(current - maxValue) < 1e-12) {
            return "lda-matrix-max-cell";
          }
          return "";
        }
      });
      return;
    }

    const topicIndex = headerIndex(parsed.headers, ["topic"]);
    const termIndex = headerIndex(parsed.headers, ["term", "terme"]);
    const probIndex = headerIndex(parsed.headers, ["prob", "probability", "poids"]);

    if (topicIndex === -1 || termIndex === -1 || probIndex === -1) {
      renderTable(container, parsed, {
        title: options.title || "Top termes par topic",
        emptyMessage: options.emptyMessage
      });
      return;
    }

    const topicMap = new Map();
    parsed.rows.forEach((row) => {
      const topic = String(row[topicIndex] || "").trim();
      const term = String(row[termIndex] || "").trim();
      const prob = parseTableNumber(row[probIndex]);
      if (!topic || !term || !Number.isFinite(prob)) return;
      if (!topicMap.has(term)) topicMap.set(term, new Map());
      topicMap.get(term).set(topic, prob);
    });

    const topics = sortTopicLabels(
      [...new Set(parsed.rows.map((row) => String(row[topicIndex] || "").trim()).filter(Boolean))]
    );

    const entries = [...topicMap.entries()].map(([term, probs]) => {
      const values = topics.map((topic) => probs.get(topic));
      const maxProb = Math.max(...values.filter((value) => Number.isFinite(value)));
      return { term, probs, maxProb };
    });

    entries.sort((left, right) => {
      if (right.maxProb !== left.maxProb) return right.maxProb - left.maxProb;
      return left.term.localeCompare(right.term, undefined, { sensitivity: "base" });
    });

    const matrixParsed = {
      headers: ["Terme", ...topics.map((topic) => topic.replaceAll("_", " "))],
      rows: entries.map(({ term, probs }) => [
        term,
        ...topics.map((topic) => {
          const prob = probs.get(topic);
          return Number.isFinite(prob) ? formatTableNumber(prob, 6) : "";
        })
      ])
    };

    const title = document.createElement("h3");
    title.className = "result-table-section-title";
    title.textContent = "Tableau général des probabilités par mot";
    container.appendChild(title);

    if (isFallbackTopTermsFile) {
      const warning = document.createElement("p");
      warning.className = "field-help field-help--alert";
      warning.textContent = "Affichage partiel : ce tableau provient de top_terms.csv. Certaines probabilités peuvent manquer tant que topic_term_matrix.csv n'est pas exporté.";
      container.appendChild(warning);
    }

    renderTable(container, matrixParsed, {
      title: options.title || "Probabilités mot × topic",
      maxRows: matrixParsed.rows.length,
      cellClassName: ({ row, columnIndex }) => {
        if (columnIndex === 0) return "lda-matrix-term-cell";
        const numericValues = row
          .slice(1)
          .map((value) => parseTableNumber(String(value || "")))
          .filter((value) => Number.isFinite(value));
        if (!numericValues.length) return "";
        const current = parseTableNumber(String(row[columnIndex] || ""));
        const maxValue = Math.max(...numericValues);
        if (Number.isFinite(current) && Math.abs(current - maxValue) < 1e-9) {
          return "lda-matrix-max-cell";
        }
        return "";
      }
    });
  } catch (error) {
    clearContainer(container);
    container.appendChild(createEmptyState("Impossible de lire le tableau général LDA."));
    log(`[error] Lecture CSV impossible (${file.name}): ${error.message}`);
  }
}

function parseLdaTopTermsLookup(parsed) {
  const topicIndex = headerIndex(parsed.headers, ["topic"]);
  const termIndex = headerIndex(parsed.headers, ["term", "terme"]);
  const probIndex = headerIndex(parsed.headers, ["prob", "probability", "poids"]);
  if (topicIndex === -1 || termIndex === -1 || probIndex === -1) {
    return null;
  }

  const topics = new Map();
  parsed.rows.forEach((row) => {
    const topic = String(row[topicIndex] || "").trim();
    const term = String(row[termIndex] || "").trim();
    const prob = parseTableNumber(row[probIndex]);
    if (!topic || !term || !Number.isFinite(prob)) return;
    const canonicalTopic = canonicalizeTopicLabel(topic);
    if (!topics.has(canonicalTopic)) topics.set(canonicalTopic, []);
    topics.get(canonicalTopic).push({ term, prob });
  });

  topics.forEach((entries) => entries.sort((left, right) => right.prob - left.prob));
  return topics;
}

function parseLdaWideTopicMatrix(parsed) {
  const termIndex = headerIndex(parsed.headers, ["term", "terme"]);
  if (termIndex === -1) return null;

  const topicColumns = parsed.headers
    .map((header, index) => ({ header: String(header || "").trim(), index }))
    .filter(({ header, index }) => index !== termIndex && /^topic[_\s-]*\d+/i.test(header));

  if (!topicColumns.length) return null;

  const topics = sortTopicLabels(topicColumns.map(({ header }) => header));
  const orderedTopicColumns = topics.map((topic) => topicColumns.find((column) => column.header === topic)).filter(Boolean);
  const topicMap = new Map(
    topics.map((topic) => [topic, []])
  );

  parsed.rows.forEach((row) => {
    const term = String(row[termIndex] || "").trim();
    if (!term) return;
    topicColumns.forEach(({ header, index }) => {
      const prob = parseTableNumber(row[index]);
      if (!Number.isFinite(prob)) return;
      topicMap.get(header).push({ term, prob });
    });
  });

  topicMap.forEach((entries) => entries.sort((left, right) => right.prob - left.prob));

  return {
    termIndex,
    topics,
    topicColumns: orderedTopicColumns,
    topicMap
  };
}

function parseLdaTopicGroups(parsed) {
  const wideMatrix = parseLdaWideTopicMatrix(parsed);
  if (wideMatrix) {
    return {
      topics: wideMatrix.topics,
      topicMap: wideMatrix.topicMap,
      sourceType: "matrix"
    };
  }

  const topicIndex = headerIndex(parsed.headers, ["topic"]);
  const termIndex = headerIndex(parsed.headers, ["term", "terme"]);
  const probIndex = headerIndex(parsed.headers, ["prob", "probability", "poids"]);
  if (topicIndex === -1 || termIndex === -1 || probIndex === -1) {
    return null;
  }

  const topicMap = new Map();
  parsed.rows.forEach((row) => {
    const topic = String(row[topicIndex] || "").trim();
    const term = String(row[termIndex] || "").trim();
    const prob = parseTableNumber(row[probIndex]);
    if (!topic || !term || !Number.isFinite(prob)) return;
    if (!topicMap.has(topic)) topicMap.set(topic, []);
    topicMap.get(topic).push({ term, prob });
  });

  const topics = sortTopicLabels([...topicMap.keys()]);
  topicMap.forEach((entries) => entries.sort((left, right) => right.prob - left.prob));

  return {
    topics,
    topicMap,
    sourceType: "top_terms"
  };
}

function distributePositions(count, min, max) {
  if (!count) return [];
  if (count === 1) return [(min + max) / 2];
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_value, index) => min + (step * index));
}

function truncateLdaNodeLabel(value, maxLength = 28) {
  const text = String(value || "").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1))}…`;
}

function buildLdaBipartiteGraph(topicGroups, options = {}) {
  const topN = Math.max(4, Number.parseInt(String(options.topN || 12), 10) || 12);
  const scoreMode = options.scoreMode === "relative" ? "relative" : "real";

  const topics = topicGroups.topics
    .map((topic, topicIndex) => {
      const entries = (topicGroups.topicMap.get(topic) || [])
        .filter((entry) => entry && entry.term && Number.isFinite(entry.prob) && entry.prob > 0)
        .slice(0, topN);
      if (!entries.length) return null;
      const retainedSum = entries.reduce((sum, entry) => sum + entry.prob, 0);
      const enrichedEntries = entries.map((entry, rank) => ({
        ...entry,
        rank,
        relativeProb: retainedSum > 0 ? entry.prob / retainedSum : 0
      }));
      return {
        key: topic,
        label: topic.replaceAll("_", " "),
        topicIndex,
        color: getLdaTopicColor(topicIndex),
        entries: enrichedEntries
      };
    })
    .filter(Boolean);

  const wordMap = new Map();
  const edges = [];

  topics.forEach((topic) => {
    topic.entries.forEach((entry) => {
      const score = scoreMode === "relative" ? entry.relativeProb : entry.prob;
      if (!Number.isFinite(score) || score <= 0) return;

      edges.push({
        topicKey: topic.key,
        topicLabel: topic.label,
        topicIndex: topic.topicIndex,
        topicColor: topic.color,
        term: entry.term,
        realProb: entry.prob,
        relativeProb: entry.relativeProb,
        score,
        rank: entry.rank
      });

      const existing = wordMap.get(entry.term) || {
        term: entry.term,
        strongestScore: -Infinity,
        strongestTopicIndex: topic.topicIndex,
        strongestTopicLabel: topic.label,
        strongestTopicColor: topic.color,
        maxRealProb: entry.prob,
        maxRelativeProb: entry.relativeProb,
        links: 0
      };

      existing.links += 1;
      existing.maxRealProb = Math.max(existing.maxRealProb, entry.prob);
      existing.maxRelativeProb = Math.max(existing.maxRelativeProb, entry.relativeProb);

      if (score > existing.strongestScore) {
        existing.strongestScore = score;
        existing.strongestTopicIndex = topic.topicIndex;
        existing.strongestTopicLabel = topic.label;
        existing.strongestTopicColor = topic.color;
      }

      wordMap.set(entry.term, existing);
    });
  });

  const words = [...wordMap.values()].sort((left, right) => {
    if (left.strongestTopicIndex !== right.strongestTopicIndex) {
      return left.strongestTopicIndex - right.strongestTopicIndex;
    }
    if (right.strongestScore !== left.strongestScore) {
      return right.strongestScore - left.strongestScore;
    }
    return left.term.localeCompare(right.term, undefined, { sensitivity: "base" });
  });

  const maxScore = edges.length
    ? Math.max(...edges.map((edge) => edge.score).filter((value) => Number.isFinite(value)))
    : 0;

  return {
    topics,
    words,
    edges,
    maxScore,
    topN,
    scoreMode,
    isPartial: topicGroups.sourceType !== "matrix"
  };
}

function buildLdaBipartiteGraphSvg(graph) {
  if (!graph.edges.length || !graph.topics.length || !graph.words.length) {
    return "";
  }

  const width = 1080;
  const wordBandHeight = Math.max(24, graph.words.length > 40 ? 22 : 26);
  const topicBandHeight = Math.max(70, graph.topics.length > 8 ? 62 : 76);
  const innerHeight = Math.max(
    320,
    Math.max(
      (graph.words.length - 1) * wordBandHeight,
      (graph.topics.length - 1) * topicBandHeight
    )
  );
  const height = innerHeight + 120;
  const topPadding = 58;
  const bottomPadding = 58;
  const topicX = 180;
  const wordX = width - 250;
  const topicNodeRadius = 12;
  const wordNodeRadius = 7;
  const controlSpan = 170;
  const topicYs = distributePositions(graph.topics.length, topPadding, height - bottomPadding);
  const wordYs = distributePositions(graph.words.length, topPadding, height - bottomPadding);
  const topicYMap = new Map(graph.topics.map((topic, index) => [topic.key, topicYs[index]]));
  const wordYMap = new Map(graph.words.map((word, index) => [word.term, wordYs[index]]));

  const gridLines = distributePositions(5, topPadding, height - bottomPadding)
    .map((y) => `<line x1="${topicX + 24}" y1="${y}" x2="${wordX - 24}" y2="${y}" class="lda-network-grid" />`)
    .join("");

  const edgesMarkup = graph.edges
    .map((edge) => {
      const startY = topicYMap.get(edge.topicKey);
      const endY = wordYMap.get(edge.term);
      const weightRatio = graph.maxScore > 0 ? edge.score / graph.maxScore : 0;
      const strokeWidth = 1.2 + (weightRatio * 6.2);
      const strokeOpacity = 0.16 + (weightRatio * 0.76);
      const controlOffset = Math.max(82, controlSpan - (edge.rank * 4));
      const path = [
        `M ${topicX + topicNodeRadius} ${startY}`,
        `C ${topicX + controlOffset} ${startY}, ${wordX - controlOffset} ${endY}, ${wordX - wordNodeRadius} ${endY}`
      ].join(" ");
      const title = [
        `${edge.topicLabel} → ${edge.term}`,
        `Score du modèle : ${formatTableNumber(edge.realProb, 6)}`
      ].join(" | ");
      return `<path d="${path}" fill="none" stroke="${edge.topicColor}" stroke-width="${strokeWidth.toFixed(2)}" stroke-opacity="${strokeOpacity.toFixed(3)}"><title>${escapeHtml(title)}</title></path>`;
    })
    .join("");

  const topicNodesMarkup = graph.topics
    .map((topic) => {
      const y = topicYMap.get(topic.key);
      return `
        <g class="lda-network-topic-node">
          <text x="${topicX - 26}" y="${y + 5}" text-anchor="end" class="lda-network-topic-label">${escapeHtml(topic.label)}</text>
          <circle cx="${topicX}" cy="${y}" r="${topicNodeRadius}" fill="${topic.color}" stroke="rgba(17,17,17,0.22)" stroke-width="1.2"></circle>
        </g>
      `;
    })
    .join("");

  const wordNodesMarkup = graph.words
    .map((word) => {
      const y = wordYMap.get(word.term);
      const label = truncateLdaNodeLabel(word.term, 34);
      const title = [
        word.term,
        `Topic dominant : ${word.strongestTopicLabel}`,
        `Score du modèle max : ${formatTableNumber(word.maxRealProb, 6)}`
      ].join(" | ");
      return `
        <g class="lda-network-word-node">
          <circle cx="${wordX}" cy="${y}" r="${wordNodeRadius}" fill="#fffdf8" stroke="${word.strongestTopicColor}" stroke-width="${word.links > 1 ? 2.2 : 1.4}"></circle>
          <text x="${wordX + 18}" y="${y + 4}" class="lda-network-word-label">${escapeHtml(label)}</text>
          <title>${escapeHtml(title)}</title>
        </g>
      `;
    })
    .join("");

  return `
    <svg class="lda-network-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Réseau topics × mots">
      <rect x="0" y="0" width="${width}" height="${height}" rx="18" ry="18" class="lda-network-background"></rect>
      ${gridLines}
      ${edgesMarkup}
      ${topicNodesMarkup}
      ${wordNodesMarkup}
    </svg>
  `;
}

async function renderLdaBipartiteNetwork(container, file, options = {}) {
  clearContainer(container);

  if (!file) {
    container.appendChild(createEmptyState(options.emptyMessage || "Aucun export CSV LDA exploitable n'a été trouvé."));
    return;
  }

  try {
    const parsed = parseCsv(await file.text());
    const topicGroups = parseLdaTopicGroups(parsed);
    if (!topicGroups?.topics?.length) {
      container.appendChild(createEmptyState(options.emptyMessage || "Aucun export CSV LDA exploitable n'a été trouvé."));
      return;
    }

    const title = document.createElement("h3");
    title.className = "result-table-section-title";
    title.textContent = options.heading || "Réseau topics × mots";
    container.appendChild(title);

    const intro = document.createElement("p");
    intro.className = "result-table-caption";
    intro.textContent = "Chaque lien relie un topic à un mot. Plus le lien est visible, plus le mot est important dans ce topic.";
    container.appendChild(intro);

    const scoreHelp = document.createElement("p");
    scoreHelp.className = "field-help";
    scoreHelp.textContent = "Score du modèle : probabilité P(mot | topic) calculée par le LDA.";
    container.appendChild(scoreHelp);

    if (topicGroups.sourceType !== "matrix") {
      const warning = document.createElement("p");
      warning.className = "field-help field-help--alert";
      warning.textContent = "Affichage partiel : le réseau est construit à partir de top_terms.csv. Pour un réseau complet, relancez LDA avec topic_term_matrix.csv.";
      container.appendChild(warning);
    }

    const controls = document.createElement("div");
    controls.className = "lda-network-controls";
    controls.innerHTML = `
      <label class="lda-network-control">
        <span>Mots retenus par topic</span>
        <select data-lda-network-topn>
          <option value="10" selected>10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </label>
    `;
    container.appendChild(controls);

    const metrics = document.createElement("p");
    metrics.className = "lda-network-metrics";
    container.appendChild(metrics);

    const canvas = document.createElement("div");
    canvas.className = "lda-network-canvas";
    container.appendChild(canvas);

    const topNSelect = controls.querySelector("[data-lda-network-topn]");
    if (topNSelect instanceof HTMLSelectElement && Number.isFinite(options.defaultTopN)) {
      topNSelect.value = String(options.defaultTopN);
    }

    const draw = () => {
      const graph = buildLdaBipartiteGraph(topicGroups, {
        scoreMode: "real",
        topN: topNSelect instanceof HTMLSelectElement ? topNSelect.value : 10
      });

      metrics.textContent = `${graph.topics.length} topic(s) · ${graph.words.length} mot(s) visibles · ${graph.edges.length} lien(s)`;

      if (!graph.edges.length) {
        canvas.innerHTML = "";
        canvas.appendChild(createEmptyState("Aucun lien exploitable n'a été trouvé pour ce réseau LDA."));
        return;
      }

      canvas.innerHTML = buildLdaBipartiteGraphSvg(graph);
    };

    topNSelect?.addEventListener("change", draw);
    draw();
  } catch (error) {
    clearContainer(container);
    container.appendChild(createEmptyState("Impossible de lire le réseau LDA."));
    log(`[error] Lecture CSV impossible (${file.name}): ${error.message}`);
  }
}

async function renderLdaDocTopicsWithWords(container, topTermsFile, options = {}) {
  clearContainer(container);

  if (!topTermsFile) {
    container.appendChild(
      createEmptyState(options.emptyMessage || "Aucun export CSV de top termes LDA n'a été trouvé.")
    );
    return;
  }

  try {
    const parsed = parseCsv(await topTermsFile.text());
    if (!parsed.headers.length) {
      container.appendChild(
        createEmptyState(options.emptyMessage || "Aucun export CSV de top termes LDA n'a été trouvé.")
      );
      return;
    }

    const topicIndex = headerIndex(parsed.headers, ["topic"]);
    const termIndex = headerIndex(parsed.headers, ["term", "terme"]);
    const probIndex = headerIndex(parsed.headers, ["prob", "probability", "poids"]);

    if (topicIndex === -1 || termIndex === -1 || probIndex === -1) {
      renderTable(container, parsed, {
        title: options.title || "Mots classés par topic",
        emptyMessage: options.emptyMessage
      });
      return;
    }

    const groups = new Map();
    parsed.rows.forEach((row) => {
      const topic = String(row[topicIndex] || "").trim();
      const term = String(row[termIndex] || "").trim();
      const prob = parseTableNumber(row[probIndex]);
      if (!topic || !term || !Number.isFinite(prob)) return;
      if (!groups.has(topic)) groups.set(topic, []);
      groups.get(topic).push({ term, prob });
    });

    const topics = sortTopicLabels([...groups.keys()]);
    const orderedGroups = topics.map((topic) =>
      [...groups.get(topic)].sort((left, right) => right.prob - left.prob)
    );
    const maxRank = orderedGroups.reduce((acc, rows) => Math.max(acc, rows.length), 0);

    const parsedTable = {
      headers: ["Rang", ...topics.map((topic) => topic.replaceAll("_", " "))],
      rows: Array.from({ length: maxRank }, (_, rankIndex) => [
        String(rankIndex + 1),
        ...orderedGroups.map((rows) => {
          const entry = rows[rankIndex];
          if (!entry) return "—";
          return `${entry.term}|||${formatTableNumber(entry.prob, 6)}`;
        })
      ])
    };

    const title = document.createElement("h3");
    title.className = "result-table-section-title";
    title.textContent = "Tableau des mots par topic";
    container.appendChild(title);

    renderTable(container, parsedTable, {
      title: options.title || "Tableau des mots par topic",
      maxRows: 250,
      cellRenderer: ({ cell, columnIndex }) => {
        if (columnIndex === 0) return null;
        const raw = String(cell || "");
        if (!raw.includes("|||")) return null;
        const [term, prob] = raw.split("|||");
        return {
          html: `<strong>${escapeHtml(term)}</strong><br><span class="lda-topic-inline-prob">${escapeHtml(prob)}</span>`
        };
      },
      cellClassName: ({ row, columnIndex }) => {
        if (columnIndex > 0) return "lda-matrix-term-cell";
        return "";
      }
    });
  } catch (error) {
    clearContainer(container);
    container.appendChild(createEmptyState("Impossible de lire le tableau des mots par topic LDA."));
    log(`[error] Lecture CSV impossible (${topTermsFile.name}): ${error.message}`);
  }
}

async function renderLdaDocTopicsSummary(container, file, options = {}) {
  clearContainer(container);

  if (!file) {
    container.appendChild(
      createEmptyState(options.emptyMessage || "Aucun export CSV de distribution topics/documents n'a été trouvé.")
    );
    return;
  }

  try {
    const parsed = parseCsv(await file.text());
    if (!parsed.headers.length) {
      container.appendChild(
        createEmptyState(options.emptyMessage || "Aucun export CSV de distribution topics/documents n'a été trouvé.")
      );
      return;
    }

    const docIdIndex = headerIndex(parsed.headers, ["doc_id", "document", "doc"]);
    const topicColumns = parsed.headers
      .map((header, index) => ({ header: String(header || "").trim(), index }))
      .filter(({ header, index }) => index !== docIdIndex && /^topic[_\s-]*\d+/i.test(header));

    if (!topicColumns.length) {
      renderTable(container, parsed, {
        title: options.title || "Distribution topics / documents",
        emptyMessage: options.emptyMessage
      });
      return;
    }

    const summaryByTopic = new Map(
      topicColumns.map(({ header }) => [
        header,
        { docs: 0, sumProb: 0, maxProb: 0 }
      ])
    );

    parsed.rows.forEach((row) => {
      let bestTopic = null;
      let bestProb = -Infinity;
      topicColumns.forEach(({ header, index }) => {
        const prob = parseTableNumber(row[index]);
        if (!Number.isFinite(prob)) return;
        if (prob > bestProb) {
          bestProb = prob;
          bestTopic = header;
        }
      });

      if (!bestTopic || !Number.isFinite(bestProb)) return;
      const bucket = summaryByTopic.get(bestTopic);
      bucket.docs += 1;
      bucket.sumProb += bestProb;
      bucket.maxProb = Math.max(bucket.maxProb, bestProb);
    });

    const summaryParsed = {
      headers: ["Topic", "Segments dominés", "Part des segments", "Probabilité moyenne", "Probabilité max"],
      rows: sortTopicLabels([...summaryByTopic.keys()]).map((topic) => {
        const item = summaryByTopic.get(topic);
        const share = parsed.rows.length > 0 ? item.docs / parsed.rows.length : 0;
        const avgProb = item.docs > 0 ? item.sumProb / item.docs : 0;
        return [
          topic.replaceAll("_", " "),
          String(item.docs),
          `${formatTableNumber(share * 100, 1)} %`,
          `${formatTableNumber(avgProb * 100, 1)} %`,
          `${formatTableNumber(item.maxProb * 100, 1)} %`
        ];
      })
    };

    const title = document.createElement("h3");
    title.className = "result-table-section-title";
    title.textContent = "Répartition dominante des segments par topic";
    container.appendChild(title);

    renderTable(container, summaryParsed, {
      title: options.title || "Synthèse topics / documents",
      maxRows: topicColumns.length,
      rowClassName: ({ rowIndex }) => `lda-summary-row lda-summary-row--${rowIndex % 4}`
    });
  } catch (error) {
    clearContainer(container);
    container.appendChild(createEmptyState("Impossible de lire la distribution topics/documents."));
    log(`[error] Lecture CSV impossible (${file.name}): ${error.message}`);
  }
}

function headerIndex(headers, candidates) {
  const normalized = headers.map((header) => String(header || "").replace(/^\ufeff/, "").trim().toLowerCase());
  for (const candidate of candidates) {
    const index = normalized.indexOf(candidate.toLowerCase());
    if (index !== -1) return index;
  }
  return -1;
}

function canonicalizeTopicLabel(value) {
  const raw = String(value || "").replace(/^\ufeff/, "").trim();
  if (!raw) return "";

  const numericMatch = raw.match(/(\d+)/);
  if (numericMatch) {
    return `topic_${Number.parseInt(numericMatch[1], 10)}`;
  }

  return raw
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_");
}

function sortClassLabels(labels) {
  return [...labels].sort((left, right) => {
    const leftNum = Number.parseInt(String(left).replace(/[^\d-]/g, ""), 10);
    const rightNum = Number.parseInt(String(right).replace(/[^\d-]/g, ""), 10);
    if (Number.isFinite(leftNum) && Number.isFinite(rightNum)) return leftNum - rightNum;
    return String(left).localeCompare(String(right), undefined, { numeric: true });
  });
}

function parseTableNumber(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return Number.NaN;
  const normalized = raw.replace(/\s+/g, "").replace(",", ".");
  return Number.parseFloat(normalized);
}

function formatTableNumber(value, digits) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "";
  return numeric.toFixed(digits);
}

function formatScientificNumber(value, digits = 6) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "";
  if (numeric === 0) return "0";
  return numeric.toExponential(Math.max(0, digits - 1));
}

function normalizeChdTypeValue(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return ["", "na", "nan", "null", "undefined"].includes(normalized) ? "" : normalized;
}

function formatAfcFrequencyValue(value) {
  const numeric = parseTableNumber(value);
  if (!Number.isFinite(numeric)) return String(value ?? "");
  return Number.isInteger(numeric) ? String(numeric) : formatTableNumber(numeric, 6);
}

function highlightAfcSegment(segment, term) {
  const rawSegment = String(segment ?? "");
  const normalizedTerm = String(term ?? "").trim();
  if (!rawSegment.trim() || !normalizedTerm) {
    return escapeHtml(rawSegment);
  }

  const regex = buildLooseTermRegex(normalizedTerm, "giu");
  let found = false;
  const highlighted = rawSegment.replace(regex, (_match, prefix, core, suffix) => {
    found = true;
    return `${escapeHtml(prefix)}<span class="afc-highlight">${escapeHtml(core)}</span>${escapeHtml(suffix)}`;
  });

  return found ? highlighted : escapeHtml(rawSegment);
}

async function renderAfcTermsByClass(container, file, options = {}) {
  clearContainer(container);

  if (!file) {
    container.appendChild(createEmptyState(options.emptyMessage || "Le fichier afc/stats_termes.csv est absent."));
    return;
  }

  try {
    const parsed = parseCsv(await file.text());
    if (!parsed.headers.length) {
      container.appendChild(createEmptyState(options.emptyMessage || "Le fichier afc/stats_termes.csv est absent."));
      return;
    }

    const classIndex = headerIndex(parsed.headers, ["classe_max"]);
    const termIndex = headerIndex(parsed.headers, ["terme"]);
    const frequencyIndex = headerIndex(parsed.headers, ["frequency"]);
    const chi2Index = headerIndex(parsed.headers, ["chi2"]);
    const pValueIndex = headerIndex(parsed.headers, ["p_value"]);
    const segmentIndex = headerIndex(parsed.headers, ["segment_texte"]);

    if (classIndex === -1 || termIndex === -1) {
      renderTable(container, parsed, {
        title: options.title || "stats_termes.csv",
        emptyMessage: options.emptyMessage
      });
      return;
    }

    const groups = new Map();
    parsed.rows.forEach((row) => {
      const classLabel = String(row[classIndex] || "").trim();
      if (!classLabel) return;
      if (!groups.has(classLabel)) groups.set(classLabel, []);
      groups.get(classLabel).push(row);
    });

    if (!groups.size) {
      container.appendChild(createEmptyState("AFC mots : aucune classe disponible."));
      return;
    }

    for (const classLabel of sortClassLabels(groups.keys())) {
      const section = document.createElement("section");
      section.className = "result-pane--spaced";

      const heading = document.createElement("h4");
      heading.className = "result-table-section-title";
      heading.textContent = classLabel;
      section.appendChild(heading);

      const rows = [...(groups.get(classLabel) || [])];
      if (chi2Index !== -1) {
        rows.sort((left, right) => parseTableNumber(right[chi2Index]) - parseTableNumber(left[chi2Index]));
      }

      const limitedRows = rows.slice(0, 100).map((row) => [
        termIndex === -1 ? "" : String(row[termIndex] ?? ""),
        frequencyIndex === -1 ? "" : formatAfcFrequencyValue(row[frequencyIndex]),
        chi2Index === -1 ? "" : formatTableNumber(parseTableNumber(row[chi2Index]), 6),
        pValueIndex === -1 ? "" : formatTableNumber(parseTableNumber(row[pValueIndex]), 6),
        segmentIndex === -1 ? "" : String(row[segmentIndex] ?? "")
      ]);

      renderTable(
        section,
        {
          headers: ["Terme", "frequency", "chi2", "p_value", "Segment_texte"],
          rows: limitedRows
        },
        {
          title: classLabel,
          maxRows: limitedRows.length,
          cellRenderer: ({ cell, row, columnIndex, headers }) => {
            const segmentColumnIndex = headerIndex(headers, ["segment_texte"]);
            const termColumnIndex = headerIndex(headers, ["terme"]);
            if (columnIndex === segmentColumnIndex) {
              return {
                html: highlightAfcSegment(cell, row[termColumnIndex]),
                className: "afc-segment-cell"
              };
            }
            return null;
          }
        }
      );

      container.appendChild(section);
    }
  } catch (error) {
    clearContainer(container);
    container.appendChild(createEmptyState("Impossible de lire la table AFC des termes."));
    log(`[error] Lecture AFC termes impossible (${file.name}) : ${error.message}`);
  }
}

function extractChdStatsCloneParsed(parsed, classLabel, options = {}) {
  const significanceThreshold = Number.isFinite(options.significanceThreshold)
    ? options.significanceThreshold
    : 0.05;

  if (!parsed?.headers?.length) {
    return {
      headers: ["Message"],
      rows: [["Statistiques indisponibles."]],
      rowClasses: []
    };
  }

  const classIndex = headerIndex(parsed.headers, ["classe"]);
  const termIndex = headerIndex(parsed.headers, ["terme"]);
  if (classIndex === -1 || termIndex === -1) {
    return {
      headers: ["Message"],
      rows: [["Statistiques indisponibles."]],
      rowClasses: []
    };
  }

  const chi2Index = headerIndex(parsed.headers, ["chi2"]);
  const frequencyIndex = headerIndex(parsed.headers, ["frequency"]);
  const effStIndex = headerIndex(parsed.headers, ["eff_st"]);
  const effTotalIndex = headerIndex(parsed.headers, ["eff_total"]);
  const percentageIndex = headerIndex(parsed.headers, ["pourcentage"]);
  const pIndex = headerIndex(parsed.headers, ["p", "p_value"]);
  const pScientificIndex = headerIndex(parsed.headers, ["p_scientifique"]);
  const pThresholdIndex = headerIndex(parsed.headers, ["p_seuil_01"]);
  const typeIndex = headerIndex(parsed.headers, ["type", "pos"]);

  let rows = parsed.rows.filter((row) => normalizeClassValue(row[classIndex]) === normalizeClassValue(classLabel));

  if (chi2Index !== -1) {
    rows = rows.filter((row) => {
      const chi2 = parseTableNumber(row[chi2Index]);
      return Number.isFinite(chi2) && chi2 > 0;
    });

    rows.sort((left, right) => {
      const rightChi2 = parseTableNumber(right[chi2Index]);
      const leftChi2 = parseTableNumber(left[chi2Index]);
      if (rightChi2 !== leftChi2) return rightChi2 - leftChi2;

      const rightFrequency = frequencyIndex === -1 ? Number.NEGATIVE_INFINITY : parseTableNumber(right[frequencyIndex]);
      const leftFrequency = frequencyIndex === -1 ? Number.NEGATIVE_INFINITY : parseTableNumber(left[frequencyIndex]);
      return rightFrequency - leftFrequency;
    });
  }

  if (!rows.length) {
    return {
      headers: ["Message"],
      rows: [["Aucun terme disponible pour cette classe avec les filtres actuels."]],
      rowClasses: []
    };
  }

  const cloneRows = rows.map((row, index) => {
    const frequency = frequencyIndex === -1 ? Number.NaN : parseTableNumber(row[frequencyIndex]);
    const effTotalRaw = effTotalIndex === -1 ? Number.NaN : parseTableNumber(row[effTotalIndex]);
    const effTotal = Number.isFinite(effTotalRaw) ? effTotalRaw : frequency;

    const docprop = headerIndex(parsed.headers, ["docprop"]) === -1
      ? Number.NaN
      : parseTableNumber(row[headerIndex(parsed.headers, ["docprop"])]);

    const effStRaw = effStIndex === -1 ? Number.NaN : parseTableNumber(row[effStIndex]);
    const effSt = Number.isFinite(effStRaw)
      ? effStRaw
      : (Number.isFinite(docprop) && Number.isFinite(effTotal) ? Math.round(docprop * effTotal) : Number.NaN);

    const percentageRaw = percentageIndex === -1 ? Number.NaN : parseTableNumber(row[percentageIndex]);
    const percentage = Number.isFinite(percentageRaw)
      ? percentageRaw
      : (Number.isFinite(effSt) && Number.isFinite(effTotal) && effTotal > 0 ? (100 * effSt) / effTotal : Number.NaN);

    const chi2 = chi2Index === -1 ? Number.NaN : parseTableNumber(row[chi2Index]);
    const pValue = pIndex === -1 ? Number.NaN : parseTableNumber(row[pIndex]);
    const pScientificValue = pScientificIndex === -1
      ? formatScientificNumber(pValue, 6)
      : String(row[pScientificIndex] ?? "").trim();
    const pThresholdValue = pThresholdIndex === -1
      ? (Number.isFinite(pValue) && pValue <= 0.01 ? "p <= 0.01" : "")
      : String(row[pThresholdIndex] ?? "").trim();
    const typeValue = typeIndex === -1 ? "" : normalizeChdTypeValue(row[typeIndex]);

    return {
      values: [
        String(index),
        String(row[termIndex] ?? ""),
        Number.isFinite(effSt) ? String(Math.round(effSt)) : "",
        Number.isFinite(effTotal) ? String(Math.round(effTotal)) : "",
        formatTableNumber(percentage, 2),
        formatTableNumber(chi2, 3),
        formatTableNumber(pValue, 6),
        pScientificValue,
        pThresholdValue,
        typeValue
      ],
      nonSignificant: Number.isFinite(pValue) && pValue > significanceThreshold
    };
  });

  return {
    headers: ["num", "forme", "eff. s.t.", "eff. total", "pourcentage", "chi2", "p.value", "p.value (sci.)", "seuil p", "Type"],
    rows: cloneRows.map((entry) => entry.values),
    rowClasses: cloneRows.map((entry) => (entry.nonSignificant ? "is-chd-non-significant" : ""))
  };
}

function renderChdStatsByClass(container, parsed, options = {}) {
  clearContainer(container);

  if (!parsed || !parsed.headers.length) {
    container.appendChild(createEmptyState(options.emptyMessage || "Aucune statistique CHD disponible."));
    return;
  }

  const classColumnIndex = headerIndex(parsed.headers, ["classe", "classe_brut"]);
  if (classColumnIndex === -1) {
    renderTable(container, parsed, options);
    return;
  }

  const groups = new Map();
  parsed.rows.forEach((row) => {
    const rawClass = String(row[classColumnIndex] || "").trim();
    const classLabel = normalizeClassValue(rawClass);
    if (!groups.has(classLabel)) groups.set(classLabel, []);
    groups.get(classLabel).push(row);
  });

  if (!groups.size) {
    renderTable(container, parsed, options);
    return;
  }

  const tabs = document.createElement("div");
  tabs.className = "local-tabs";

  const panelsWrap = document.createElement("div");
  panelsWrap.className = "local-tab-panels";

  const descriptors = sortClassLabels(groups.keys()).map((label) => ({
    label: label === "Sans classe" ? label : `Classe ${label}`,
    rows: groups.get(label)
  }));

  descriptors.forEach((descriptor, index) => {
    const maxPValue = parseTableNumber(document.getElementById("maxP")?.value);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `local-tab-button${index === 0 ? " is-active" : ""}`;
    button.textContent = descriptor.label;

    const panel = document.createElement("section");
    panel.className = `local-tab-panel${index === 0 ? " is-active" : ""}`;
    panel.hidden = index !== 0;

    const cloneParsed = extractChdStatsCloneParsed(parsed, descriptor.label, {
      significanceThreshold: Number.isFinite(maxPValue) ? maxPValue : 0.05
    });

    renderTable(
      panel,
      { headers: cloneParsed.headers, rows: cloneParsed.rows },
      {
        title: descriptor.label,
        maxRows: cloneParsed.rows.length,
        emptyMessage: options.emptyMessage,
        rowClassName: ({ rowIndex }) => cloneParsed.rowClasses[rowIndex] || "",
        cellClassName: ({ rowIndex, columnIndex, headers }) => {
          const isNonSignificant = cloneParsed.rowClasses[rowIndex] === "is-chd-non-significant";
          if (!isNonSignificant) return "";
          const termColumnIndex = headerIndex(headers, ["forme", "terme"]);
          const pValueColumnIndexes = [
            headerIndex(headers, ["p.value", "p_value", "p"]),
            headerIndex(headers, ["p.value (sci.)"]),
            headerIndex(headers, ["seuil p"])
          ].filter((value) => value !== -1);
          if (columnIndex === termColumnIndex || pValueColumnIndexes.includes(columnIndex)) {
            return "is-chd-non-significant-cell";
          }
          return "";
        },
        onCellClick: ({ cell, rowIndex, columnIndex, headers }) => {
          const termColumnIndex = headerIndex(headers, ["forme", "terme"]);
          if (columnIndex !== termColumnIndex) return null;
          const termValue = String(cell || "").trim();
          if (!termValue) return null;
          const isNonSignificant = cloneParsed.rowClasses[rowIndex] === "is-chd-non-significant";
          return {
            clickable: true,
            className: isNonSignificant ? "is-chd-non-significant-cell" : "",
            onClick: () => openTermSegmentsDialog(normalizeClassValue(descriptor.label), termValue),
            onContextMenu: (event) =>
              openChdTermContextMenu({
                event,
                term: termValue,
                classLabel: normalizeClassValue(descriptor.label)
              })
          };
        }
      }
    );

    button.addEventListener("click", () => {
      tabs.querySelectorAll(".local-tab-button").forEach((item) => item.classList.remove("is-active"));
      panelsWrap.querySelectorAll(".local-tab-panel").forEach((item) => {
        item.classList.remove("is-active");
        item.hidden = true;
      });
      button.classList.add("is-active");
      panel.classList.add("is-active");
      panel.hidden = false;
    });

    tabs.appendChild(button);
    panelsWrap.appendChild(panel);
  });

  container.appendChild(tabs);
  container.appendChild(panelsWrap);
}

async function renderCombinedTables(container, descriptors, emptyMessage) {
  clearContainer(container);

  const available = descriptors.filter((descriptor) => descriptor.file);
  if (!available.length) {
    container.appendChild(createEmptyState(emptyMessage));
    return;
  }

  for (const descriptor of available) {
    const section = document.createElement("section");
    section.className = "result-pane--spaced";

    try {
      const text = await descriptor.file.text();
      renderTable(section, parseCsv(text), {
        title: descriptor.title,
        maxRows: descriptor.maxRows || 60,
        emptyMessage
      });
    } catch (error) {
      section.appendChild(createEmptyState(`Lecture impossible pour ${descriptor.title}.`));
      log(`[error] Lecture CSV impossible (${descriptor.file.name}): ${error.message}`);
    }

    container.appendChild(section);
  }
}

async function loadCorpusPreview(file) {
  try {
    const text = await file.text();
    appState.corpusText = text;
    appState.afcStarredVariablesChoices = extractStarredVariablesFromCorpusText(text);
    const preview = text.slice(0, 4000).trim();
    corpusPreview.textContent = preview || "Le fichier est vide.";
    renderAfcStarredVariablesPickers(document, { resetSelection: true });
  } catch (error) {
    appState.corpusText = "";
    appState.afcStarredVariablesChoices = [];
    corpusPreview.textContent = "Impossible de lire un apercu du fichier.";
    renderAfcStarredVariablesPickers(document, { resetSelection: true });
    log(`[error] Lecture du fichier impossible: ${error.message}`);
  }
}

function syncFieldValue(source, target) {
  if (!source || !target) return;
  if (source instanceof HTMLInputElement && target instanceof HTMLInputElement) {
    if (source.type === "checkbox" || source.type === "radio") {
      target.checked = source.checked;
      return;
    }
  }
  if ("value" in target) {
    target.value = source.value;
  }
}

function applyDialogValuesToSource() {
  const dialogFields = chdConfigDialogContent.querySelectorAll("[data-source-id]");
  dialogFields.forEach((dialogField) => {
    const source = document.getElementById(dialogField.dataset.sourceId);
    if (!source) return;

    if (dialogField instanceof HTMLInputElement && source instanceof HTMLInputElement) {
      if (dialogField.type === "checkbox" || dialogField.type === "radio") {
        source.checked = dialogField.checked;
        if (dialogField.type !== "radio" || dialogField.checked) {
          source.dispatchEvent(new Event("change", { bubbles: true }));
        }
      } else {
        source.value = dialogField.value;
        source.dispatchEvent(new Event("change", { bubbles: true }));
      }
      return;
    }

    if ("value" in dialogField && "value" in source) {
      source.value = dialogField.value;
      source.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  renderClassificationModeCards(document);
  renderLdaMorphoPickers(document);
}

function applyDialogValues(dialogContent) {
  const dialogFields = dialogContent.querySelectorAll("[data-source-id]");
  dialogFields.forEach((dialogField) => {
    const source = document.getElementById(dialogField.dataset.sourceId);
    if (!source) return;

    if (dialogField instanceof HTMLInputElement && source instanceof HTMLInputElement) {
      if (dialogField.type === "checkbox" || dialogField.type === "radio") {
        source.checked = dialogField.checked;
        if (dialogField.type !== "radio" || dialogField.checked) {
          source.dispatchEvent(new Event("change", { bubbles: true }));
        }
      } else {
        source.value = dialogField.value;
        source.dispatchEvent(new Event("change", { bubbles: true }));
      }
      return;
    }

    if ("value" in dialogField && "value" in source) {
      source.value = dialogField.value;
      source.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  renderClassificationModeCards(document);
  renderLdaMorphoPickers(document);
}

function populateChdConfigDialog() {
  chdConfigDialogContent.innerHTML = "";

  chdConfigSourceCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.removeAttribute("data-chd-config-source");

    clone.querySelectorAll("[id]").forEach((element) => {
      const originalId = element.id;
      element.dataset.sourceId = originalId;
      element.id = `${originalId}__dialog`;

      const source = document.getElementById(originalId);
      if (source) {
        syncFieldValue(source, element);
      }
    });

    clone.querySelectorAll("label[for]").forEach((label) => {
      label.htmlFor = `${label.htmlFor}__dialog`;
    });

    chdConfigDialogContent.appendChild(clone);
  });
}

function populateConfigDialog(dialogContent, sourceCards, suffix = "__dialog") {
  dialogContent.innerHTML = "";

  sourceCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.removeAttribute("data-chd-config-source");
    clone.removeAttribute("data-simi-config-source");

    clone.querySelectorAll("[id]").forEach((element) => {
      const originalId = element.id;
      element.dataset.sourceId = originalId;
      element.id = `${originalId}${suffix}`;

      const source = document.getElementById(originalId);
      if (source) {
        syncFieldValue(source, element);
      }
    });

    clone.querySelectorAll("label[for]").forEach((label) => {
      label.htmlFor = `${label.htmlFor}${suffix}`;
    });

    clone.querySelectorAll("input[type='radio'][name]").forEach((radio) => {
      radio.name = `${radio.name}${suffix}`;
    });

    dialogContent.appendChild(clone);
  });
}

function openChdConfigDialog() {
  if (!chdConfigDialog || !chdConfigDialogContent) {
    log("[error] Boîte de dialogue CHD introuvable dans l'interface.");
    return;
  }

  try {
    populateConfigDialog(chdConfigDialogContent, chdConfigSourceCards, "__dialog");
    renderMorphoPickers(chdConfigDialogContent);
    renderAfcStarredVariablesPickers(chdConfigDialogContent);
    renderClassificationModeCards(chdConfigDialogContent);

    if (typeof chdConfigDialog.showModal === "function") {
      chdConfigDialog.showModal();
    } else if (typeof chdConfigDialog.show === "function") {
      chdConfigDialog.show();
    } else {
      chdConfigDialog.setAttribute("open", "");
    }
  } catch (error) {
    log(`[error] Ouverture de la boîte CHD impossible : ${error?.message || String(error)}`);
  }
}

function closeChdConfigDialog() {
  if (chdConfigDialog.open) {
    chdConfigDialog.close();
  }
}

async function openSimiConfigDialog() {
  populateConfigDialog(simiConfigDialogContent, simiConfigSourceCards, "__simi_dialog");
  renderSimiTermsPickers(simiConfigDialogContent);
  if (typeof simiConfigDialog.showModal === "function") {
    simiConfigDialog.showModal();
  }
}

function closeSimiConfigDialog() {
  if (simiConfigDialog.open) {
    simiConfigDialog.close();
  }
}

function openLdaConfigDialog() {
  populateConfigDialog(ldaConfigDialogContent, ldaConfigSourceCards, "__lda_dialog");
  renderLdaMorphoPickers(ldaConfigDialogContent);
  if (typeof ldaConfigDialog.showModal === "function") {
    ldaConfigDialog.showModal();
  }
}

function closeLdaConfigDialog() {
  if (ldaConfigDialog.open) {
    ldaConfigDialog.close();
  }
}

function buildExportsIndex(fileList) {
  const entries = fileList.map((file) => ({
    file,
    relativePath: getRelativePath(file),
    normalizedPath: normalizePath(getRelativePath(file))
  }));

  const index = new Map(entries.map((entry) => [entry.normalizedPath, entry.file]));

  return { entries, index };
}

function findFile(index, predicates) {
  for (const [path, file] of index.entries()) {
    if (predicates.some((predicate) => predicate(path))) {
      return file;
    }
  }
  return null;
}

function findFiles(index, predicate) {
  return Array.from(index.entries())
    .filter(([path]) => predicate(path))
    .map(([path, file]) => ({ path, file }));
}

async function renderExports(entries, index) {
  clearObjectUrls();
  appState.chdSegmentsByClass = new Map();
  resetSimiTermsState();

  appState.chdDendrogramFiles = new Map([
    ["iramuteq", findFile(index, [(path) => path.endsWith("dendrogramme_chd.png")])],
    ["factoextra", findFile(index, [(path) => path.endsWith("dendrogramme_chd_factoextra.png")])]
  ]);
  renderSelectableChdDendrogram();

  const chdSegmentsFile = findFile(index, [(path) => path.endsWith("segments_par_classe.txt")]);
  if (chdSegmentsFile) {
    try {
      appState.chdSegmentsByClass = parseSegmentsByClassText(await chdSegmentsFile.text());
    } catch (error) {
      appState.chdSegmentsByClass = new Map();
      log(`[error] Lecture TXT impossible (${chdSegmentsFile.name}): ${error.message}`);
    }
  }

  const chdStatsFile = findFile(index, [(path) => path.endsWith("stats_par_classe.csv")]);
  if (!chdStatsFile) {
    clearContainer(resultContainers.chdStatsTable);
    resultContainers.chdStatsTable.appendChild(
      createEmptyState("Le fichier stats_par_classe.csv est absent du dossier d'exports.")
    );
  } else {
    try {
      const parsedChdStats = parseCsv(await chdStatsFile.text());
      syncSimiTermsChoicesFromChdStats(parsedChdStats);
      renderChdStatsByClass(resultContainers.chdStatsTable, parsedChdStats, {
        title: "stats_par_classe.csv",
        emptyMessage: "Le fichier stats_par_classe.csv est vide."
      });
      renderSimiTermsPickers(document, { resetSelection: true });
    } catch (error) {
      clearContainer(resultContainers.chdStatsTable);
      resultContainers.chdStatsTable.appendChild(createEmptyState("Impossible de lire les statistiques CHD."));
      log(`[error] Lecture CSV impossible (${chdStatsFile.name}): ${error.message}`);
    }
  }

  const concordancierFile = findFile(index, [
    (path) => path.endsWith("segments_par_classe.html"),
    (path) => path.endsWith("concordancier.html"),
    (path) => path.endsWith("concordancier_afc.html")
  ]);

  if (concordancierFile) {
    try {
      renderHtmlFrame(
        resultContainers.chdConcordancier,
        await concordancierFile.text(),
        "Aucun concordancier HTML disponible."
      );
    } catch (error) {
      renderHtmlFrame(resultContainers.chdConcordancier, "", "Impossible de lire le concordancier HTML.");
      log(`[error] Lecture HTML impossible (${concordancierFile.name}): ${error.message}`);
    }
  } else {
    renderHtmlFrame(resultContainers.chdConcordancier, "", "Aucun concordancier HTML disponible.");
  }

  const wordcloudFiles = findFiles(
    index,
    (path) => path.endsWith(".png") && path.startsWith("wordclouds/")
  )
    .sort((left, right) => left.path.localeCompare(right.path, undefined, { numeric: true }))
    .map(({ path, file }) => ({
      file,
      title: path
        .replace(/^.*wordclouds\//, "")
        .replace("_wordcloud.png", "")
        .replace("cluster_", "Classe ")
    }));

  renderImageGallery(
    resultContainers.chdWordclouds,
    wordcloudFiles,
        "Aucun nuage de mots exporté dans wordclouds/.",
    {
      onImageClick: ({ title, src }) => openImagePreview(title, src, "CHD")
    }
  );

  renderImage(
    resultContainers.afcClassesPlot,
    findFile(index, [(path) => path.endsWith("afc/afc_classes.png")]),
    "AFC des classes"
  );

  renderImage(
    resultContainers.afcTermsPlot,
    findFile(index, [(path) => path.endsWith("afc/afc_termes.png")]),
    "AFC des termes"
  );

  renderImage(
    resultContainers.afcVarsPlot,
    findFile(index, [(path) => path.endsWith("afc/afc_variables_etoilees.png")]),
    "AFC des variables etoilees"
  );

  await renderAfcTermsByClass(
    resultContainers.afcTermsTable,
    findFile(index, [(path) => path.endsWith("afc/stats_termes.csv")]),
    {
      title: "stats_termes.csv",
      emptyMessage: "Le fichier afc/stats_termes.csv est absent."
    }
  );

  await renderCsvFromFile(
    resultContainers.afcVarsTable,
    findFile(index, [(path) => path.endsWith("afc/stats_modalites.csv")]),
    {
      title: "stats_modalites.csv",
      emptyMessage: "Le fichier afc/stats_modalites.csv est absent."
    }
  );

  await renderCombinedTables(
    resultContainers.afcEigTable,
    [
      {
        title: "valeurs_propres.csv",
        file: findFile(index, [(path) => path.endsWith("afc/valeurs_propres.csv")])
      },
      {
        title: "valeurs_propres_vars.csv",
        file: findFile(index, [(path) => path.endsWith("afc/valeurs_propres_vars.csv")])
      }
    ],
    "Aucune table de valeurs propres disponible."
  );

  const ldaWordcloudFiles = findFiles(
    index,
    (path) => path.endsWith(".png") && (path.includes("wordcloud_lda") || path.includes("lda/wordcloud"))
  )
    .sort((left, right) => left.path.localeCompare(right.path, undefined, { numeric: true }))
    .map(({ path, file }) => ({
      file,
      title: path.split("/").pop().replace(".png", "")
    }));

  renderImageGallery(
    resultContainers.ldaWordclouds,
    ldaWordcloudFiles,
    "Aucun nuage LDA détecté dans le dossier chargé.",
    {
      onImageClick: ({ title, src }) => openImagePreview(title, src, "LDA")
    }
  );

  const ldaVisHtmlFile = findFile(index, [
    (path) => path.endsWith("lda/pyldavis.html"),
    (path) => path.endsWith("pyldavis.html")
  ]);
  if (ldaVisHtmlFile) {
    try {
      renderHtmlFrame(
        resultContainers.ldaBubblePlot,
        await ldaVisHtmlFile.text(),
        "Impossible de lire la visualisation pyLDAvis."
      );
    } catch (error) {
      clearContainer(resultContainers.ldaBubblePlot);
      resultContainers.ldaBubblePlot.appendChild(createEmptyState("Impossible de lire la visualisation pyLDAvis."));
      log(`[error] Lecture HTML impossible (${ldaVisHtmlFile.name}): ${error.message}`);
    }
  } else {
    clearContainer(resultContainers.ldaBubblePlot);
    resultContainers.ldaBubblePlot.appendChild(
      createEmptyState("Visualisation pyLDAvis indisponible. Vérifiez que le package Python pyLDAvis est installé.")
    );
  }

  const ldaHeatmapFile = findFile(index, [
    (path) => path.endsWith("lda/heatmap_lda.png"),
    (path) => path.endsWith("/heatmap_lda.png"),
    (path) => path.endsWith("heatmap_lda.png")
  ]);
  if (ldaHeatmapFile) {
    renderImage(resultContainers.ldaHeatmap, ldaHeatmapFile, "Heatmap LDA mots × topics");
    const heatmapImage = resultContainers.ldaHeatmap?.querySelector(".result-image");
    if (heatmapImage instanceof HTMLImageElement) {
      heatmapImage.classList.add("is-clickable");
      heatmapImage.addEventListener("click", () =>
        openImagePreview("Heatmap mots × topics", heatmapImage.src, "LDA")
      );
    }
  } else {
    clearContainer(resultContainers.ldaHeatmap);
    resultContainers.ldaHeatmap.appendChild(
      createEmptyState("Aucune heatmap LDA détectée dans le dossier chargé.")
    );
  }

  const ldaTopTermsFile = findFile(index, [
    (path) => path.endsWith("lda/topic_term_matrix.csv"),
    (path) => path.endsWith("/topic_term_matrix.csv"),
    (path) => path.endsWith("topic_term_matrix.csv"),
    (path) => path.endsWith("lda/top_terms.csv"),
    (path) => path.endsWith("/top_terms.csv"),
    (path) => path.endsWith("top_terms.csv"),
    (path) => path.endsWith("lda/topics.csv"),
    (path) => path.endsWith("/topics.csv") && !path.endsWith("doc_topics.csv") && !path.endsWith("documents_topics.csv")
  ]);
  log(`[info] Fichier LDA retenu pour les mots : ${ldaTopTermsFile?.name || "aucun"}.`);
  await renderLdaBipartiteNetwork(
    resultContainers.ldaNetwork,
    ldaTopTermsFile,
    {
      heading: "Réseau topics × mots",
      emptyMessage: "Aucun export CSV LDA exploitable n'a été trouvé."
    }
  );

  await renderLdaTopTermsMatrix(
    resultContainers.ldaTopTerms,
    ldaTopTermsFile,
    {
      title: "Probabilités mot × topic",
      emptyMessage: "Aucun export CSV de top termes LDA n'a été trouvé."
    }
  );

  await renderLdaTopTermsByTopic(
    resultContainers.ldaDocTopics,
    ldaTopTermsFile,
    {
      heading: "Tableaux par topic",
      title: "Tableaux par topic",
      emptyMessage: "Aucun export CSV de top termes LDA n'a été trouvé."
    }
  );

  const ldaSegmentsFile = findFile(index, [
    (path) => path.endsWith("lda/lda_python_output.json"),
    (path) => path.endsWith("/lda_python_output.json"),
    (path) => path.endsWith("lda_python_output.json"),
    (path) => path.endsWith("lda/segments_topics.csv"),
    (path) => path.endsWith("/segments_topics.csv"),
    (path) => path.endsWith("segments_topics.csv")
  ]);
  await renderLdaTopicSegments(
    resultContainers.ldaSegments,
    ldaSegmentsFile,
    {
      heading: "Segments de texte par topic",
      topTermsFile: ldaTopTermsFile,
      highlightTermsPerTopic: 20,
      emptyMessage: "Aucun export CSV de segments LDA n'a été trouvé."
    }
  );

  clearContainer(resultContainers.ldaTopicWords);

  const similitudeHtmlFile = findFile(index, [
    (path) => path.endsWith(".html") && path.includes("simi"),
    (path) => path.endsWith(".html") && path.includes("simil"),
    (path) => path.endsWith(".png") && path.includes("simi"),
    (path) => path.endsWith(".png") && path.includes("simil")
  ]);

  if (similitudeHtmlFile?.name.endsWith(".html")) {
    try {
      renderHtmlFrame(
        resultContainers.simiGraph,
        await similitudeHtmlFile.text(),
        "Aucun graphe de similitudes exporté."
      );
    } catch (error) {
      renderHtmlFrame(resultContainers.simiGraph, "", "Impossible de lire le graphe HTML.");
      log(`[error] Lecture HTML impossible (${similitudeHtmlFile.name}): ${error.message}`);
    }
  } else if (similitudeHtmlFile) {
    renderImage(resultContainers.simiGraph, similitudeHtmlFile, "Graphe de similitudes");
  } else {
    clearContainer(resultContainers.simiGraph);
    resultContainers.simiGraph.appendChild(createEmptyState("Aucun graphe de similitudes exporté."));
  }

  appState.exportEntries = entries;
  renderResults(entries.map((entry) => entry.relativePath));
}

async function handleExportsFolderSelection(fileList, navigationTarget = "resultats_chd") {
  const files = Array.from(fileList || []);

  if (!files.length) {
    return;
  }

  const firstPath = files[0].virtualRelativePath || files[0].webkitRelativePath || "";
  const folderName = firstPath.split("/")[0] || "exports";
  const { entries, index } = buildExportsIndex(files);

  appState.exportsFolderName = folderName;
  if (sidebarStatus) sidebarStatus.textContent = "Exports chargés dans l'application";

  await renderExports(entries, index);
  activateTopTab(navigationTarget);
  if (navigationTarget === "resultats_chd") {
    activateChdSubTab("dendrogramme");
  }
  log(`[info] Dossier d'exports chargé : ${folderName} (${entries.length} fichiers).`);
}

function resetResultPanes() {
  appState.outputDir = null;
  appState.exportsFolderName = null;
  appState.exportEntries = [];
  appState.analysisHistory = [];
  appState.activeAnalysisHistoryId = null;
  appState.chdSegmentsByClass = new Map();
  appState.afcTermsZoom = 1;
  appState.simiZoom = 1;
  resetSimiTermsState();
  updateDownloadResultsState();
  renderAnalysisHistory();
  const messages = {
    chdDendrogramme: "Chargez un dossier d'exports pour afficher les dendrogrammes CHD.",
    chdStatsTable: "Chargez un dossier d'exports pour afficher les statistiques CHD.",
    chdConcordancier: "Chargez un dossier d'exports pour afficher le concordancier HTML.",
    chdWordclouds: "Chargez un dossier d'exports pour afficher les nuages de mots.",
    afcClassesPlot: "Chargez un dossier d'exports pour afficher l'AFC des classes.",
    afcTermsPlot: "Chargez un dossier d'exports pour afficher l'AFC des termes.",
    afcTermsTable: "Chargez un dossier d'exports pour afficher la table AFC des termes.",
    afcVarsPlot: "Chargez un dossier d'exports pour afficher les variables etoilees.",
    afcVarsTable: "Chargez un dossier d'exports pour afficher les modalites projetees.",
    afcEigTable: "Chargez un dossier d'exports pour afficher les valeurs propres.",
    ldaBubblePlot: "Chargez un dossier d'exports LDA pour afficher la visualisation pyLDAvis.",
    ldaHeatmap: "Chargez un dossier d'exports LDA pour afficher la heatmap mots × topics.",
    ldaNetwork: "Chargez un dossier d'exports LDA pour afficher le réseau topics × mots.",
    ldaWordclouds: "Chargez un dossier d'exports LDA pour afficher les nuages par topic.",
    ldaTopTerms: "Chargez un dossier d'exports LDA pour afficher le tableau général des probabilités.",
    ldaSegments: "Chargez un dossier d'exports LDA pour afficher les segments de texte par topic.",
    ldaDocTopics: "Chargez un dossier d'exports LDA pour afficher le tableau des mots par topic.",
    ldaTopicWords: "Chargez un dossier d'exports LDA pour afficher le détail des topics.",
    simiGraph: "Vous devez réaliser une CHD avant l'analyse de similitudes."
  };

  Object.entries(resultContainers).forEach(([key, container]) => {
    clearContainer(container);
    container.appendChild(createEmptyState(messages[key]));
  });

  renderAnalysisSteps([]);
  renderAnalysisSummary(null);
  renderZipfChart(null);
  applySimiZoom();
}

topNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    activateTopTab(link.dataset.tabTarget);
  });
});

document.querySelectorAll("[data-open-chd-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    openChdConfigDialog();
  });
});

document.querySelectorAll("[data-open-simi-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    void openSimiConfigDialog();
  });
});

document.querySelectorAll("[data-open-lda-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    openLdaConfigDialog();
  });
});

closeChdDialogBtn.addEventListener("click", () => {
  closeChdConfigDialog();
});

launchChdDialogBtn.addEventListener("click", () => {
  applyDialogValuesToSource();
  closeChdConfigDialog();
  activateTopTab("analyse");
  log("[info] Lancement de l'analyse CHD depuis la boite de dialogue.");
  void startAnalysis();
});

closeSimiDialogBtn.addEventListener("click", () => {
  closeSimiConfigDialog();
});

launchSimiDialogBtn.addEventListener("click", () => {
  applyDialogValues(simiConfigDialogContent);
  renderSimiTermsPickers(document);
  closeSimiConfigDialog();
  activateTopTab("analyse");
  log("[info] Lancement de l'analyse de similitudes depuis la boite de dialogue.");
  void startAnalysis("simi");
});

closeLdaDialogBtn.addEventListener("click", () => {
  closeLdaConfigDialog();
});

closeImagePreviewBtn?.addEventListener("click", () => {
  closeImagePreview();
});

closeTermSegmentsBtn?.addEventListener("click", () => {
  closeTermSegmentsDialog();
});

termSegmentsDialog?.addEventListener("close", () => {
  setTermSegmentsExportState();
  setTermChartExportState();
});

buildSubcorpusBtn?.addEventListener("click", () => {
  void saveCurrentSubcorpus();
});

saveChi2PngBtn?.addEventListener("click", () => {
  void saveCurrentChi2Chart();
});

chdTermContextMenu?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const actionButton = target.closest("[data-chd-term-action]");
  if (!actionButton) return;
  event.preventDefault();
  void invokeChdAction(actionButton.getAttribute("data-chd-term-action") || "");
});

simiZoomInBtn?.addEventListener("click", () => {
  setSimiZoom(appState.simiZoom + 0.2);
});

simiZoomOutBtn?.addEventListener("click", () => {
  setSimiZoom(appState.simiZoom - 0.2);
});

simiZoomResetBtn?.addEventListener("click", () => {
  setSimiZoom(1);
});

afcTermsZoomInBtn?.addEventListener("click", () => {
  setAfcTermsZoom(appState.afcTermsZoom + 0.2);
});

afcTermsZoomOutBtn?.addEventListener("click", () => {
  setAfcTermsZoom(appState.afcTermsZoom - 0.2);
});

afcTermsZoomResetBtn?.addEventListener("click", () => {
  setAfcTermsZoom(1);
});

launchLdaDialogBtn.addEventListener("click", () => {
  applyDialogValues(ldaConfigDialogContent);
  closeLdaConfigDialog();
  activateTopTab("analyse");
  log("[info] Lancement de l'analyse LDA depuis la boite de dialogue.");
  void startAnalysis("lda");
});

document.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.matches("[data-simi-top-terms-input]")) return;

  const card = target.closest("[data-simi-config-card]");
  if (card) {
    renderSimiTermsPicker(card, { resetSelection: true });
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const addButton = target.closest("[data-morpho-add-btn]");
  if (!addButton) return;

  const card = addButton.closest("[data-chd-morpho-card]");
  if (!card) return;

  const hiddenInput = card.querySelector("[data-morpho-selected-input]");
  const select = card.querySelector("[data-morpho-available-select]");
  if (!hiddenInput || !select || !select.value) return;

  const selected = splitCsvValues(hiddenInput.value).map((value) => value.toUpperCase());
  if (!selected.includes(select.value)) {
    hiddenInput.value = [...selected, select.value].join(", ");
  }
  renderMorphoPicker(card);
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const addButton = target.closest("[data-lda-morpho-add-btn]");
  if (!addButton) return;

  const card = addButton.closest("[data-lda-morpho-card]");
  if (!card) return;

  const hiddenInput = card.querySelector("[data-lda-morpho-selected-input]");
  const select = card.querySelector("[data-lda-morpho-available-select]");
  if (!hiddenInput || !select || !select.value) return;

  const selected = splitCsvValues(hiddenInput.value).map((value) => value.toUpperCase());
  if (!selected.includes(select.value)) {
    hiddenInput.value = [...selected, select.value].join(", ");
  }
  renderLdaMorphoPicker(card);
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.matches("[data-morpho-available-select]")) return;

  const card = target.closest("[data-chd-morpho-card]");
  if (card) {
    renderMorphoPicker(card);
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const addButton = target.closest("[data-afc-starred-add-btn]");
  if (!addButton) return;

  const card = addButton.closest("[data-afc-starred-variables-card]");
  if (!card) return;

  const hiddenInput = card.querySelector("[data-afc-starred-selected-input]");
  const select = card.querySelector("[data-afc-starred-available-select]");
  if (!hiddenInput || !select || !select.value) return;

  const selected = splitCsvValues(hiddenInput.value).map((value) => normalizeStarredVariableName(value));
  const nextValue = normalizeStarredVariableName(select.value);
  if (!selected.some((value) => value.toLowerCase() === nextValue.toLowerCase())) {
    hiddenInput.value = [...selected, nextValue].join(", ");
  }
  renderAfcStarredVariablesPicker(card);
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.matches("[data-lda-morpho-available-select]")) return;

  const card = target.closest("[data-lda-morpho-card]");
  if (card) {
    renderLdaMorphoPicker(card);
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.matches("[data-classification-radio]")) return;
  if (target instanceof HTMLInputElement && !target.checked) return;

  const card = target.closest("[data-classification-mode-card]");
  if (!card) return;

  const hiddenInput = card.querySelector("#classificationMode, [data-source-id='classificationMode']");
  if (!hiddenInput) return;

  hiddenInput.value = target.value === "double" ? "double" : "simple";
  renderClassificationModeCard(card);
});

chdSubNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    activateChdSubTab(link.dataset.subtabTarget);
  });
});

ldaSubNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    activateLdaSubTab(link.dataset.ldaSubtabTarget);
  });
});

chdDendrogramSelect.addEventListener("change", () => {
  renderSelectableChdDendrogram();
});

window.addEventListener("resize", () => {
  syncDendrogramSizing();
  applyAfcTermsZoom();
});

importCorpusBtn.addEventListener("click", () => {
  corpusFileInput.click();
});

annotationImportBtn?.addEventListener("click", () => {
  annotationImportCsv?.click();
});

annotationCorpusText?.addEventListener("input", () => {
  renderAnnotationPreview();
});

annotationCorpusText?.addEventListener("mouseup", () => {
  updateAnnotationSelectionFields(getAnnotationSelectionFromTextarea());
});

annotationCorpusText?.addEventListener("keyup", () => {
  updateAnnotationSelectionFields(getAnnotationSelectionFromTextarea());
});

annotationSelection?.addEventListener("input", () => {
  if (annotationNorm) {
    annotationNorm.value = buildAnnotationNormValue(annotationSelection.value);
  }
});

annotationAddEntryBtn?.addEventListener("click", () => {
  try {
    const selectionValue =
      annotationSelection?.value || getAnnotationSelectionFromTextarea() || "";
    const dicMot = normalizeAnnotationSelectionValue(selectionValue);
    const dicNorm =
      normalizeAnnotationSelectionValue(annotationNorm?.value) || buildAnnotationNormValue(selectionValue);
    const dicMorpho = normalizeAnnotationMorphoValue(annotationMorpho?.value);

    if (!dicMot || !dicNorm) {
      log("[error] dic_mot et dic_norm sont obligatoires.");
      return;
    }

    const entries = [...appState.expressionAnnotations];
    const existingIndex = entries.findIndex((entry) => entry.dic_mot === dicMot);
    const entry = { dic_mot: dicMot, dic_norm: dicNorm, dic_morpho: dicMorpho };
    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }

    setAnnotationEntries(entries);
    fillAnnotationEditor(entry);
    log(
      existingIndex >= 0
        ? `[info] Entrée dictionnaire mise à jour : ${dicMot}.`
        : `[info] Entrée dictionnaire ajoutée : ${dicMot}.`
    );
  } catch (error) {
    log(`[error] Ajout / modification impossible : ${error?.message || String(error)}`);
  }
});

annotationRemoveEntryBtn?.addEventListener("click", () => {
  const key = normalizeAnnotationSelectionValue(annotationRemoveKey?.value);
  if (!key) return;
  setAnnotationEntries(appState.expressionAnnotations.filter((entry) => entry.dic_mot !== key));
  log("[info] Entrée supprimée (si existante).");
});

annotationImportCsv?.addEventListener("change", async () => {
  const file = annotationImportCsv.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const entries = parseAnnotationCsv(text);
    if (!entries.length) {
      log("[error] CSV annotation invalide ou vide : colonnes attendues dic_mot et dic_norm.");
      return;
    }
    setAnnotationEntries(entries, { imported: true });
  } catch (error) {
    log(`[error] Erreur pendant l'import du dictionnaire : ${error?.message || String(error)}`);
  } finally {
    annotationImportCsv.value = "";
  }
});

annotationDownloadCsvBtn?.addEventListener("click", async () => {
  const content = buildAnnotationCsvContent();
  const tauriInvoke = getTauriInvoke();

  if (!tauriInvoke) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "add_expression_fr.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    log("[info] Export add_expression_fr.csv préparé.");
    setAnnotationSaveStatus("Le navigateur a préparé le téléchargement de add_expression_fr.csv.");
    return;
  }

  try {
    annotationDownloadCsvBtn.disabled = true;
    annotationDownloadCsvBtn.textContent = "Préparation...";
    setAnnotationSaveStatus("Création de l'export add_expression_fr.csv en cours...");
    const payload = await tauriInvoke("save_annotation_dictionary_export", {
      content,
      filename: "add_expression_fr.csv"
    });
    log(`[info] add_expression_fr.csv enregistré : ${payload.savedPath || payload.filename}`);
    setAnnotationSaveStatus(`Fichier enregistré : ${payload.savedPath || payload.filename}`);
    await revealInFileManager(payload.savedPath || payload.filename);
    log("[info] Emplacement de add_expression_fr.csv ouvert dans le gestionnaire de fichiers.");
  } catch (nativeError) {
    try {
      const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "add_expression_fr.csv";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      log("[info] Export add_expression_fr.csv préparé.");
      log(`[info] Cause du fallback : ${nativeError?.message || String(nativeError)}`);
      setAnnotationSaveStatus(
        "Le navigateur a préparé le téléchargement de add_expression_fr.csv. Vérifie ton dossier Téléchargements."
      );
    } catch (fallbackError) {
      log(`[error] Téléchargement de add_expression_fr.csv impossible : ${fallbackError?.message || String(fallbackError)}`);
      setAnnotationSaveStatus(
        `Enregistrement impossible : ${fallbackError?.message || String(fallbackError)}`,
        { isError: true }
      );
    }
  } finally {
    annotationDownloadCsvBtn.disabled = false;
    annotationDownloadCsvBtn.textContent = "Enregistrer add_expression_fr.csv";
  }
});

corpusFileInput.addEventListener("change", async () => {
  const selectedFile = corpusFileInput.files?.[0];

  if (!selectedFile) {
    appState.corpusFileName = null;
    appState.corpusText = "";
    appState.afcStarredVariablesChoices = [];
    resetSimiTermsState();
    fileInfo.textContent = "Aucun fichier sélectionné.";
    if (sidebarStatus) sidebarStatus.textContent = "";
    corpusPreview.textContent = "Importez un fichier texte pour afficher un extrait ici.";
    if (annotationCorpusText) annotationCorpusText.value = "";
    renderAnnotationPreview();
    renderAfcStarredVariablesPickers(document, { resetSelection: true });
    renderSimiTermsPickers(document);
    updateDownloadResultsState();
    return;
  }

  resetResultPanes();
  appState.corpusFileName = selectedFile.name;
  fileInfo.textContent = `Fichier: ${selectedFile.name} (${getFileSizeLabel(selectedFile)})`;
  if (sidebarStatus) sidebarStatus.textContent = "";
  await loadCorpusPreview(selectedFile);
  if (annotationCorpusText) {
    annotationCorpusText.value = appState.corpusText;
  }
  renderAnnotationPreview();
  resetSimiTermsState();
  renderSimiTermsPickers(document);
  log(`[info] Corpus sélectionné : ${selectedFile.name}`);
});

document.addEventListener("click", (event) => {
  if (chdTermContextMenu && !chdTermContextMenu.hidden) {
    const target = event.target;
    if (!(target instanceof Node) || !chdTermContextMenu.contains(target)) {
      closeChdTermContextMenu();
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeChdTermContextMenu();
  }
});

document.addEventListener("scroll", () => {
  closeChdTermContextMenu();
}, true);

document.addEventListener("click", (event) => {
  const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!anchor) return;

  const href = anchor.getAttribute("href");
  if (!href || !/^https?:\/\//i.test(href)) return;

  event.preventDefault();
  void openExternalUrl(href);
});

async function startAnalysis(analysisKind = "chd") {
  const waitForNextPaint = () =>
    new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
  const wait = (ms) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  closeParameterDialogs([chdConfigDialog, simiConfigDialog, ldaConfigDialog]);

  const selectedFile = corpusFileInput.files?.[0];

  if (!selectedFile) {
    activateTopTab("corpus");
    log("[error] Veuillez importer un corpus avant de lancer l'analyse.");
    return;
  }

  const analysis = document.getElementById("analysisType").value;
  const minFreq = Number(document.getElementById("minFreq").value);
  const statsMode = document.getElementById("statsMode").value;
  const kIramuteq = Number(document.getElementById("kIramuteq").value);
  const ldaK = Math.max(2, Number(document.getElementById("ldaK").value) || 6);
  const tauriInvoke = getTauriInvoke();
  const isLdaMode = analysisKind === "lda";
  const isSimiMode = analysisKind === "simi";

  if (isSimiMode && !appState.simiTermsChoices.length) {
    activateTopTab("similitudes");
    log("[error] L'analyse de similitudes nécessite d'abord une CHD pour récupérer les termes les plus fréquents.");
    return;
  }

  const progressTitle = isLdaMode
    ? "Analyse LDA"
    : isSimiMode
      ? "Analyse de similitudes"
      : "Analyse CHD";
  const progressStartMessage = isLdaMode
    ? "Préparation du modèle LDA..."
    : isSimiMode
      ? "Préparation du graphe de similitudes..."
      : "Préparation de la CHD...";

  if (sidebarStatus) sidebarStatus.textContent = "";
  activateTopTab("analyse");
  progression.open(progressTitle, progressStartMessage);
  await waitForNextPaint();
  if (isLdaMode) {
    log(`[info] Démarrage analyse LDA : topics=${ldaK}, unité=${document.getElementById("language").value}`);
  } else if (isSimiMode) {
    log(`[info] Démarrage analyse de similitudes : méthode=${document.getElementById("simiMethod").value}`);
  } else {
    log(
      `[info] Démarrage analyse : moteur=${analysis}, classes=${kIramuteq}, minFreq=${minFreq}, stats=${statsMode}`
    );
  }
  progression.set(4, progressStartMessage);

  if (!tauriInvoke) {
    const checkpoints = isLdaMode
      ? [
          [18, "Préparation du corpus"],
          [42, "Segmentation et préparation LDA"],
          [76, "Modélisation des topics"],
          [100, "Exports LDA prêts à afficher"]
        ]
      : isSimiMode
        ? [
            [18, "Préparation du corpus"],
            [46, "Construction de la matrice de similitudes"],
            [82, "Génération du graphe"],
            [100, "Exports similitudes prêts à afficher"]
          ]
      : [
          [18, "Préparation du corpus"],
          [36, "Nettoyage et dictionnaire"],
          [61, "Classification CHD"],
          [82, "Exports + tableaux"],
          [100, "Analyse prête à afficher"]
        ];

    for (const [value, message] of checkpoints) {
      await new Promise((resolve) => setTimeout(resolve, 280));
      progression.set(value, message);
      log(`[info] ${message}`);
    }

    renderAnalysisSteps(checkpoints.map(([, message]) => message));
    renderAnalysisSummary(null);
    renderZipfChart(null);
    if (sidebarStatus) sidebarStatus.textContent = "";
    log("[info] Le pipeline R n'est pas disponible hors environnement Tauri.");
    progression.close();
    return;
  }

  try {
    const bootstrap = await ensureDependenciesReady();
    if (!bootstrap?.success) {
      if (sidebarStatus) sidebarStatus.textContent = "Packages incomplets";
      progression.set(0);
      log("[error] L'analyse est bloquée tant que les packages requis ne sont pas installés.");
      progression.close();
      return;
    }

    const corpusText = await selectedFile.text();
    const config = buildJobConfig(analysisKind);
    let streamedLogCount = 0;

    progression.set(12, "Envoi du corpus au backend...");
    log("[info] Envoi du corpus à Python pour orchestration du job R.");

    const session = await tauriInvoke("start_python_analysis", {
      corpusName: selectedFile.name,
      corpusText,
      config
    });
    log(`[info] Job lancé : ${session.jobId}`);

    let payload = null;
    while (!payload) {
      const snapshot = await tauriInvoke("read_python_analysis_status", {
        jobId: session.jobId
      });

      const progressValue = Math.max(4, Math.min(99, Number(snapshot.progress) || 0));
      progression.set(
        snapshot.completed && snapshot.success ? 99 : progressValue,
        snapshot.message || "Traitement du job..."
      );

      const statusLogs = Array.isArray(snapshot.logs) ? snapshot.logs : [];
      if (statusLogs.length > streamedLogCount) {
        statusLogs.slice(streamedLogCount).forEach((line) => log(line));
        streamedLogCount = statusLogs.length;
      }

      if (snapshot.completed) {
        if (!snapshot.success) {
          const failureLines = statusLogs.length ? statusLogs : [snapshot.message || "Le job Python a échoué."];
          throw new Error(failureLines.join("\n"));
        }
        payload = snapshot;
        break;
      }

      await wait(350);
    }

    appState.outputDir = payload.outputDir || null;

    progression.set(96, "Traitement des exports...");

    renderAnalysisSteps(payload.logs || []);
    renderAnalysisSummary(payload.summary || null);
    renderZipfChart(payload.summary || null);

    let artifactFiles = [];
    if (payload.outputDir) {
      try {
        const refreshedArtifacts = await tauriInvoke("collect_output_artifacts", {
          outputDir: payload.outputDir
        });
        artifactFiles = Array.isArray(refreshedArtifacts.files) ? refreshedArtifacts.files : [];
      } catch (refreshError) {
        log(
          `[error] Relecture directe des exports impossible : ${refreshError?.message || String(refreshError)}`
        );
      }
    }
    if (!artifactFiles.length && Array.isArray(payload.files)) {
      artifactFiles = payload.files;
    }

    log(`[info] Exports récupérés par l'UI : ${artifactFiles.length} fichier(s).`);

    const virtualFiles = artifactFiles.map((artifact) =>
      createVirtualFileFromArtifact(artifact, payload.jobId || "exports")
    );

    const navigationTarget = isLdaMode ? "lda" : isSimiMode ? "similitudes" : "resultats_chd";

    if (virtualFiles.length) {
      await handleExportsFolderSelection(virtualFiles, navigationTarget);
      rememberAnalysisHistoryEntry({
        id: payload.jobId || `${analysisKind}-${Date.now()}`,
        jobId: payload.jobId || null,
        analysisKind,
        createdAt: new Date().toISOString(),
        corpusName: selectedFile.name,
        folderName: payload.jobId || "exports",
        outputDir: payload.outputDir || null,
        navigationTarget,
        summary: payload.summary || null,
        logs: Array.isArray(payload.logs) ? payload.logs : [],
        artifacts: artifactFiles
      });
    } else {
      log("[error] Aucun export exploitable n'a été récupéré après l'analyse.");
      activateTopTab(navigationTarget);
    }

    progression.set(100, "Analyse terminée.");
    if (sidebarStatus) sidebarStatus.textContent = "";
    const summary = payload.summary || {};
    log(
      isLdaMode
        ? `[info] Analyse LDA terminée : topics=${ldaK}, fichiers=${virtualFiles.length}.`
        : isSimiMode
          ? `[info] Analyse de similitudes terminée : fichiers=${virtualFiles.length}.`
        : `[info] Analyse terminée : segments=${summary.n_segments ?? "?"}, classes=${summary.n_classes ?? "?"}, fichiers=${virtualFiles.length}.`
    );
    log(`[info] Exports backend: ${payload.outputDir}`);
    progression.close();
  } catch (error) {
    if (sidebarStatus) sidebarStatus.textContent = "Échec de l'analyse";
    progression.set(0, "Échec de l'analyse.");
    const message = error?.message || String(error);
    const lines = String(message)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) {
      log("[error] Échec d'analyse sans message détaillé.");
    } else {
      lines.forEach((line, index) => {
        log(index === 0 ? `[error] ${line}` : line);
      });
    }
    progression.close();
  }
}

activateTopTab("analyse");
activateChdSubTab("dendrogramme");
resetResultPanes();
renderResults([]);
syncDendrogramSizing();
renderMorphoPickers(document);
renderAfcStarredVariablesPickers(document, { resetSelection: true });
renderLdaMorphoPickers(document);
renderClassificationModeCards(document);
renderSimiTermsPickers(document);
populateAnnotationMorphoOptions();
renderAnnotationDictionaryTable();
renderAnnotationPreview();
void resetAnnotationEntriesOnStartup();
void ensureDependenciesReady();
void loadHelpMarkdown(helpMarkdownContent, "help.md");
void loadHelpMarkdown(helpMorphoMarkdownContent, "pos_lexique.md");
void loadHelpMarkdown(helpLdaMarkdownContent, "lda.md");
