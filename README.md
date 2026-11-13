# Arctic Forge — Minecraft Marketplace

A Next.js marketplace for Minecraft mods, modpacks, plugins, texture packs, shaders, data packs, server services and creator-made products.

## Features
- Live free-project discovery powered by the public Modrinth API
- Search, sorting, Minecraft version and loader filters
- Free / paid marketplace filter
- Project detail previews with icons, screenshot galleries, compatibility and version downloads
- Paid server and development service catalogue
- Creator studio with free/paid price setting and image/GIF previews
- Local creator profile and draft previews
- Responsive Arctic Luxury / Rainbow visual system

## Run locally
```bash
npm install
npm run dev
```

## Important current limitations
- Creator Studio drafts and profile previews are saved in the current browser only.
- Authentication, public creator accounts, permanent file storage, public project publishing, orders, checkout, payment processing, refunds and creator payouts are not connected yet.
- The creator studio accepts image previews (PNG, JPG, WEBP, GIF), but it does not yet upload project archives or publish them to a server.
- Paid service cards are quote requests; prices and inventory must be configured before real sales.
- Free community project metadata and download links are served by Modrinth. Original project creators retain ownership; links open the original Modrinth project and downloads.

## Hero media
Place licensed Minecraft gameplay footage at `public/minecraft-hero.mp4` to use a custom video hero. The current homepage uses an animated visual fallback.

## Attribution
This is an independent marketplace project and is not affiliated with Modrinth, Mojang or Microsoft.
