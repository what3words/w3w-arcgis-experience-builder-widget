/** @jsx jsx */
import { React, jsx, getAppStore } from 'jimu-core'
import { AllWidgetSettingProps } from 'jimu-for-builder'
import AddressSettings from './components/locator-settings'
import { MapWidgetSelector, SettingCollapse, SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import defaultMessages from './translations/default'

interface State {
  isAddressSettingsOpen: boolean
}

export default class Setting extends React.PureComponent<AllWidgetSettingProps<any>, any> {
  private readonly isRTL: boolean

  constructor (props) {
    super(props)
    this.state = {
      isAddressSettingsOpen: true
    }

    this.isRTL = false

    const appState = getAppStore().getState()
    this.isRTL = appState?.appContext?.isRTL
  }

  nls = (id: string) => {
    return this.props.intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] })
  }

  onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds: useMapWidgetIds
    })
  }

  onToggleAddressSettings = () => {
    this.setState({
      isAddressSettingsOpen: !this.state.isAddressSettingsOpen
    })
  }

  updateAddressSettings = (property: string, value: string | number) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['addressSettings', property], value)
    })
  }

  setW3wLocator = (w3wLocator: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('w3wLocator', w3wLocator)
    })
  }

  render () {
    return <div className="widget-what3words-setting">
      <SettingSection
          className="map-selector-section"
          title={this.props.intl.formatMessage({
            id: 'selectMapWidget',
            defaultMessage: defaultMessages.selectMapWidget
          })}>
          <SettingRow>
          <MapWidgetSelector
            useMapWidgetIds={this.props.useMapWidgetIds}
            onSelect={this.onMapWidgetSelected}
          />
          </SettingRow>
      </SettingSection>
      <SettingSection>
        <SettingCollapse
          defaultIsOpen
          label={this.nls('addressSettingsLabel')}
          isOpen={this.state.isAddressSettingsOpen}
          onRequestOpen={() => this.onToggleAddressSettings()}
          onRequestClose={() => this.onToggleAddressSettings()}>
          <SettingRow flow='wrap'>
            <AddressSettings
              intl={this.props.intl}
              theme={this.props.theme}
              portalSelf={this.props.portalSelf}
              config={this.props.config.addressSettings}
              isRTL={this.isRTL}
              onAddressSettingsUpdated={this.updateAddressSettings}
            />
          </SettingRow>
        </SettingCollapse>
      </SettingSection>
    </div>
  }
}
