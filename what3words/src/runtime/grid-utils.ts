import { loadArcGISJSAPIModules } from 'jimu-arcgis'
import { saveAs } from 'file-saver' // Ensure file-saver is installed
import what3words, { axiosTransport } from '@what3words/api'
import type { What3wordsService, GridSectionGeoJsonResponse, FeatureCollectionResponse } from '@what3words/api'

let _gridLayer: __esri.FeatureLayer | null = null
let _drawnBoundingBoxes: __esri.Extent[] = []
let w3wService: What3wordsService

/**
 * Initialize the W3W Service and Grid Layer.
 * @param mapView - The MapView instance.
 * @param apiKey - The What3Words API Key.
 */
export async function initializeGridLayer (mapView: __esri.MapView, apiKey: string): Promise<__esri.FeatureLayer> {
  const [FeatureLayer, Field, Renderer] = await loadArcGISJSAPIModules([
    'esri/layers/FeatureLayer',
    'esri/layers/support/Field',
    'esri/renderers/SimpleRenderer'
  ])

  const w3wGridLines = await getW3wGridLineGraphics({ features: [], type: 'FeatureCollection' })

  w3wService = what3words(apiKey, { host: 'https://api.what3words.com' }, { transport: axiosTransport() })
  if (_gridLayer && _gridLayer.destroyed) {
    console.warn('FeatureLayer was destroyed. Recreating...')
    _gridLayer = null // Reset the layer to force re-creation
  }
  mapView.map.remove(_gridLayer)
  _gridLayer?.destroy()

  if (!_gridLayer) {
    const renderer = new Renderer({
      symbol: {
        type: 'simple-line',
        color: [255, 31, 38, 0.5], // Red with 60% opacity
        width: 0.5
      }
    })

    _gridLayer = new FeatureLayer({
      id: 'w3wFeatureLayer',
      title: 'What3Words Grid',
      source: w3wGridLines,
      fields: [
        new Field({ name: 'ObjectID', alias: 'ObjectID', type: 'oid' })
      ],
      geometryType: 'polyline',
      renderer
    })

    mapView.map.add(_gridLayer)
    console.log('W3W Feature Layer initialized and added to the map.')
  } else {
    _gridLayer?.destroy()
  }

  return _gridLayer
}

/**
 * Clear the W3W Grid Layer without destroying it.
 * Resets the drawn bounding boxes and removes all features from the layer.
 */
export function clearGridLayer () {
  if (_gridLayer) {
    if (_gridLayer.source) {
      _gridLayer.source.removeAll() // Clear features from the FeatureLayer
      console.log('Cleared all features from the W3W Grid Layer.')
    } else {
      console.warn('Grid layer has no source to clear.')
    }
  }
  _drawnBoundingBoxes = [] // Reset the cache of drawn bounding boxes
}

/**
 * Check if a bounding box is already drawn or overlaps existing boxes.
 */
function getUndrawnBoundingBox (extent: __esri.Extent): __esri.Extent | null {
  for (const drawn of _drawnBoundingBoxes) {
    if (
      extent.xmin >= drawn.xmin &&
      extent.xmax <= drawn.xmax &&
      extent.ymin >= drawn.ymin &&
      extent.ymax <= drawn.ymax
    ) {
      return null // Fully covered
    }
  }
  return extent // Return the undrawn part
}

export async function getW3wGridLineGraphics (
  w3wGrid: FeatureCollectionResponse<GridSectionGeoJsonResponse>
): Promise<__esri.Graphic[]> {
  if (!w3wGrid || !w3wGrid.features || w3wGrid.features.length === 0) {
    console.warn('No grid data provided.')
    return []
  }

  const [Graphic] = await loadArcGISJSAPIModules(['esri/Graphic'])

  // Iterate over the grid features and map them to Graphics
  return w3wGrid.features.flatMap((feature, index) => {
    if (feature.geometry.type !== 'MultiLineString') {
      console.warn('Unsupported geometry type in grid feature:', feature.geometry.type)
      return []
    }

    // Process each line segment in the MultiLineString
    return feature.geometry.coordinates.map((coordinate: any) => {
      return new Graphic({
        attributes: {
          ObjectID: index
        },
        geometry: {
          type: 'polyline',
          spatialReference: { wkid: 4326 },
          paths: coordinate
        } as __esri.Polyline,
        symbol: {
          type: 'simple-line',
          color: [255, 0, 0, 0.5], // Red line with transparency
          width: 0.5
        }
      })
    })
  })
}

