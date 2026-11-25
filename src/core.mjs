import { categories } from "./catalog.mjs";

export const STORAGE_KEY = "gitiasei.preferences.v1";

export function validateCatalog(records) {
  const issues = [];
  const ids = new Set();
  const allowed = new Set(categories.map((c) => c.id));
  for (const [index, record] of records.entries()) {
    if (!record.id || ids.has(record.id)) issues.push(index + ": nonunique id");
    ids.add(record.id);
    if (!record.title || !record.summary) issues.push(index + ": incomplete editorial text");
    if (!allowed.has(record.category) || record.category === "all") issues.push(index + ": invalid category");
    if (!["DEMO", "REVIEWED", "PUBLISHED"].includes(record.status)) issues.push(index + ": invalid state");
    if (typeof record.map?.x !== "number" || record.map.x < 0 || record.map.x > 100 ||
        typeof record.map?.y !== "number" || record.map.y < 0 || record.map.y > 100) {
      issues.push(index + ": invalid concept coordinates");
    }
    if (record.status === "PUBLISHED" &&
        (!record.source?.url || !record.source?.author || !record.license?.evidence ||
         !record.media?.embedUrl || record.source?.reviewed !== true)) {
      issues.push(index + ": published clip without verified provenance, rights or media");
    }
    if (record.status === "DEMO" && (record.source || record.media)) {
      issues.push(index + ": demo should not impersonate a real clip");
    }
  }
  return issues;
}

export function filterDiscoveries(records, { category = "all", search = "", savedOnly = false, saved = [] } = {}) {
  const query = search.trim().toLocaleLowerCase();
  const savedIds = new Set(saved);
  return records.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (savedOnly && !savedIds.has(item.id)) return false;
    if (!query) return true;
    return [item.title, item.summary, item.area, item.category, ...(item.tags || [])]
      .some((part) => String(part).toLocaleLowerCase().includes(query));
  });
}

export function sanitizePreferences(raw, validIds) {
  const ids = new Set(validIds);
  const safe = raw && typeof raw === "object" ? raw : {};
  return {
    saved: Array.isArray(safe.saved) ? [...new Set(safe.saved.filter((id) => ids.has(id)))] : [],
    found: Array.isArray(safe.found) ? [...new Set(safe.found.filter((id) => ids.has(id)))] : [],
    hideSpoilers: safe.hideSpoilers !== false
  };
}

export function toggleId(values, id) {
  return values.includes(id) ? values.filter((value) => value !== id) : [...values, id];
}
