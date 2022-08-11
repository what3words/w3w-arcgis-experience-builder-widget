/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx, IntlShape, urlUtils, ThemeVariables } from 'jimu-core'
import { AlertPopup, Button, Label, TextInput } from 'jimu-ui'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import { getAddressSettingsStyle, getAlertPopupStyle } from '../lib/style'
import defaultMessages from '../translations/default'
import Portal from 'esri/portal/Portal'
import { IMAddressSettings } from '../../config'

//regular expression for validating the geocode service url
const urlRegExString = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/

interface Props {
  intl: IntlShape
  theme: ThemeVariables
  portalSelf: Portal
  config: IMAddressSettings
  isRTL: boolean
  onAddressSettingsUpdated: (prop: string, value: string | number) => void
}

interface State {
  geocodeLocatorUrl: string
  updateGeocodeLocatorUrl: string
  isAlertPopupOpen: boolean
  isInvalidValue: boolean
}

export default class AddressSettings extends React.PureComponent<Props, State> {
  private readonly geocodeTextBox = React.createRef<HTMLInputElement>()
  constructor (props) {
    super(props)
    this.geocodeTextBox = React.createRef<HTMLInputElement>()

    let geocodeServiceUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'

    if (this.props.config && this.props.config.geocodeServiceUrl) {
      geocodeServiceUrl = this.props.config.geocodeServiceUrl
    } else if (this.props.portalSelf && this.props.portalSelf.helperServices &&
      this.props.portalSelf.helperServices.geocode &&
      this.props.portalSelf.helperServices.geocode.length > 0 &&
      this.props.portalSelf.helperServices.geocode[0].url) { //Use org's first geocode service if available
      geocodeServiceUrl = this.props.portalSelf.helperServices.geocode[0].url
    }

    this.state = {
      geocodeLocatorUrl: geocodeServiceUrl,
      updateGeocodeLocatorUrl: geocodeServiceUrl,
      isAlertPopupOpen: false,
      isInvalidValue: false
    }
  }

  nls = (id: string) => {
    return this.props.intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] })
  }

  componentDidMount = () => {
    //When using geocode service URL from helper services it was not getting updated in config
    //as we were updating service URL only on OK button click
    // so set geocodeServiceUrl from here it will be updated in config
    this.props.onAddressSettingsUpdated('geocodeServiceUrl', this.state.geocodeLocatorUrl)
  }

  onSetLocatorClicked = () => {
    this.setState({
      isAlertPopupOpen: true,
      isInvalidValue: false
    }, () => {
      setTimeout(() => {
        //for setting the cursor to the front of textbox
        const ua = window.jimuUA.browser ? (window.jimuUA.browser.name + '').toLowerCase() : ''
        if (ua === 'chrome' || ua === 'microsoft edge') {
          this.geocodeTextBox.current.selectionStart = this.geocodeTextBox.current.selectionEnd = 0
          this.geocodeTextBox.current.focus()
        } else {
          if (this.props.isRTL) {
            this.geocodeTextBox.current.focus()
          } else {
            this.geocodeTextBox.current.selectionStart = this.geocodeTextBox.current.selectionEnd = 0
            this.geocodeTextBox.current.focus()
          }
        }
      }, 1000)
    })
    setTimeout(() => {
      const currentValue = this.state.geocodeLocatorUrl
      this.setState({
        updateGeocodeLocatorUrl: currentValue
      })
    }, 500)
  }

  onAlertOkButtonClicked = () => {
    if (this.geocodeTextBox.current.value === '') {
      return
    }
    //Check if valid url is entered, if not then don't hide the Alert popup on ok button
    if (!this.state.isInvalidValue) {
      this.setState({
        geocodeLocatorUrl: this.geocodeTextBox.current.value
      })
      this.props.onAddressSettingsUpdated('geocodeServiceUrl', this.geocodeTextBox.current.value)

      this.onAlertCloseButtonClicked()
    }
  }

  onAlertCloseButtonClicked = () => {
    this.setState({
      isAlertPopupOpen: false
    })
  }

  onInputChange = (value: string) => {
    this.setState({
      updateGeocodeLocatorUrl: value
    })
    let isValid = false
    //validate the geocode service url on change of user input url
    this._validateGeocodeService().then((isValidGeocodeService) => {
      // console.log(isValidGeocodeService)
      if (!isValidGeocodeService) {
        isValid = false
      } else {
        isValid = true
      }
      this.setState({
        isInvalidValue: !isValid
      })
    })
  }

  _validateGeocodeService = async () => {
    if (this.geocodeTextBox.current.value && urlRegExString.test(this.geocodeTextBox.current.value)) {
      try {
        return await fetch(this.geocodeTextBox.current.value + '?f=json')
          .then(response => response.json())
          .then(response => {
            // console.log(response)
            // The ArcGIS locator URL when added returns a 403 code which means
            // message: "You do not have permissions to access this resource or perform this operation."
            // messageCode: "GWM_0003"
            // This part of the code needs to be reviewed
            if (response.error.code !== 403) {
              return false
            } else {
              return true
            }
          })
      } catch (error) {
        console.log('Error: ' + error.message)
        return false
      }
    } else {
      return false
    }
  }

  render () {
    return <div style={{ height: '100%', marginTop: '5px' }}>
      <div css={getAddressSettingsStyle(this.props.theme)}>
        <SettingRow>
          <Button role={'button'} aria-haspopup={'dialog'} className={'w-100 text-dark'} type={'primary'} onClick={this.onSetLocatorClicked.bind(this)} >
            {this.nls('locatorServiceLabel')}
          </Button>
        </SettingRow>

        <SettingRow className={'locator-url'}>
          <Label tabIndex={0} aria-label={this.state.geocodeLocatorUrl}>{this.state.geocodeLocatorUrl}</Label>
        </SettingRow>

        {/* Popup dialog for selecting the valid geocode service */}
        <AlertPopup isOpen={this.state.isAlertPopupOpen && !urlUtils.getAppIdPageIdFromUrl().pageId}
          css={getAlertPopupStyle(this.props.theme)}
          onClickOk={this.onAlertOkButtonClicked.bind(this)} onClickClose={this.onAlertCloseButtonClicked}
          title={this.props.intl ? this.nls('alertPopupTitle') : ''}>
          <div className={'popupContents'}>
            <div className={'alertValidationContent'}>
              <TextInput role={'textbox'} aria-label={this.state.geocodeLocatorUrl} required
                className={this.state.isInvalidValue ? 'locaterUrlTextInput w-100 is-invalid' : 'locaterUrlTextInput w-100 is-valid'}
                size={'sm'} type='text' ref={this.geocodeTextBox}
                value={this.state.updateGeocodeLocatorUrl}
                onChange={(evt: any) => this.onInputChange(evt.currentTarget.value)} />
              <div className={this.state.isInvalidValue ? 'invalidServiceURL locatorErrorMessage' : 'validServiceURL'}>
                {this.nls('invalidLocatorServiceURL')}
              </div>
            </div>
          </div>
        </AlertPopup>
      </div>
    </div>
  }
}
