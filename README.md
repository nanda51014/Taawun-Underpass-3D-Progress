# Taawun Underpass – 3D Progress Model

Live site: https://nanda51014.github.io/Taawun-Underpass-3D-Progress/

`index.html` is the live model, served by GitHub Pages from the `main` branch.

## Shared statuses (Firebase)
The site can keep one shared set of statuses for all viewers, with editor sign-in and an audit log. Setup steps: [FIREBASE-SETUP.md](FIREBASE-SETUP.md). Until `firebase-config.js` is filled in, statuses are saved only in each viewer's browser (localStorage).

## CAD export (DXF)
**Export DXF (CAD)** (bottom-left tools) downloads the 3D model with the current statuses as an AutoCAD R12 DXF. Open it in AutoCAD / Civil 3D / BricsCAD and use **Save As → DWG**.
- Units metres; X = chainage, Y+ = LHS facing Sharjah, Z = level relative to top of wall (0.00).
- One layer per element, named `STATUS_ELEMENT` (e.g. `CON_UL4-WALL-L`). Status prefixes: `NS`, `RFT`, `FW`, `CON` (stage complete), `RFT-IP`, `FW-IP`, `CON-IP` (in progress), `HD` (on hold). Use a layer filter such as `CON_*`.
- All elements are exported whatever the on-screen show/hide toggles; segment IDs, chainages, a title and a colour legend are included as text.

## Updating the model
1. Replace `index.html` with the new revision. **Keep the three script lines for `firebase-config.js`, `cloud-sync.js` and `dxf-export.js` just before `</body>`.** Also add the dated copy, e.g. `Taawun_Underpass_3D_Progress_Model-Rev2-<date>.html`.
2. Add a row to the revisions table below.
3. Commit and push to `main`. The site updates within a minute or two.

## Revisions
| Rev | Date | File |
|---|---|---|
| Rev0 | 05-Nov-26 | [Taawun_Underpass_3D_Progress_Model-Rev0-05-Nov-26.html](Taawun_Underpass_3D_Progress_Model-Rev0-05-Nov-26.html) |
| Rev1 | 09-Nov-26 | [Taawun_Underpass_3D_Progress_Model-Rev1-09-Nov-26.html](Taawun_Underpass_3D_Progress_Model-Rev1-09-Nov-26.html) — stage colours simplified to steel fixing / formwork / concrete (hatched = in progress), draggable labels with reset, unweighted KPI and segment panels removed |

`index.html` = Rev1 model + the shared-status hook (firebase-config.js, cloud-sync.js) added 09-Nov-26. Dated copies are the model files exactly as issued.
