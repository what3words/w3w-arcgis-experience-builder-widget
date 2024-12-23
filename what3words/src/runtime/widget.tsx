/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { React, type AllWidgetProps, jsx, getAppStore, UtilityManager, type UseUtility } from 'jimu-core'
import { JimuMapViewComponent, loadArcGISJSAPIModules, type JimuMapView } from 'jimu-arcgis'
import { getCurrentAddress, getMarkerGraphic, getMapLabelGraphic, getCurrentAddressFromW3wService, getSquareMapLabelGraphic, getSquareMarkerGraphic, initializeW3wService } from './locator-utils'
import { getW3WStyle } from './lib/style'
import defaultMessages from './translations/default'
import { Button } from 'jimu-ui'
import { CopyButton } from 'jimu-ui/basic/copy-button'
import { ShareArrowCurveOutlined } from 'jimu-icons/outlined/editor/share-arrow-curve'
import type { Extent } from 'esri/geometry'
import { add } from 'esri/views/3d/externalRenderers'

interface State {
  w3wLocator: string
  JimuMapView: JimuMapView | null
  latitude: string
  longitude: string
  what3words: string | null
  isCopyMessageOpen: boolean
  currentZoomLevel: number
  isZoomInRange: boolean
  nearestPlace: string | null
  extent: Extent
  currentAddress: any
  currentMapPoint: any
  center: __esri.Point
}

export default class Widget extends React.PureComponent<AllWidgetProps<any>, State> {
  mapView: any
  private _isMounted: boolean
  private readonly isRTL: boolean
  private _clickHandle: __esri.Handle
  private _zoomHandle: __esri.WatchHandle
  private _extentHandle: __esri.WatchHandle
  private _stationaryHandle: __esri.WatchHandle
  private _centerHandle: __esri.WatchHandle
  private _basemapHandle: __esri.WatchHandle
  what3words: string

  constructor (props) {
    super(props)

    //Get the default geocoding service URL
    let geocodeServiceURL = this.getDefaultGeocodeServiceURL()

    if (this.props.config?.addressSettings?.geocodeServiceUrl) {
      geocodeServiceURL = this.props.config.addressSettings.geocodeServiceUrl
    } else if (this.props.portalSelf && this.props.portalSelf.helperServices && this.props.portalSelf.helperServices.geocode &&
      this.props.portalSelf.helperServices.geocode.length > 0 && this.props.portalSelf.helperServices.geocode[0].url) { // Use org's first geocode service if available
      geocodeServiceURL = this.props.portalSelf.helperServices.geocode[0].url
    }

    this._isMounted = false
    this.isRTL = false

    const appState = getAppStore().getState()
    this.isRTL = appState?.appContext?.isRTL

    this.state = {
      w3wLocator: geocodeServiceURL,
      JimuMapView: null,
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
      center: null
    }
    //check whether any utility selected in configuration in the new app
    if (this.props.config.addressSettings?.useUtilitiesGeocodeService?.length > 0) {
      this.updateGeocodeURL()
    }
  }

  /* Config */
  getApiKey = (): string | null => {
    const apiKey = this.props.config?.addressSettings?.w3wApiKey

    if (!apiKey) {
      // console.warn('API Key is missing. Please provide an API key in the settings.')
      return null
    }
    return apiKey
  }

