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

export interface GeoJsonGridData {
  features: Feature[]
  type: string
}

interface Feature {
  geometry: Geometry
  type: string
  properties: FeatureProperties
}

interface FeatureProperties {
  country: string
  nearestPlace: string
  words: string
  language: string
  map: string
}

interface Geometry {
  coordinates: number[]
  type: string
}

interface Options {
  apiKey: string
  language?: string
  exbVersion: string
}

const W3W_PLUGIN_HEADER = (exbVersion: string) => `ArcGIS Experience App (v${exbVersion})`
export const fetchW3WAddress = async ({ latitude, longitude }: Coordinates, opts: Options): Promise<Address> => {
  const { apiKey, language = 'en', exbVersion } = opts
  if (!opts.apiKey) {
    throw new Error('API Key is required to fetch address.')
  }
  return fetch(
    'https://api.what3words.com/v3/convert-to-3wa?' +
    new URLSearchParams({
      key: apiKey,
      coordinates: `${latitude},${longitude}`,
      language
    }).toString(),
    {
      headers: { 'X-W3W-Plugin': W3W_PLUGIN_HEADER(exbVersion) }
    })
    .then(res => res.json())
    .then(({ error, words, square, nearestPlace = 'No nearby place available' }) => {
      if (error) {
        throw new Error(`${error?.code || 'Error'}: ${error?.message || 'Unable to fetch 3wa'}`)
      }
      return {
        words,
        square,
        nearestPlace
      }
    })
}

export const fetchGrid = async (extent: __esri.Extent, opts: Options): Promise<GeoJsonGridData> => {
  const { apiKey, exbVersion } = opts
  if (!apiKey) {
    return
  }
  const boundingBox = `${extent.ymin},${extent.xmin},${extent.ymax},${extent.xmax}`
  return fetch(
    'https://api.what3words.com/v3/grid-section?' +
    new URLSearchParams({
      key: apiKey,
      'bounding-box': boundingBox,
      format: 'geojson'
    }).toString(),
    {
      headers: { 'X-W3W-Plugin': W3W_PLUGIN_HEADER(exbVersion) }
    })
    .then(res => res.json())
    .then(({ error, features, type }) => {
      if (error) {
        throw new Error(`${error?.code || 'Error'}: ${error?.message || 'Unable to fetch grid data'}`)
      }
      return {
        features,
        type
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
      headers: { 'X-W3W-Plugin': W3W_PLUGIN_HEADER(exbVersion) }
    }
  )
    .then(res => res.json())
    // .then(({ languages }) => languages)
    .then(({ error, languages }) => {
      if (error) {
        throw new Error(`${error?.code || 'Error'}: ${error?.message || 'Unable to fetch available languages'}`)
      }
      return languages
    })
}
