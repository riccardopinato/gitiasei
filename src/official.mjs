// Original, concise editorial labels backed by Rockstar first-party pages.
// Names and short descriptions are not replicas of publisher prose or game media.
export const officialRecords = Object.freeze([
  {
    "id": "official:character:jason-duval",
    "kind": "characters",
    "name": "Jason Duval",
    "description": "Personaggio centrale presentato ufficialmente da Rockstar.",
    "sourceUrl": "https://www.rockstargames.com/VI/only-in-leonida",
    "evidence": "OFFICIAL_NAMED",
    "spoiler": true
  },
  {
    "id": "official:character:lucia-caminos",
    "kind": "characters",
    "name": "Lucia Caminos",
    "description": "Personaggio centrale presentato ufficialmente da Rockstar.",
    "sourceUrl": "https://www.rockstargames.com/VI/only-in-leonida",
    "evidence": "OFFICIAL_NAMED",
    "spoiler": true
  },
  {
    "id": "official:character:cal-hampton",
    "kind": "characters",
    "name": "Cal Hampton",
    "description": "Amico di Jason, incluso nella pagina ufficiale dei personaggi.",
    "sourceUrl": "https://www.rockstargames.com/VI/only-in-leonida",
    "evidence": "OFFICIAL_NAMED",
    "spoiler": true
  },
  {
    "id": "official:character:boobie-ike",
    "kind": "characters",
    "name": "Boobie Ike",
    "description": "Figura legata alla scena imprenditoriale e musicale di Vice City.",
    "sourceUrl": "https://www.rockstargames.com/VI/only-in-leonida",
    "evidence": "OFFICIAL_NAMED",
    "spoiler": true
  },
  {
    "id": "official:character:dre-quan-priest",
    "kind": "characters",
    "name": "Dre'Quan Priest",
    "description": "Personaggio ufficiale collegato all'industria musicale locale.",
    "sourceUrl": "https://www.rockstargames.com/VI/only-in-leonida",
    "evidence": "OFFICIAL_NAMED",
    "spoiler": true
  },
  {
    "id": "official:character:real-dimez",
    "kind": "characters",
    "name": "Real Dimez",
    "description": "Duo musicale descritto nella presentazione ufficiale Rockstar.",
    "sourceUrl": "https://www.rockstargames.com/VI/only-in-leonida",
    "evidence": "OFFICIAL_NAMED",
    "spoiler": true
  },
  {
    "id": "official:character:raul-bautista",
    "kind": "characters",
    "name": "Raul Bautista",
    "description": "Personaggio presentato ufficialmente come rapinatore esperto.",
    "sourceUrl": "https://www.rockstargames.com/VI/only-in-leonida",
    "evidence": "OFFICIAL_NAMED",
    "spoiler": true
  },
  {
    "id": "official:character:brian-heder",
    "kind": "characters",
    "name": "Brian Heder",
    "description": "Personaggio ufficiale legato alle attività di contrabbando nelle Keys.",
    "sourceUrl": "https://www.rockstargames.com/VI/only-in-leonida",
    "evidence": "OFFICIAL_NAMED",
    "spoiler": true
  },
  {
    "id": "official:region:vice-city",
    "kind": "locations",
    "name": "Vice City",
    "description": "Area nominata nella presentazione ufficiale di Leonida. Nessuna coordinata in-game viene affermata.",
    "sourceUrl": "https://www.rockstargames.com/VI/only-in-leonida",
    "evidence": "OFFICIAL_NAMED",
    "spoiler": false
  },
  {
    "id": "official:region:leonida-keys",
    "kind": "locations",
    "name": "Leonida Keys",
    "description": "Area nominata nella presentazione ufficiale di Leonida. Nessuna coordinata in-game viene affermata.",
    "sourceUrl": "https://www.rockstargames.com/VI/only-in-leonida",
    "evidence": "OFFICIAL_NAMED",
    "spoiler": false
  },
  {
    "id": "official:region:grassrivers",
    "kind": "locations",
    "name": "Grassrivers",
    "description": "Area nominata nella presentazione ufficiale di Leonida. Nessuna coordinata in-game viene affermata.",
    "sourceUrl": "https://www.rockstargames.com/VI/only-in-leonida",
    "evidence": "OFFICIAL_NAMED",
    "spoiler": false
  },
  {
    "id": "official:region:port-gellhorn",
    "kind": "locations",
    "name": "Port Gellhorn",
    "description": "Area nominata nella presentazione ufficiale di Leonida. Nessuna coordinata in-game viene affermata.",
    "sourceUrl": "https://www.rockstargames.com/VI/only-in-leonida",
    "evidence": "OFFICIAL_NAMED",
    "spoiler": false
  },
  {
    "id": "official:region:ambrosia",
    "kind": "locations",
    "name": "Ambrosia",
    "description": "Area nominata nella presentazione ufficiale di Leonida. Nessuna coordinata in-game viene affermata.",
    "sourceUrl": "https://www.rockstargames.com/VI/only-in-leonida",
    "evidence": "OFFICIAL_NAMED",
    "spoiler": false
  },
  {
    "id": "official:region:mount-kalaga",
    "kind": "locations",
    "name": "Mount Kalaga",
    "description": "Area nominata nella presentazione ufficiale di Leonida. Nessuna coordinata in-game viene affermata.",
    "sourceUrl": "https://www.rockstargames.com/VI/only-in-leonida",
    "evidence": "OFFICIAL_NAMED",
    "spoiler": false
  },
  {
    "id": "official:fact:release",
    "kind": "facts",
    "name": "Uscita GTA VI",
    "description": "Grand Theft Auto VI è disponibile dal 19 novembre 2026.",
    "sourceUrl": "https://www.rockstargames.com/VI/out-now",
    "evidence": "PRIMARY_SOURCE_CHECKED",
    "spoiler": false
  },
  {
    "id": "official:fact:platforms",
    "kind": "facts",
    "name": "Piattaforme di lancio",
    "description": "La pagina ufficiale annuncia disponibilità su PlayStation 5 e Xbox Series X|S.",
    "sourceUrl": "https://www.rockstargames.com/VI/out-now",
    "evidence": "PRIMARY_SOURCE_CHECKED",
    "spoiler": false
  }
]);
export function officialByKind(kind) {
  return officialRecords.filter((record) => record.kind === kind);
}
export function validateOfficial(records = officialRecords) {
  const seen = new Set(), issues = [];
  for (const record of records) {
    if (!record.id || seen.has(record.id)) issues.push("duplicate official record");
    seen.add(record.id);
    if (!record.name || !record.description || !["characters","locations","facts"].includes(record.kind))
      issues.push("invalid official record");
    if (!/^https:\/\/www\.rockstargames\.com\/VI\//.test(record.sourceUrl || ""))
      issues.push("untrusted first-party source");
    if (!["OFFICIAL_NAMED","PRIMARY_SOURCE_CHECKED"].includes(record.evidence)) issues.push("invalid evidence");
  }
  return issues;
}
