import type Point from 'esri/geometry/Point'
import { loadArcGISJSAPIModules } from 'jimu-arcgis'
import what3words, { axiosTransport } from '@what3words/api'
import type { What3wordsService, ConvertTo3waResponse } from '@what3words/api'

let w3wService: What3wordsService

/**
 * Initializes the What3Words service with the provided API key.
 * @param apiKey - The W3W API Key.
 */
export async function initializeW3wService (apiKey: string): Promise<void> {
  if (!apiKey) {
    console.error('W3W API Key is required to initialize the service.')
    return
  }

  try {
    // Initialize the What3Words service
    w3wService = what3words(apiKey, { host: 'https://api.what3words.com' }, { transport: axiosTransport() })
    console.log('What3Words service initialized.')
  } catch (error) {
    console.error('Error initializing What3Words service:', error)
  }
}

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
 * Fetches the W3W address and square using the initialized W3W service.
 * @param latitude - Latitude of the location.
 * @param longitude - Longitude of the location.
 * @returns A promise resolving to the W3W address and square.
 */
export async function getCurrentAddressFromW3wService (
  latitude: number,
  longitude: number
): Promise<{ words: string, square: { southwest: { lat: number, lng: number }, northeast: { lat: number, lng: number } }, nearestPlace: string } | null> {
  if (!w3wService) {
    console.error('W3W service is not initialized. Please call initializeW3wService first.')
    return null
  }

  try {
    const response = await w3wService.convertTo3wa({ coordinates: { lat: latitude, lng: longitude } }) as ConvertTo3waResponse

    if (!response.words || !response.square) {
      console.error('Invalid response from W3W API:', response)
      return null
    }

    return {
      words: response.words,
      square: response.square,
      nearestPlace: response.nearestPlace || 'No nearby place available'
    }
  } catch (error) {
    console.error('Error fetching W3W address:', error)
    return null
  }
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
 * Creates a polygon graphic for the given W3W square with dynamic color adjustment.
 * The polygon is styled using W3W branding colors and scales dynamically.
 * @param square - The W3W square to calculate the polygon's bounds.
 * @param mapView - The MapView instance to retrieve zoom level and other details.
 * @param proximityFactor - A factor indicating proximity to a certain point (optional).
 * @returns A promise resolving to a Graphic.
 */
export const getMarkerGraphic = async (
  square: { southwest: { lat: number, lng: number }, northeast: { lat: number, lng: number } },
  mapView: __esri.MapView,
  proximityFactor: number = 1
): Promise<__esri.Graphic | null> => {
  if (!square || !mapView) return null

  try {
    const [Graphic, SimpleFillSymbol] = await loadArcGISJSAPIModules(['esri/Graphic', 'esri/symbols/SimpleFillSymbol'])

    // Create the polygon geometry
    const polygon = {
      type: 'polygon',
      rings: [
        [square.southwest.lng, square.southwest.lat], // Bottom-left
        [square.northeast.lng, square.southwest.lat], // Bottom-right
        [square.northeast.lng, square.northeast.lat], // Top-right
        [square.southwest.lng, square.northeast.lat], // Top-left
        [square.southwest.lng, square.southwest.lat] // Close the loop
      ],
      spatialReference: { wkid: 4326 }
    }

    // Dynamic color adjustments
    const zoomLevel = mapView.zoom

    // Adjust opacity dynamically based on zoom level
    const fillOpacity = Math.min(0.5 + 0.03 * (28 - zoomLevel), 1) // Higher zoom = more opaque

    // Adjust color brightness based on proximity factor (e.g., closer = brighter)
    const baseColor = [225, 31, 38] // W3W red color
    const outlineColor = [160, 15, 25] // Darker red for outline

    const adjustedFillColor = baseColor.map((channel) => Math.min(channel + proximityFactor * 15, 255))
    const adjustedOutlineColor = outlineColor.map((channel) => Math.min(channel + proximityFactor * 10, 255))

    // Style the polygon
    const symbol = new SimpleFillSymbol({
      color: [...adjustedFillColor, fillOpacity], // Adjusted fill color with dynamic opacity
      outline: {
        color: [...adjustedOutlineColor, 1], // Darker outline color with full opacity
        width: 2 // Outline width
      }
    })

    return new Graphic({
      geometry: polygon,
      symbol: symbol
    })
  } catch (error) {
    console.error('Error creating polygon graphic with dynamic colors:', error)
    return null
  }
}

/**
 * Creates a label graphic for the what3words address.
 * @param square - The W3W square for which the label should be displayed.
 * @param what3words - The what3words address to display.
 * @returns A promise resolving to a Graphic.
 */
export const getMapLabelGraphic = async (
  square: { southwest: { lat: number, lng: number }, northeast: { lat: number, lng: number } },
  what3words: string
): Promise<__esri.Graphic | null> => {
  if (!square || !what3words) return null

  try {
    const [Graphic] = await loadArcGISJSAPIModules(['esri/Graphic'])

    // Calculate the center of the square for the label placement
    const centerLat = (square.southwest.lat + square.northeast.lat) / 2
    const centerLng = (square.southwest.lng + square.northeast.lng) / 2

    const textSymbol = {
      type: 'text',
      text: '///' + what3words,
      font: { size: 12, weight: 'bold' },
      horizontalAlignment: 'center',
      color: [225, 31, 38, 1],
      haloColor: '#0A3049',
      haloSize: '1px',
      yoffset: 20 // Offset the label slightly above the marker
    }

    return new Graphic({
      geometry: {
        type: 'point',
        latitude: centerLat,
        longitude: centerLng,
        spatialReference: { wkid: 4326 }
      },
      symbol: textSymbol
    })
  } catch (error) {
    console.error('Error creating map label graphic:', error)
    return null
  }
}
