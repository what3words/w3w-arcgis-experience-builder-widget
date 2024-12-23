import type Point from 'esri/geometry/Point'
import { loadArcGISJSAPIModules } from 'jimu-arcgis'
import axios from 'axios'
// const w3wIcon = require('../assets/w3w_dark.svg')

let w3wApiKey: string

/**
 * Initializes the What3Words service with the provided API key.
 * @param apiKey - The W3W API Key.
 */
export async function initializeW3wService (apiKey: string): Promise<void> {
  if (!apiKey) {
    console.error('W3W API Key is required to initialize the service.')
    return
  }

  w3wApiKey = apiKey
  console.log('What3Words service initialized.')
}

/**
 * Fetches an address from a geocode service.
 * @param geocodeURL - URL of the geocode service.
 * @param mapClick - The clicked point on the map.
 * @returns A promise resolving to the retrieved address or an error message.
 */
export const getCurrentAddress = async (geocodeURL: string, mapClick: Point): Promise<string | null> => {
  if (!mapClick) {
    console.error('Invalid map click location.')
    return null
  }

  try {
    const [locator] = await loadArcGISJSAPIModules(['esri/rest/locator'])
    const point = await createPoint(mapClick)

    const response = await locator.locationToAddress(
      geocodeURL,
      { location: point },
      { query: {} }
    )

    if (response?.address) {
      return response.address
    }

    // Handle unexpected structure or missing address
    console.error('Unexpected response structure:', response)
    throw new Error('Address not found in response.')
  } catch (err) {
    // Handle cases with detailed error information
    if (err.details && err.details.messages) {
      let errorMessage = err.details.messages[0] || 'Unknown error occurred.'

      if (errorMessage.includes("Error from W3W service: error code=PaymentRequired")) {
        errorMessage = "Quota exceeded or API plan does not have access to this feature. Please change your plan at https://accounts.what3words.com/select-plan, or contact support@what3words.com"
      }
      return `Error fetching address: ${errorMessage}`
    }
    // Fallback to a generic error message
    const errorMessage = err.message || 'Unknown error occurred.'
    return `Error fetching address: ${errorMessage}`
  }
}

/**
 * Fetches the W3W address and square using the initialized W3W service.
 * @param latitude - Latitude of the location.
 * @param longitude - Longitude of the location.
 * @returns A promise resolving to the W3W address and square.
 */
export async function getCurrentAddressFromW3wService (
  latitude: number,
  longitude: number,
  language: string
): Promise<{ words: string, square: { southwest: { lat: number, lng: number }, northeast: { lat: number, lng: number } }, nearestPlace: string } | null> {
  if (!w3wApiKey) {
    console.error('W3W service is not initialized. Please call initializeW3wService first.')
    return null
  }

  try {
    const response = await axios.get('https://api.what3words.com/v3/convert-to-3wa', {
      params: {
        coordinates: `${latitude},${longitude}`,
        key: w3wApiKey,
        language
      }
    })

    if (!response.data.words || !response.data.square) {
      console.error('Invalid response from W3W API:', response.data)
      return null
    }

    return {
      words: response.data.words,
      square: response.data.square,
      nearestPlace: response.data.nearestPlace || 'No nearby place available'
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
export const getSquareMarkerGraphic = async (
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
export const getSquareMapLabelGraphic = async (
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
      haloColor: '#ffffff',
      haloSize: '.7px',
      yoffset: 25 // Offset the label slightly above the marker
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

/**
 * Creates a marker graphic for a given point.
 * @param point - The point where the marker should be displayed.
 * @param mapView - The MapView instance.
 * @returns A promise resolving to a Graphic.
 */

export const getMarkerGraphic = async (
  point: Point,
  mapView: __esri.MapView
): Promise<__esri.Graphic | null> => {
  if (!point) return null;

  try {
    const [Graphic, PictureMarkerSymbol] = await loadArcGISJSAPIModules([
      'esri/Graphic',
      'esri/symbols/PictureMarkerSymbol',
    ]);

    const iconUrl = getMarkerIcon(mapView)

    const symbol = new PictureMarkerSymbol({
      url: iconUrl,
      width: 25,
      height: 25,
      xoffset: 0,
      yoffset: 11
    });

    return new Graphic({
      geometry: point,
      symbol,
    });
  } catch (error) {
    console.error('Error creating locator marker graphic:', error);
    return null;
  }
};

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
      haloColor: '#ffffff',
      haloSize: '.7px',
      xoffset: 12,
      yoffset: 5
    }

    return new Graphic({
      geometry: point,
      symbol: textSymbol
    })
  })
}

/**
 * Determines the appropriate marker icon based on the current map theme.
 * @param mapView - The MapView instance to determine the theme.
 * @returns The URL of the appropriate marker icon.
 */
export const getMarkerIcon = (mapView: __esri.MapView): string => {
  // List of dark mode basemaps
  const darkBasemaps = [
    'Dark Gray Canvas',
    'Dark Gray Canvas Vector',
    'Imagery (Dark)',
    'Modern Antique',
    'Midnight Basemap',
    'Human Geography Dark Map',
    'Oceans (Dark)',
    'Streets (Night)',
    'Esri Dark Gray (Canvas)',
    'Enhanced Contrast Dark Map',
    'Navigation (Dark)',
    'Navigation (Dark - Places)',
    'Nova Map',
    'GB Dark Grey',
    'Firefly Imagery Hybrid',
    'Imagery Hybrid',
    'Imagery'
  ];

  // Get the current basemap title
  const currentBasemapTitle = mapView.map.basemap?.title || '';

  // Check if the current basemap is a dark mode basemap
  const isDarkMode = darkBasemaps.some((title) => currentBasemapTitle.includes(title));

  // Return the appropriate icon
  return isDarkMode
    ? require('../assets/w3w_white.svg') // Marker for dark mode
    : require('../assets/w3w_dark.svg'); // Marker for light mode
};