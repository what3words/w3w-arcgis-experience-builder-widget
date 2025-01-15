import { loadArcGISJSAPIModules } from 'jimu-arcgis'

const GRID_LAYER_ID = 'w3wGridLayer'

const getW3wGridLineGraphics = async (
  w3wGrid: any
) => {
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

export const getGridData = async (extent: __esri.Extent, apiKey: string) => {
  if (!apiKey) {
    return
  }
  const boundingBox = `${extent.ymin},${extent.xmin},${extent.ymax},${extent.xmax}`
  return await fetch(
    'https://api.what3words.com/v3/grid-section?' +
    new URLSearchParams({
      key: apiKey,
      'bounding-box': boundingBox,
      format: 'geojson'
    }).toString(),
    {
      headers: {
        'X-W3W-Wrapper': `ArcGIS Experience App ${0.1}` // (v${this.exbVersion})`
      }
    })
    .then(res => res.json())
    .catch(error => {
      return {
        features: [
          {
            geometry: {
              coordinates: [],
              type: 'MultiLineString'
            },
            type: 'Feature',
            properties: {}
          }
        ],
        type: 'FeatureCollection'
      }
    })
}

export const fillW3wGridLayer = async (mapView: __esri.MapView | __esri.SceneView, gridData: any) => {
  const [FeatureLayer, Renderer] = await loadArcGISJSAPIModules([
    'esri/layers/FeatureLayer',
    'esri/renderers/SimpleRenderer'
  ])

  console.log('Map view extent: ', mapView.extent.spatialReference.wkid)

  let gridLayer = mapView.map.findLayerById(GRID_LAYER_ID)
  const w3wGridLines = await getW3wGridLineGraphics(gridData)

  const renderer = new Renderer({
    symbol: {
      type: 'simple-line',
      color: [255, 31, 38, 0.5],
      width: 0.5
    }
  })

  if (gridLayer) {
    gridLayer.destroy()
    mapView.map.remove(gridLayer)
  }
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
  const gridLayer = mapView.map.findLayerById(GRID_LAYER_ID)
  if (gridLayer) {
    gridLayer.destroy()
    mapView.map.remove(gridLayer)
  }
}
