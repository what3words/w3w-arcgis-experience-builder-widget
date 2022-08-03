/** @jsx jsx */
import { React, AllWidgetProps, jsx } from 'jimu-core'
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'
import Point from 'esri/geometry/Point'
import { getCurrentAddress, getMarkerGraphic } from './addlocator'

export default class Widget extends React.PureComponent<AllWidgetProps<any>, any> {
  mapView: any

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
      this.mapView = jmv.view
      this.setState({
        jimuMapView: jmv
      })
      this.setState({
        w3wLocator: this.props.config.w3wLocator
      })
      this.mapView.on('click', async (mapClick) => {
        this.mapView.graphics.removeAll()
        const graphic = await getMarkerGraphic(mapClick.mapPoint)
        const latitude = Math.round(mapClick.mapPoint.latitude * 1000) / 1000
        const longitude = Math.round(mapClick.mapPoint.longitude * 1000) / 1000
        const point: Point = this.state.jimuMapView.view.toMap({
          x: longitude,
          y: latitude
        })
        this.setState({
          latitude: point.latitude.toFixed(4),
          longitude: point.longitude.toFixed(4)
        })
        this.mapView.popup.open({
          // Set the popup's title to the coordinates of the location
          title: 'Reverse geocode: [' + longitude + ', ' + latitude + ']',
          location: mapClick.mapPoint // Set the location of the popup to the clicked location
        })
        console.log(this.mapView.popup.title)

        getCurrentAddress(this.state.w3wLocator, mapClick.mapPoint).then(response => {
          this.setState({
            what3words: response
          })
          this.mapView.popup.content = 'what3words address: ///' + response
          console.log(this.mapView.popup.content)
          this.mapView.graphics.add(graphic)
        }).catch((error) => {
          console.log('error: ' + error)
          // If the promise fails and no result is found, show a generic message
          this.mapView.popup.content = 'No address was found for this location'
          this.mapView.graphics.removeAll()
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
