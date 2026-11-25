import { officialRecords, officialByKind, validateOfficial } from "./official.mjs";
import { sectionResearchGroup, validateResearchShard, pageResearch } from "./research-preview.mjs";

const escape = (value) => String(value).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const labCache = new Map();
const allowOfficial = (url) => typeof url === "string" &&
  /^https:\/\/www\.rockstargames\.com\/VI\//.test(url);

function referenceCard(item, hideSpoilers) {
  const shield = hideSpoilers && item.spoiler;
  return '<article class="verified-card"><span class="verified-eyebrow">' +
    escape(item.evidence === "PRIMARY_SOURCE_CHECKED" ? "PRIMARY CHECK" : "OFFICIAL NAMED SOURCE") +
    '</span><strong>' + escape(shield ? "SPOILER SHIELDED" : item.name) +
    '</strong><p>' + escape(shield ? "Character details hidden by spoiler setting." : item.description) +
    '</p><a href="' + escape(item.sourceUrl) +
    '" rel="noopener noreferrer" target="_blank">OPEN FIRST-PARTY SOURCE ↗</a></article>';
}
export function renderOfficialHighlights(target, hideSpoilers) {
  if (!target || validateOfficial(officialRecords).length) return;
  const items = officialRecords.filter((r) => r.kind === "facts").concat(
    officialRecords.filter((r) => r.kind === "characters").slice(0, 2));
  target.innerHTML = items.map((r) => referenceCard(r,hideSpoilers)).join("");
}
function officialMarkup(section, hideSpoilers) {
  const kind = ["characters","locations","facts"].includes(section) ? section : null;
  if (!kind) return "";
  const items = officialByKind(kind);
  return '<div class="subhead"><h3>FIRST-PARTY REFERENCES</h3><small>' + items.length +
    ' sourced names/facts</small></div><div class="verified-grid">' +
    items.map((item) => referenceCard(item,hideSpoilers)).join("") + '</div>';
}
const back = '<button type="button" class="directory-back" data-action="directory-back">← ALL SECTIONS</button>';

