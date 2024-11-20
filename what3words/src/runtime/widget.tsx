/** @jsx jsx */
import { React, type AllWidgetProps, jsx, getAppStore } from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import { getCurrentAddress, getMarkerGraphic, getMapLabelGraphic } from './locator-utils'
import { getW3WStyle } from './lib/style'
import defaultMessages from './translations/default'
import { Button, Icon, Popper } from 'jimu-ui'

const iconCopy = require('jimu-ui/lib/icons/duplicate.svg')
const iconZoom = require('jimu-ui/lib/icons/zoom-out-fixed.svg')

export default class Widget extends React.PureComponent<AllWidgetProps<any>, any> {
  mapView: any
  private _isMounted: boolean
  private readonly isRTL: boolean
  zoomScale = 5000
  what3words: string

  constructor (props) {
    super(props)
    let geocodeServiceURL = ''

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
      isCopyMessageOpen: false
    }
  }

  nls = (id: string) => {
    return this.props.intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] })
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

    console.log('Active view changed. MapView initialized:', !!this.mapView)

    // Attach the click listener
    this.mapView.on('click', (mapClick: any) => {
      console.log('Map clicked at:', mapClick.mapPoint) // Add log here
      this.handleMapClick(mapClick)
    })
  }

  handleMapClick = async (mapClick: any) => {
    const widgetState = this.props.state || 'OPENED' // Add fallback
    console.log('Handling map click at:', mapClick.mapPoint)
    console.log('Current widget state:', widgetState)

    if (widgetState !== 'OPENED') {
      console.log('Widget is not active. Ignoring click.')
      return
    }

    if (!mapClick?.mapPoint) {
      console.error('Invalid map point:', mapClick)
      return
    }

    try {
      // Close any existing popup
      this.mapView.closePopup()

      this.clearGraphics()

      const { latitude, longitude } = mapClick.mapPoint
      this.setState({
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4)
      })

      const address = await getCurrentAddress(this.state.w3wLocator, mapClick.mapPoint)
      console.log('Retrieved what3words address:', address)

      if (!address) {
        throw new Error('No address returned from API')
      }

      this.setState({ what3words: address })

      const marker = await getMarkerGraphic(mapClick.mapPoint)
      const label = await getMapLabelGraphic(mapClick.mapPoint, address)

      if (marker && label) {
        this.mapView.graphics.addMany([marker, label])
      } else {
        console.error('Failed to create graphics for map point:', mapClick.mapPoint)
      }

      // Conditionally open the popup based on displayPopupMessage toggle
      if (this.props.config.displayPopupMessage) {
        this.mapView.openPopup({
          title: `Reverse geocode for ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          content: `what3words address: ///${address}`,
          location: mapClick.mapPoint
        })
      } else {
        console.log('Popup message display is toggled off in configuration.')
      }
    } catch (error) {
      console.error('Error handling map click:', error)

      // Optionally handle error but avoid unnecessary popup display
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
    console.log('Component mounted with state:', widgetState)

    if (widgetState === 'OPENED') {
      this.activateWidget()
    } else if (widgetState === 'CLOSED') {
      this.deactivateWidget()
    }
  }

  componentDidUpdate (prevProps) {
    const prevState = prevProps.state || 'OPENED'
    const currentState = this.props.state || 'OPENED'
    console.log('Component did update: previous state:', prevState, 'current state:', currentState)

    if (prevState !== currentState) {
      if (currentState === 'CLOSED') {
        console.log('[Widget] Deactivating...')
        this.deactivateWidget()
      } else if (currentState === 'OPENED') {
        console.log('[Widget] Activating...')
        this.activateWidget()
      }
    }
  }

  deactivateWidget = () => {
    console.log('Deactivating widget')
    // Clear graphics from the map view
    this.clearGraphics()

    // Disable map click events
    if (this.mapView) {
      this.mapView.popup.autoOpenEnabled = false
      this.mapView.graphics.removeAll()

      // Optionally remove any event listeners you added
      this.mapView.on('click', null) // Remove click listener
    }
  }

  activateWidget = () => {
    console.log('Activating widget')
    if (this.mapView) {
      this.mapView.popup.autoOpenEnabled = false
      this.mapView.closePopup()
    }
  }

  componentWillUnmount = () => {
    console.log('Component did mount: initial state:', this.props.state)
    this._isMounted = false
    this.deactivateWidget() // Ensure all resources are cleaned up
  }

  resetWidgetState = () => {
    this.setState({ latitude: '', longitude: '', what3words: '' })
    this.clearGraphics()
  }

  clearGraphics = () => {
    if (this.mapView) {
      this.mapView.graphics.removeAll()
    }
  }

  render () {
    console.log('Render props:', this.props)
    const widgetState = this.props.state || 'OPENED' // Fallback to 'OPENED'
    console.log('Render state:', widgetState)

    const { config, theme, useMapWidgetIds, id } = this.props
    const { what3words, latitude, longitude, isCopyMessageOpen } = this.state

    return (
      <div css={getW3WStyle(theme)} className="widget-starter jimu-widget">
        <h5>Reverse Geocode with your what3words locator</h5>

        {useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent
            useMapWidgetId={useMapWidgetIds[0]}
            onActiveViewChange={this.onActiveViewChange}
          />
        )}
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
        <h3 className="w3wBlock">
          <span className="w3wRed">///</span>
          {what3words}
        </h3>

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
