import { categories, discoveries, catalogMeta } from "./catalog.mjs";
import { directoryModules, filterDirectory, validateDirectory } from "./directory.mjs";
import { filterDiscoveries, sanitizePreferences, toggleId, validateCatalog, STORAGE_KEY } from "./core.mjs";

if (validateCatalog(discoveries).length || validateDirectory(directoryModules).length) throw new Error("Invalid concept catalog or directory");
const el = (id) => document.getElementById(id);
const html = (value) => String(value).replace(/[&<>"']/g, (char) => (
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]
));
const validIds = discoveries.map((item) => item.id);
let stored = {};
try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { /* unavailable or malformed */ }
let prefs = sanitizePreferences(stored, validIds);
let activeTab = "feed", category = "all", query = "", openId = null, activeDirectory = null, toastTimer;

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); }
  catch { notify("Storage unavailable: saved changes may not persist"); }
}
function notify(message) {
  const target = el("toast");
  target.textContent = message;
  target.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => target.classList.remove("visible"), 2800);
}
function saved(id) { return prefs.saved.includes(id); }
function found(id) { return prefs.found.includes(id); }
function label(id) { return categories.find((c) => c.id === id)?.label || id.toUpperCase(); }
function spoiler(item) { return prefs.hideSpoilers && item.spoiler; }

function showTab(tab) {
  if (!["feed", "map", "discover", "saved"].includes(tab)) return;
  activeTab = tab;
  for (const view of document.querySelectorAll(".page")) view.hidden = view.id !== "view-" + tab;
  for (const button of document.querySelectorAll(".tabbar button")) {
    const selected = button.dataset.tab === tab;
    button.classList.toggle("active", selected);
    if (selected) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  }
  history.replaceState(null, "", "#" + tab);
  window.scrollTo({ top: 0, behavior: "instant" });
}
function renderCategories() {
  el("feedCategories").innerHTML = categories.map((c) =>
    '<button type="button" data-category="' + html(c.id) + '" class="' +
    (c.id === category ? "active" : "") + '" aria-pressed="' + (c.id === category) +
    '">' + html(c.label) + '</button>'
  ).join("");
}
function reel(item, index) {
  return '<article class="reel art-' + html(item.art) + '" aria-label="' + html(item.title) + '">' +
    '<div class="reel-top"><span>' + html(item.eyebrow) + '</span><b>■ DEMO</b></div>' +
    '<div class="reel-serial" aria-hidden="true">' + String(index + 1).padStart(2, "0") + '</div>' +
    '<div class="reel-bottom"><div class="reel-copy">' +
    '<div class="reel-category">' + html(label(item.category)) + ' / ' + html(item.area) + '</div>' +
    '<h2>' + html(spoiler(item) ? "SPOILER SHIELDED" : item.title) + '</h2>' +
    '<p>' + html(spoiler(item) ? "Sensitive preview hidden. Open the file to reveal the concept." : item.summary) + '</p>' +
    '<div class="tags">' + item.tags.map((tag) => '<span>' + html(tag) + '</span>').join("") + '</div>' +
    '<div class="media-note">▶  VIDEO PENDING RIGHTS REVIEW</div></div>' +
    '<div class="reel-actions"><button type="button" data-action="save" data-id="' + html(item.id) +
    '" aria-label="' + (saved(item.id) ? "Remove bookmark" : "Bookmark") + '" aria-pressed="' +
    saved(item.id) + '" class="' + (saved(item.id) ? "saved" : "") + '"><strong>★</strong><small>SAVE</small></button>' +
    '<button type="button" data-action="map" data-id="' + html(item.id) +
    '" aria-label="Show concept map"><strong>⌖</strong><small>MAP</small></button>' +
    '<button type="button" data-action="detail" data-id="' + html(item.id) +
    '" aria-label="Read discovery file"><strong>↗</strong><small>FILE</small></button></div></div></article>';
}
function renderFeed() {
  renderCategories();
  const items = filterDiscoveries(discoveries, { category });
  el("reelFeed").innerHTML = items.length ? items.map(reel).join("") : '<div class="empty">NO SIGNAL HERE.</div>';
}
function file(item, index) {
  return '<article class="file-card"><span class="file-index">' + String(index + 1).padStart(2, "0") + '</span>' +
    '<div class="file-meta"><b>' + html(item.title) + '</b><small>' + html(label(item.category)) +
    ' / ' + html(item.area) + '</small></div><div class="file-actions">' +
    '<button type="button" data-action="detail" data-id="' + html(item.id) + '">OPEN ↗</button>' +
    '<button type="button" data-action="save" data-id="' + html(item.id) + '">' +
    (saved(item.id) ? '★' : '☆') + '</button></div></article>';
}
function renderMap(highlightId = null) {
  el("mapPins").innerHTML = discoveries.map((item, i) =>
    '<button type="button" data-action="detail" data-id="' + html(item.id) +
    '" class="map-pin ' + (highlightId === item.id ? "selected" : "") + '" style="left:' +
    item.map.x + '%;top:' + item.map.y + '%" aria-label="Open map file ' + html(item.title) +
    '"><span>' + (found(item.id) ? "✓" : String(i + 1).padStart(2, "0")) + '</span></button>'
  ).join("");
  el("mapList").innerHTML = discoveries.map(file).join("");
  el("mapCount").textContent = discoveries.length + " demo pins";
}
function renderDiscover() {
  el("categoryGrid").innerHTML = categories.filter((c) => c.id !== "all").map((c, i) => {
    const count = discoveries.filter((item) => item.category === c.id).length;
    return '<button class="category-tile" type="button" data-action="category" data-category="' + html(c.id) +
      '"><small>FREQUENCY ' + String(i + 1).padStart(2, "0") + '</small><strong>' + html(c.label) +
      '</strong><span>' + count + ' DEMO FILES ↗</span></button>';
  }).join("");
  const items = filterDiscoveries(discoveries, { search: query });
  el("discoverList").innerHTML = items.length ? items.map(file).join("") :
    '<div class="empty"><b>NO SIGNAL FOUND.</b><p>Try a different search.</p></div>';
  el("discoverCount").textContent = items.length + " demo files";
}