async function fillResearch(panel, group, hideSpoilers) {
  const target = panel.querySelector("#researchResults");
  if (!target) return;
  if (hideSpoilers) {
    target.innerHTML = '<div class="empty"><b>SPOILER SHIELD ACTIVE.</b>' +
      '<p>These community records can contain unverified claims and spoilers. ' +
      'Use Settings to turn off the spoiler shield if you wish to review them.</p></div>';
    return;
  }
  try {
    if (!labCache.has(group)) {
      target.textContent = "LOADING SOURCE-ATTRIBUTED RESEARCH...";
      const result = await fetch("./data/research-" + group + ".json", {credentials:"same-origin"});
      if (!result.ok) throw new Error("HTTP " + result.status);
      const data = await result.json();
      validateResearchShard(data,group);
      labCache.set(group,data.items);
    }
    if (panel.dataset.previewGroup !== group || !panel.isConnected) return;
    const searchBox = panel.querySelector("#researchSearch");
    const count = panel.querySelector("#researchCount");
    const more = panel.querySelector("#researchMore");
    let currentPage = 0;
    const render = () => {
      const query = searchBox.value;
      const page = pageResearch(labCache.get(group), {query,page:currentPage,pageSize:16});
      const normalized = String(query).toLocaleLowerCase().trim();
      const all = normalized ? labCache.get(group).filter(item =>
        [item.name,item.kind,item.area,item.id].some(v => String(v).toLocaleLowerCase().includes(normalized))) :
        labCache.get(group);
      const visible = all.slice(0,(currentPage+1)*16);
      target.innerHTML = visible.length ? visible.map(item =>
        '<article class="source-row"><div><small>UNVERIFIED / ' +
        escape(item.kind) + '</small><strong>' + escape(item.name) +
        '</strong><p>' + escape(item.area || "Unknown region") + ' · ' +
        escape(item.confidence) + (item.suspectedDuplicate ? ' · POSSIBLE DUPLICATE' : '') +
        '</p></div><code>' + escape(item.id) + '</code></article>'
      ).join("") : '<p class="empty">No results in this research group.</p>';
      count.textContent = page.total + " CANDIDATES · 0 CERTIFIED";
      more.hidden = !page.hasMore;
    };
    searchBox.addEventListener("input", () => { currentPage = 0; render(); });
    more.addEventListener("click", () => { currentPage += 1; render(); });
    render();
  } catch (error) {
    target.textContent = "Research archive unavailable. Source-backed references are still accessible.";
    console.warn("Research preview fetch error:",error);
  }
}
async function fillVideos(panel) {
  const target = panel.querySelector("#videoRegistry");
  if (!target) return;
  try {
    const response = await fetch("./data/video-links.json",{credentials:"same-origin"});
    if (!response.ok) throw new Error("Video registry unavailable");
    const data = await response.json();
    if (data.schema !== "gitiasei.media.references.v1" || !Array.isArray(data.items) ||
      data.items.length === 0 || data.items.some(item =>
      !allowOfficial(item.sourceUrl) || item.downloadStatus !== "NOT_DOWNLOADED" ||
      item.redistributionRight !== "UNDETERMINED" || item.embedStatus !== "DISABLED"))
      throw new Error("Unsafe media registry");
    if (!panel.isConnected || panel.dataset.previewGroup !== "videos") return;
    target.innerHTML = '<p class="directory-note">' + data.items.length +
      ' OFFICIAL MEDIA LINKS · NO VIDEOS DOWNLOADED OR REHOSTED</p>' +
      data.items.map(item =>
        '<article class="source-row"><div><small>ROCKSTAR / LINK ONLY</small><strong>' +
        escape(item.title) + '</strong><p>No rehost authorization assumed</p></div>' +
        '<a href="' + escape(item.sourceUrl) +
        '" rel="noopener noreferrer" target="_blank">OPEN ↗</a></article>'
      ).join("") + '<a class="source-zip" rel="noopener noreferrer" target="_blank" href="' +
      escape(data.pressKitUrl) + '">OFFICIAL ZIP DOWNLOAD (11 VIDEO ASSETS) ↗</a>' +
      '<p class="directory-note">The publisher offers these downloads; this app does not download, store or redistribute them.</p>';
  } catch(error) {
    target.textContent = "Media links unavailable.";
    console.warn("Media metadata error:",error);
  }
}
export function renderPreviewPanel(section, panel, hideSpoilers) {
  if (!section || !panel || validateOfficial(officialRecords).length) return false;
  const group = sectionResearchGroup[section.id];
  const eligible = Boolean(group) || ["characters","videos","facts"].includes(section.id);
  if (!eligible) return false;
  panel.dataset.previewGroup = group || section.id;
  panel.innerHTML = back + '<span class="eyebrow">' + escape(section.group) +
    ' / SOURCE TRANSPARENCY</span><h3 class="directory-heading">' +
    escape(section.title) + '</h3><p class="lead directory-intro">' +
    escape(section.description) + '</p>' +
    officialMarkup(section.id, hideSpoilers) +
    (group ? '<div class="subhead"><h3>COMMUNITY RESEARCH LAB</h3><small id="researchCount">...</small></div>' +
      '<p class="directory-note">CAUTION: third-party research, not confirmed game facts. ' +
      'Original data by Open GTA 6 Map (CC BY 4.0); individual game claims and coordinates need review. ' +
      'No source photos or game video files are used.</p>' +
      '<input class="research-search" id="researchSearch" type="search" aria-label="Search unverified candidates" placeholder="SEARCH THE UNVERIFIED ARCHIVE...">' +
      '<div id="researchResults" class="research-results" aria-live="polite">LOADING...</div>' +
      '<button type="button" id="researchMore" hidden>SHOW MORE ↗</button>' : '') +
    (section.id === "videos" ?
      '<p class="directory-note">Curated source links only, copyright and redistribution review pending.</p>' +
      '<div id="videoRegistry" aria-live="polite">LOADING...</div>' : '');
  if (group) void fillResearch(panel, group, hideSpoilers);
  if (section.id === "videos") void fillVideos(panel);
  return true;
}
