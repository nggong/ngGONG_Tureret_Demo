# GONG-style turret and stationary lab

Two-mirror horizontal-axis turret with a stationary lab wall, beam entry port, optical bench, and receiving aperture. The beam follows Sun → FM1 → stem → FM2 → horizontal shaft → wall port → bench receiver. The receiver is not a mirror.

Live Demo: https://nggong.github.io/ngGONG_Tureret_Demo/

GitHub Repo: https://github.com/nggong/ngGONG_Tureret_Demo

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
node test-dynamics.mjs
```

Edit `source/turret-app.js` for rendering and lab geometry, `source/turret-model.js` for the two-mirror kinematics, and `source/turret-template.html` for controls and labels. `source/standalone-template.html` contains the standalone HTML shell and embedded styles. Rebuild and commit the resulting `index.html` after edits. All paths are relative to this package; no local-machine paths are required.

## Scope

Dimensions, axis zeros, and the horizontal +X lab bearing are schematic. Sky tracking is an illustrative sweep, not a dated solar ephemeris or controller. The wall, bench, and receiver have constant world coordinates. The primary support and output centerline stay fixed while the head and core move. Field rotation, aperture clearance, collisions, polarization, structural behavior, and servo performance are not evaluated. Legacy HA/DEC load tables are not sizing results for this mount.

The test checks 1,452 sky positions for fixed horizontal output, two reflections, axis mapping, mirror mounting angle, and unchanged lab mesh geometry. Use the play control and side/isometric views to inspect motion.

## Reference assets

The included reference image is the user-supplied “GONG Turret Components,” L. Rimmele, 19 August 2026 draft. Hardware candidates and illustrative load data come from the supplied project documents.

GONG arrangement reference: https://nso.edu/telescopes/nisp/gong/

## Dynamics view (revision 7)

Select **Dynamics · Lagrange / Hamilton** in the View menu. Adjust head mass, stem/COM radius, core inertia and the three head principal inertias. Inputs reject nonpositive/out-of-range values and nonphysical principal-inertia triangle inequalities. Play or scrub the 12-second reference trajectory; compare angles, motor torques, and maximum formulation differences. Download CSV or copy the revealed CSV text if browser downloads are blocked.

The simulations use independently integrated Euler–Lagrange angle/velocity and Hamilton angle/momentum states. Both use the same inverse-dynamics/PD control law; changing mass/inertia changes torque requirements while that law maintains the prescribed motion. This is an ideal rigid-body tracking demonstration with adjustable symmetric torque saturation, not a measured servo response. There are no counterweights, friction, wind or flexibility. The head COM is at the stem pivot and the core COM is on the horizontal shaft. Visual geometry remains dimensionless.

`test-dynamics.mjs` checks coordinate-transformed derivatives, trajectory accuracy, step-halving convergence and L/H torque/motion agreement for three physical parameter sets.

### Motor torque limits and tracking error

Shaft and head limits are independently adjustable, including zero torque. Limits clip the requested PD/inverse-dynamics torque at every RK4 substep in both models. High/low presets illustrate successful tracking and saturation. Angle plots include the command; separate panels show requested torque, applied torque with limit lines, and actual-minus-command error. Peak error and the fraction of saturated output samples are reported per axis. CSV adds commanded angles, L/H errors and applied torques.

These are constant joint-torque limits, not speed-dependent motor curves or thermal/current limits. With no counterweights or travel stops the low-limit model can rotate far beyond a real turret’s travel; do not interpret those trajectories as permissible hardware motion. Numerical convergence and L/H agreement are tested for high, low and zero torque.

## Guided operating sequence

The default view is a draft SFC with Next/Back, autoplay, Hold and Fault branches. It steps through Stowed, Prepare, Acquire Sun, Track, Stop tracking, Move to stow, and Stowed. The parked entrance faces down (schematic shaft rotation +90°, head rotation 0°) with an illustrated cover closed. Real stow angles, weather sealing, interlocks and recovery behavior remain to be defined. Engineering dynamics remain optional. Edit source/sequence.js to replace step descriptions, poses and transitions.
