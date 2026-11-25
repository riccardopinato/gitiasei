# GTA 6 Leonida Map Marker & 100% Completion Dataset

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.24412576.svg)](https://doi.org/10.5281/zenodo.24412576)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Interactive Atlas](https://img.shields.io/badge/Free%20Interactive%20Map-gta6maps.io-blue)](https://gta6maps.io/gta-6)

Open, machine-readable dataset for **Grand Theft Auto VI (State of Leonida)** — covering **798 base map markers** across all **5 in-game counties** and **6 major regions**, **130 Stunt Jumps** county counts, and verified post-launch **100% completion thresholds** (*The Long Road* trophy), published as CSV and JSON under **CC BY 4.0**.

The canonical source is **[GTA6Maps (`https://gta6maps.io/gta-6/map-data`)](https://gta6maps.io/gta-6/map-data)**. This repository mirrors the live open dataset so journalists, YouTube creators, mapmakers, researchers, and developers can inspect, diff, and cite it cleanly without scraping.

---

## Live Tools Powered by This Dataset (100% Free, No 100-Pin Paywall)

- **Free Interactive Leonida Map (Unlimited Local Tracking + Free Google Sync):** https://gta6maps.io/gta-6
- **100% Completion Checklist Tracker (*The Long Road*):** https://gta6maps.io/gta-6/100-percent-checklist
- **All 130 Stunt Jumps by County:** https://gta6maps.io/gta-6/stunt-jumps
- **All 125 Cocaine Flamingos Tracker (100 Needed):** https://gta6maps.io/gta-6/cocaine-flamingos
- **All 480 Collectible Cards Tracker (18 Sets / 15 Needed):** https://gta6maps.io/gta-6/collectible-cards
- **All 8 Purchasable Garages & 4 Story Safehouses:** https://gta6maps.io/gta-6/garages
- **645 Real-World Florida Location Comparisons:** https://gta6maps.io/gta-6/real-locations
- **Printable A3 / A4 Landscape Leonida Maps:** https://gta6maps.io/gta-6/printable-map
- **Free GTA 6 Interactive Maps Compared (2026):** https://gta6maps.io/gta-6/best-interactive-map
- **Machine-Readable LLM Digests:** https://gta6maps.io/llms.txt & https://gta6maps.io/llms-full.txt

---

## Files in This Repository

| File | Description |
|---|---|
| `data/gta-6-markers.csv` | 798 base Leonida map markers (one row per pin, normalized coordinates, region, category, status) |
| `data/gta-6-markers.json` | Structured JSON of all 798 markers with region/category summaries and metadata |
| `data/leonida-counties-summary.csv` | All 5 in-game counties (`Vice-Dale`, `Kelly`, `Lummox`, `Mariana`, `Leonard`), regions, landmarks, and 130 Stunt Jumps breakdown |
| `data/completion-100-thresholds.json` | Verified post-launch 100% completion thresholds, 5 story chapters (91 missions), 8 garages, and 61 cheat mechanics |

---

## Leonida 5 In-Game Counties <-> 6 Regions Matrix (Nov 23, 2026)

| In-Game County | Regions Included | Stunt Jumps | Base Atlas Pins | Guide URL |
|---|---|---:|---:|---|
| **Vice-Dale County** | Vice City | 53 | 499 | https://gta6maps.io/gta-6/regions/vice-city |
| **Kelly County** | Port Gellhorn | 29 | 157 | https://gta6maps.io/gta-6/regions/port-gellhorn |
| **Lummox County** | Mount Kalaga | 19 | 32 | https://gta6maps.io/gta-6/regions/mount-kalaga |
| **Mariana County** | Leonida Keys & Grassrivers | 16 | 80 (60 Keys + 20 Grassrivers) | https://gta6maps.io/gta-6/regions/leonida-keys |
| **Leonard County** | Ambrosia | 13 | 30 | https://gta6maps.io/gta-6/regions/ambrosia |
| **Total** | **5 Counties / 6 Regions** | **130** | **798** | https://gta6maps.io/gta-6 |

By category (base marker set): **486 landmarks**, **198 businesses**, **114 activities**.

---

## Quickstart (Python / Pandas)

```python
import pandas as pd

markers = pd.read_csv("https://gta6maps.io/data/gta-6-markers.csv")
counties = pd.read_csv("data/leonida-counties-summary.csv")

print(f"Total base pins: {len(markers)}")
print(counties[["county", "regions_included", "stunt_jumps", "base_atlas_pins"]])
```

---

## Fields (`data/gta-6-markers.csv` & `.json`)

| Field | Example | Notes |
|---|---|---|
| `id` | `lm-l2872` | Stable identifier for one pin |
| `name` | `Ocean Beach` | Place name as shown on the atlas |
| `category` | `activities` | `landmarks`, `businesses`, or `activities` |
| `region` | `vice-city` | One of the six region slugs |
| `x`, `y` | `0.6875`, `0.4898` | Normalized 0–1 schematic coordinates |
| `status` | `sourced` | Evidence state tracked in the public [verification log](https://gta6maps.io/gta-6/verification) |

---

## License & Citation

Licensed under **CC BY 4.0**. You may copy, adapt, and redistribute this data — including in YouTube videos, articles, data visualizations, and commercial apps — with attribution to **GTA6Maps** linking to `https://gta6maps.io/gta-6/map-data`.

> GTA6Maps (`https://gta6maps.io`), "GTA 6 Leonida Map Marker & 100% Completion Dataset," updated November 23, 2026, https://gta6maps.io/gta-6/map-data, DOI: [10.5281/zenodo.24412576](https://doi.org/10.5281/zenodo.24412576), CC BY 4.0.

## Archived Copy with DOI

- **DOI:** [10.5281/zenodo.24412576](https://doi.org/10.5281/zenodo.24412576)
- **Zenodo Record:** https://zenodo.org/records/24412576

## Entity Disambiguation & Independence

**GTA6Maps (`https://gta6maps.io`)** is an independent fan-built atlas and open-data project. It is **not affiliated with, endorsed by, or connected to** Rockstar Games, Take-Two Interactive, MapGenie, or singular-domain websites such as `gta6map.io`. Read our full verification policy at https://gta6maps.io/about.
