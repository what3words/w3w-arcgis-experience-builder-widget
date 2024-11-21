import type Point from 'esri/geometry/Point'
import { loadArcGISJSAPIModules } from 'jimu-arcgis'
const w3wIcon = require('../assets/w3wMarker.png')

/**
 * Fetches an address from a geocode service.
 * @param geocodeURL - URL of the geocode service.
 * @param mapClick - The clicked point on the map.
 * @returns A promise resolving to the retrieved address.
 */
export const getCurrentAddress = (geocodeURL: string, mapClick: Point): Promise<string | null> => {
  if (!mapClick) return Promise.resolve(null)

  return loadArcGISJSAPIModules(['esri/rest/locator']).then(([locator]) => {
    return createPoint(mapClick).then((point) => {
      return locator.locationToAddress(
        geocodeURL,
        { location: point },
        { query: {} }
      ).then((response) => {
        console.log('Geocode service response:', response)
        return Promise.resolve(response.address)
      }).catch((err) => {
        console.error('Error fetching address:', err.message)
        return err.message + ' - Check your Locator URL'
      })
    })
  })
}

/**
 * Fetches an address from the what3words API.
 * @param apiKey - The what3words API key.
 * @param latitude  - The latitude.
 * @param longitude - The longitude.
 * @returns A promise resolving to the retrieved address.
 */
export const getCurrentAddressFromApiKey = async (apiKey: string, latitude: number, longitude: number): Promise<string | null> => {
  if (!apiKey) throw new Error('API key is not provided.')

  const url = `https://api.what3words.com/v3/convert-to-3wa?key=${apiKey}&coordinates=${latitude},${longitude}`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch address.')

  const data = await response.json()
  return data.words || null
}

/**
 * Creates a point geometry from map click.
 * @param mapClick - The map click event.
 * @returns A promise resolving to an Esri Point.
 */
export const createPoint = (mapClick: any): Promise<Point> => {
  if (!mapClick) return Promise.resolve(null)

  return loadArcGISJSAPIModules(['esri/geometry/Point']).then(([Point]) => {
    return new Point({
      longitude: mapClick.longitude,
      latitude: mapClick.latitude,
      spatialReference: { wkid: 4326 }
    })
  })
}

/**
 * Creates a marker graphic for a given point.
 * @param point - The point where the marker should be displayed.
 * @returns A promise resolving to a Graphic.
 */
export const getMarkerGraphic = (point: Point): Promise<__esri.Graphic | null> => {
  if (!point) return Promise.resolve(null)

  return loadArcGISJSAPIModules(['esri/Graphic', 'esri/symbols/PictureMarkerSymbol']).then(([Graphic, PictureMarkerSymbol]) => {
    const symbol = new PictureMarkerSymbol({
      width: 25,
      height: 25,
      xoffset: 0,
      yoffset: 11,
      url: w3wIcon
    })

    return new Graphic({
      geometry: point,
      symbol: symbol
    })
  })
}

/**
 * Creates a label graphic for the what3words address.
 * @param point - The point where the label should be displayed.
 * @param what3words - The what3words address to display.
 * @returns A promise resolving to a Graphic.
 */
export const getMapLabelGraphic = (point: Point, what3words: string): Promise<__esri.Graphic | null> => {
  if (!point) return Promise.resolve(null)

  return loadArcGISJSAPIModules(['esri/Graphic']).then(([Graphic]) => {
    const textSymbol = {
      type: 'text',
      text: '///' + what3words,
      font: { size: 12, weight: 'bold' },
      horizontalAlignment: 'left',
      kerning: true,
      rotated: false,
      color: [225, 31, 38, 1],
      haloColor: '#0A3049',
      haloSize: '1px',
      xoffset: 12,
      yoffset: 5
    }

    return new Graphic({
      geometry: point,
      symbol: textSymbol
    })
  })
}
