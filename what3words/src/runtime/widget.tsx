/** @jsx jsx */
import { React, type AllWidgetProps, jsx, getAppStore, UtilityManager, type UseUtility } from 'jimu-core'
import { JimuMapViewComponent, loadArcGISJSAPIModules, type JimuMapView } from 'jimu-arcgis'
import { getCurrentAddress, getMarkerGraphic, getMapLabelGraphic, getCurrentAddressFromApiKey } from './locator-utils'
import { getW3WStyle } from './lib/style'
import defaultMessages from './translations/default'
import { Button, Icon, Popper } from 'jimu-ui'
import { drawW3WGrid, clearGridLayer, initializeGridLayer } from './grid-utils'
import gridIcon from '../assets/grid_red.svg'

const iconCopy = require('jimu-ui/lib/icons/duplicate.svg')
const iconZoom = require('jimu-ui/lib/icons/zoom-out-fixed.svg')

interface State {
  w3wLocator: string
  JimuMapView: JimuMapView | null
  latitude: string
  longitude: string
  what3words: string | null
  isCopyMessageOpen: boolean
  isW3WGridVisible: boolean
  currentZoomLevel: number
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

  constructor (props) {
    super(props)
    // let geocodeServiceURL = this.props.config?.addressSettings?.geocodeServiceUrl || ''

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
      isW3WGridVisible: false, // Add a toggle state for the W3W grid
      currentZoomLevel: null
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

  onActiveViewChange = (jmv: JimuMapView) => {
    if (!jmv) return

    this.mapView = jmv.view
    // Debug log to check API key presence
    const apiKey = this.getApiKey()

    if (!apiKey) {
      console.warn('API Key not yet available. Retrying...')
      setTimeout(() => { this.onActiveViewChange(jmv) }, 500) // Retry after a delay
      return
    }

    // Add zoom and extent handlers
    this._zoomHandle = this.mapView.watch('zoom', (zoomLevel: number) => {
      this.setState({ currentZoomLevel: zoomLevel }, this.updateGridVisibility)
    })

    this._extentHandle = this.mapView.watch('extent', () => {
      if (this.state.isW3WGridVisible && this.isZoomLevelInRange()) {
        drawW3WGrid(this.mapView, apiKey)
      }
    })

    console.log('Active view changed. MapView initialized:', !!this.mapView)

    // Remove any existing click handler before adding a new one
    if (this._clickHandle) {
      this._clickHandle.remove()
      this._clickHandle = null
    }

    // Store the click handler
    this._clickHandle = this.mapView.on('click', (mapClick: any) => {
      console.log('Map clicked at:', mapClick.mapPoint)
      this.handleMapClick(mapClick)
    })
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
      // Check if mapPoint contains valid spatialReference and coordinates
      console.log('mapPoint:', mapClick.mapPoint)
      this.mapView.closePopup()
      this.clearGraphics()

      let mapPointWGS84 = mapClick.mapPoint

      // Handle projection only if not in WGS84
      if (mapClick.mapPoint.spatialReference?.wkid !== 4326) {
        console.log('Projecting map point to WGS84...')
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

      // Extract latitude and longitude from WGS84 point
      const latitude = mapPointWGS84.latitude || mapPointWGS84.y
      const longitude = mapPointWGS84.longitude || mapPointWGS84.x

      if (latitude === null || longitude === null) {
        throw new Error('Invalid latitude or longitude from mapPoint.')
      }

      console.log('Latitude:', latitude, 'Longitude:', longitude)

      this.setState({
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4)
      })

      const address =
        this.props.config.mode === 'apiKey'
          ? await getCurrentAddressFromApiKey(apiKey, latitude, longitude)
          : await getCurrentAddress(this.state.w3wLocator, mapPointWGS84)

      console.log('Retrieved what3words address:', address)

      if (!address) {
        throw new Error('No address returned from API')
      }

      this.setState({ what3words: address })

      const marker = await getMarkerGraphic(mapPointWGS84)
      const label = await getMapLabelGraphic(mapPointWGS84, address)

      if (marker && label) {
        this.mapView.graphics.addMany([marker, label])
      } else {
        console.error('Failed to create graphics for map point:', mapPointWGS84)
      }

      if (this.props.config.displayPopupMessage) {
        this.mapView.openPopup({
          title: `Reverse geocode for ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          content: `what3words address: ///${address}`,
          location: mapPointWGS84
        })
      } else {
        console.log('Popup message display is toggled off in configuration.')
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

    if (widgetState === 'OPENED') {
      this.activateWidget()
    } else if (widgetState === 'CLOSED') {
      this.deactivateWidget()
    }

    if (this.mapView) {
      initializeGridLayer(this.mapView)
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
        this.setState({ isW3WGridVisible: false })
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

  // Toggle the W3W grid visibility
  toggleGridVisibility = async () => {
    const { isW3WGridVisible } = this.state
    const apiKey = this.getApiKey()
    if (!apiKey) return

    if (!this.isZoomLevelInRange()) {
      console.warn('Zoom level is out of range (17-25). Grid not displayed.')
      this.mapView.popup.open({
        title: 'Notice',
        content: 'Grid can only be displayed at zoom levels between 17 and 25.',
        location: this.mapView.center
      })
      return
    }

    if (!isW3WGridVisible) {
      this.setState({ isW3WGridVisible: true })
      try {
        await drawW3WGrid(this.mapView, apiKey)
      } catch (error) {
        console.error('Error drawing W3W Grid:', error)
        this.setState({ isW3WGridVisible: false }) // Revert state if grid drawing fails
      }
    } else {
      this.setState({ isW3WGridVisible: false })
      clearGridLayer()
    }
  }

  // Update grid visibility based on zoom level
  updateGridVisibility = () => {
    const { isW3WGridVisible } = this.state
    const apiKey = this.getApiKey()
    if (!apiKey) return

    if (isW3WGridVisible) {
      if (this.isZoomLevelInRange()) {
        try {
          drawW3WGrid(this.mapView, apiKey)
        } catch (error) {
          console.error('Error drawing W3W Grid during update:', error)
        }
      } else {
        console.warn('Zoom level is out of range (17-25). Clearing grid.')
        clearGridLayer()
      }
    }
  }

  isZoomLevelInRange = () => {
    const { currentZoomLevel } = this.state
    return currentZoomLevel >= 17 && currentZoomLevel <= 25
  }

  // Deactivate the widget
  deactivateWidget = () => {
    console.log('Deactivating widget')
    // Clear the grid layer and graphics
    clearGridLayer()
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
        console.log('Map clicked at:', mapClick.mapPoint)
        this.handleMapClick(mapClick)
      })
    }
  }

  componentWillUnmount = () => {
    console.log('Component did mount: initial state:', this.props.state)
    this._isMounted = false
    if (this._zoomHandle) this._zoomHandle.remove()
    if (this._extentHandle) this._extentHandle.remove()
    clearGridLayer()
    this.clearGraphics()
    this.deactivateWidget() // Ensure all resources are cleaned up
  }

  resetWidgetState = () => {
    console.log('Resetting widget state...')
    this.setState({
      isW3WGridVisible: false,
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
    const widgetState = this.props.state || 'OPENED' // Fallback to 'OPENED'
    console.log('Render state:', widgetState)
    const { what3words, latitude, longitude, isCopyMessageOpen, isW3WGridVisible } = this.state
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
        <h5>what3words widget</h5>

        <JimuMapViewComponent
            useMapWidgetId={useMapWidgetIds[0]}
            onActiveViewChange={this.onActiveViewChange}
        />

        {/* Toggle Grid Button */}
        {isApiKeyMode && (
          <Button
            type="tertiary"
            aria-label={this.nls('viewGrid')}
            title={this.nls('viewGrid')}
            icon
            size="sm"
            active={isW3WGridVisible}
            aria-disabled={!this.isZoomLevelInRange()}
            disabled={!this.isZoomLevelInRange()}
            className='float-right actionButton'
            onClick={this.toggleGridVisibility}
          >
            <img src={gridIcon} alt="Grid Icon" width="17" />
          </Button>
        )}

        {!isApiKeyMode && <p>Grid functionality is disabled in Locator URL mode.</p>}

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
