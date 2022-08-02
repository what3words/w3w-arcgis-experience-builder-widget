import Point from 'esri/geometry/Point'
import { loadArcGISJSAPIModules } from 'jimu-arcgis'

export const getCurrentAddress = (geocodeURL: string, position: Point) => {
  // const position = getCurrentLocation()
  if (!position) return Promise.resolve(null)
  return loadArcGISJSAPIModules(['esri/rest/locator']).then(modules => {
    const [locator] = modules
    return locator.locationToAddress(geocodeURL, {
      location: position
    }, {
      query: {}
    }).then(response => {
      return Promise.resolve(response.address)
    }, err => {
      console.error(err.message)
      return []
    })
  })
}

/**
 * Get current location
*/
export const getCurrentLocation = (onSeccess: (position) => void, onError) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSeccess, onError)
  } else {
    onError && onError()
  }
}

/**
 * Create point by position
*/
export const createPoint = (position: GeolocationPosition): Promise<__esri.Point> => {
  const coords = position && position.coords
  if (!coords) {
    return Promise.resolve(null)
  }
  return loadArcGISJSAPIModules(['esri/geometry/Point']).then(modules => {
    const [Point] = modules
    return new Point({
      longitude: coords.longitude,
      latitude: coords.latitude,
      z: coords.altitude || null,
      spatialReference: {
        wkid: 4326
      }
    })
  })
}
