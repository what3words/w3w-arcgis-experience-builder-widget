#!/usr/bin/env bash
# Builds the demo app into expBuilder_Widget/: downloads ArcGIS Experience Builder (Developer Edition),
# adds the what3words widget and the demo app from demo/, then exports it with Experience Builder's own app download.
# Needs Node.js, pnpm (or corepack), curl, python3, shasum and unzip.
set -euo pipefail

# From https://developers.arcgis.com/experience-builder/guide/downloads/ (Checksums)
EXB_VERSION=1.21
EXB_SHA256=ab173fab2193d0d6c1b3d995efc1e871f27699a9676427ec85c3686ce25c3025

repo=$(cd "$(dirname "$0")/.." && pwd)
work=${EXB_WORK_DIR:-"$repo/.exb"}
zip="arcgis-experience-builder-$EXB_VERSION.zip"

mkdir -p "$work"
cd "$work"
if [ ! -f "$zip" ]; then
  url=$(curl -fsS "https://downloads.arcgis.com/dms/rest/download/secured/$zip?folder=software/ExperienceBuilder/$EXB_VERSION" \
    | python3 -c "import json, sys; print(json.load(sys.stdin)['url'])")
  curl -fsSL -o "$zip" "$url"
fi
echo "$EXB_SHA256  $zip" | shasum -a 256 -c -

rm -rf exb
unzip -q "$zip" -d exb
(cd exb/server && pnpm install --frozen-lockfile)
(cd exb/client && pnpm install --frozen-lockfile)

cp -R "$repo/what3words" exb/client/your-extensions/widgets/
app=exb/server/public/apps/1
mkdir -p "$app/resources/config"
cp "$repo/demo/config.json" "$app/config.json"
cp "$repo/demo/config.json" "$app/resources/config/config.json"
cp "$repo/demo/info.json" "$app/info.json"

# NODE_ENV=production makes the download build the widgets for production
(cd exb/server && NODE_ENV=production node -e "
  const { zipApp } = require('./src/middlewares/dev/apps/app-download.js')
  const { attributes } = require('./public/apps/1/config.json')
  Promise.resolve(zipApp('1', process.argv[1], attributes.clientId)).catch((error) => {
    console.error(error)
    process.exit(1)
  })
" "$work/expBuilder_Widget.zip")

rm -rf "$repo/expBuilder_Widget"
unzip -q "$work/expBuilder_Widget.zip" -d "$repo/expBuilder_Widget"
echo "Demo app built in $repo/expBuilder_Widget"
