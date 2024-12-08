import { loadArcGISJSAPIModules } from 'jimu-arcgis'
import { saveAs } from 'file-saver' // Ensure file-saver is installed
import what3words, { axiosTransport } from '@what3words/api'
import type { What3wordsService, GridSectionGeoJsonResponse, FeatureCollectionResponse } from '@what3words/api'

let _gridLayer: __esri.GraphicsLayer | null = null
let _drawnBoundingBoxes: __esri.Extent[] = []
let w3wService: What3wordsService

/**
 * Initialize the W3W Service and Grid Layer.
 * @param mapView - The MapView instance.
 * @param apiKey - The What3Words API Key.
 */
export async function initializeGridLayer (mapView: __esri.MapView, apiKey: string): Promise<__esri.GraphicsLayer> {
  const [GraphicsLayer] = await loadArcGISJSAPIModules(['esri/layers/GraphicsLayer'])

  w3wService = what3words(apiKey, { host: 'https://api.what3words.com' }, { transport: axiosTransport() })
  if (!w3wService) {
    console.error('Failed to initialize What3Words Service with API Key:', apiKey)
  }

  if (!_gridLayer) {
    _gridLayer = new GraphicsLayer({
      id: 'w3wGridLayer',
      title: 'what3words Grid Layer',
      visible: true
    })
    mapView.map.add(_gridLayer)
    console.log('W3W Grid Layer initialized and added to the map.')
  } else if (!mapView.map.findLayerById('w3wGridLayer')) {
    mapView.map.add(_gridLayer) // Add only if it's not already part of the map
  }
  // Store the API key with the layer to avoid redundant initialization
  (_gridLayer as any).apiKey = apiKey

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
 * Fetch and draw the W3W Grid on the map using the @what3words/api client.
 * Avoids redrawing areas that have already been drawn.
 * @param mapView - The MapView instance.
 */

export async function drawW3WGrid (mapView: __esri.MapView): Promise<void> {
  if (!_gridLayer || !w3wService) {
    console.error('Grid layer or What3Words service is not initialized.')
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

  const wgs84SpatialReference = new SpatialReference({ wkid: 4326 })
  let projectedExtent: __esri.Extent

  try {
    // Project the extent to WGS84
    projectedExtent = projection.project(
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
      throw new Error('Projection failed: projected extent is null or undefined.')
    }
  } catch (error) {
    console.error('Failed to project extent to WGS84:', error)
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
    console.log('Requesting What3Words Grid Section with bounding box:', boundingBox)
    const gridData = await w3wService.gridSection({
      boundingBox,
      format: 'geojson'
    }) as unknown as FeatureCollectionResponse<GridSectionGeoJsonResponse>

    if (!gridData.features || !Array.isArray(gridData.features)) {
      console.error('Invalid grid data received:', gridData)
      return
    }

    console.log('Fetched W3W Grid Data:', gridData)

    // Process the grid data and create graphics
    const graphics = gridData.features.flatMap((feature) => {
      if (
        feature.geometry.type === 'MultiLineString' &&
        Array.isArray(feature.geometry.coordinates)
      ) {
        return feature.geometry.coordinates.map((line) => {
          return new Graphic({
            geometry: {
              type: 'polyline',
              paths: line,
              spatialReference: wgs84SpatialReference
            },
            symbol: {
              type: 'simple-line',
              color: [255, 31, 38, 0.5], // Red with 60% opacity
              width: 0.5
            }
          })
        })
      } else {
        console.warn('Unsupported feature geometry:', feature.geometry)
        return []
      }
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
