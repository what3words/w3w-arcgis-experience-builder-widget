/** @jsx jsx */
import { React, AllWidgetProps, jsx } from 'jimu-core'
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'
import Point from 'esri/geometry/Point'
import { getCurrentAddress } from './addlocator'

export default class Widget extends React.PureComponent<AllWidgetProps<any>, any> {
  constructor (props) {
    super(props)
    const geocodeServiceURL = this.props.config.w3wLocator

    this.state = {
      w3wLocator: geocodeServiceURL,
      JimuMapView: null,
      latitude: '',
      longitude: '',
      what3words: ''
    }
  }

  componentDidMount () {
    console.log('Component did mount')
  }

  activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      this.setState({
        jimuMapView: jmv
      })
      this.setState({
        w3wLocator: this.props.config.w3wLocator
      })
      jmv.view.on('click', (mapClick) => {
        const point: Point = this.state.jimuMapView.view.toMap({
          x: mapClick.x,
          y: mapClick.y
        })
        this.setState({
          latitude: point.latitude.toFixed(4),
          longitude: point.longitude.toFixed(4)
        })
        getCurrentAddress(this.state.w3wLocator, mapClick.mapPoint).then(res => {
          this.setState({
            what3words: res
          })
        })
      })
    }
  }

  componentDidUpdate (prevPops) {
    console.log('Component did update')
    //check for the updated geocode service url in config
  }

  render () {
    return <div className="widget-starter jimu-widget">
      <p>This is the starter widget area</p>
      {this.props.hasOwnProperty('useMapWidgetIds') &&
        this.props.useMapWidgetIds &&
        this.props.useMapWidgetIds[0] && (
          <JimuMapViewComponent
            useMapWidgetId={this.props.useMapWidgetIds?.[0]}
            onActiveViewChange={this.activeViewChangeHandler}
          />
      )}
      <p>Lat/Lon: {this.state.latitude} {this.state.longitude}</p>
      <p>What3words address: {this.state.what3words}</p>
    </div>
  }
}
