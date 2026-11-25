// Separate, opt-in research browser. These are NOT published facts, searchable feed items or map pins.
export const researchGroups = Object.freeze(["curiosities","places","vehicles","activities","collectibles","reference"]);
export const sectionResearchGroup = Object.freeze({
  curiosities:"curiosities",locations:"places",vehicles:"vehicles",
  activities:"activities",collectibles:"collectibles"
});
export function validateResearchShard(data, group) {
  if (!researchGroups.includes(group) || !data || data.schema !== "gitiasei.research-preview.v1" ||
      data.category !== group || data.status !== "RESEARCH_ONLY" || !Array.isArray(data.items))
    throw new Error("Invalid research preview shard");
  const ids = new Set();
  for (const item of data.items) {
    if (!item || typeof item.id !== "string" || ids.has(item.id) ||
        !/^gta6:location:[a-z0-9-]+$/.test(item.id) ||
        item.status !== "UNVERIFIED" || typeof item.name !== "string" ||
        item.name.length > 240 || typeof item.kind !== "string" ||
        typeof item.area !== "string" || !["community","UNSPECIFIED"].includes(item.confidence) ||
        typeof item.hasRecordSourceUrl !== "boolean" ||
        typeof item.suspectedDuplicate !== "boolean" ||
        "media" in item || "image" in item || "map" in item)
      throw new Error("Unsafe or duplicate research record");
    ids.add(item.id);
  }
  return data.items.length;
}
export function pageResearch(items, { query="", page=0, pageSize=16 }={}) {
  if (!Array.isArray(items)) throw new Error("Invalid item array");
  if (!Number.isInteger(page) || page < 0 || !Number.isInteger(pageSize) ||
      pageSize < 1 || pageSize > 40) throw new Error("Unsafe pagination");
  const search=String(query).normalize("NFKD").toLocaleLowerCase().trim();
  const found=search ? items.filter(item=>[item.name,item.kind,item.area,item.id]
    .some(value=>String(value??"").normalize("NFKD").toLocaleLowerCase().includes(search))) : items;
  return { total:found.length, page, pageSize, hasMore:(page+1)*pageSize < found.length,
    items:found.slice(page*pageSize,(page+1)*pageSize) };
}
