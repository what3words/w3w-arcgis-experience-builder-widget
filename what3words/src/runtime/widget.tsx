/** @jsx jsx */
import { React, type AllWidgetProps, jsx, getAppStore, UtilityManager, type UseUtility } from 'jimu-core'
import { JimuMapViewComponent, loadArcGISJSAPIModules, type JimuMapView } from 'jimu-arcgis'
import { getCurrentAddress, getMarkerGraphic, getMapLabelGraphic, getCurrentAddressFromW3wService, initializeW3wService } from './locator-utils'
import { getW3WStyle } from './lib/style'
import defaultMessages from './translations/default'
import { Button, Icon, Popper, Alert, Tooltip } from 'jimu-ui'
import { drawW3WGrid, clearGridLayer, initializeGridLayer, exportGeoJSON } from './grid-utils'
import gridIcon from '../assets/grid_red.svg'
import { debounce } from 'lodash'

const iconCopy = require('jimu-ui/lib/icons/duplicate.svg')
const iconZoom = require('jimu-ui/lib/icons/zoom-out-fixed.svg')
const iconExport = require('jimu-ui/lib/icons/export.svg')

interface State {
  w3wLocator: string
  JimuMapView: JimuMapView | null
  latitude: string
  longitude: string
  what3words: string | null
  isCopyMessageOpen: boolean
  isW3WGridEnabled: boolean
  currentZoomLevel: number
  isZoomInRange: boolean
  alertVisible: boolean
  gridLayerInitialized: boolean
  exportEnabled: boolean
}

export default class Widget extends React.PureComponent<AllWidgetProps<any>, State> {
  mapView: any
  private _isMounted: boolean
  private readonly isRTL: boolean
  private _clickHandle: __esri.Handle
  private _zoomHandle: __esri.WatchHandle
  private _extentHandle: __esri.WatchHandle
  zoomScale = 1000
  what3words: string
  _gridLayer: __esri.FeatureLayer | null = null

