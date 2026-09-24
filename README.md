# SAEID & MOCHA 🚀🐾

Original, browser-based, character-driven jetpack endless runner. The playable hero is Saeid, accompanied by his flying cat Mocha. Built with Phaser 3, TypeScript, Vite and procedural vector art, using the two supplied character illustrations as transparent sprites.

**Live game (after Pages deployment):** https://saaeiddev.github.io/Saeid-Mocha-/

## Controls

Desktop: hold **Space** or **↑** to ascend and release to descend; **M** = Mocha's guardian shield; **P** or **Esc** = pause. On mobile, hold the game area to fly, release to fall, and use the **paw** button to deploy the shield. Landscape recommended.

## Gameplay

Four looping environments (laboratory, neon city, cyber factory, space station), escalating obstacle generation, drones, changing laser gates, homing missiles with warnings, moving machines, electrical and energy barriers. Collect coins and mega coins, five power-ups including boost/magnet/slow/shield. Mocha follows and collects nearby coins; her shield blocks one hit and recharges in 30 seconds. Classic Endless and unlockable Mocha Rescue modes, six missions, achievements, cosmetics shop, browser-local saves and original Web Audio synth soundtrack.

## Run locally

```sh
npm install
npm test
npm run dev
```

`npm run build` generates the deployable `dist/` directory; `npm run typecheck` checks TypeScript separately. Vite's base path is `/Saeid-Mocha-/`. The GitHub Actions workflow installs dependencies, tests, builds and deploys to GitHub Pages.

## Attribution and scope

Original Saeid/Mocha artwork was provided by the game creator; the game uses cutouts derived from that art, not generic replacement characters. Sprite motion is procedural (hovering, tilting, squash-and-stretch) rather than a full hand-drawn frame-by-frame animation set. The electronic soundtrack is generated in real time. No commercial artwork, sound, code or branding from Jetpack Joyride is used. All purchases are in-game earned currency only. No analytics or server account.