/**
 * Fetch and draw the W3W Grid on the map using the @what3words/api client.
 * Avoids redrawing areas that have already been drawn.
 * @param mapView - The MapView instance.
 */

export async function drawW3WGrid (mapView: __esri.MapView): Promise<void> {
  if (!_gridLayer || !w3wService) {
    console.error('Feature layer or What3Words service is not initialized.')
    return
  }

  const [projection, SpatialReference] = await loadArcGISJSAPIModules([
    'esri/geometry/projection',
    'esri/geometry/SpatialReference'
  ])

  if (!projection.isLoaded()) {
    await projection.load()
  }

  const extent = mapView.extent
  const wgs84SpatialReference = new SpatialReference({ wkid: 4326 })
  const projectedExtent = projection.project(extent, wgs84SpatialReference) as __esri.Extent

  if (!projectedExtent) {
    console.error('Failed to project extent to WGS84.')
    return
  }

  const undrawnExtent = getUndrawnBoundingBox(projectedExtent)
  if (!undrawnExtent) {
    console.log('No new areas to draw.')
    return
  }

  const boundingBox = {
    northeast: { lat: undrawnExtent.ymax, lng: undrawnExtent.xmax },
    southwest: { lat: undrawnExtent.ymin, lng: undrawnExtent.xmin }
  }

  try {
    const gridData = await w3wService.gridSection({ boundingBox, format: 'geojson' }) as unknown as FeatureCollectionResponse<GridSectionGeoJsonResponse>

    if (!gridData.features || !Array.isArray(gridData.features)) {
      console.error('Invalid grid data received:', gridData)
      return
    }

    const graphics = await getW3wGridLineGraphics(gridData)

    if (graphics.length > 0) {
      await _gridLayer.applyEdits({ addFeatures: graphics })
      console.log(`Added ${graphics.length} grid lines.`)
    } else {
      console.log('No new grid lines to add.')
    }
    // Cache the drawn bounding box
    _drawnBoundingBoxes.push(undrawnExtent)
  } catch (error) {
    console.error('Error fetching W3W Grid:', error)
  }
}

/**
 * Exports the W3W grid layer as a GeoJSON file with the correct FeatureCollection format.
 * @param layer - The GraphicsLayer containing the grid lines.
 */
export async function exportGeoJSON (layer: __esri.FeatureLayer): Promise<void> {
  if (!layer) {
    console.error('Feature layer is not initialized.')
    return
  }

  try {
    // Query all features from the layer
    const query = layer.createQuery()
    query.where = '1=1' // Query all features
    query.outFields = ['*'] // Include all attributes
    query.returnGeometry = true // Ensure geometry is included

    const featureSet = await layer.queryFeatures(query)

    if (!featureSet || !featureSet.features || featureSet.features.length === 0) {
      console.error('No features found in the grid layer.')
      return
    }

    // Convert features to GeoJSON
    const geoJSONFeatures = featureSet.features.map((feature) => {
      const geometry = feature.geometry

      if (geometry.type === 'polyline') {
        return {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: (geometry as __esri.Polyline).paths[0]
          },
          properties: feature.attributes || {}
        }
      }

      console.warn('Unsupported geometry type:', geometry.type)
      return null
    }).filter(Boolean)

    if (geoJSONFeatures.length === 0) {
      console.error('No valid features found in the grid layer.')
      return
    }

    const geoJSON = {
      type: 'FeatureCollection',
      features: geoJSONFeatures
    }

    // Convert GeoJSON to a file and trigger download
    const geoJSONString = JSON.stringify(geoJSON, null, 2)
    const blob = new Blob([geoJSONString], { type: 'application/geo+json' })
    saveAs(blob, 'w3w-grid.geojson')

    console.log('GeoJSON exported successfully.')
  } catch (error) {
    console.error('Error exporting GeoJSON:', error)
  }
}
