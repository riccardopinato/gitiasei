# Gitiasei video vault — rights-first acquisition

Research metadata is stored in `public/data/video-links.json`. Each record contains title, creator, first-party public source URL, download state, embed state and redistribution-rights state.

**Source checked 25 November 2026:** Rockstar official media page lists 11 downloadable video items and an official ZIP:
https://www.rockstargames.com/VI/media/videos
Official ZIP: https://media.rockstargames.com/VI/downloads/videos/GTAVI_Videos.zip

Rockstar's release page additionally lists the newer launch trailer and extended look:
https://www.rockstargames.com/VI/out-now

## Safe, optional local acquisition

```sh
node scripts/media-vault.mjs --list
node scripts/media-vault.mjs --download-official-zip --accept-publisher-download-terms
```

The download command requires deliberate acceptance of applicable publisher terms and writes the original archive and SHA-256 provenance manifest to **`.private-media/rockstar/`**, ignored by Git. It does not extract or host clips. Direct network access is unavailable in the ChatGPT container, so actual download **has not been executed here**; the script has not been demonstrated on a real device.

The official download listing is not blanket commercial/rehosting permission. Verify rights, clips containing third-party music, required credits, embeds, age rating, and any permitted promotion use before publishing. Never add the ZIP or an extracted video to public GitHub or the deployed PWA without specific permission.

## Future input channels
- Creator-submitted original clips with demonstrable commercial permission and opt-out process.
- Official platform embeds when their current terms expressly permit the use, preferably click-to-play.
- Link-only references and creator attribution when download/embed rights are unknown.

Do not bypass age gates, logins, DRM, streaming restrictions, signed URLs or platform rate limits. No blanket social-platform scraping/downloading is configured.
