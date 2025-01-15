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
  apiKeyError: boolean
}

export default class Setting extends React.PureComponent<
AllWidgetSettingProps<IMConfig>,
State
> {
  private readonly isRTL: boolean
  private readonly exbVersion: string

  constructor (props: AllWidgetSettingProps<IMConfig>) {
    super(props)
    this.state = {
      isAddressSettingsOpen: true,
      languages: [],
      tempApiKey:
        this.props.config.mode === 'apiKey' ? this.props.config.w3wApiKey : '',
      apiKeyError: false
    }

    const appState = getAppStore().getState()
    this.isRTL = appState?.appContext?.isRTL || false // Default to false if undefined
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
    this.fetchLanguages()
  }

  /** Fetch available languages using the saved API key */
  async fetchLanguages () {
    if (this.props.config.mode !== 'apiKey') {
      console.warn('API key is not used. Skipping language fetch.')
      return
    }
    const apiKey = this.props.config.w3wApiKey
    try {
      const languages = await fetchAvailableLanguages({
        apiKey,
        exbVersion: this.exbVersion
      })
      this.setState({ languages })
    } catch (error) {
      console.error('Error fetching languages:', error)
    }
  }

  setW3wApiKey = async (w3wApiKey: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['w3wApiKey'], w3wApiKey)
    })

    try {
      await this.fetchLanguages() // Fetch languages after the API key is saved
    } catch (error) {
      console.error(
        'Error fetching languages with the updated API key:',
        error
      )
    }
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
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('mode', mode) // Update mode
    })
  }

  /** Save the API key and fetch languages */
  handleApiKeySave = async () => {
    const { tempApiKey } = this.state

    // If API key is empty, clear languages and update the configuration
    if (!tempApiKey.trim()) {
      console.warn('API Key is empty. Clearing languages.')
      this.setState({ languages: [], apiKeyError: false }) // Clear languages and reset error
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.setIn(['w3wApiKey'], '')
      })
      return
    }

    // Save the API key to the configuration
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['w3wApiKey'], tempApiKey)
    })

    // Fetch languages directly using the temporary API key
    try {
      const languages = await fetchAvailableLanguages({
        apiKey: tempApiKey,
        exbVersion: this.exbVersion
      })
      this.setState({ languages, apiKeyError: false }) // Clear error if successful
    } catch (error) {
      console.error('Error fetching languages with the saved API key:', error)
      this.setState({ languages: [], apiKeyError: true }) // Set error and clear languages
    }
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
      config: this.props.config.setIn([property], value)
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
            {/* Show message when dropdown is disabled */}
            {(!this.state.languages || this.state.languages.length === 0) && (
              <SettingRow className="no-languages-message">
                <p style={{ color: 'inherit', fontSize: '14px' }}>
                  {' '}
                  {/* Error-like styling */}
                  No languages available. Enter a valid API key.
                </p>
              </SettingRow>
            )}
            {/* Show error message if API key is invalid */}
            {this.state.apiKeyError && (
              <SettingRow className="api-key-error">
                <p style={{ color: 'inherit', fontSize: '14px' }}>
                  Invalid API key. Please enter a valid key and try again.
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
                  config={config} // Fallback to empty object
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
