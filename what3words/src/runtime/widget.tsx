/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {
  React,
  type AllWidgetProps,
  jsx,
  getAppStore,
  UtilityManager,
  BaseWidget
} from 'jimu-core'
import {
  JimuMapViewComponent,
  loadArcGISJSAPIModules,
  type JimuMapView
} from 'jimu-arcgis'

import {
  getAddressFromGeocodeService,
  getMarkerGraphic,
  getMapLabelGraphic,
  getSquareMapLabelGraphic,
  getSquareMarkerGraphic
} from './locator-utils'
import { type IMConfig } from '../config'
import { getW3WStyle } from './lib/style'
import defaultMessages from './translations/default'
import { Button, Label, Checkbox } from 'jimu-ui'
import { CopyButton } from 'jimu-ui/basic/copy-button'
import { ShareArrowCurveOutlined } from 'jimu-icons/outlined/editor/share-arrow-curve'
import { debounce } from 'lodash'
import * as webMercatorUtils from 'esri/geometry/support/webMercatorUtils'
import * as geometryEngine from 'esri/geometry/geometryEngine'
import * as geodesicUtils from 'esri/geometry/support/geodesicUtils'
import Point from '@arcgis/core/geometry/Point'

interface State {
  w3wLocator: string
  jimuMapView: JimuMapView | null
  latitude: string
  longitude: string
  what3words: string | null
  isCopyMessageOpen: boolean
  currentZoomLevel: number
  isZoomInRange: boolean
  nearestPlace: string | null
  extent: __esri.Extent
  currentAddress: Address
  currentMapPoint: __esri.Point
  center: __esri.Point
  showGrid: boolean
}

interface Address {
  words: string
  square: {
    northeast: { lat: number, lng: number }
    southwest: { lat: number, lng: number }
  }
  nearestPlace: string
}

