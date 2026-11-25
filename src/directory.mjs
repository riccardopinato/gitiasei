// Original navigation taxonomy. No third-party records, names, art or datasets are copied.
export const directoryModules = Object.freeze([
  { id: "curiosities", title: "Curiosities & hidden finds", group: "DISCOVER", state: "DEMO", description: "Investigate peculiar details and links between discoveries. Only illustrative cards exist today." },
  { id: "locations", title: "Locations & map", group: "EXPLORE", state: "DEMO", description: "Connect discoveries to map markers; verified in-game geography is not yet available." },
  { id: "vehicles", title: "Vehicles", group: "REFERENCE", state: "EMPTY", description: "A future vehicle directory with separately sourced details and discovery links." },
  { id: "missions", title: "Missions", group: "REFERENCE", state: "EMPTY", description: "A future story and activity index with source-backed relationships." },
  { id: "weapons", title: "Weapons", group: "REFERENCE", state: "EMPTY", description: "A future reference for verified weapon information and related locations." },
  { id: "characters", title: "Characters", group: "REFERENCE", state: "EMPTY", description: "A future people index connected to missions, places and discoveries." },
  { id: "wildlife", title: "Wildlife", group: "EXPLORE", state: "EMPTY", description: "A future index of observed species, encounters and areas." },
  { id: "activities", title: "Activities", group: "EXPLORE", state: "EMPTY", description: "A future index of playable activities, encounters and challenges." },
  { id: "collectibles", title: "Collectibles", group: "COMPLETE", state: "EMPTY", description: "A future checklist of independently verified collectible types and positions." },
  { id: "properties", title: "Properties", group: "REFERENCE", state: "EMPTY", description: "A future directory of verified purchasable or visitable locations." },
  { id: "guides", title: "Guides", group: "LEARN", state: "EMPTY", description: "Original walkthroughs and explainers, written and verified for this project." },
  { id: "videos", title: "Videos & creators", group: "WATCH", state: "EMPTY", description: "A future collection of attributed, permission-cleared videos; no live clips yet." },
  { id: "checklists", title: "Progress & checklists", group: "COMPLETE", state: "DEMO", description: "Track demo discoveries locally. Full game completion lists are not available yet." }
]);

export function filterDirectory(modules, search = "") {
  const term = String(search).trim().toLocaleLowerCase();
  if (!term) return modules;
  // Prefer a direct title match over an incidental description match.
  return modules.filter((entry) =>
    [entry.title, entry.group, entry.description].some((value) => value.toLocaleLowerCase().includes(term))
  ).sort((a, b) => Number(b.title.toLocaleLowerCase().includes(term)) -
                    Number(a.title.toLocaleLowerCase().includes(term)));
}

export function validateDirectory(modules) {
  const issues = [], ids = new Set();
  for (const entry of modules) {
    if (!/^[a-z-]+$/.test(entry.id || "") || ids.has(entry.id)) issues.push("invalid or duplicate directory id");
    ids.add(entry.id);
    if (!entry.title || !entry.description || !entry.group) issues.push("missing directory copy");
    if (!["DEMO", "EMPTY"].includes(entry.state)) issues.push("invalid directory state");
  }
  return issues;
}
