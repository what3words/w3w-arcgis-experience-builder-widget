/** @jsx jsx */
import { React, jsx } from 'jimu-core'
import { AllWidgetSettingProps } from 'jimu-for-builder'
import { TextInput } from 'jimu-ui'
import { MapWidgetSelector, SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import defaultMessages from './translations/default'

export default class Setting extends React.PureComponent<AllWidgetSettingProps<any>, any> {
  onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds: useMapWidgetIds
    })
  }

  setW3wLocator = (w3wLocator: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('w3wLocator', w3wLocator)
    })
  }

  render () {
    return <div className="widget-setting-demo">
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
      <SettingSection
          className="map-selector-section"
          title={this.props.intl.formatMessage({
            id: 'w3wLocator',
            defaultMessage: defaultMessages.w3wLocator
          })}>
          <SettingRow>
            <TextInput
                type="url"
                allowClear
                placeholder={defaultMessages.w3wLocator}
                defaultValue={this.props.config.w3wLocator}
                onAcceptValue={this.setW3wLocator}
            />
          </SettingRow>
        </SettingSection>
    </div>
  }
}