  nls = (id: string) => {
    return this.props.intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] })
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
    //by default use esri world geocoding service
    let geocodeServiceURL = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
    //if geocoding service url is configured then use that (This is for backward compatibility before implementing Utility selector)
    //else if use org first geocode service
    if (this.props.config?.addressSettings?.geocodeServiceUrl) {
      geocodeServiceURL = this.props.config.addressSettings.geocodeServiceUrl
    } else if (this.props.portalSelf && this.props.portalSelf.helperServices && this.props.portalSelf.helperServices.geocode &&
      this.props.portalSelf.helperServices.geocode.length > 0 && this.props.portalSelf.helperServices.geocode[0].url) { // Use org's first geocode service if available
      geocodeServiceURL = this.props.portalSelf.helperServices.geocode[0].url
    }
    return geocodeServiceURL
  }

  getGeocodeServiceURL = async (): Promise<string> => {
    //Ge the default geocoding service url if utility service is not configured
    let geocodeServiceURL = this.getDefaultGeocodeServiceURL()
    const geocodeURlFromUtility = await this.getGeocodeURLFromUtility()
    // if utility services is used fetch its url
    if (this.props.config.addressSettings?.useUtilitiesGeocodeService?.length > 0) {
      geocodeServiceURL = geocodeURlFromUtility
    }
    return geocodeServiceURL
  }

  getGeocodeURLFromUtility = async (): Promise<string> => {
    if (this.props.config.addressSettings?.useUtilitiesGeocodeService?.length > 0) {
      return this.getUrlOfUseUtility(this.props.config.addressSettings?.useUtilitiesGeocodeService?.[0])
    }
    return Promise.resolve('')
  }

  getUrlOfUseUtility = async (useUtility: UseUtility): Promise<string> => {
    if (!useUtility) {
      return Promise.resolve('')
    }
    return UtilityManager.getInstance().getUrlOfUseUtility(useUtility)
      .then((url) => {
        return Promise.resolve(url)
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
  onActiveViewChange = async (JimuMapView: JimuMapView) => {
    if (!JimuMapView) return
    this.mapView = JimuMapView.view

    // Debug log to check API key presence
    const apiKey = this.getApiKey()
    if (!apiKey) {
      // console.warn('API Key not yet available. Retrying...')
      setTimeout(() => { this.onActiveViewChange(JimuMapView) }, 500) // Retry after a delay
      return
    }

    // Handle map clicks
    if (this._clickHandle) {
      this._clickHandle.remove()
    }
    this._clickHandle = this.mapView.on('click', this.handleMapClick)

    // Monitor zoom changes
    if (!this._zoomHandle) {
      this._zoomHandle = this.mapView.watch('zoom', (zoomLevel: number) => {
        this.setState({ currentZoomLevel: zoomLevel },
          () => this.handleZoomChange(zoomLevel)
        )
      })
    }
    if(!this._basemapHandle) {
      this._basemapHandle = this.mapView.watch('basemap', () => {
        // console.log('Basemap changed. Re-evaluating marker icon...')
        this.handleBasemapChange()
      })
    }
    
    // Watch the `stationary` property to detect when the map stops moving
    if (!this._stationaryHandle) {
      this._stationaryHandle = this.mapView.watch('stationary', () => {
        // console.log('Map is stationary. Updating current map point and address...')
        this.handleBasemapChange() 
      })
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

  isZoomLevelInRange = () => {
    const { currentZoomLevel } = this.state
    return currentZoomLevel >= 17 && currentZoomLevel <= 25
  }

  handleZoomChange = async (zoomLevel: number) => {
    const isZoomInRange = this.isZoomLevelInRange()
    this.setState({ isZoomInRange })
    
    const { currentAddress, currentMapPoint } = this.state
    
    // Do not add graphics if the widget is deactivated
    if (!this.isWidgetActive()) {
      return
    }
    if (currentAddress && currentMapPoint) {
      await this.addGraphicsToMap(currentAddress, currentMapPoint, zoomLevel)
    }
  }

  handleBasemapChange = async () => {
    const { currentMapPoint } = this.state
  
    if (!currentMapPoint) {
      console.log('No current map point available to update markers.')
      return
    }
  
    // Clear existing markers
    this.clearGraphics()
  
    // Add the updated marker
    this.addGraphicsToMap(this.state.currentAddress, currentMapPoint, this.state.currentZoomLevel)
    // console.log('Markers updated for the new basemap.')
  }

  /* Handle Map Click */
  handleMapClick = async (mapClick: any) => {
    if (!this.isWidgetActive()) return

    try {
      this.clearGraphics()
      this.resetMapState()

      const mapPointWGS84 = await this.getMapPointInWGS84(mapClick.mapPoint)
      if (!mapPointWGS84) return

      await this.zoomToLocation(mapPointWGS84)

      const { latitude, longitude } = this.extractCoordinates(mapPointWGS84)
      this.setState({ latitude, longitude })

      const address = await this.fetchAddress(latitude, longitude, mapPointWGS84)
      if (!address) throw new Error('Address fetch failed.')

      this.updateStateWithAddress(address)

      // Save current address and map point
      this.setState({
        currentAddress: address,
        currentMapPoint: mapPointWGS84
      })
      const { currentZoomLevel } = this.state
      await this.addGraphicsToMap(address, mapPointWGS84, currentZoomLevel)
    } catch (error) {
      console.error('Error handling map click:', error)
    }
  }

  zoomToLocation = async (mapPoint: any) => {
    try {
      await this.mapView.goTo({
        center: [mapPoint.longitude || mapPoint.x, mapPoint.latitude || mapPoint.y],
        zoom: 18
      })
    } catch (error) {
      console.error('Failed to zoom to location:', error)
    }
  }

  isWidgetActive = (): boolean => {
    const widgetState = this.props.state || 'OPENED'
    const apiKey = this.getApiKey()
    const isApiKeyMode = this.props.config?.mode === 'apiKey'

    if ((isApiKeyMode && !apiKey) || widgetState !== 'OPENED') {
      // console.log('Widget is not active or API key is missing.')
      return false
    }
    return true
  }

  resetMapState = () => {
    this.mapView.closePopup()
    this.clearGraphics()
  }

  getMapPointInWGS84 = async (mapPoint: any): Promise<any> => {
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

  fetchAddress = async (latitude: number, longitude: number, mapPoint: any) => {
    if (this.props.config.mode === 'apiKey') {
      const language = this.props.config.w3wLanguage || 'en'
      return await getCurrentAddressFromW3wService(latitude, longitude, language)
    }

    const locatorResponse = await getCurrentAddress(this.state.w3wLocator, mapPoint)
    if (locatorResponse.startsWith('Error')) {
      return {
        words: locatorResponse, // Display error message as the address
        square: null,
        nearestPlace: null
      }
    }

    return {
      words: locatorResponse,
      square: null,
      nearestPlace: null
    }
  }

  updateStateWithAddress = (address: any) => {
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
    // console.log('Updated state with address:', address)
  }

  addGraphicsToMap = async (address: any, mapPoint: any, zoomLevel: number) => {
    try {
      const proximityFactor = 1 // Optional proximity adjustment for styling
      const { config } = this.props

      // Clear previous graphics
      this.clearGraphics()

      if (config.mode === 'apiKey') {
        // Handle API Key mode: add picture marker or square based on zoom level
        if (zoomLevel < 18) {
          // Add a picture marker for zoom levels below 17
          const marker = await getMarkerGraphic(mapPoint, this.mapView)
          const label = await getMapLabelGraphic(mapPoint, address.words)

          if (marker) this.mapView.graphics.add(marker)
          if (config.displayMapAnnotation && label && !address.words.startsWith('Error')) {
            this.mapView.graphics.add(label)
          }
        } else if (address.square) {
          // Add a square for zoom levels 17 and above
          const squareGraphic = await getSquareMarkerGraphic(address.square, this.mapView, proximityFactor)
          const label = await getSquareMapLabelGraphic(address.square, address.words)

          if (squareGraphic) this.mapView.graphics.add(squareGraphic)
          if (config.displayMapAnnotation && label && !address.words.startsWith('Error')) {
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
        if (config.displayMapAnnotation && label && !address.words.startsWith('Error')) {
          this.mapView.graphics.add(label)
        }
      }
    } catch (error) {
      console.error('Error adding graphics to map:', error)
    }
  }

  /* Lifecycle method */
  componentDidMount () {
    console.log('Component did mount')
    try {
      const widgetState = this.props.state || 'OPENED' // Add fallback
      const apiKey = this.getApiKey()
      const isApiKeyMode = this.props.config?.mode === 'apiKey'
      if (isApiKeyMode) {
        if (apiKey) {
          initializeW3wService(apiKey) // Initialize W3W service
        }
      }

      if (widgetState === 'OPENED') {
        this.activateWidget()
      } else if (widgetState === 'CLOSED') {
        this.deactivateWidget()
      }

      this.mapView.watch('zoom', (newZoomLevel) => {
        // console.log('Zoom level changed:', newZoomLevel)
        this.setState({ currentZoomLevel: newZoomLevel })
      })
    } catch (error) {
      console.error('Error in componentDidMount:', error)
    }
  }

  componentDidUpdate (prevProps) {
    const prevState = prevProps.state || 'OPENED'
    const currentState = this.props.state || 'OPENED'
    const prevMode = prevProps.config.mode
    const currentMode = this.props.config.mode
    if (prevProps.config !== this.props.config) {
      const apiKey = this.getApiKey()
      if (!apiKey) {
        console.warn('API Key is missing after config update.')
      }

      if (!this.mapView) {
        console.log('Reinitializing map view with updated API Key...')
        this.onActiveViewChange(prevProps.jimuMapView)
      }
    }
    // console.log('Component did update: previous state:', prevState, 'current state:', currentState)

    if (prevState !== currentState) {
      if (currentState === 'CLOSED') {
        console.log('[Widget] Deactivating...')
        this.deactivateWidget()
      } else if (currentState === 'OPENED') {
        console.log('[Widget] Activating...')
        this.activateWidget()
      }
    }

    if (prevMode !== currentMode) {
      console.log(`Mode changed from ${prevMode} to ${currentMode}`)
      if (currentMode === 'locatorUrl') {
        this.setState({
          w3wLocator: this.props.config?.addressSettings?.geocodeServiceUrl
        })
      }
    }

    // Update the locator URL if changed
    if (prevProps.config?.addressSettings?.geocodeServiceUrl !== this.props.config?.addressSettings?.geocodeServiceUrl) {
      this.setState({
        w3wLocator: this.props.config?.addressSettings?.geocodeServiceUrl
      })
    }
    //check for the updated geocode service url in config
    //if utility services is used then check if it is updated OR
    //if utility service was configured and now removed
    //In these two cases update the geocode url
    if ((this.props.config.addressSettings?.useUtilitiesGeocodeService?.length > 0 &&
      prevProps.config.addressSettings?.useUtilitiesGeocodeService?.[0]?.utilityId !== this.props.config.addressSettings?.useUtilitiesGeocodeService?.[0]?.utilityId) ||
      (this.props.config.addressSettings?.useUtilitiesGeocodeService?.length === 0 &&
        prevProps.config.addressSettings?.useUtilitiesGeocodeService.length !== this.props.config.addressSettings?.useUtilitiesGeocodeService.length)) {
      this.updateGeocodeURL()
    }
  }

  componentWillUnmount = () => {
    console.log('Component did mount: initial state:', this.props.state)
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
    console.log('Deactivating widget')
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
    console.log('Activating widget')
    if (this.mapView) {
      // Remove and reassign the click handler if needed
      if (this._clickHandle) {
        this._clickHandle.remove()
      }
      this._clickHandle = this.mapView.on('click', (mapClick: any) => {
        // console.log('Map clicked at:', mapClick.mapPoint)
        this.handleMapClick(mapClick)
      })
    }
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
    if (this.mapView && this.mapView.graphics) {
      // Remove all graphics
      this.mapView.graphics.removeAll()
      // console.log('Cleared all graphics from the map view.')
    }
  }

  /* Renders the widget UI */
  render () {
    const { what3words, latitude, longitude, nearestPlace } = this.state
    const { config, theme, useMapWidgetIds } = this.props
    const isApiKeyMode = config?.mode === 'apiKey'

    if (!useMapWidgetIds || useMapWidgetIds.length === 0) {
      console.error('No map widget ID found. Ensure the widget is properly linked to a map.')
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
        <h5 className="card-title">what3words Address
        </h5>

        {/* W3W Address Block */}
        <div className="w3w-address-row">
          <span className="w3w-address">
            {what3words
              ? (
                <>
                  {what3words.startsWith('Error')
                    ? (
                      // Render the error message directly without "///"
                      <span className="w3w-error">{what3words.replace('Error: ', '')}</span>
                      )
                    : (
                      // Render the W3W address with "///"
                      <>
                        <span className="w3w-slash">///</span>
                        <span className="w3w-text">{what3words}</span>
                      </>
                      )
                  }
                </>
                )
              : (
                // Placeholder for no address
                <span className="w3w-placeholder">Click on the map to get what3words address.</span>
                )}
          </span>
          <div className="w3w-actions">
            {config.displayCopyButton && what3words && !what3words.startsWith('Error') && (
              <CopyButton
                text={`///${what3words}`}
                onCopy={this.onCopyClick.bind(this)}
              />
            )}
            {config.displayMapsiteButton && what3words && !what3words.startsWith('Error') && (
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
        {config.displayNearestPlace && isApiKeyMode && nearestPlace && what3words && (
        <p className="card-subtitle">
          {what3words
            ? (nearestPlace) // Replace this placeholder with real data if available
            : 'No nearest places available'}
        </p>
        )}

        {/* Subtitle: Lat & Long */}
        { config.displayCoordinates && what3words && (
        <p className="card-subtitle">
          Latitude: {latitude || 'N/A'}, Longitude: {longitude || 'N/A'}
        </p>
        )}
      </div>
    </div>
    )
  }
}
