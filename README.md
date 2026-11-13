# GONG-style turret and stationary lab

Two-mirror horizontal-axis turret with a stationary lab wall, beam entry port, optical bench, and receiving aperture. The beam follows Sun → FM1 → stem → FM2 → horizontal shaft → wall port → bench receiver. The receiver is not a mirror.

Live Demo: https://nggong.github.io/ngGONG_Tureret_Demo/

GitHub Repo & README:  https://github.com/nggong/ngGONG_Tureret_Demo

## Publish on GitHub Pages

1. Create a GitHub repository and upload the contents of this folder. Keep `index.html` at the repository root.
2. In the repository, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select your branch and **/(root)**, then save.
4. Open the Pages URL GitHub provides after deployment completes.

`index.html` is self-contained and can also be opened directly in a browser. No npm packages, server, or secrets are needed. `.nojekyll` disables Jekyll processing.

## Edit and rebuild

Requires Node.js 20 or newer; no dependency installation is needed.

```sh
node build.mjs
node test.mjs
```

Edit `source/turret-app.js` for rendering and lab geometry, `source/turret-model.js` for the two-mirror kinematics, and `source/turret-template.html` for controls and labels. `source/standalone-template.html` contains the standalone HTML shell and embedded styles. Rebuild and commit the resulting `index.html` after edits. All paths are relative to this package; no local-machine paths are required.

## Scope

Dimensions, axis zeros, and the horizontal +X lab bearing are schematic. Sky tracking is an illustrative sweep, not a dated solar ephemeris or controller. The wall, bench, and receiver have constant world coordinates. The primary support and output centerline stay fixed while the head and core move. Field rotation, aperture clearance, collisions, polarization, structural behavior, and servo performance are not evaluated. Legacy HA/DEC load tables are not sizing results for this mount.

The test checks 1,452 sky positions for fixed horizontal output, two reflections, axis mapping, mirror mounting angle, and unchanged lab mesh geometry. Use the play control and side/isometric views to inspect motion.

## Reference assets

The included reference image is the user-supplied “GONG Turret Components,” L. Rimmele, 19 August 2026 draft. Hardware candidates and illustrative load data come from the supplied project documents.

GONG arrangement reference: https://nso.edu/telescopes/nisp/gong/
