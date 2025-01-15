/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {
  React,
  type AllWidgetProps,
  jsx,
  getAppStore,
  BaseWidget
} from 'jimu-core'
import {
  JimuMapViewComponent,
  loadArcGISJSAPIModules,
  type JimuMapView
} from 'jimu-arcgis'
import { getApiKey, getGeocodeServiceURL, validApiKey, validLocator } from './lib/mode-utils'

import {
  getMarkerGraphic,
  getMapLabelGraphic,
  getSquareMapLabelGraphic,
  getSquareMarkerGraphic,
  getAddressFromGeocodeService
} from './lib/locator-utils'
import { type IMConfig } from '../config'
import { getW3WStyle } from './lib/style'
import defaultMessages from './translations/default'
import { Button, Label, Checkbox } from 'jimu-ui'
import { CopyButton } from 'jimu-ui/basic/copy-button'
import { ShareArrowCurveOutlined } from 'jimu-icons/outlined/editor/share-arrow-curve'
import { debounce } from 'lodash'

import { clearGridLayer, fillW3wGridLayer, getGridData } from './lib/grid-utils'
import { type Address, fetchW3WAddress } from '../lib/w3w-utils'

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
  currentAddress: Address
  currentMapPoint: __esri.Point
  displayGrid: boolean
  error: string
}

