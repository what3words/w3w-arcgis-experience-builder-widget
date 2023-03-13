import Point from 'esri/geometry/Point'
import { loadArcGISJSAPIModules } from 'jimu-arcgis'
const w3wIcon = require('../assets/w3wMarker.png')

export const getCurrentAddress = (geocodeURL: string, mapClick: Point) => {
  if (!mapClick) return Promise.resolve(null)
  return loadArcGISJSAPIModules(['esri/rest/locator']).then(modules => {
    const [locator] = modules
    return createPoint(mapClick).then(point => {
      return locator.locationToAddress(geocodeURL, {
        location: point
      }, {
        query: {}
      }).then(response => {
        return Promise.resolve(response.address)
      }, err => {
        console.error(err.message)
        return err.message + ' - Check your Locator URL'
      })
    })
  })
}

export const createPoint = (mapClick: any): Promise<Point> => {
  if (!mapClick) {
    return Promise.resolve(null)
  }
  return loadArcGISJSAPIModules(['esri/geometry/Point']).then(modules => {
    const [Point] = modules
    return new Point({
      longitude: mapClick.longitude,
      latitude: mapClick.latitude,
      spatialReference: {
        wkid: 4326
      }
    })
  })
}

export const getMarkerGraphic = (point: Point) => {
  if (!point) return Promise.resolve(null)
  return loadArcGISJSAPIModules(['esri/Graphic', 'esri/symbols/PictureMarkerSymbol']).then(modules => {
    let Graphic: __esri.GraphicConstructor = null
    let PictureMarkerSymbol: typeof __esri.PictureMarkerSymbol
    [Graphic, PictureMarkerSymbol] = modules
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

export const getMapLabelGraphic = (point: Point, what3words: string) => {
  if (!point) return Promise.resolve(null)
  return loadArcGISJSAPIModules(['esri/Graphic']).then(modules => {
    let Graphic: __esri.GraphicConstructor = null;
    [Graphic] = modules
    const textSym = {
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
      symbol: textSym
    })
  })
}
