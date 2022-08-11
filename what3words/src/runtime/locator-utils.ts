import Point from 'esri/geometry/Point'
import { loadArcGISJSAPIModules } from 'jimu-arcgis'
const w3wIcon = require('../assets/w3wMarker.png')

export const getCurrentAddress = (geocodeURL: string, position: Point) => {
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
      return err.message + ' - Check your Locator URL'
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
      width: 25,
      height: 25,
      url: w3wIcon
    })
    return new Graphic({
      geometry: position,
      symbol: symbol
    })
  })
}

export const getMapLabelGraphic = (position: Point, what3words: string) => {
  if (!position) return Promise.resolve(null)
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
      yoffset: -5
    }
    return new Graphic({
      geometry: position,
      symbol: textSym
    })
  })
}
