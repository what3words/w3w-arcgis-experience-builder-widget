/** @jsx jsx */ // <-- make sure to include the jsx pragma
import {
  React,
  jsx,
  type IntlShape,
  type IMThemeVariables,
  Immutable,
  type UseUtility,
  SupportedUtilityType,
  type ImmutableArray,
} from 'jimu-core';
import { Label, Icon, Tooltip } from 'jimu-ui';
import { UtilitySelector } from 'jimu-ui/advanced/utility-selector';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { getAddressSettingsStyle } from '../lib/style';
import defaultMessages from '../translations/default';
import type Portal from 'esri/portal/Portal';
import type { IMConfig } from '../../config';

import infoIcon from 'jimu-icons/svg/outlined/suggested/info.svg';

interface Props {
  intl: IntlShape;
  theme: IMThemeVariables;
  portalSelf: Portal;
  config: IMConfig;
  isRTL: boolean;
  onAddressSettingsUpdated: (
    prop: string | any[],
    value: string | number | ImmutableArray<UseUtility> | [] | boolean
  ) => void;
}

interface State {
  geocodeLocatorUrl: string;
  updateGeocodeLocatorUrl: string;
  isAlertPopupOpen: boolean;
  isInvalidValue: boolean;
  utilities: ImmutableArray<UseUtility> | [];
  showDefaultGeocodeUrl: boolean;
}
const supportedUtilityTypes = [SupportedUtilityType.GeoCoding];

export default class AddressSettings extends React.PureComponent<Props, State> {
  private readonly geocodeTextBox = React.createRef<HTMLInputElement>();
  constructor(props: Props) {
    super(props);
    if (props.config.mode === 'apiKey') return;
    this.geocodeTextBox = React.createRef<HTMLInputElement>();

    let geocodeServiceUrl =
      'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';

    let showDefaultGeocodeUrl: boolean = true;
    if (props.config.useUtilitiesGeocodeService?.length > 0) {
      showDefaultGeocodeUrl = false;
    } else if (props.config && props.config.geocodeServiceUrl) {
      geocodeServiceUrl = props.config.geocodeServiceUrl;
    } else if (props.portalSelf?.helperServices?.geocode?.[0]?.url) {
      //Use org's first geocode service if available
      geocodeServiceUrl = props.portalSelf?.helperServices?.geocode?.[0]?.url;
    }

    this.state = {
      geocodeLocatorUrl: geocodeServiceUrl,
      updateGeocodeLocatorUrl: geocodeServiceUrl,
      isAlertPopupOpen: false,
      isInvalidValue: false,
      utilities: props.config?.useUtilitiesGeocodeService
        ? props.config.useUtilitiesGeocodeService
        : [],
      showDefaultGeocodeUrl: showDefaultGeocodeUrl,
    };
  }

  nls = (id: string) => {
    return this.props.intl.formatMessage({
      id: id,
      defaultMessage: defaultMessages[id],
    });
  };

  componentDidMount = () => {
    //When using geocode service URL from helper services it was not getting updated in config
    //as we were updating service URL only on OK button click
    // so set geocodeServiceUrl from here it will be updated in config
    this.props.onAddressSettingsUpdated(
      'geocodeServiceUrl',
      this.state.geocodeLocatorUrl
    );
  };

  onSetLocatorClicked = () => {
    this.setState(
      {
        isAlertPopupOpen: true,
        isInvalidValue: false,
      },
      () => {
        setTimeout(() => {
          //for setting the cursor to the front of textbox
          const ua = window.jimuUA.browser
            ? (window.jimuUA.browser.name + '').toLowerCase()
            : '';
          if (ua === 'chrome' || ua === 'microsoft edge') {
            this.geocodeTextBox.current.selectionStart =
              this.geocodeTextBox.current.selectionEnd = 0;
            this.geocodeTextBox.current.focus();
          } else {
            if (this.props.isRTL) {
              this.geocodeTextBox.current.focus();
            } else {
              this.geocodeTextBox.current.selectionStart =
                this.geocodeTextBox.current.selectionEnd = 0;
              this.geocodeTextBox.current.focus();
            }
          }
        }, 1000);
      }
    );
    setTimeout(() => {
      const currentValue = this.state.geocodeLocatorUrl;
      this.setState({
        updateGeocodeLocatorUrl: currentValue,
      });
    }, 500);
  };

  onAlertOkButtonClicked = () => {
    if (this.geocodeTextBox.current.value === '') {
      return;
    }
    //Check if valid url is entered, if not then don't hide the Alert popup on ok button
    if (!this.state.isInvalidValue) {
      this.setState({
        geocodeLocatorUrl: this.geocodeTextBox.current.value,
      });
      this.props.onAddressSettingsUpdated(
        'geocodeServiceUrl',
        this.geocodeTextBox.current.value
      );
      this.onAlertCloseButtonClicked();
    }
  };

  onAlertCloseButtonClicked = () => {
    this.setState({
      isAlertPopupOpen: false,
    });
  };

  onUtilityChange = (utilities: ImmutableArray<UseUtility>) => {
    let showDefaultGeocodeUrl: boolean = false;
    //if no utility selected show and use the default geocode URL
    if (utilities.length < 1) {
      showDefaultGeocodeUrl = true;
    }
    this.setState({
      showDefaultGeocodeUrl: showDefaultGeocodeUrl,
      utilities: utilities,
    });
    this.props.onAddressSettingsUpdated(
      'useUtilitiesGeocodeService',
      utilities
    );
  };

  render() {
    return (
      <div style={{ height: '100%', marginTop: '5px' }}>
        <div css={getAddressSettingsStyle(this.props.theme)}>
          <SettingRow flow="wrap">
            <UtilitySelector
              useUtilities={Immutable(
                this.state.utilities ? this.state.utilities : []
              )}
              onChange={this.onUtilityChange}
              showRemove={true}
              closePopupOnSelect
              types={supportedUtilityTypes}
            />
          </SettingRow>

          {this.state.showDefaultGeocodeUrl && (
            <SettingRow className={'locator-url'}>
              <Label tabIndex={0} aria-label={this.state.geocodeLocatorUrl}>
                {this.state.geocodeLocatorUrl}
              </Label>
              <Tooltip
                role={'tooltip'}
                tabIndex={0}
                aria-label={this.nls('defaultGeocodeUrlTooltip')}
                title={this.nls('defaultGeocodeUrlTooltip')}
                showArrow
                placement="top"
              >
                <div className="ml-2 d-inline defGeocode-tooltip">
                  <Icon size={14} icon={infoIcon} />
                </div>
              </Tooltip>
            </SettingRow>
          )}
        </div>
      </div>
    );
  }
}
