# Gitiasei — Leonida Signal

Independent **GTA VI community discoveries** product concept: a mobile-first cinematic feed, connected discovery map and personal saved/found library.

**Status: v0.1 prototype / design DEMO only.** There are no real GTA VI gameplay clips, live discoveries or verified in-game locations in this build. The illustrated map is fictional. Not affiliated with Rockstar Games or Take-Two.

## What works

- Vertical, scrollable discovery feed, category filtering and original sunset-noir visual art.
- Interactive concept map and direct file ↔ map navigation.
- Discover categories, full-text search and file details.
- Bookmarks, "tracked down" state and spoiler shield saved to the browser locally.
- Lightweight installable PWA shell and offline cache for first-party static files.

## Developer commands

Requires Node.js 20+:

    npm run verify

This runs syntax checks, catalog/unit tests and static PWA packaging to the dist/ directory. No dependencies or credentials are required. Serve the built directory via any static HTTP server; file:// is not supported for PWA/service workers.

## Editorial and legal boundary

The five built-in records are explicitly fictional presentation fixtures. Real entries must provide a verifiable source, creator attribution, checked usage/embedding rights, review status and safe media metadata. Publicly visible social posts are **not** automatically licensed for commercial redistribution. Do not copy official GTA VI game-map images, Rockstar logos, typography or key art.

See [Product Bible](docs/PRODUCT_BIBLE.md) and [Roadmap](docs/ROADMAP.md).

## CI / release

GitHub Actions web-ci.yml builds and tests PRs and main, uploading a static dist/ artifact. A green build does not mean authorized clips, live deployment, mobile certification or approved monetization.

No production deployment is configured or authorized by this repository bootstrap.