export default class Widget extends BaseWidget<
AllWidgetProps<IMConfig>,
State
> {
  private mapView: __esri.MapView | __esri.SceneView
  private readonly isRTL: boolean
  private clickHandle: __esri.Handle
  private eventHandle: __esri.WatchHandle
  private readonly exbVersion: string

  constructor (props: AllWidgetProps<IMConfig>) {
    super(props)

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
      currentAddress: null,
      currentMapPoint: null,
      displayGrid: false,
      error: null
    }
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
    getGeocodeServiceURL(this.props).then((geocodeServiceURL) => {
      this.setState({
        w3wLocator: geocodeServiceURL
      })
    })
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

    try {
      if (this.props.state === 'OPENED') {
        this.activateWidget()
      } else if (this.props.state === 'CLOSED') {
        this.deactivateWidget()
      }
    } catch (error) {
      console.error('Error in onActiveViewChange:', error)
    }
  }

  drawLocationOnMap = async () => {
    const { currentMapPoint, currentAddress, isZoomInRange } = this.state
    try {
      if (!currentAddress) {
        console.error('Error adding graphics to map: address is null')
        return
      }
      const proximityFactor = 1 // Optional proximity adjustment for styling
      const { config } = this.props

      // Clear previous graphics
      this.clearGraphics()

      if (validApiKey(this.props.config)) {
        // Handle API Key mode: add picture marker or square based on zoom level
        if (!isZoomInRange) {
          // Add a picture marker for zoom levels below 17
          const marker = await getMarkerGraphic(currentMapPoint, this.mapView)
          const label = await getMapLabelGraphic(currentMapPoint, currentAddress.words)

          if (marker) this.mapView.graphics.add(marker)
          if (
            config.displayMapAnnotation &&
            label &&
            !currentAddress.words.startsWith('Error')
          ) {
            this.mapView.graphics.add(label)
          }
        } else if (currentAddress.square) {
          const squareGraphic = await getSquareMarkerGraphic(
            currentAddress.square,
            this.mapView,
            proximityFactor
          )
          const label = await getSquareMapLabelGraphic(
            currentAddress.square,
            currentAddress.words
          )

          if (squareGraphic) this.mapView.graphics.add(squareGraphic)
          if (
            config.displayMapAnnotation &&
            label &&
            !currentAddress.words.startsWith('Error')
          ) {
            this.mapView.graphics.add(label)
          }
        } else {
          console.warn('Square data is missing for the current address.')
        }
      }

      if (validLocator(this.props.config)) {
        // Handle Locator URL mode
        const marker = await getMarkerGraphic(currentMapPoint, this.mapView)
        const label = await getMapLabelGraphic(currentMapPoint, currentAddress.words)

        if (marker) this.mapView.graphics.add(marker)
        if (
          config.displayMapAnnotation &&
          label &&
          !currentAddress.words.startsWith('Error')
        ) {
          this.mapView.graphics.add(label)
        }
      }
    } catch (error) {
      console.error('Error adding graphics to map:', error)
    }
  }

  drawGridOnMap = async () => {
    if (this.state.displayGrid) {
      const extent = await this.projectToWGS84(this.mapView.extent)
      if (!this.state.isZoomInRange) {
        clearGridLayer(this.mapView)
        return
      }
      const grid = await getGridData(extent, getApiKey(this.props.config))
      fillW3wGridLayer(this.mapView, grid)
    } else {
      clearGridLayer(this.mapView)
    }
  }

  projectToWGS84 = async <T extends __esri.Extent | __esri.Point>(geometry: T): Promise<T> => {
    if (!geometry) {
      return
    }

    if (geometry.spatialReference?.wkid === 4326) {
      return geometry
    }

    const [SpatialReference, projection] = await loadArcGISJSAPIModules([
      'esri/geometry/SpatialReference',
      'esri/geometry/projection'
    ])
    if (!projection.isLoaded()) {
      await projection.load()
    }

    const wgs84SpatialReference = new SpatialReference({ wkid: 4326 })
    const projectedGeometry = projection.project(geometry, wgs84SpatialReference) as __esri.Extent

    if (!projectedGeometry) {
      console.error('Failed to project geometry to WGS84.')
      return
    }
    return projectedGeometry as T
  }

  handleZoomChange = async (zoomLevel: number) => {
    this.setState({ isZoomInRange: this.isZoomLevelInRange(zoomLevel), currentZoomLevel: zoomLevel })
  }

  isZoomLevelInRange = (zoomLevel: number) => zoomLevel >= 17 && zoomLevel <= 25

  zoomToLocation = async (mapPoint: __esri.Point) => {
    console.log('Zoom level is: ', { currentZoomLevel: this.state.currentZoomLevel, mapZoom: this.mapView.zoom })
    await this.mapView.goTo({
      center: [mapPoint.longitude || mapPoint.x, mapPoint.latitude || mapPoint.y],
      zoom: this.isZoomLevelInRange(this.mapView.zoom) ? this.mapView.zoom : 18
    })
  }

  /* Handle Map Click */
  handleMapClick = async (mapClick: __esri.ViewClickEvent) => {
    if (!this.isWidgetActive()) return
    const { latitude, longitude } = mapClick.mapPoint
    console.log('Map clicked at:', { latitude, longitude })

    try {
      this.clearGraphics()

      const point = await this.projectToWGS84(mapClick.mapPoint)
      if (!point) return

      const { latitude, longitude } = this.extractCoordinates(point)
      this.setState({ latitude, longitude })
      let address: Address
      if (validApiKey(this.props.config)) {
        address = await fetchW3WAddress({ latitude, longitude }, {
          apiKey: getApiKey(this.props.config),
          exbVersion: this.exbVersion
        })
      }

      if (validLocator(this.props.config)) {
        address = await getAddressFromGeocodeService(this.state.w3wLocator, point)
      }

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

  handleEvents = (newValue: any, oldValue: any, propertyName: string) => {
    switch (propertyName) {
      case 'stationary':
        if (newValue) {
          console.log(
            'Map is stationary. Updating current map point and address...'
          )
          this.drawLocationOnMap()
          this.drawGridOnMap()
        }
        break
      case 'zoom':
        const debouncedZoomHandler = debounce((zoomLevel: number) => {
          this.handleZoomChange(zoomLevel)
          console.log('Zoom level changed:', { before: oldValue, after: newValue })
        }, 100)
        debouncedZoomHandler(newValue)
        break
      case 'basemap':
        console.log('Base map event: ', { oldValue, newValue })
        break
      default:
        // console.log('Unhandled property change:', { propertyName, oldValue, newValue })
        break
    }
  }

  isWidgetActive = (): boolean =>
    validApiKey(this.props.config) &&
    getApiKey(this.props.config) &&
    this.props.state === 'OPENED'

  extractCoordinates = (mapPoint: any) => {
    const latitude = mapPoint.latitude?.toFixed(6) || mapPoint.y?.toFixed(6)
    const longitude = mapPoint.longitude?.toFixed(6) || mapPoint.x?.toFixed(6)

    if (latitude === null || longitude === null) {
      throw new Error('Invalid latitude or longitude.')
    }

    return { latitude, longitude }
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
    console.log('Updated state with address:', address)
  }

  /* Lifecycle method */
  componentDidMount = () => {
    console.log('Component did mount - state: ', this.props.state)
    try {
      if (this.props.state === 'OPENED') {
        this.activateWidget()
      } else if (this.props.state === 'CLOSED') {
        this.deactivateWidget()
      }
    } catch (error) {
      console.error('Error in componentDidMount:', error)
    }
  }

  componentDidUpdate = (prevProps: AllWidgetProps<IMConfig>) => {
    const prevState = prevProps.state
    const currentState = this.props.state
    console.log(`Component did updated - current state: ${currentState} previous state: ${prevState}`)
    if (prevState !== currentState) {
      if (currentState === 'OPENED') {
        this.activateWidget()
      } else if (currentState === 'CLOSED') {
        this.deactivateWidget()
      }
    }

    // ignore if nothing changed
    if (prevProps.config === this.props.config) return

    const prevMode = prevProps.config.mode
    const currentMode = this.props.config.mode
    // check if currentMode and prevMode are different
    if (prevMode !== currentMode) {
      console.log(`Mode changed from ${prevMode} to ${currentMode}`)
    }

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
  }

  componentWillUnmount = () => {
    console.log('Component will unmount - state:', this.props.state)
    this.clearGraphics()
    this.deactivateWidget() // Ensure all resources are cleaned up
  }

  /* Widget Activity */
  activateWidget = () => {
    console.log('Activating widget')
    if (!this.mapView) return

    const isApiKeyMode = validApiKey(this.props.config)
    const isLocatorMode = validLocator(this.props.config)

    if (!isApiKeyMode && !isLocatorMode) {
      return
    }

    if (isLocatorMode) this.updateGeocodeURL()
    if (isLocatorMode || isApiKeyMode) {
      this.removeHandlers()
      this.clickHandle = this.mapView.on('click', this.handleMapClick)
      this.eventHandle = this.mapView.watch(['stationary', 'zoom', 'center', 'basemap'], this.handleEvents)
    }
  }

  deactivateWidget = () => {
    console.log('Deactivating widget')
    // Clear the graphics layer
    this.clearGraphics()
    this.removeHandlers()
    // Reset the widget state
    this.resetWidgetState()
  }

  resetWidgetState = () => {
    console.log('Resetting widget state...')
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
    this.mapView?.graphics?.removeAll()
    this.mapView?.closePopup()
  }

  removeHandlers = () => {
    this.clickHandle?.remove()
    this.eventHandle?.remove()
  }

  toggleGrid = (evt: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({
      displayGrid: checked
    })
    if (checked) {
      this.projectToWGS84(this.mapView.extent).then((extent) => {
        if (!this.state.isZoomInRange) {
          clearGridLayer(this.mapView)
          return
        }
        getGridData(extent, getApiKey(this.props.config))
          .then(gridData => {
            fillW3wGridLayer(this.mapView, gridData)
          })
      })
    } else {
      clearGridLayer(this.mapView)
    }
  }

  /* Renders the widget UI */
  render () {
    const { what3words, latitude, longitude, nearestPlace, isZoomInRange } = this.state
    const { config, theme, useMapWidgetIds } = this.props
    const isApiKeyMode = config.mode === 'apiKey'
    const isLocatorMode = config.mode === 'locatorUrl'
    const isModeMissing = !isApiKeyMode && !isLocatorMode
    const isApiKeyInvalid = isApiKeyMode && !config.w3wApiKey
    const isLocatorInvalid = isLocatorMode && !config.useUtilitiesGeocodeService?.length

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
          {isModeMissing && (
            <div className="w3w-error">
              <span>Please select a mode: API or Locator URL to display what3words addresses</span>
            </div>
          )}
          {isApiKeyInvalid && (
            <div className="w3w-error">
              <span>Please provide a valid API key</span>
            </div>
          )}
          {isLocatorInvalid && (
            <div className="w3w-error">
              <span>Please provide a valid Locator Service</span>
            </div>
          )}

          {/* TODO: Display error when API key is invalid */}
          {
            !isModeMissing &&
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
          }

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

          {isApiKeyMode && isZoomInRange && (
            <div className="button-group-container">
              <div className="action-buttons full-width">
                <Label centric check>
                  <Checkbox
                    aria-label="Display Grid"
                    checked={this.state.displayGrid}
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
