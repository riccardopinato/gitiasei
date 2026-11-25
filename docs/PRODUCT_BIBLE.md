# Gitiasei — Product Bible v0.1
Status: PROVISIONAL PRODUCT BASELINE (2026-11-25). Not a production launch.

## Promise
Explore community discoveries about GTA VI through a vertical short-form feed, linked interactive map, saved discoveries and a sourced editorial catalog. Delight first, factual accuracy and creator rights always.

## Approved pillars
1. Endless vertical reels / editorial discovery feed.
2. Interactive discovery map, clip-to-pin and pin-to-clip.
3. Category discovery, search, trending-ready architecture and spoiler controls.
4. Saved, found, history/progress. No mandatory account.
5. Future moderated community submissions, creator profiles and collections.

## Platform and acquisition
- Initial surface: lightweight mobile-first Web/PWA, with indexable content pages when real catalog exists.
- Later: Flutter Android/iOS companion after user validation.
- Primary acquisition: social shares + organic search. No advertising SDK until rights, consent and monetization review.
- No hosting deployment or paid service authorized here.

## Editorial and rights policy
- Never download/rehost third-party clips by default.
- A social post, public stream or accessible URL does NOT grant reuse rights.
- Real clips require creator attribution, platform-compliant embedding, proof/terms supporting commercial use, source URL, review date and content verification.
- GTA VI and Rockstar are third-party trademarks. Brand, typography, artwork and UI in this project are ORIGINAL and must not imply affiliation or official endorsement.
- No simulated "verified" claims or fictional map coordinates represented as fact.
- Demo fixtures are explicitly marked "DEMO" and do not represent factual GTA discoveries.
- Treat spoilers, false claims, harassment and duplicated clips as moderation concerns.

## Design direction
**APPROVED visual reference: 2026-11-25 Gitiasei Neon Vice dashboard** (user approved). This supersedes the original vague MOCK-STYLE-002 treatment for the Web/PWA visual surface.

- Premium **deep-black glass** UI with fluorescent magenta/pink panel outlines, soft purple bloom and sparse cyan for secondary actions; do not return to petroleum blue or stock Material.
- Desktop: immersive framed dashboard with left icon+label sidebar, top section tabs, original sunset-city hero, four content/action tiles, real project-stat panels and a sourced Rockstar information rail.
- Mobile: native-app-like top bar and bottom navigation, hero with legible text, horizontal swipeable content cards, full-width map and safe-area touch controls.
- Clear typography: robust high-contrast condensed sans for labels/headings, clean system UI for paragraphs, script neon only in the decorative "Vice City" hero title; no illegible Impact-style paragraphs.
- Self-hosted original first-party artwork and vector icon sprite. Game title references remain nominative; no copied Rockstar art, logos, fonts or misleading official-brand affiliation.
- No fake live audiences, social numbers, release countdowns, activity claims or functional "watch party" elements just to imitate a concept mock-up. Cards must navigate to current functional areas or a correctly attributed official external source.
- All existing data contracts, spoiler shielding, saved/found stable IDs, native map and CC BY attribution are preserved.

Historical reference: Design-App MOCK-STYLE-002 NEON.

## Boundaries
- Gitiasei must render its primary map independently from **self-hosted, version-pinned map geometry**; external map iframes/tiles, branding overlays and map-provider requests are forbidden by product decision (25 Nov 2026).
- Where source coordinates or shapes are CC BY 4.0, preserve attribution, source/license links and modification notices, in a discreet data-credit area.
- Geography and 4,687 candidate markers are *community research*, not independently confirmed Rockstar map locations; use clear status labels and default spoiler shielding.
- In-map save/found progress uses stable IDs and must not disappear on catalog upgrades.
- No backend, accounts, API scraping, remote clip ingestion, publication or live advertising at v0.1.
- No claims of full playable video until rights-cleared media actually exists.

## Acceptance for first build
- Vertical, scroll-snap visual feed with clearly labeled demos.
- Functional tab navigation, category/search filtering, map-to-discovery paths.
- Reversible saved/found actions persisted locally; spoiler setting.
- CI includes syntax, unit/integrity tests and static PWA packaging.
- Documented limitations, PR and exact SHA-based CI checks before merge.
