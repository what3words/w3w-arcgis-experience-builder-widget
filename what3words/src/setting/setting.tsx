/** @jsx jsx */
import { React, jsx, getAppStore, FormattedMessage, type ImmutableArray, type UseUtility } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import AddressSettings from './components/locator-settings'
import {
  MapWidgetSelector,
  SettingRow,
  SettingSection
} from 'jimu-ui/advanced/setting-components'
import defaultMessages from './translations/default'
import { getWidgetDisplayOptionsStyle } from './lib/style'
import { Switch, CollapsablePanel, TextInput, Radio } from 'jimu-ui'

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
    this.setState({
      isAddressSettingsOpen: !this.state.isAddressSettingsOpen
    })
  }

  /** Handle mode change */
  handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const mode = event.target.value
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('mode', mode) // Update mode
    })
  }

  /** Handle input changes for API key and Locator URL */
  handleInputChange = (property: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const newConfig = this.props.config.setIn(['addressSettings', property], event.target.value)
    console.log('Updated config:', newConfig)
    this.props.onSettingChange({
      id: this.props.id,
      config: newConfig
    })
  }

  /** Update address settings */
  updateAddressSettings = (property: string, value: string | number | ImmutableArray<UseUtility> | [] | boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['addressSettings', property], value)
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
            <MapWidgetSelector
            useMapWidgetIds={useMapWidgetIds}
            onSelect={this.onMapWidgetSelected}
          />
          </SettingRow>
        </SettingSection>

        {/* Mode Selector Section */}
        <SettingSection title="Mode Selection">
          <SettingRow flow="wrap">
            <Radio
              value="apiKey"
              checked={config?.mode === 'apiKey'}
              onChange={this.handleModeChange}
            />
            <label>Use API Key</label>
          </SettingRow>
          <SettingRow>
            <Radio
              value="locatorUrl"
              checked={config?.mode === 'locatorUrl'}
              onChange={this.handleModeChange}
            />
            <label>Use Locator URL</label>
          </SettingRow>
        </SettingSection>

        {/* API Key Section */}
        {config?.mode === 'apiKey' && (
          <SettingSection title="API Key">
            <SettingRow flow="wrap">
              <TextInput
                className="w-100"
                placeholder="Enter your what3words API key"
                value={config?.addressSettings?.w3wApiKey || ''}
                onChange={(e) => { this.handleInputChange('w3wApiKey', e) }}
              />
            </SettingRow>
          </SettingSection>
        )}

        {/* Address Settings Section */}
        {config?.mode === 'locatorUrl' && (
          <SettingSection>
            <CollapsablePanel
              defaultIsOpen
              label={this.nls('addressSettingsLabel')}
              isOpen={this.state.isAddressSettingsOpen}
              onRequestOpen={this.onToggleAddressSettings}
              onRequestClose={this.onToggleAddressSettings}
            >
              <SettingRow flow="wrap" className="w-100">
                <AddressSettings
                  intl={intl}
                  theme={theme}
                  portalSelf={this.props.portalSelf}
                  config={config?.addressSettings || {}} // Fallback to empty object
                  isRTL={this.isRTL}
                  onAddressSettingsUpdated={this.updateAddressSettings}
                />
              </SettingRow>
            </CollapsablePanel>
          </SettingSection>
        )}

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
                    onChange={(event) => {
                      this.props.onSettingChange({
                        id: this.props.id,
                        config: this.props.config.set(key, event.currentTarget.checked)
                      })
                    }}
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
