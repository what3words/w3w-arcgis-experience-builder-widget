/** @jsx jsx */
import { React, AllWidgetProps, jsx, getAppStore } from 'jimu-core'
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'
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

  componentDidMount () {
    console.log('Component did mount')
    this._isMounted = true
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

    this.setState({
      jimuMapView: jmv
    })
    this.setState({
      w3wLocator: this.state.w3wLocator
    })
    this.mapView.on('click', async (mapClick: any) => {
      this.mapView.graphics.removeAll()
      this.mapView.popup.autoOpenEnabled = false
      const graphic = await getMarkerGraphic(mapClick.mapPoint)
      this.setState({
        latitude: mapClick.mapPoint.latitude.toFixed(4),
        longitude: mapClick.mapPoint.longitude.toFixed(4)
      })
      // eslint-disable-next-line no-lone-blocks
      { this.props.config.displayPopupMessage &&
      this.mapView.popup.open({
        title: 'Reverse geocode for ' + `${this.state.latitude}, ${this.state.longitude}`,
        location: mapClick.mapPoint
      })
      }
      getCurrentAddress(this.state.w3wLocator, mapClick.mapPoint).then(async response => {
        this.setState({
          what3words: response
        })
        const mapLabel = await getMapLabelGraphic(mapClick.mapPoint, response)
        this.mapView.popup.content = 'what3words address: ' + `///${response}`
        this.mapView.graphics.add(graphic)
        this.mapView.graphics.add(mapLabel)
        this.mapView.set({ center: mapClick.mapPoint }) // center to the point
      }).catch((error) => {
        console.log('error: ' + error)
        this.mapView.popup.content = 'No address was found for this location'
        this.mapView.graphics.removeAll()
      })
    })
  }

  componentDidUpdate (prevProps) {
    console.log('Component did update')
    //check for the updated geocode service url in config
    if (prevProps.config.addressSettings?.geocodeServiceUrl !== this.props.config.addressSettings?.geocodeServiceUrl) {
      this.setState({
        w3wLocator: this.props.config.addressSettings.geocodeServiceUrl
      })
    }
  }

  componentWillUnmount = () => {
    console.log('Component will unmount')
    this._isMounted = false
    this.mapView.graphics.removeAll()
  }

  render () {
    return <div css={getW3WStyle(this.props.theme)} className="widget-starter jimu-widget">
      <h5>Reverse Geocode with your what3words locator</h5>
      {{}.hasOwnProperty.call(this.props, 'useMapWidgetIds') &&
        this.props.useMapWidgetIds &&
        this.props.useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent
            useMapWidgetId={this.props.useMapWidgetIds?.[0]}
            onActiveViewChange={this.onActiveViewChange}
          ></JimuMapViewComponent>
      )}
      {this.props.config.displayCopyButton &&
      <Button type='tertiary' aria-label={this.nls('copy')} aria-disabled={!this.state.what3words} title={this.nls('copy')} className='float-right actionButton' icon size={'sm'}
        active={this.state.isCopyMessageOpen} disabled={!this.state.what3words} id={'refCopy' + this.props.id} onClick={this.onCopyClick.bind(this)}>
        <Icon icon={iconCopy} size={'17'}></Icon>
      </Button>
      }
      {this.props.config.displayZoomButton &&
      <Button type='tertiary' aria-label={this.nls('zoomTo')} aria-disabled={!this.state.what3words} title={this.nls('zoomTo')} className='float-right actionButton' icon size={'sm'}
       onClick={this.onZoomClick.bind(this)} disabled={!this.state.what3words}>
        <Icon icon={iconZoom} size={'17'}></Icon>
       </Button>
      }
      <h3 className="w3wBlock">
          <span className='w3wRed'>///</span>{this.state.what3words}
      </h3>
      {this.props.config.displayCoordinates &&
      <div className="w3wCoords">
        <div className="w3wCoordsProp"><span className='w3wRed w3wCoordsFirstCol'>{defaultMessages.y}:</span><span>{this.state.latitude}</span></div>
        <div className="w3wCoordsProp"><span className='w3wRed w3wCoordsFirstCol'>{defaultMessages.x}:</span><span>{this.state.longitude}</span></div>
      </div>
      }
      {/* Copy message toast popper */}
      {this.state.isCopyMessageOpen &&
        <Popper
          open={this.state.isCopyMessageOpen}
          version={0}
          placement={'bottom'}
          showArrow={true}
          reference={'refCopy' + this.props.id}
          offset={[0, 0]}>
          <div className={'p-2'}>{this.nls('copySuccessMessage')}</div>
        </Popper>
      }
    </div>
  }
}
