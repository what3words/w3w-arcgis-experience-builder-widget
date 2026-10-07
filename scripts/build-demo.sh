#!/usr/bin/env bash
# Builds the demo app into expBuilder_Widget/: downloads ArcGIS Experience Builder (Developer Edition),
# adds the what3words widget and the demo app from demo/, then exports it with Experience Builder's own app download.
#
# The Experience Builder version is EXB_VERSION if set (e.g. 1.16, or "latest" for the newest stable release),
# otherwise exbVersion from what3words/manifest.json.
# Needs Node.js, pnpm (or corepack) or npm (whichever that version uses), curl, python3 and unzip.
set -euo pipefail

repo=$(cd "$(dirname "$0")/.." && pwd)
work=${EXB_WORK_DIR:-"$repo/.exb"}
requested=${EXB_VERSION:-$(python3 -c "import json, sys; print(json.load(open(sys.argv[1]))['exbVersion'])" "$repo/what3words/manifest.json")}

# Looks the version up in the list behind https://developers.arcgis.com/experience-builder/guide/downloads/
resolved=$(python3 - "$requested" <<'EOF'
import json, re, sys, urllib.request

base = 'https://developers.arcgis.com/experience-builder/page-data'
get = lambda url: json.load(urllib.request.urlopen(url, timeout=30))
key = lambda v: tuple(int(p) for p in v.split('.'))

def normalise(v):
    parts = key(v)
    while len(parts) > 1 and parts[-1] == 0:
        parts = parts[:-1]
    return parts

downloads = None
for query_hash in get(f'{base}/guide/downloads/page-data.json')['staticQueryHashes']:
    raw = get(f'{base}/sq/d/{query_hash}.json').get('data', {}).get('siteConfig', {}).get('raw', {})
    if (raw.get('downloads') or {}).get('id') == 'arcgis-experience-builder':
        downloads = raw['downloads']['downloads']
        break
if not downloads:
    sys.exit('Could not find the Experience Builder downloads list on developers.arcgis.com')

stable = [d for d in downloads if re.fullmatch(r'\d+(\.\d+){1,2}', str(d['version']))]
requested = sys.argv[1]
if requested == 'latest':
    entry = max(stable, key=lambda d: key(d['version']))
else:
    entry = next((d for d in stable if normalise(d['version']) == normalise(requested)), None)
    if not entry:
        sys.exit(f'Experience Builder {requested} is not in the downloads list')
file = next(f for f in entry['files'] if f['label'] == 'Download')
if not file.get('sha256'):
    sys.exit(f"Experience Builder {entry['version']} has no published SHA-256")
print(entry['version'], file['folder'], file['name'], file['sha256'].lower())
EOF
)
read -r version folder zip sha256 <<< "$resolved"
echo "Building the demo with Experience Builder $version"

mkdir -p "$work"
cd "$work"
if [ ! -f "$zip" ]; then
  url=$(curl -fsS "https://downloads.arcgis.com/dms/rest/download/secured/$zip?folder=$folder" \
    | python3 -c "import json, sys; print(json.load(sys.stdin)['url'])")
  curl -fsSL -o "$zip" "$url"
fi
echo "$sha256  $zip" | shasum -a 256 -c -

rm -rf exb
unzip -q "$zip" -d exb
# Older zips wrap client/ and server/ in an ArcGISExperienceBuilder/ folder
client_package=$(find exb -maxdepth 3 -path '*/client/package.json' -print -quit)
exb=$(dirname "$(dirname "$client_package")")
# Experience Builder 1.21 pins pnpm in packageManager; older versions use npm
if node -p "require('./$exb/client/package.json').packageManager || ''" | grep -q '^pnpm'; then
  install='pnpm install --frozen-lockfile'
else
  install='npm ci'
fi
(cd "$exb/server" && $install)
(cd "$exb/client" && $install)

cp -R "$repo/what3words" "$exb/client/your-extensions/widgets/"
app=$exb/server/public/apps/1
mkdir -p "$app/resources/config"
cp "$repo/demo/config.json" "$app/config.json"
cp "$repo/demo/config.json" "$app/resources/config/config.json"
cp "$repo/demo/info.json" "$app/info.json"

# zipApp refuses to overwrite an existing zip.
# NODE_ENV=production makes the download build the widgets for production.
rm -f "$work/expBuilder_Widget.zip"
(cd "$exb/server" && NODE_ENV=production node -e "
  const { zipApp } = require('./src/middlewares/dev/apps/app-download.js')
  const { attributes } = require('./public/apps/1/config.json')
  Promise.resolve(zipApp('1', process.argv[1], attributes.clientId)).catch((error) => {
    console.error(error)
    process.exit(1)
  })
" "$work/expBuilder_Widget.zip")

rm -rf "$repo/expBuilder_Widget"
unzip -q "$work/expBuilder_Widget.zip" -d "$repo/expBuilder_Widget"
echo "Demo app built with Experience Builder $version in $repo/expBuilder_Widget"