function renderDirectory() {
  const modules = filterDirectory(directoryModules, query);
  el("directoryGrid").innerHTML = modules.length ? modules.map((section) =>
    '<button type="button" class="directory-card" data-action="directory" data-directory="' + html(section.id) +
    '" aria-label="Browse ' + html(section.title) + '">' +
    '<span class="directory-overline">' + html(section.group) + ' / ' + html(section.state === "DEMO" ? "CONCEPT" : "NO DATA YET") + '</span>' +
    '<strong>' + html(section.title) + '</strong><span class="directory-cta">OPEN SECTION ↗</span></button>'
  ).join("") : '<div class="empty directory-empty">NO MATCHING SECTIONS.</div>';
  el("directoryCount").textContent = String(modules.length).padStart(2, "0") + " SECTIONS";
  const section = directoryModules.find((item) => item.id === activeDirectory);
  el("discoverMain").hidden = Boolean(section);
  el("directoryPanel").hidden = !section;
  if (!section) { el("directoryPanel").innerHTML = ""; return; }
  let content = '<div class="empty"><b>NO VERIFIED ENTRIES YET.</b><p>This section has an interface slot, not an imported GTADb database. Entries will appear only after independent sourcing and editorial review.</p></div>';
  if (section.id === "curiosities") {
    content = '<p class="directory-note">These five records are fictional presentation examples, not confirmed game discoveries.</p>' +
      '<div class="file-list">' + discoveries.map(file).join("") + '</div>';
  } else if (section.id === "locations") {
    content = '<div class="empty"><b>CONCEPT MAP ONLY.</b><p>Current markers are fictional; there is no licensed GTA VI geography in this build.</p>' +
      '<button type="button" data-tab="map">OPEN CONCEPT MAP ↗</button></div>';
  } else if (section.id === "checklists") {
    content = '<div class="empty"><b>LOCAL DEMO PROGRESS.</b><p>The Saved screen tracks bookmarked and marked demo discoveries on this device. Full GTA VI completion data is not loaded.</p>' +
      '<button type="button" data-tab="saved">OPEN SAVED ↗</button></div>';
  }
  el("directoryPanel").innerHTML =
    '<button type="button" class="directory-back" data-action="directory-back">← ALL SECTIONS</button>' +
    '<span class="eyebrow">' + html(section.group) + ' / ' + html(section.state) + '</span>' +
    '<h3 class="directory-heading">' + html(section.title) + '</h3>' +
    '<p class="lead directory-intro">' + html(section.description) + '</p>' + content;
}

