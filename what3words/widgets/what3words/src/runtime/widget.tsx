import Point from 'esri/geometry/Point'
import { loadArcGISJSAPIModules } from 'jimu-arcgis'
const w3wIcon = require('../assets/w3wMarker.png')

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

export const getMarkerGraphic = (position: Point) => {
  if (!position) return Promise.resolve(null)
  return loadArcGISJSAPIModules(['esri/Graphic', 'esri/symbols/PictureMarkerSymbol']).then(modules => {
    let Graphic: __esri.GraphicConstructor = null
    let PictureMarkerSymbol: typeof __esri.PictureMarkerSymbol
    [Graphic, PictureMarkerSymbol] = modules
    const symbol = new PictureMarkerSymbol({
      width: 15,
      height: 15,
      url: w3wIcon
    })
    return new Graphic({
      geometry: position,
      symbol: symbol
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
