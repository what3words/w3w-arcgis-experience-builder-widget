/** @jsx jsx */
import { React, jsx, getAppStore, FormattedMessage } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import AddressSettings from './components/locator-settings'
import {
  MapWidgetSelector,
  SettingCollapse,
  SettingRow,
  SettingSection
} from 'jimu-ui/advanced/setting-components'
import defaultMessages from './translations/default'
import { getWidgetDisplayOptionsStyle } from './lib/style'
import { Switch } from 'jimu-ui'

interface State {
  isAddressSettingsOpen: boolean
}

export default class Setting extends React.PureComponent<AllWidgetSettingProps<any>, State> {
  private readonly isRTL: boolean

  constructor (props) {
    super(props)
    this.state = {
      isAddressSettingsOpen: true
    }

    const appState = getAppStore().getState()
    this.isRTL = appState?.appContext?.isRTL || false // Default to false if undefined
  }

  /** Localize strings */
  nls = (id: string) => {
    return this.props.intl.formatMessage({ id, defaultMessage: defaultMessages[id] })
  }

  /** Handle map widget selection */
  onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds
    })
  }

  /** Toggle address settings panel */
  onToggleAddressSettings = () => {
    this.setState((prevState) => ({
      isAddressSettingsOpen: !prevState.isAddressSettingsOpen
    }))
  }

  /** Update address settings */
  updateAddressSettings = (property: string, value: string | number) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['addressSettings', property], value)
    })
  }

  /** Set what3words locator URL */
  setW3wLocator = (w3wLocator: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('w3wLocator', w3wLocator)
    })
  }

  /** Toggle display options */
  switchDisplayOption = (key: string, event: React.FormEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(key, event.currentTarget.checked)
    })
  }

  render () {
    const { theme, config, useMapWidgetIds, intl } = this.props

    return (
      <div css={getWidgetDisplayOptionsStyle(theme)} className="widget-what3words-setting">
        {/* Map Widget Selector Section */}
        <SettingSection
          className="map-selector-section"
          title={intl.formatMessage({
            id: 'selectMapWidget',
            defaultMessage: defaultMessages.selectMapWidget
          })}
        >
          <SettingRow>
            <MapWidgetSelector useMapWidgetIds={useMapWidgetIds} onSelect={this.onMapWidgetSelected} />
          </SettingRow>
        </SettingSection>

        {/* Address Settings Section */}
        <SettingSection>
          <SettingCollapse
            defaultIsOpen
            label={this.nls('addressSettingsLabel')}
            isOpen={this.state.isAddressSettingsOpen}
            onRequestOpen={this.onToggleAddressSettings}
            onRequestClose={this.onToggleAddressSettings}
          >
            <SettingRow flow="wrap">
              <AddressSettings
                intl={intl}
                theme={theme}
                portalSelf={this.props.portalSelf}
                config={config?.addressSettings || {}} // Fallback to empty object
                isRTL={this.isRTL}
                onAddressSettingsUpdated={this.updateAddressSettings}
              />
            </SettingRow>
          </SettingCollapse>
        </SettingSection>

        {/* Widget Display Options Section */}
        <SettingSection
          className="map-selector-section"
          title={intl.formatMessage({
            id: 'widgetDisplayOptions',
            defaultMessage: defaultMessages.widgetDisplayOptions
          })}
        >
          {[
            { key: 'displayCoordinates', label: 'displayCoordinates' },
            { key: 'displayCopyButton', label: 'displayCopyButton' },
            { key: 'displayZoomButton', label: 'displayZoomButton' },
            { key: 'displayPopupMessage', label: 'displayPopupMessage' }
          ].map(({ key, label }) => (
            <SettingRow key={key}>
              <div className="w-100">
                <div className="checkbox-row">
                  <Switch
                    checked={config?.[key] || false}
                    onChange={(event) => { this.switchDisplayOption(key, event) }}
                  />
                  <label>
                    <FormattedMessage id={label} defaultMessage={defaultMessages[label]} />
                  </label>
                </div>
              </div>
            </SettingRow>
          ))}
        </SettingSection>
      </div>
    )
  }
}
