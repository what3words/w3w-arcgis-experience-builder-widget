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

export const getMarkerGraphic = (position: Point) => {
  if (!position) return Promise.resolve(null)
  return loadArcGISJSAPIModules(['esri/Graphic', 'esri/symbols/PictureMarkerSymbol']).then(modules => {
    let Graphic: __esri.GraphicConstructor = null
    let PictureMarkerSymbol: typeof __esri.PictureMarkerSymbol
    [Graphic, PictureMarkerSymbol] = modules
    const symbol = new PictureMarkerSymbol({
      width: 14,
      height: 26.6,
      xoffset: 0,
      yoffset: 12.6,
      url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAjCAYAAAB2KjFhAAACtUlEQVRIS+2WS0wTURSG/zvT0kpfkGJ4pGCViA1Em9CtCQVx5QIWhiVRo8GdSNypqHElkcgOlzVh5ap1X6nEiAkQXzGBxkSKtZC0jdTSB7SdMXdwRjudB+w5q5t7T775z3/OzR0CWbT4x90Glh0CMEx43g1C3FIKz6/zhKwDCJYrldBWZIaupSDiqsE/3mBjmGeMyXLF7GiBubEVhmN2sIY6KblS3kO58BvFX5soZrbA7eYCWY67vR2Z2aZJAoyqMTLMvLXN47a1eeRiUSrmUSrmhHSGNYA11oGtMyO3FcVOYnW9xHH9VKUAcw1MfHSc9HktzvYaEN34B6suymSxCwozsQ+ReHi6n7gG7/iNZvv88W6/Ikgdtl+Y2d6I5NfXqJQK/cQ1MPHQ1uZ5oFSeSFdWtn9Ky93b/olsYvURhUWcXef7TPamGmWXfM3oPeVAi8OIeDKLpWgSrxY3qvIY1gjCl5GOvn2jCLOaWUyN9sDX6aj5wNJaErdm3yNbKAlnurCp0W709ThVPQy+i+H+ixV92OlWC+bGe1VB4sHlx2GsxTPayqhPkyNdurB7gRWEFmPasBsXT+D6YIcu7MnLz5gLf9OG0e7Njp3ThV2bXsBSNKUNo518ftML6p1aUK+oZwfqJgVRIAXLg47E1acLgvkHgtGk1kYTJkfOCEMrxnI0hbuBZSTSeWlPd87kaprqeWwkUopVHxqmdTePYMqTdeRZ9d1svzARtLnODlmbO1XvoqpnhMBkaUAhHUM2/iVE6ONrZZjIoZ+6v6BiZhOZ7yufdjjOL7ybesAaZQog+qpX/R6oKayCqYCoKAmmpVCCaYBqYGpAAbabF8z+3yPxh0XsXJUycVPuYWm3IIyAFkhRmRowl/4hdU2uSFOZHFjv7PDm0xtC+9VAmspkwOAOxw1rgWj+H4uVH6hj08HSAAAAAElFTkSuQmCC'
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
