# Maintaining the what3words ArcGIS Experience Builder Widget

How to test and release the widget when Esri releases a new Experience Builder version, and how the demo app is built and deployed to GitHub Pages. For installing and using the widget, see [README.md](./README.md).

## Upgrading to a new Experience Builder version

Steps for maintainers when Esri releases a new Experience Builder version. The widget source supports every version from the oldest one listed under [Prerequisites](./README.md#prerequisites) to the newest, so test on both ends.

### 1. Set up the Developer Edition locally
1. Download the new version of [ArcGIS Experience Builder (Developer Edition)](https://developers.arcgis.com/experience-builder/guide/downloads/) and unzip it next to your previous install.
2. Install the `server` and `client` dependencies with the package manager named in `client/package.json` (`packageManager`), for example `pnpm install` for 1.21. Versions without `packageManager` (1.16) use `npm ci`. Node.js 24 works for 1.16 and 1.21.
3. Copy `server/public/signin-info.json` from your previous install to reuse its portal URL and client ID. The client ID's OAuth redirect URL must allow `https://localhost:3001`.
4. Copy the `what3words` folder into `client/your-extensions/widgets/`.
5. Start the server (`pnpm start` or `npm start` in `server`; set `EXB_HTTP_PORT` if port 3000 is taken) and the client watcher (same command in `client`), then open `https://localhost:3001`. Every install uses port 3001, so run one server at a time.

### 2. Test the widget
1. In a test app with a map, check:
   - API key mode and Locator URL mode: a map click returns and draws a what3words address.
   - The Grid: zoom in until `Display Grid` is enabled, turn it on, then pan and zoom; the Grid redraws when the map stops.
   - Opening and closing the widget through a widget controller turns map clicks on and off.
   - The settings page saves, and the browser console has no errors from the widget.
2. In `client`, run `pnpm exec eslint your-extensions/widgets/what3words`, and `pnpm run tscheck` if `client/package.json` has that script (1.21 does, 1.16 does not).
3. Failures usually come from ArcGIS Maps SDK for JavaScript APIs removed in a new major version, for example `esri/geometry/projection` in 5.0. Compare the widget's `esri/` imports with `client/node_modules/@arcgis/core`.

### 3. Update the widget
1. Fix the widget in this repository and copy it into the Developer Edition after each change.
2. Repeat the tests on the new version and on the oldest supported version. When an API differs between them, branch on the `esri/kernel` version, as `projectToWGS84` in `what3words/src/runtime/widget.tsx` does.
3. Bump `version` in `what3words/manifest.json` using [semver](https://semver.org/) and set `exbVersion` to the new Experience Builder version. `exbVersion` is also the version the demo is built with when `main` is deployed.
4. Update the supported versions under [Prerequisites](./README.md#prerequisites) and add a [Revision History](./README.md#revision-history) entry.

### 4. Test the demo app locally
`scripts/build-demo.sh` downloads the Developer Edition from Esri, checks it against Esri's published SHA-256, adds the widget and the demo app from `demo/`, and exports the demo into `expBuilder_Widget/`. It needs Node.js, pnpm or npm (whichever that version uses), curl, python3, shasum and unzip. Downloads are cached in `.exb/`; both folders are ignored by git.

```sh
scripts/build-demo.sh                      # exbVersion from what3words/manifest.json
EXB_VERSION=1.16 scripts/build-demo.sh     # a specific version, e.g. the oldest supported
EXB_VERSION=latest scripts/build-demo.sh   # the newest stable release
python3 -m http.server 8000 --directory expBuilder_Widget
```

Open `http://localhost:8000` and check that the app loads. The local build keeps the `__W3W_API_KEY__` placeholder, so API key mode will not return addresses, and the demo's web map needs an ArcGIS sign-in unless it is shared publicly.

### 5. Test on GitHub Pages before merging
1. Push your branch, then open the repository's Actions tab, choose "Deploy static content to Pages" and click "Run workflow".
2. Pick your branch and leave `exb_version` empty to use the branch's `exbVersion`, or set a version such as `1.16`.
3. When the run finishes, check the [demo](https://what3words.github.io/w3w-arcgis-experience-builder-widget/expBuilder_Widget/). The "Build the demo app" step logs the version it used.

This replaces the live demo until the next deployment from `main`.

### 6. Release
1. Open a pull request into `main`. Merging it deploys the demo on the new `exbVersion`.
2. If you deployed a branch in step 5 and do not merge, restore the live demo by running the workflow on `main` with `exb_version` empty.
3. Create the release on `main`: `gh release create vX.Y.Z --target main --title vX.Y.Z --notes "..."`.

## Demo app on GitHub Pages

The demo is deployed by `.github/workflows/static.yml`, which runs `scripts/build-demo.sh`, injects the what3words API key and publishes the site with Jekyll, so `README.md` renders at the site root.

| Trigger | Branch | Experience Builder version |
| --- | --- | --- |
| Push to `main` | `main` | `exbVersion` in `what3words/manifest.json` |
| "Run workflow" with `exb_version` empty | The branch you pick | That branch's `exbVersion` |
| "Run workflow" with `exb_version` set | The branch you pick | `exb_version`, e.g. `1.16` or `latest` |

There is one GitHub Pages site, so any deployment replaces the live demo. To restore it, run the workflow on `main` with `exb_version` empty.

### One-time setup
- Settings > Pages > Build and deployment: Source is "GitHub Actions".
- Repository secret `W3W_DEMO_API_KEY`: a what3words API key restricted to `what3words.github.io/w3w-arcgis-experience-builder-widget/*`, for example `gh secret set W3W_DEMO_API_KEY`. The key is visible to anyone using the demo, so never use an unrestricted key.
- Settings > Environments > `github-pages` > Deployment branches: allow `main`, plus any branch you want to deploy from.

### Demo app config
`demo/config.json` and `demo/info.json` define the demo app: its pages, the map and the settings of the two what3words widgets. They stay on the oldest supported Experience Builder version (1.16), because newer versions upgrade an older config when the app loads but older versions cannot read a newer one. `w3wApiKey` must stay `__W3W_API_KEY__`; the workflow replaces it at deploy time.

To change the demo app, or when dropping support for older versions, edit it in the oldest version you support:
1. Copy `demo/config.json` to `server/public/apps/1/config.json` and `server/public/apps/1/resources/config/config.json`, and `demo/info.json` to `server/public/apps/1/info.json`.
2. Open the app in the builder, make your changes, then Save and Publish.
3. Copy `server/public/apps/1/resources/config/config.json` back to `demo/config.json` and set `w3wApiKey` back to `__W3W_API_KEY__` before committing.

### When a deployment fails
- "is not in the downloads list": the version is not on Esri's downloads page. Check `exb_version` or `exbVersion`.
- "has no published SHA-256": Esri does not publish a checksum for that version, so it cannot be used.
- "W3W_DEMO_API_KEY secret is not set": add the repository secret.
- The deploy step is rejected: allow the branch in the `github-pages` environment.
- Downloading Experience Builder fails: the script uses the endpoint behind Esri's downloads page, which is not a documented API. If Esri starts requiring a sign-in, the script needs an ArcGIS token.
