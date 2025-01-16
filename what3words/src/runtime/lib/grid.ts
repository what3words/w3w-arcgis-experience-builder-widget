import { loadArcGISJSAPIModules } from 'jimu-arcgis'
import { type GeoJsonGridData } from '../../lib/w3w'

const GRID_LAYER_ID = 'w3wGridLayer'
const getW3wGridLineGraphics = async (
  w3wGrid: GeoJsonGridData
) => {
  if (!w3wGrid?.features?.length) {
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
    return feature.geometry.coordinates.map((coordinate: any, index: number) => {
      return new Graphic({
        attributes: {
          id: index
        },
        geometry: {
          type: 'polyline',
          spatialReference: {
            wkid: 4326
          },
          paths: coordinate
        } as __esri.Polyline
      })
    })
  })
}

export const fillW3wGridLayer = async (mapView: __esri.MapView | __esri.SceneView, gridData: GeoJsonGridData) => {
  const [FeatureLayer, Renderer] = await loadArcGISJSAPIModules([
    'esri/layers/FeatureLayer',
    'esri/renderers/SimpleRenderer'
  ])

  let gridLayer = mapView.map?.findLayerById(GRID_LAYER_ID)
  if (gridLayer) {
    gridLayer.destroy()
    mapView.map?.remove(gridLayer)
  }

  const w3wGridLines = await getW3wGridLineGraphics(gridData)
  if (!w3wGridLines.length) {
    return
  }

  const renderer = new Renderer({
    symbol: {
      type: 'simple-line',
      color: [194, 194, 194, 0.5],
      width: 0.5
    }
  })

  gridLayer = new FeatureLayer({
    visible: true,
    objectIdField: 'id',
    fields: [
      {
        name: 'id',
        type: 'integer'
      },
      {
        name: 'value',
        type: 'double'
      },
      {
        name: 'norm',
        type: 'double'
      }
    ],
    id: GRID_LAYER_ID,
    source: w3wGridLines,
    renderer,
    popupEnabled: false
  })
  mapView.map.add(gridLayer)
}

export const clearGridLayer = (mapView: __esri.MapView | __esri.SceneView) => {
  const gridLayer = mapView.map?.findLayerById(GRID_LAYER_ID)
  if (gridLayer) {
    gridLayer.destroy()
    mapView.map?.remove(gridLayer)
  }
}
