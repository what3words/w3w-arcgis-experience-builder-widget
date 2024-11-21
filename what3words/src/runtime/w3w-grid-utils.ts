import { loadArcGISJSAPIModules } from 'jimu-arcgis'

let _gridLayer: __esri.GraphicsLayer
let _drawnBoundingBoxes: __esri.Extent[] = []

/**
 * Initialize the W3W Grid Layer.
 * @param mapView - The MapView instance.
 */
export async function initializeGridLayer (mapView: __esri.MapView) {
  const [GraphicsLayer] = await loadArcGISJSAPIModules(['esri/layers/GraphicsLayer'])

  if (!_gridLayer) {
    _gridLayer = new GraphicsLayer({ id: 'w3wGridLayer' })
    mapView.map.add(_gridLayer)
  }
}

/**
 * Clear the W3W Grid Layer and reset the cache.
 */
export function clearGridLayer () {
  if (_gridLayer) {
    _gridLayer.removeAll()
  }
  _drawnBoundingBoxes = []
}

/**
 * Check if a bounding box has already been drawn.
 * @param bbox - The bounding box to check.
 * @returns {boolean} - True if already drawn, otherwise false.
 */
function isBoundingBoxDrawn (bbox: __esri.Extent): boolean {
  return _drawnBoundingBoxes.some(
    (existingBbox) =>
      bbox.xmin >= existingBbox.xmin &&
      bbox.xmax <= existingBbox.xmax &&
      bbox.ymin >= existingBbox.ymin &&
      bbox.ymax <= existingBbox.ymax
  )
}

/**
 * Fetch and draw the W3W Grid on the map using the What3Words public API.
 * Avoids redrawing areas that have already been drawn.
 * @param mapView - The MapView instance.
 * @param apiKey - The What3Words API Key.
 */
export async function drawW3WGrid (mapView: __esri.MapView, apiKey: string) {
  if (!_gridLayer) {
    await initializeGridLayer(mapView)
  }

  const [projection, SpatialReference, Extent] = await loadArcGISJSAPIModules([
    'esri/geometry/projection',
    'esri/geometry/SpatialReference',
    'esri/geometry/Extent'
  ])

  // Ensure the projection module is loaded
  if (!projection.isLoaded()) {
    await projection.load()
  }

  const extent = mapView.extent

  // Project the extent to WGS84
  const wgs84SpatialReference = new SpatialReference({ wkid: 4326 })
  const projectedExtent = projection.project(
    new Extent({
      xmin: extent.xmin,
      ymin: extent.ymin,
      xmax: extent.xmax,
      ymax: extent.ymax,
      spatialReference: extent.spatialReference
    }),
    wgs84SpatialReference
  ) as unknown as __esri.Extent

  if (!projectedExtent) {
    console.error('Failed to project extent to WGS84.')
    return
  }

  if (isBoundingBoxDrawn(projectedExtent)) {
    console.log('Bounding box already drawn. Skipping API call.')
    return
  }

  const boundingBox = {
    northeast: {
      lat: projectedExtent.ymax,
      lng: projectedExtent.xmax
    },
    southwest: {
      lat: projectedExtent.ymin,
      lng: projectedExtent.xmin
    }
  }

  try {
    const response = await fetch(
      `https://api.what3words.com/v3/grid-section?key=${apiKey}&bounding-box=${boundingBox.southwest.lat},${boundingBox.southwest.lng},${boundingBox.northeast.lat},${boundingBox.northeast.lng}`
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch W3W grid: ${response.statusText}`)
    }

    const gridData = await response.json()
    const [Graphic] = await loadArcGISJSAPIModules(['esri/Graphic'])

    const graphics = gridData.lines.map((line) => {
      const { start, end } = line

      return new Graphic({
        geometry: {
          type: 'polyline',
          paths: [
            [start.lng, start.lat],
            [end.lng, end.lat]
          ],
          spatialReference: wgs84SpatialReference
        },
        symbol: {
          type: 'simple-line',
          color: [255, 0, 0, 0.6],
          width: 1
        }
      })
    })

    _gridLayer.addMany(graphics)

    // Cache the drawn bounding box
    _drawnBoundingBoxes.push(projectedExtent)
  } catch (error) {
    console.error('Error fetching W3W Grid:', error)
  }
}
