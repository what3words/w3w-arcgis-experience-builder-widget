export interface Address {
  words: string
  square: {
    northeast: { lat: number, lng: number }
    southwest: { lat: number, lng: number }
  }
  nearestPlace: string
}

export interface AvailableLanguage {
  code: string
  name: string
  nativeName: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

interface Options {
  apiKey: string
  language?: string
  exbVersion: string
}

const DEFAULT_PLUGIN_HEADER = (exbVersion: string) => `ArcGIS Experience App (v${exbVersion})`
export const fetchW3WAddress = async ({ latitude, longitude }: Coordinates, opts: Options): Promise<Address> => {
  const { apiKey, language = 'en', exbVersion } = opts
  if (!opts.apiKey) {
    throw new Error('API Key is required to fetch address.')
  }
  const response = await fetch(
    'https://api.what3words.com/v3/convert-to-3wa?' +
    new URLSearchParams({
      key: apiKey,
      coordinates: `${latitude},${longitude}`,
      language
    }).toString(),
    {
      headers: { 'X-W3W-Plugin': DEFAULT_PLUGIN_HEADER(exbVersion) }
    })
    .then(res => res.json())

  return {
    words: response.words,
    square: response.square,
    nearestPlace: response.nearestPlace || 'No nearby place available'
  }
}

export const fetchGrid = async (extent: __esri.Extent, opts: Options) => {
  const { apiKey, exbVersion } = opts
  if (!apiKey) {
    return
  }
  const boundingBox = `${extent.ymin},${extent.xmin},${extent.ymax},${extent.xmax}`
  return await fetch(
    'https://api.what3words.com/v3/grid-section?' +
    new URLSearchParams({
      key: apiKey,
      'bounding-box': boundingBox,
      format: 'geojson'
    }).toString(),
    {
      headers: {
        'X-W3W-Wrapper': `ArcGIS Experience App ${exbVersion}`
      }
    })
    .then(res => res.json())
    .catch(error => {
      return {
        features: [
          {
            geometry: {
              coordinates: [],
              type: 'MultiLineString'
            },
            type: 'Feature',
            properties: {}
          }
        ],
        type: 'FeatureCollection'
      }
    })
}
export const fetchAvailableLanguages = async (opts: Options): Promise<AvailableLanguage[]> => {
  const { apiKey, exbVersion } = opts
  if (!apiKey) {
    throw new Error('API key is required to fetch available languages.')
  }

  return await fetch(
    'https://api.what3words.com/v3/available-languages?' +
      new URLSearchParams({ key: apiKey }).toString(),
    {
      headers: { 'X-W3W-Plugin': DEFAULT_PLUGIN_HEADER(exbVersion) }
    }
  )
    .then((response) => response.json())
    .then(({ languages }) => languages)
    .catch((error) => {
      console.error(
        'Error fetching available languages:',
        error?.response?.data?.error?.message || error
      )
      return [
        {
          code: 'en',
          name: 'English',
          nativeName: 'English'
        }
      ]
    })
}
