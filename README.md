# QRavate for Make

[![CI](https://github.com/QRavate/make/actions/workflows/ci.yml/badge.svg)](https://github.com/QRavate/make/actions/workflows/ci.yml)
[![Contract test](https://github.com/QRavate/make/actions/workflows/contract.yml/badge.svg)](https://github.com/QRavate/make/actions/workflows/contract.yml)

The [Make](https://www.make.com) app of [QRavate](https://www.qravate.com), dynamic QR codes with style. Use your QR codes in Make scenarios: create them from a form or a spreadsheet, change where they point without reprinting them, react when one reaches a number of scans.

Built on the public [QRavate API](https://www.qravate.com/docs).

## Modules

| Module | Type | What it does |
|---|---|---|
| Watch QR Code Events | Instant trigger | QR code created, destination changed, paused or resumed, or scan threshold reached |
| Create a QR Code | Action | Creates a dynamic QR code with a name and a destination URL |
| Update a QR Code | Action | Changes the destination or the name. The printed QR code stays the same. |
| Pause or Resume a QR Code | Action | Scanners see a neutral page while the QR code is paused |
| Get a QR Code | Action | Gets a QR code by ID |
| Search QR Codes | Search | Lists QR codes, newest first, by name, destination or state |
| Get QR Code Stats | Action | Scans over a period: total, unique visitors, per day |

The trigger registers a QRavate webhook when the scenario's webhook is created and removes it when it is deleted.

## Connecting your account

1. You need a QRavate account on the **Pro** or **Max** plan (the API is included from Pro).
2. In your QRavate account, open **API et webhooks** and create a key. It starts with `sk_` and is shown only once.
3. In Make, add a QRavate connection and paste the key.

## How this repository is organised

Make apps are edited in the Make app editor (or synced with the [Make Apps Editor](https://marketplace.visualstudio.com/items?itemName=Integromat.apps-sdk) extension for VS Code). This repository is the reference copy of every block, one file per editor tab:

| Editor | File |
|---|---|
| Base | `app/base.iml.json` |
| Connection → Communication / Parameters | `app/connection/*.iml.json` |
| Webhook `qrEvents` → Communication / Parameters / Attach / Detach | `app/webhooks/qrEvents/*.iml.json` |
| Remote procedure `listQrCodes` | `app/rpcs/listQrCodes/communication.iml.json` |
| Module → Communication / Static parameters / Mappable parameters / Interface / Samples | `app/modules/<module>/*.iml.json` |

`app.json` lists each component with its name, label, type and connection, and the module groups. `assets/icon.png` is the app icon (512 × 512).

`node scripts/check.mjs` checks that every block is valid JSON and that every component has its files. It runs in CI on every pull request.

**Changing the app:** edit the files here in a pull request, then copy the changed blocks into the Make editor once merged, and test the modules in a scenario.

## Support

[Open an issue](https://github.com/QRavate/make/issues) or write to support@qravate.com.
