import { loadArcGISJSAPIModules } from 'jimu-arcgis'
let gridLayer: __esri.FeatureLayer | null = null

/**
 * Plots or updates the W3W grid lines on the map dynamically.
 * Ensures a single layer exists at all times and clears features on update.
 */
export async function updateW3WGrid(mapView: __esri.MapView, apiKey: string): Promise<void> {
  const [projection, SpatialReference, Graphic, FeatureLayer] = await loadArcGISJSAPIModules([
    'esri/geometry/projection',
    'esri/geometry/SpatialReference',
    'esri/Graphic',
    'esri/layers/FeatureLayer'
  ])

  const wgs84SR = new SpatialReference({ wkid: 4326 })
  if (!projection.isLoaded()) await projection.load()

  // Step 1: Project map extent to WGS84
  const projectedExtent = projection.project(mapView.extent, wgs84SR) as __esri.Extent
  if (!projectedExtent) {
    console.error('Projection to WGS84 failed.')
    return
  }

  const boundingBox = {
    northeast: { lat: projectedExtent.ymax, lng: projectedExtent.xmax },
    southwest: { lat: projectedExtent.ymin, lng: projectedExtent.xmin }
  }

  // Step 2: Fetch grid data only at valid zoom level
  const zoomLevel = mapView.zoom
  const diagonalDistance = Math.sqrt(
    Math.pow(projectedExtent.xmax - projectedExtent.xmin, 2) +
    Math.pow(projectedExtent.ymax - projectedExtent.ymin, 2)
  )

  if (zoomLevel < 16 || diagonalDistance > 4) {
    console.log('Zoom level or bounding box invalid. Clearing grid.')
    if (gridLayer) gridLayer.source.removeAll()
    return
  }

  try {
    // Step 3: Fetch grid data from W3W API
    const url = `https://api.what3words.com/v3/grid-section?bounding-box=${boundingBox.southwest.lat},${boundingBox.southwest.lng},${boundingBox.northeast.lat},${boundingBox.northeast.lng}&format=geojson&key=${apiKey}`
    const response = await fetch(url)

    if (!response.ok) {
      console.error('Failed to fetch grid data:', response.statusText)
      return
    }

    const data = await response.json()

    const graphics = data.features.map((feature: any, index: number) => {
      return new Graphic({
        attributes: { ObjectID: index },
        geometry: {
          type: 'polyline',
          paths: feature.geometry.coordinates,
          spatialReference: wgs84SR
        },
        symbol: {
          type: 'simple-line',
          color: [255, 0, 0, 0.8],
          width: 1
        }
      })
    })
    // Step 4: Create or update the grid layer
    if (!gridLayer) {
      gridLayer = new FeatureLayer({
        source: graphics,
        title: 'W3W Grid Layer',
        id: 'w3wGridLayer',
        fields: [{ name: 'ObjectID', alias: 'ObjectID', type: 'oid' }],
        geometryType: 'polyline',
        spatialReference: wgs84SR
      })

      mapView.map.add(gridLayer)
      console.log('Grid layer created and added to map.')
    } else {
      gridLayer.source.removeAll() // Clear existing features
      await gridLayer.applyEdits({ addFeatures: graphics })
      console.log('Grid layer updated with new features.')
    }
  } catch (error) {
    console.error('Error fetching or updating grid:', error)
  }
}

/**
 * Clears the W3W grid lines from the map.
 */
export function clearW3WGrid(mapView: __esri.MapView) {
  if (gridLayer) {
    mapView.map.remove(gridLayer)
    gridLayer.destroy()
    gridLayer = null
    console.log('Grid layer cleared.')
  }
}