  // Reference for grid button
  private readonly gridButtonRef = React.createRef<HTMLButtonElement>()

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
      gridLayerInitialized: false,
      isW3WGridEnabled: false, // Add a toggle state for the W3W grid
      currentZoomLevel: null,
      isZoomInRange: false,
      alertVisible: false,
      exportEnabled: false
    }
    //check whether any utility selected in configuration in the new app
    if (this.props.config.addressSettings?.useUtilitiesGeocodeService?.length > 0) {
      this.updateGeocodeURL()
    }
  }

  getApiKey = (): string | null => {
    const apiKey = this.props.config?.addressSettings?.w3wApiKey

    if (!apiKey) {
      console.warn('API Key is missing. Please provide an API key in the settings.')
      return null
    }

    return apiKey
  }

  nls = (id: string) => {
    return this.props.intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] })
  }

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

  //get url from the selcted utility
  getUrlOfUseUtility = async (useUtility: UseUtility): Promise<string> => {
    if (!useUtility) {
      return Promise.resolve('')
    }
    return UtilityManager.getInstance().getUrlOfUseUtility(useUtility)
      .then((url) => {
        return Promise.resolve(url)
      })
  }

  onZoomClick = () => {
    if (this.mapView.graphics.length > 0) {
      const selectedLocationGraphic = this.mapView.graphics.getItemAt(0)
      this.mapView.goTo({
        center: selectedLocationGraphic.geometry,
        scale: this.zoomScale
      })
    }
  }

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

  onActiveViewChange = async (JimuMapView: JimuMapView) => {
    if (!JimuMapView) return
    this.mapView = JimuMapView.view

    // Monitor zoom changes
    this.mapView.watch('zoom', this.handleZoomChange)

    // Debug log to check API key presence
    const apiKey = this.getApiKey()
    if (!apiKey) {
      console.warn('API Key not yet available. Retrying...')
      setTimeout(() => { this.onActiveViewChange(JimuMapView) }, 500) // Retry after a delay
      return
    }

    // Initialize the grid layer
    if (!this._gridLayer) {
      console.log('Initializing grid layer...')
      this._gridLayer = await initializeGridLayer(this.mapView, apiKey)
      this.setState({ gridLayerInitialized: true })
    }

    // Monitor zoom and extent changes
    this._zoomHandle = this.mapView.watch('zoom', (zoomLevel: number) => {
      this.setState({ currentZoomLevel: zoomLevel }, this.updateGridVisibility)
    })
    this._extentHandle = this.mapView.watch(
      'extent',
      debounce(async () => {
        if (this.state.isW3WGridEnabled && this.isZoomLevelInRange()) {
          await drawW3WGrid(this.mapView)
        }
      }, 500)
    )

    // Handle map clicks
    if (this._clickHandle) {
      this._clickHandle.remove()
    }
    this._clickHandle = this.mapView.on('click', this.handleMapClick)
  }

  handleMapClick = async (mapClick: any) => {
    const widgetState = this.props.state || 'OPENED' // Add fallback
    const apiKey = this.getApiKey()
    if (!apiKey) return

    if (widgetState !== 'OPENED') {
      console.log('Widget is not active. Ignoring click.')
      return
    }

    if (!mapClick?.mapPoint) {
      console.error('Invalid map point:', mapClick)
      return
    }

    try {
      // Close existing popups and clear any graphics
      this.mapView.closePopup()
      this.clearGraphics()

      let mapPointWGS84 = mapClick.mapPoint

      // Handle projection if not in WGS84
      if (mapClick.mapPoint.spatialReference?.wkid !== 4326) {
        const [projection, SpatialReference] = await loadArcGISJSAPIModules([
          'esri/geometry/projection',
          'esri/geometry/SpatialReference'
        ])

        if (!projection.isLoaded()) {
          await projection.load()
        }

        const wgs84 = new SpatialReference({ wkid: 4326 })
        mapPointWGS84 = projection.project(mapClick.mapPoint, wgs84)

        if (!mapPointWGS84) {
          throw new Error('Failed to project map point to WGS84.')
        }
      }

      const latitude = mapPointWGS84.latitude || mapPointWGS84.y
      const longitude = mapPointWGS84.longitude || mapPointWGS84.x

      if (latitude === null || longitude === null) {
        throw new Error('Invalid latitude or longitude from mapPoint.')
      }

      this.setState({
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4)
      })

      // Fetch the W3W address
      const address =
        this.props.config.mode === 'apiKey'
          ? await getCurrentAddressFromW3wService(latitude, longitude)
          : await getCurrentAddress(this.state.w3wLocator, mapPointWGS84)
      console.log('W3W API Response:', address)

      if (typeof address !== 'object' || !address.square) {
        throw new Error('No address or square information returned from API')
      }

      this.setState({ what3words: address.words })

      // Add a marker and label
      const proximityFactor = 1
      const marker = await getMarkerGraphic(address.square, this.mapView, proximityFactor)
      const label = await getMapLabelGraphic(address.square, address.words)

      if (marker) {
        this.mapView.graphics.add(marker)
      }

      if (label) {
        this.mapView.graphics.add(label)
      }

      if (this.props.config.displayPopupMessage) {
        this.mapView.openPopup({
          title: 'what3words Address',
          content: `///${address.words}`,
          location: mapPointWGS84
        })
      }
    } catch (error) {
      console.error('Error handling map click:', error)

      if (this.props.config.displayPopupMessage) {
        this.mapView.openPopup({
          title: 'Error',
          content: 'Failed to retrieve what3words address.',
          location: mapClick.mapPoint
        })
      }
    }
  }

  componentDidMount () {
    console.log('Component did mount')
    const widgetState = this.props.state || 'OPENED' // Add fallback
    const apiKey = this.getApiKey()
    if (!apiKey) return

    // Initialize W3W service
    initializeW3wService(apiKey)

    if (widgetState === 'OPENED') {
      this.activateWidget()
    } else if (widgetState === 'CLOSED') {
      this.deactivateWidget()
    }

    if (this.mapView) {
      initializeGridLayer(this.mapView, apiKey)
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

    if (currentMode !== prevMode) {
      if (currentMode === 'locatorUrl') {
        this.setState({ isW3WGridEnabled: false })
        clearGridLayer()
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

  // Export the grid as GeoJSON
  exportGeoJSONHandler = async () => {
    if (!this._gridLayer || this._gridLayer.destroyed) {
      console.error('FeatureLayer is not initialized or has been destroyed. Cannot export GeoJSON.')
      return
    }

    try {
      // Verify if the FeatureLayer has any features
      const query = this._gridLayer.createQuery()
      query.where = '1=1' // Select all features
      const featureSet = await this._gridLayer.queryFeatures(query)

      if (!featureSet.features || featureSet.features.length === 0) {
        console.error('FeatureLayer has no features to export.')
        return
      }

      // Call the updated exportGeoJSON function
      await exportGeoJSON(this._gridLayer)
      console.log('GeoJSON export successful.')
    } catch (error) {
      console.error('Error exporting GeoJSON:', error)
    }
  }

  // Adjust grid visibility and synchronization with export button
  toggleGridVisibility = async () => {
    const { isW3WGridEnabled } = this.state
    const apiKey = this.getApiKey()
    if (!apiKey) {
      console.error('API Key is missing.')
      return
    }
    // Check if the FeatureLayer is destroyed
    if (this._gridLayer && this._gridLayer.destroyed) {
      console.warn('FeatureLayer was destroyed. Reinitializing...')
      this._gridLayer = null // Reset the reference
    }

    if (!this._gridLayer) {
      console.log('Initializing grid layer...')
      this._gridLayer = await initializeGridLayer(this.mapView, apiKey)
      this.setState({ gridLayerInitialized: true })
    }

    if (!isW3WGridEnabled) {
      console.log('Drawing grid...')
      await drawW3WGrid(this.mapView)
      // Check if features were successfully added
      const query = this._gridLayer.createQuery()
      query.where = '1=1'
      const featureSet = await this._gridLayer.queryFeatures(query)

      this.setState({
        isW3WGridEnabled: true,
        exportEnabled: featureSet.features.length > 0
      })
      console.log('Grid drawn successfully.')
    } else {
      console.log('Hiding grid...')
      this.setState({ isW3WGridEnabled: false })
      if (this._gridLayer) {
        await this._gridLayer.applyEdits({ deleteFeatures: this._gridLayer.source.toArray() }) // Clear the grid lines
      }
    }
  }

  // Update grid visibility based on zoom level
  updateGridVisibility = () => {
    const { isW3WGridEnabled } = this.state
    const apiKey = this.getApiKey()

    if (!apiKey || !isW3WGridEnabled) return

    if (!this.isZoomLevelInRange()) {
      this.setState({ alertVisible: true })
      return
    }

    try {
      drawW3WGrid(this.mapView)
    } catch (error) {
      console.error('Error updating W3W Grid:', error)
    }
  }

  // Check if the current zoom level is within the valid range
  isZoomLevelInRange = () => {
    const { currentZoomLevel } = this.state
    return currentZoomLevel >= 17 && currentZoomLevel <= 25
  }

  // Handle zoom level change
  handleZoomChange = () => {
    const isZoomInRange = this.isZoomLevelInRange()
    this.setState({ isZoomInRange })

    if (!isZoomInRange) {
      this.setState({ alertVisible: true })
    }
  }

  // Close the alert message
  handleAlertClose = () => {
    this.setState({ alertVisible: false })
  }

  // Deactivate the widget
  deactivateWidget = () => {
    console.log('Deactivating widget')
    if (this._gridLayer) {
      clearGridLayer()
    }
    // Clear the graphics layer
    this.clearGraphics()

    if (this.mapView) {
      if (this._clickHandle) {
        this._clickHandle.remove()
        this._clickHandle = null
      }
      this.mapView.popup.autoOpenEnabled = false
      this.mapView.graphics.removeAll()

      if (this.mapView.closePopup) {
        this.mapView.closePopup()
      }
    }

    // Reset the widget state
    this.resetWidgetState()
  }

  // Activate the widget
  activateWidget = () => {
    console.log('Activating widget')
    if (this.mapView) {
      this.mapView.popup.autoOpenEnabled = true

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

  componentWillUnmount = () => {
    console.log('Component did mount: initial state:', this.props.state)
    this._isMounted = false
    if (this._zoomHandle) this._zoomHandle.remove()
    if (this._extentHandle) this._extentHandle.remove()
    if (this._clickHandle) this._clickHandle.remove()
    // Remove and destroy the feature layer
    if (this._gridLayer) {
      if (this.mapView.map.findLayerById(this._gridLayer.id)) {
        this.mapView.map.remove(this._gridLayer)
      }
      this._gridLayer.destroy()
      this._gridLayer = null
    }
    this.clearGraphics()
    this.deactivateWidget() // Ensure all resources are cleaned up
  }

  resetWidgetState = () => {
    console.log('Resetting widget state...')
    this.setState({
      isW3WGridEnabled: false,
      latitude: '',
      longitude: '',
      what3words: null,
      isCopyMessageOpen: false,
      currentZoomLevel: null
    })
  }

  clearGraphics = () => {
    if (this.mapView) {
      this.mapView.graphics.removeAll()
    }
  }

  render () {
    const { what3words, latitude, longitude, isCopyMessageOpen, isW3WGridEnabled, isZoomInRange, alertVisible, exportEnabled } = this.state
    const { config, theme, useMapWidgetIds, id } = this.props
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
        <h5>what3words widget
          <span>
          {/* Alert for Zoom Out of Range */}
          {alertVisible && (
            <Alert
              type="info"
              text="Zoom level is out of range. The grid will not be updated."
              aria-live="polite"
              buttonType="tertiary"
              size="medium"
              form="tooltip"
              placement="right"
              showArrow={true}
            />
          )}
          </span>
        </h5>
        <JimuMapViewComponent
            useMapWidgetId={useMapWidgetIds[0]}
            onActiveViewChange={this.onActiveViewChange}
        />

        {/* Toggle Grid Button */}
        {isApiKeyMode && (
          <Tooltip title={isW3WGridEnabled ? 'Disabled Grid' : 'Enabled Grid'} placement="bottom" followCursor>
            <span>
              <Button
                ref={this.gridButtonRef}
                id="gridButton"
                type="tertiary"
                aria-label='Toggle Grid'
                title='Toggle Grid'
                icon
                size="sm"
                active={isW3WGridEnabled}
                aria-disabled={!isZoomInRange}
                disabled={!isZoomInRange}
                className={`toggle-grid-button float-right actionButton ${isW3WGridEnabled ? 'active' : ''} ${!isZoomInRange ? 'disabled' : ''}`}
                onClick={this.toggleGridVisibility}
              >
                <img src={gridIcon} alt="Grid Icon" width="17" />
              </Button>
            </span>
          </Tooltip>
        )}

        {/* Download Grid Button */}
        {isApiKeyMode && (
          <Tooltip title="Download Grid" placement="bottom" followCursor>
            <span>
                <Button
                type="tertiary"
                aria-label="Download Grid"
                title="Download Grid"
                icon
                size="sm"
                onClick={() => { this.exportGeoJSONHandler() }}
                className='float-right actionButton'
                disabled={!exportEnabled}
              >
                <Icon icon={iconExport} size="17" />
              </Button>
            </span>
          </Tooltip>
        )}

        {/* {!isApiKeyMode && <p>Grid functionality is disabled in Locator URL mode.</p>} */}

        {/* Copy Button */}
        {config.displayCopyButton && (
          <Button
            type="tertiary"
            aria-label={this.nls('copy')}
            title={this.nls('copy')}
            icon
            size="sm"
            aria-disabled={!what3words}
            className='float-right actionButton'
            active={isCopyMessageOpen}
            disabled={!what3words}
            id={'refCopy' + id}
            onClick={this.onCopyClick.bind(this)}
          >
            <Icon icon={iconCopy} size={'17'} />
          </Button>
        )}

        {/* Zoom Button */}
        {config.displayZoomButton && (
          <Button
            type="tertiary"
            aria-label={this.nls('zoomTo')}
            title={this.nls('zoomTo')}
            icon
            size="sm"
            aria-disabled={!what3words}
            className='float-right actionButton'
            onClick={this.onZoomClick.bind(this)}
            disabled={!what3words}
          >
            <Icon icon={iconZoom} size={'17'} />
          </Button>
        )}

        {/* what3words Block */}
        <h3 className="w3wBlock">
          <span className="w3wRed">///</span>
          {what3words}
        </h3>

        {/* Coordinates Block */}
        {config.displayCoordinates && (
          <div className="w3wCoords">
            <div className="w3wCoordsProp">
              <span className="w3wRed w3wCoordsFirstCol">{defaultMessages.y}:</span> {latitude}
            </div>
            <div className="w3wCoordsProp">
              <span className="w3wRed w3wCoordsFirstCol">{defaultMessages.x}:</span> {longitude}
            </div>
          </div>
        )}

        {/* Copy Message Popper */}
        {isCopyMessageOpen && (
          <Popper
            open={isCopyMessageOpen}
            version={0}
            placement={'bottom'}
            showArrow={true}
            reference={'refCopy' + id}
            offset={[0, 0]}>
            <div className="p-2">{this.nls('copySuccessMessage')}</div>
          </Popper>
        )}
      </div>
    )
  }
}
