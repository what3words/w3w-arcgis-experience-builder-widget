/** @jsx jsx */
import {
  React,
  jsx,
  getAppStore,
  FormattedMessage,
  type ImmutableArray,
  type UseUtility
} from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import AddressSettings from './components/locator-settings'
import {
  MapWidgetSelector,
  SettingRow,
  SettingSection
} from 'jimu-ui/advanced/setting-components'
import defaultMessages from './translations/default'
import { getWidgetDisplayOptionsStyle } from './lib/style'
import {
  Switch,
  CollapsablePanel,
  TextInput,
  Radio,
  Select,
  Option
} from 'jimu-ui'
import {
  type AvailableLanguage,
  fetchAvailableLanguages
} from '../lib/w3w'
import { type IMConfig } from '../config'

interface State {
  isAddressSettingsOpen: boolean
  languages: AvailableLanguage[]
  tempApiKey: string
  apiError: string
}

export default class Setting extends React.PureComponent<
AllWidgetSettingProps<IMConfig>,
State
> {
  private readonly isRTL: boolean
  private readonly widgetVersion: string
  private readonly exbVersion: string

  constructor (props: AllWidgetSettingProps<IMConfig>) {
    super(props)
    this.state = {
      isAddressSettingsOpen: true,
      languages: [],
      tempApiKey:
        this.props.config.mode === 'apiKey' ? this.props.config.w3wApiKey : '',
      apiError: null
    }

    const appState = getAppStore().getState()
    this.isRTL = appState?.appContext?.isRTL || false // Default to false if undefined
    this.widgetVersion = appState?.appConfig?.widgets?.[this.props.widgetId]?.manifest?.version || 'Unknown'
    this.exbVersion = appState?.appConfig?.exbVersion || 'Unknown'
  }

  /** Localize strings */
  nls = (id: string) => {
    return this.props.intl.formatMessage({
      id,
      defaultMessage: defaultMessages[id]
    })
  }

  componentDidMount () {
    this.props.config.mode === 'apiKey' && this.fetchLanguages(this.props.config.w3wApiKey)
  }

  /** Fetch available languages using the saved API key */
  async fetchLanguages (apiKey: string) {
    const { widgetVersion, exbVersion } = this
    const languages = await fetchAvailableLanguages({
      apiKey,
      widgetVersion,
      exbVersion
    }).catch((error) => {
      console.error('Error fetching languages:', error)
      this.setState({ apiError: error.message })
      this.props.onSettingChange({
        id: this.props.id,
        // Only set w3wApiKey with a valid value downstream
        config: this.props.config.set('w3wApiKey', '')
      })
      return []
    })
    this.setState({ languages })
  }

  setW3wLanguage = (w3wLanguage: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('w3wLanguage', w3wLanguage)
    })
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
    let config = this.props.config.set('mode', mode)
    if (config.mode === 'apiKey') {
      // Reset the API key if the mode is changed to API key
      const tempApiKey = config.w3wApiKey
      this.setState({ tempApiKey })
    }
    if (config.mode === 'locatorUrl') {
      // Clear the geocode service URL if the mode is changed to locator URL mode
      config = config.set('useUtilitiesGeocodeService', [])
    }
    this.props.onSettingChange({
      id: this.props.id,
      config
    })
  }

  /** Save the API key and fetch languages */
  handleApiKeySave = async () => {
    const { tempApiKey } = this.state
    // Reset error
    this.setState({ apiError: null })
    // If API key is empty, clear languages and update the configuration
    if (!tempApiKey.trim()) {
      console.warn('API Key is empty. Clearing languages.')
      this.setState({ languages: [], apiError: 'Enter a valid API Key' })
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('w3wApiKey', '')
      })
      return
    }

    // Save the API key to the configuration
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('w3wApiKey', tempApiKey)
    })
    await this.fetchLanguages(tempApiKey)
  }

  /** Handle input changes for the temporary API key */
  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tempApiKey = event.target.value
    this.setState({ tempApiKey }) // Update the temporary API key
  }

  /** Update address settings */
  updateAddressSettings = (
    property: string,
    value: string | number | ImmutableArray<UseUtility> | [] | boolean
  ) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(property, value)
    })
  }

  render () {
    const { theme, config, useMapWidgetIds, intl } = this.props
    const { tempApiKey } = this.state

    return (
      <div
        css={getWidgetDisplayOptionsStyle(theme)}
        className="widget-what3words-setting"
      >
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
              checked={config.mode === 'apiKey'}
              onChange={this.handleModeChange}
            />
            <label>Use API Key</label>
          </SettingRow>
          <SettingRow>
            <Radio
              value="locatorUrl"
              checked={config.mode === 'locatorUrl'}
              onChange={this.handleModeChange}
            />
            <label>Use Locator URL</label>
          </SettingRow>
        </SettingSection>

        {/* API Key Section */}
        {config.mode === 'apiKey' && (
          <SettingSection title="API Key">
            <SettingRow flow="wrap" className="api-key-input-row">
              <TextInput
                className="w-100"
                placeholder="Enter your what3words API key"
                value={tempApiKey}
                onChange={this.handleInputChange}
              />
              <button
                className="btn btn-primary w-100"
                onClick={this.handleApiKeySave}
              >
                Save
              </button>
            </SettingRow>
          </SettingSection>
        )}

        {/* Language Dropdown */}
        {config.mode === 'apiKey' && (
          <SettingSection title="Select Language">
            <SettingRow className="lang-dropdown">
              <Select
                className="lang-select"
                value={config.w3wLanguage || 'en'}
                onChange={(e: any) => {
                  this.setW3wLanguage(e.target.value)
                }}
                disabled={!this.state.languages || this.state.languages.length === 0}
                placeholder="Select a language"
              >
                {this.state.languages?.map((language) => (
                  <Option key={language.code} value={language.code}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: 'auto'
                      }}
                    >
                      <strong>{language.nativeName}</strong>
                      <small>{`${language.name} (${language.code})`}</small>
                    </div>
                  </Option>
                ))}
              </Select>
            </SettingRow>
            {/* Show error message */}
            {this.state.apiError && (
              <SettingRow className="api-key-error">
                <p style={{ color: 'inherit', fontSize: '14px' }}>
                  {this.state.apiError}. Please try again.
                </p>
              </SettingRow>
            )}
          </SettingSection>
        )}

        {/* Address Settings Section */}
        {config.mode === 'locatorUrl' && (
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
                  config={config}
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
            ...(config.mode === 'apiKey'
              ? [{ key: 'displayNearestPlace', label: 'displayNearestPlace' }]
              : []),
            { key: 'displayCopyButton', label: 'displayCopyButton' },
            { key: 'displayMapsiteButton', label: 'displayMapsiteButton' },
            { key: 'displayMapAnnotation', label: 'displayMapAnnotation' }
          ].map(({ key, label }) => (
            <SettingRow key={key}>
              <div className="w-100">
                <div className="checkbox-row">
                  <Switch
                    checked={config?.[key] || false}
                    onChange={(event) => {
                      this.props.onSettingChange({
                        id: this.props.id,
                        config: this.props.config.set(
                          key,
                          event.currentTarget.checked
                        )
                      })
                    }}
                  />
                  <label>
                    <FormattedMessage
                      id={label}
                      defaultMessage={defaultMessages[label]}
                    />
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