export default class Widget extends BaseWidget<
AllWidgetProps<IMConfig>,
State
> {
  private mapView: __esri.MapView | __esri.SceneView
  private gridLayer: __esri.FeatureLayer | null = null
  private _isMounted: boolean // unused???
  private readonly isRTL: boolean
  private _clickHandle: __esri.Handle
  private _zoomHandle: __esri.WatchHandle
  private readonly _extentHandle: __esri.WatchHandle
  private _stationaryHandle: __esri.WatchHandle
  private _centerHandle: __esri.WatchHandle
  private _basemapHandle: __esri.WatchHandle
  private readonly exbVersion: string

  constructor (props: AllWidgetProps<IMConfig>) {
    super(props)

    this._isMounted = false
    this.isRTL = false

    const appState = getAppStore().getState()
    this.isRTL = appState?.appContext?.isRTL
    this.exbVersion = appState?.appConfig?.exbVersion || 'Unknown'
    this.state = {
      w3wLocator: '',
      jimuMapView: null,
      latitude: '',
      longitude: '',
      what3words: null,
      isCopyMessageOpen: false,
      currentZoomLevel: null,
      isZoomInRange: false,
      nearestPlace: null,
      extent: null,
      currentAddress: null,
      currentMapPoint: null,
      center: null,
      showGrid: false
    }

    if (this.props.config.mode === 'locatorUrl') this.updateGeocodeURL()
  }

  /* Config */
  getApiKey = (): string | null => {
    if (this.props.config.mode === 'locatorUrl') {
      throw new Error('Unable to get API key on URL locator mode')
    }
    const apiKey = this.props.config.w3wApiKey
    if (!apiKey) {
      console.warn(
        'API Key is missing. Please provide an API key in the settings.'
      )
      return null
    }
    return apiKey
  }

  /* Localize strings */
  nls = (id: string) => {
    return this.props.intl.formatMessage({
      id: id,
      defaultMessage: defaultMessages[id]
    })
  }

  /* Locator URL */
  updateGeocodeURL = () => {
    this.getGeocodeServiceURL().then((geocodeServiceURL) => {
      this.setState({
        w3wLocator: geocodeServiceURL
      })
    })
  }

  getDefaultGeocodeServiceURL = () => {
    if (this.props.config.mode === 'apiKey') return
    //by default use esri world geocoding service
    const geocodeServiceURL =
      'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
    //if geocoding service url is configured then use that (This is for backward compatibility before implementing Utility selector)
    //else if use org first geocode service
    return (
      this.props.config?.geocodeServiceUrl ||
      this.props.portalSelf?.helperServices?.geocode?.[0]?.url ||
      geocodeServiceURL
    )
  }

  getGeocodeServiceURL = async (): Promise<string> => {
    if (this.props.config.mode === 'apiKey') {
      throw new Error('Cannot retrieve geocode service url in API key mode')
    }

    const defaultGeocodeServiceUrl = this.getDefaultGeocodeServiceURL()

    const { geocodeServiceUrl } = this.props.config || {}
    const orgGeocodeUrl =
      this.props.portalSelf?.helperServices?.geocode?.[0]?.url
    const geocodeURlFromUtility = await this.getGeocodeURLFromUtility()
    return (
      geocodeURlFromUtility ||
      geocodeServiceUrl ||
      orgGeocodeUrl ||
      defaultGeocodeServiceUrl
    )
  }

  getGeocodeURLFromUtility = async (): Promise<string> => {
    if (this.props.config.mode === 'apiKey') {
      throw new Error(
        'Cannot retrieve geocode url from utility in API key mode'
      )
    }
    if (this.props.config.useUtilitiesGeocodeService?.length > 0) {
      return UtilityManager.getInstance()
        .getUrlOfUseUtility(this.props.config.useUtilitiesGeocodeService?.[0])
        .then((url) => {
          return Promise.resolve(url)
        })
    }
    return Promise.resolve('')
  }

  /* What3words Action buttons */
  onCopyClick = () => {
    //clear prev selection
    if (window.getSelection) {
      window.getSelection().removeAllRanges()
    }

    //copy input
    navigator.clipboard.writeText(this.state.what3words)
    this.setState({
      isCopyMessageOpen: true
    })

    setTimeout(() => {
      //Remove the existing selection
      if (window.getSelection) {
        window.getSelection().removeAllRanges()
      }
      this.setState({
        isCopyMessageOpen: false
      })
    }, 500)
  }

  openMapsite = () => {
    const { what3words } = this.state
    if (what3words) {
      // URL-encode the what3words address to handle non-Latin characters
      const encodedW3W = encodeURIComponent(what3words)
      // Construct the map URL with the application query parameter
      const mapUrl = `https://what3words.com/${encodedW3W}?application=arcgis-experience-app`
      // Open the URL in a new tab
      window.open(mapUrl, '_blank')
    } else {
      console.warn('No what3words address available to open.')
    }
  }

  /* Handle Map View */
  onActiveViewChange = async (jimuMapView: JimuMapView) => {
    console.info('Active View Change')
    if (!jimuMapView) return
    this.mapView = jimuMapView.view

    // Debug log to check API key presence
    if (this.props.config.mode === 'apiKey') {
      const apiKey = this.getApiKey()
      if (!apiKey) {
        console.warn('API Key not yet available. Retrying...')
        setTimeout(() => {
          this.onActiveViewChange(jimuMapView)
        }, 500) // Retry after a delay
        return
      }
    }

    // Handle map clicks
    if (this._clickHandle) {
      this._clickHandle.remove()
    }
    this._clickHandle = this.mapView.on('click', this.handleMapClick)

    // Monitor zoom changes
    if (!this._zoomHandle) {
      const debouncedZoomHandler = debounce((zoomLevel: number) => {
        this.setState({ currentZoomLevel: zoomLevel }, () => {
          this.handleZoomChange(zoomLevel)
        })
      }, 100) // Adjust the debounce delay as needed

      this._zoomHandle = this.mapView.watch('zoom', (zoomLevel: number) => {
        debouncedZoomHandler(zoomLevel)
      })
    }
    if (!this._basemapHandle) {
      this._basemapHandle = this.mapView.watch('basemap', () => {
        this.handleZoomChange(this.state.currentZoomLevel)
      })
    }

    // Watch the `stationary` property to detect when the map stops moving
    if (!this._stationaryHandle) {
      this.resetMapState()
      this.clearGraphics()

      this._stationaryHandle = this.mapView.watch(
        'stationary',
        (isStationary) => {
          if (isStationary) {
            this.drawLocationOnMap()
            if (this.state.showGrid) this.fillW3wGridLayer()
          }
        }
      )
    }

    // Watch the `center` property to update the current map point
    if (!this._centerHandle) {
      this._centerHandle = this.mapView.watch('center', (center) => {
        this.setState({
          center
        })
      })
    }
  }

  drawLocationOnMap = async () => {
    const { currentMapPoint, currentAddress, isZoomInRange } = this.state
    await this.addGraphicsToMap(currentAddress, currentMapPoint, isZoomInRange)
  }

  isZoomLevelInRange = () => {
    const wgs84Extent = webMercatorUtils.webMercatorToGeographic(
      this.mapView.extent,
      true
    ) as __esri.Extent
    const diagonalDistance = geodesicUtils.geodesicDistance(
      new Point({
        y: wgs84Extent.ymax,
        x: wgs84Extent.xmax
      }),
      new Point({
        y: wgs84Extent.ymin,
        x: wgs84Extent.xmin
      }),
      'kilometers'
    )
    return diagonalDistance.distance <= 0.5
  }

  handleZoomChange = async (zoomLevel: number) => {
    const isZoomInRange = this.isZoomLevelInRange()
    this.setState({ isZoomInRange })
  }

  /* Handle Map Click */
  handleMapClick = async (mapClick: __esri.ViewClickEvent) => {
    if (!this.isWidgetActive()) return

    try {
      this.clearGraphics()
      this.resetMapState()

      const point = await this.getMapPointInWGS84(mapClick.mapPoint)
      if (!point) return

      const { latitude, longitude } = this.extractCoordinates(point)
      this.setState({ latitude, longitude })

      const address = await this.fetchAddress(point)
      if (!address) throw new Error('Address fetch failed.')

      this.updateStateWithAddress(address)

      // Save current address and map point
      this.setState({
        currentAddress: address,
        currentMapPoint: point
      })

      await this.zoomToLocation(point)
    } catch (error) {
      console.error('Error handling map click:', error)
    }
  }

  zoomToLocation = async (mapPoint: __esri.Point) => {
    const w3wPoint = webMercatorUtils.geographicToWebMercator(mapPoint)
    const w3wBuffer = geometryEngine.buffer(w3wPoint, 100, 'meters')
    await this.mapView.goTo({
      target: w3wBuffer,
      zoom: this.state.currentZoomLevel
    })
  }

  isWidgetActive = (): boolean => {
    const widgetState = this.props.state || 'OPENED'
    if (this.props.config.mode === 'apiKey') {
      const apiKey = this.getApiKey()
      if (!apiKey || widgetState !== 'OPENED') {
        return false
      }
    }
    return true
  }

  resetMapState = () => {
    this.mapView.closePopup()
  }

  getMapPointInWGS84 = async (mapPoint: __esri.Point): Promise<any> => {
    if (!mapPoint) {
      console.error('Invalid map point.')
      return null
    }

    if (mapPoint.spatialReference?.wkid === 4326) {
      return mapPoint // Already in WGS84
    }

    const [projection, SpatialReference] = await loadArcGISJSAPIModules([
      'esri/geometry/projection',
      'esri/geometry/SpatialReference'
    ])

    if (!projection.isLoaded()) await projection.load()

    const wgs84 = new SpatialReference({ wkid: 4326 })
    const projectedPoint = projection.project(mapPoint, wgs84)

    if (!projectedPoint) {
      console.error('Failed to project map point to WGS84.')
      return null
    }

    return projectedPoint
  }

  extractCoordinates = (mapPoint: any) => {
    const latitude = mapPoint.latitude?.toFixed(6) || mapPoint.y?.toFixed(6)
    const longitude = mapPoint.longitude?.toFixed(6) || mapPoint.x?.toFixed(6)

    if (latitude === null || longitude === null) {
      throw new Error('Invalid latitude or longitude.')
    }

    return { latitude, longitude }
  }

  fetchAddress = async (point: __esri.Point): Promise<Address> => {
    if (this.props.config.mode === 'apiKey') {
      const { latitude, longitude } = this.extractCoordinates(point)
      const language = this.props.config.w3wLanguage || 'en'
      const response = await fetch(
        'https://api.what3words.com/v3/convert-to-3wa?' +
        new URLSearchParams({
          key: this.getApiKey(),
          coordinates: `${latitude},${longitude}`,
          language
        }).toString(),
        {
          headers: {
            'X-W3W-Wrapper': `ArcGIS Experience App (v${this.exbVersion})`
          }
        }
      ).then(res => res.json())

      return {
        words: response.words,
        square: response.square,
        nearestPlace: response.nearestPlace || 'No nearby place available'
      }
    }

    const locatorResponse = await getAddressFromGeocodeService(
      this.state.w3wLocator,
      point
    )

    return {
      words: locatorResponse,
      square: null,
      nearestPlace: null
    }
  }

  updateStateWithAddress = (address: Address) => {
    if (address.words.startsWith('Error')) {
      // Display error as the address if there's an issue
      this.setState({
        what3words: address.words,
        nearestPlace: null
      })
    } else {
      // Normal address update
      this.setState({
        what3words: address.words,
        nearestPlace: address.nearestPlace || 'Unknown location'
      })
    }
  }

  addGraphicsToMap = async (
    address: Address,
    mapPoint: __esri.Point,
    zoomIsInRange: boolean
  ) => {
    try {
      if (!address) {
        console.error('Error adding graphics to map: address is null')
        return
      }
      const proximityFactor = 1 // Optional proximity adjustment for styling
      const { config } = this.props

      // Clear previous graphics
      this.clearGraphics()

      if (config.mode === 'apiKey') {
        // Handle API Key mode: add picture marker or square based on zoom level
        if (!zoomIsInRange) {
          // Add a picture marker for zoom levels below 17
          const marker = await getMarkerGraphic(mapPoint, this.mapView)
          const label = await getMapLabelGraphic(mapPoint, address.words)

          if (marker) this.mapView.graphics.add(marker)
          if (
            config.displayMapAnnotation &&
            label &&
            !address.words.startsWith('Error')
          ) {
            this.mapView.graphics.add(label)
          }
        } else if (address.square) {
          // Add a square for zoom levels 17 and above
          const squareGraphic = await getSquareMarkerGraphic(
            address.square,
            this.mapView,
            proximityFactor
          )
          const label = await getSquareMapLabelGraphic(
            address.square,
            address.words
          )

          if (squareGraphic) this.mapView.graphics.add(squareGraphic)
          if (
            config.displayMapAnnotation &&
            label &&
            !address.words.startsWith('Error')
          ) {
            this.mapView.graphics.add(label)
          }
        } else {
          console.warn('Square data is missing for the current address.')
        }
      } else {
        // Handle Locator URL mode
        const marker = await getMarkerGraphic(mapPoint, this.mapView)
        const label = await getMapLabelGraphic(mapPoint, address.words)

        if (marker) this.mapView.graphics.add(marker)
        if (
          config.displayMapAnnotation &&
          label &&
          !address.words.startsWith('Error')
        ) {
          this.mapView.graphics.add(label)
        }
      }
    } catch (error) {
      console.error('Error adding graphics to map:', error)
    }
  }

  /* Lifecycle method */
  componentDidMount = () => {
    try {
      const widgetState = this.props.state || 'OPENED' // Add fallback
      if (widgetState === 'OPENED') {
        this.activateWidget()
      } else if (widgetState === 'CLOSED') {
        this.deactivateWidget()
      }
    } catch (error) {
      console.error('Error in componentDidMount:', error)
    }
  }

  componentDidUpdate = (prevProps: AllWidgetProps<IMConfig>) => {
    const prevState = prevProps.state || 'OPENED'
    const currentState = this.props.state || 'OPENED'
    // ignore if nothing changed
    if (prevProps.config === this.props.config) return

    const prevMode = prevProps.config.mode
    const currentMode = this.props.config.mode

    if (currentMode === 'locatorUrl') {
      const currentLocator = this.props.config.geocodeServiceUrl
      this.setState({
        w3wLocator: currentLocator
      })

      //check for the updated geocode service url in config
      //if utility services is used then check if it is updated OR
      //if utility service was configured and now removed
      //In these two cases update the geocode url

      const useGeocodeService = this.props.config.useUtilitiesGeocodeService

      const hasService = useGeocodeService?.length > 0
      const hasServiceChanged =
        prevMode === 'locatorUrl' &&
        prevProps.config.useUtilitiesGeocodeService?.[0]?.utilityId !==
          useGeocodeService?.[0]?.utilityId
      const serviceRemoved =
        useGeocodeService?.length === 0 &&
        prevMode === 'locatorUrl' &&
        prevProps.config.useUtilitiesGeocodeService?.length !==
          useGeocodeService?.length

      if ((hasService && hasServiceChanged) || serviceRemoved) {
        this.updateGeocodeURL()
      }
    }

    if (prevState !== currentState) {
      if (currentState === 'CLOSED') {
        this.deactivateWidget()
      } else if (currentState === 'OPENED') {
        this.activateWidget()
      }
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false
    if (this._zoomHandle) this._zoomHandle.remove()
    if (this._extentHandle) this._extentHandle.remove()
    if (this._clickHandle) this._clickHandle.remove()
    if (this._stationaryHandle) this._stationaryHandle.remove()
    if (this._centerHandle) this._centerHandle.remove()
    if (this._basemapHandle) this._basemapHandle.remove()

    this.clearGraphics()
    this.deactivateWidget() // Ensure all resources are cleaned up
  }

  /* Widget Activity */
  deactivateWidget = () => {
    // Clear the graphics layer
    this.clearGraphics()

    if (this.mapView) {
      if (this._clickHandle) {
        this._clickHandle.remove()
        this._clickHandle = null
      }
      this.mapView.graphics.removeAll()

      if (this.mapView.closePopup) {
        this.mapView.closePopup()
      }
    }

    // Reset the widget state
    this.resetWidgetState()
  }

  activateWidget = () => {
    if (this.mapView) {
      if (this._clickHandle) {
        this._clickHandle.remove()
      }
      this._clickHandle = this.mapView.on('click', this.handleMapClick)
      this.setState({ currentZoomLevel: 19 })
    }
  }

  resetWidgetState = () => {
    this.setState({
      latitude: '',
      longitude: '',
      what3words: null,
      isCopyMessageOpen: false,
      currentZoomLevel: null,
      currentAddress: null,
      currentMapPoint: null
    })
  }

  clearGraphics = () => {
    if (this.mapView && this.mapView.graphics) {
      this.mapView.graphics.removeAll()
    }
  }

  clearGridLayer () {
    if (this.gridLayer) {
      if (this.mapView.map.findLayerById(this.gridLayer.id)) {
        this.mapView.map.remove(this.gridLayer)
      }
      this.gridLayer.destroy()
      this.gridLayer = null
    }
  }

  toggleGrid = (evt: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({
      showGrid: checked
    })
    if (checked) {
      this.fillW3wGridLayer()
    } else {
      this.clearGridLayer()
    }
  }

  fillW3wGridLayer = async () => {
    const [FeatureLayer, Renderer] = await loadArcGISJSAPIModules([
      'esri/layers/FeatureLayer',
      'esri/renderers/SimpleRenderer'
    ])

    const wgs84Extent = webMercatorUtils.webMercatorToGeographic(
      this.mapView.extent,
      true
    ) as __esri.Extent
    const isZoomInRange = this.isZoomLevelInRange()

    if (isZoomInRange) {
      const apiKey = this.getApiKey()
      const boundingBox = `${wgs84Extent.ymin},${wgs84Extent.xmin},${wgs84Extent.ymax},${wgs84Extent.xmax}`
      const grid = await fetch(
        'https://api.what3words.com/v3/grid-section?' +
        new URLSearchParams({
          key: apiKey,
          'bounding-box': boundingBox,
          format: 'geojson'
        }).toString(),
        {
          headers: {
            'X-W3W-Wrapper': `ArcGIS Experience App (v${this.exbVersion})`
          }
        }
      ).then(res => res.json())

      const w3wGridLines = await this.getW3wGridLineGraphics(grid, wgs84Extent)

      const renderer = new Renderer({
        symbol: {
          type: 'simple-line',
          color: [255, 31, 38, 0.5], // Red with 60% opacity
          width: 0.5
        }
      })

      this.mapView.map.remove(this.gridLayer)
      this.gridLayer?.destroy()
      this.gridLayer = new FeatureLayer({
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
        id: 'w3wGridLayer',
        source: w3wGridLines,
        renderer,
        popupEnabled: false // Make grid lines not selectable
      })

      // add w3wGridLayer under w3wLayer
      this.mapView.map.add(this.gridLayer)
    } else {
      this.gridLayer?.destroy()
    }
  }

  getW3wGridLineGraphics = async (
    w3wGrid: any,
    wgs84Extent: __esri.Extent
  ) => {
    const getRange = (center: number, min: number, max: number, coord: number) => {
      const rangeToMin = Math.abs(center - min)
      const rangeToMax = Math.abs(center - max)
      const coordRange = coord <= center ? Math.abs(coord - min) : Math.abs(coord - max)
      const value = coord <= center ? rangeToMin - coordRange : rangeToMax - coordRange
      const norm = coord <= center ? rangeToMin : rangeToMax
      return { value, norm }
    }

    const [Graphic] = await loadArcGISJSAPIModules(['esri/Graphic'])

    return w3wGrid.features[0].geometry.coordinates.map(
      (coordinate: any, index: number) => {
        let value = 1
        let norm = 1

        if (this.state.currentMapPoint) {
          const gridCenterPoint = this.state.currentMapPoint
          const isVertical = coordinate[0][0] === coordinate[1][0]

          const { x: centerX, y: centerY } = gridCenterPoint
          const [coordX, coordY] = coordinate[0]

          if (isVertical) {
            ({ value, norm } = getRange(centerX, wgs84Extent.xmin, wgs84Extent.xmax, coordX))
          } else {
            ({ value, norm } = getRange(centerY, wgs84Extent.ymin, wgs84Extent.ymax, coordY))
          }
        }

        return new Graphic({
          attributes: {
            id: index,
            value: value * 10000,
            norm: norm * 10000
          },
          symbol: {
            type: 'simple-line',
            color: [255, 31, 38, 0.5], // Red with 50% opacity
            width: 0.5
          },
          geometry: {
            type: 'polyline',
            spatialReference: {
              wkid: 4326
            },
            paths: coordinate
          } as __esri.Polyline
        })
      }
    )
  }

  /* Renders the widget UI */
  render () {
    const { what3words, latitude, longitude, nearestPlace, isZoomInRange } = this.state
    const { config, theme, useMapWidgetIds } = this.props
    const isApiKeyMode = config.mode === 'apiKey'

    if (!useMapWidgetIds || useMapWidgetIds.length === 0) {
      console.error(
        'No map widget ID found. Ensure the widget is properly linked to a map.'
      )
      return (
        <div>
          <h5>Please configure this widget to use a map widget.</h5>
        </div>
      )
    }

    return (
      <div css={getW3WStyle(theme)} className="widget-starter jimu-widget">
        <JimuMapViewComponent
          useMapWidgetId={useMapWidgetIds[0]}
          onActiveViewChange={this.onActiveViewChange}
        />
        {/* Main Card */}
        <div className="w3w-card">
          {/* Title */}
          <h5 className="card-title">what3words Address</h5>

          {/* W3W Address Block */}
          <div className="w3w-address-row">
            <span className="w3w-address">
              {what3words
                /* eslint-disable-next-line multiline-ternary */
                ? (
                    <>
                      {what3words.startsWith('Error')
                        ? (
                          // Render the error message directly without "///"
                          <span className="w3w-error">
                            {what3words.replace('Error: ', '')}
                          </span>
                          )
                        : (
                          // Render the W3W address with "///"
                          <>
                            <span className="w3w-slash">///</span>
                            <span className="w3w-text">{what3words}</span>
                          </>
                          )}
                    </>
                  ) : (
                // Placeholder for no address
                <span className="w3w-placeholder">
                  Click on the map to get what3words address.
                </span>
                  )}
            </span>
            <div className="w3w-actions">
              {config.displayCopyButton &&
                what3words &&
                !what3words.startsWith('Error') && (
                  <CopyButton
                    text={`///${what3words}`}
                    onCopy={this.onCopyClick.bind(this)}
                  />
              )}
              {config.displayMapsiteButton &&
                what3words &&
                !what3words.startsWith('Error') && (
                  <Button
                    type="tertiary"
                    aria-label="Open Mapsite"
                    title="Open Mapsite"
                    icon
                    size="sm"
                    disabled={!what3words}
                    onClick={this.openMapsite.bind(this)}
                  >
                    <ShareArrowCurveOutlined size={'16'} />
                  </Button>
              )}
            </div>
          </div>

          {/* Subtitle: Nearest Places */}
          {config.displayNearestPlace &&
            isApiKeyMode &&
            nearestPlace &&
            what3words && (
              <p className="card-subtitle">
                {what3words
                  ? nearestPlace // Replace this placeholder with real data if available
                  : 'No nearest places available'}
              </p>
          )}

          {/* Subtitle: Lat & Long */}
          {config.displayCoordinates && what3words && (
            <p className="card-subtitle">
              Latitude: {latitude || 'N/A'}, Longitude: {longitude || 'N/A'}
            </p>
          )}

          {isZoomInRange && (
            <div className="button-group-container">
              <div className="action-buttons full-width">
                <Label centric check>
                  <Checkbox
                    aria-label="Display Grid"
                    checked={this.state.showGrid}
                    onChange={this.toggleGrid.bind(this)}
                  />
                  <span className="show-grid-title">Display Grid</span>
                </Label>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}