function renderSaved() {
  el("savedCount").textContent = String(prefs.saved.length).padStart(2, "0");
  el("foundCount").textContent = String(prefs.found.length).padStart(2, "0");
  const items = filterDiscoveries(discoveries, { savedOnly: true, saved: prefs.saved });
  el("savedList").innerHTML = items.length ? items.map(file).join("") :
    '<div class="empty"><b>NOTHING ON FILE. YET.</b><p>Bookmark a discovery in the feed to find it here.</p>' +
    '<button type="button" data-tab="feed">EXPLORE THE FEED ↗</button></div>';
}
function renderAll() { renderFeed(); renderMap(); renderDiscover(); renderSaved(); renderDirectory(); }
function updateAfterStateChange() {
  const y = window.scrollY;
  renderAll();
  if (el("detailDialog").open && openId) renderDetail(openId);
  window.scrollTo({ top: y, behavior: "instant" });
}
function toggleSaved(id) {
  prefs.saved = toggleId(prefs.saved, id);
  persist();
  updateAfterStateChange();
  notify(saved(id) ? "FILE BOOKMARKED" : "BOOKMARK REMOVED");
}
function toggleFound(id) {
  prefs.found = toggleId(prefs.found, id);
  persist();
  updateAfterStateChange();
  notify(found(id) ? "TRACKED DOWN" : "TRACKING REMOVED");
}
function renderDetail(id) {
  const item = discoveries.find((x) => x.id === id);
  if (!item) return;
  openId = id;
  el("detailContent").innerHTML =
    '<div class="detail-cover"><strong>DEMO<br>FILE.</strong></div><div class="sheet-body">' +
    '<span class="eyebrow">' + html(label(item.category)) + ' / ' + html(item.eyebrow) + '</span>' +
    '<h2 id="detailTitle">' + html(item.title) + '</h2>' +
    '<span class="demo-chip">● ILLUSTRATIVE ONLY · NOT A VERIFIED GTA VI DISCOVERY</span>' +
    '<p>' + html(item.summary) + '</p><div class="detail-lines"><span>LOCATION</span><b>' +
    html(item.location) + '</b><span>CLIP SOURCE</span><b>Not attached — creator rights unverified</b>' +
    '<span>EDITORIAL</span><b>' + html(item.status) + '</b></div>' +
    '<div class="detail-buttons"><button data-action="save" data-id="' + html(id) + '">' +
    (saved(id) ? "★ SAVED" : "☆ SAVE FILE") + '</button>' +
    '<button data-action="found" data-id="' + html(id) + '">' +
    (found(id) ? "✓ TRACKED" : "○ MARK TRACKED") + '</button>' +
    '<button data-action="map" data-id="' + html(id) + '">VIEW ON CONCEPT MAP ↗</button></div></div>';
}
function openDetail(id) { renderDetail(id); if (!el("detailDialog").open) el("detailDialog").showModal(); }
function showOnMap(id) {
  if (el("detailDialog").open) el("detailDialog").close();
  showTab("map");
  renderMap(id);
  const target = [...document.querySelectorAll(".map-pin")].find((x) => x.dataset.id === id);
  target?.focus({ preventScroll: true });
  notify("CONCEPT PIN HIGHLIGHTED — NO REAL GAME COORDINATES");
}
document.addEventListener("click", (event) => {
  const close = event.target.closest("[data-close]");
  if (close) { el(close.dataset.close)?.close(); return; }
  const action = event.target.closest("[data-action]");
  if (action) {
    const id = action.dataset.id;
    if (action.dataset.action === "directory") { activeDirectory = action.dataset.directory; renderDirectory(); el("view-discover").scrollIntoView({ block: "start" }); }
    if (action.dataset.action === "directory-back") { activeDirectory = null; renderDirectory(); el("view-discover").scrollIntoView({ block: "start" }); }
    if (action.dataset.action === "save") toggleSaved(id);
    if (action.dataset.action === "found") toggleFound(id);
    if (action.dataset.action === "detail") openDetail(id);
    if (action.dataset.action === "map") showOnMap(id);
    if (action.dataset.action === "category") {
      category = action.dataset.category;
      renderFeed();
      showTab("feed");
      document.querySelector(".filters")?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
    return;
  }
  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) { category = categoryButton.dataset.category; renderFeed(); return; }
  const tab = event.target.closest("[data-tab]");
  if (tab) { event.preventDefault(); showTab(tab.dataset.tab); }
});
el("discoverSearch").addEventListener("input", (event) => {
  query = event.target.value;
  renderDiscover();
  renderDirectory();
});
el("settingsOpen").addEventListener("click", () => {
  el("spoilerToggle").checked = prefs.hideSpoilers;
  el("settingsDialog").showModal();
});
el("spoilerToggle").addEventListener("change", (event) => {
  prefs.hideSpoilers = event.target.checked;
  persist();
  renderFeed();
  notify(prefs.hideSpoilers ? "SPOILER SHIELD ON" : "SPOILER SHIELD OFF");
});
document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
}));
window.addEventListener("hashchange", () => {
  const tab = location.hash.slice(1);
  if (tab !== activeTab) showTab(tab);
});
renderAll();
showTab(["feed", "map", "discover", "saved"].includes(location.hash.slice(1)) ?
  location.hash.slice(1) : "feed");
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
console.info("Leonida Signal:", catalogMeta.editorialState, discoveries.length, "illustrative records");
