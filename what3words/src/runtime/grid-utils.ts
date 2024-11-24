import { loadArcGISJSAPIModules } from 'jimu-arcgis'
import { saveAs } from 'file-saver' // Ensure file-saver is installed

let _gridLayer: __esri.GraphicsLayer | null = null
let _drawnBoundingBoxes: __esri.Extent[] = []

/**
 * Initialize the W3W Grid Layer.
 * @param mapView - The MapView instance.
 */
export async function initializeGridLayer(mapView: __esri.MapView): Promise<__esri.GraphicsLayer> {
  const [GraphicsLayer] = await loadArcGISJSAPIModules(['esri/layers/GraphicsLayer'])

  if (!_gridLayer) {
    _gridLayer = new GraphicsLayer({
      id: 'w3wGridLayer',
      title: 'what3words Grid Layer',
      visible: true
    })
    mapView.map.add(_gridLayer)
    console.log('W3W Grid Layer initialized and added to the map.')
  } else {
    console.log('W3W Grid Layer already initialized.')
  }

  return _gridLayer
}

/**
 * Clear the W3W Grid Layer and reset the cache.
 * Does not remove the layer but clears its graphics.
 */
export function clearGridLayer () {
  if (_gridLayer) {
    _gridLayer.removeAll()
    console.log('Cleared W3W Grid Layer.')
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
  if (!apiKey) {
    console.error('API Key is missing. Cannot draw What3Words grid.')
    return
  }

  if (!_gridLayer) {
    console.error('Grid layer is not initialized.')
    return
  }

  const [projection, SpatialReference, Extent, Graphic] = await loadArcGISJSAPIModules([
    'esri/geometry/projection',
    'esri/geometry/SpatialReference',
    'esri/geometry/Extent',
    'esri/Graphic'
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

    const graphics = gridData.lines.map((line: any) => {
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
          color: [255, 0, 0, 0.6], // Red with 60% opacity
          width: 1
        }
      })
    })

    _gridLayer.addMany(graphics)
    console.log(`Added ${graphics.length} grid lines to the layer.`)

    // Cache the drawn bounding box
    _drawnBoundingBoxes.push(projectedExtent)
  } catch (error) {
    console.error('Error fetching W3W Grid:', error)
  }
}

/**
 * Exports the W3W grid layer as a GeoJSON file with the correct FeatureCollection format.
 * @param layer - The GraphicsLayer containing the grid lines.
 */
export async function exportGeoJSON (layer: __esri.GraphicsLayer): Promise<void> {
  if (!layer || !layer.graphics || layer.graphics.length === 0) {
    console.error('Grid layer is not initialized or empty. Cannot export GeoJSON.')
    return
  }

  try {
    const features = layer.graphics.map((graphic) => {
      const geometry = graphic.geometry

      if (geometry.type === 'polyline') {
        return {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: (geometry as __esri.Polyline).paths[0]
          },
          properties: graphic.attributes || {}
        }
      }

      console.warn('Unsupported geometry type:', geometry.type)
      return null
    }).filter(Boolean)

    if (features.length === 0) {
      console.error('No valid features found in the grid layer.')
      return
    }

    const geoJSON = {
      type: 'FeatureCollection',
      features
    }

    const geoJSONString = JSON.stringify(geoJSON, null, 2)
    const blob = new Blob([geoJSONString], { type: 'application/geo+json' })
    saveAs(blob, 'w3w-grid.geojson')
    console.log('GeoJSON exported successfully.')
  } catch (error) {
    console.error('Error exporting GeoJSON:', error)
  }
}
