System.register(["jimu-core","jimu-ui","jimu-ui/advanced/setting-components"], function(__WEBPACK_DYNAMIC_EXPORT__, __system_context__) {
	var __WEBPACK_EXTERNAL_MODULE_jimu_core__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__ = {};
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_core__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_ui__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__, "__esModule", { value: true });
	return {
		setters: [
			function(module) {
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_core__[key] = module[key];
				});
			},
			function(module) {
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_ui__[key] = module[key];
				});
			},
			function(module) {
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__[key] = module[key];
				});
			}
		],
		execute: function() {
			__WEBPACK_DYNAMIC_EXPORT__(
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./your-extensions/widgets/what3words/src/setting/components/locator-settings.tsx":
/*!****************************************************************************************!*\
  !*** ./your-extensions/widgets/what3words/src/setting/components/locator-settings.tsx ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AddressSettings)
/* harmony export */ });
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jimu-core */ "jimu-core");
/* harmony import */ var jimu_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jimu-ui */ "jimu-ui");
/* harmony import */ var jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jimu-ui/advanced/setting-components */ "jimu-ui/advanced/setting-components");
/* harmony import */ var _lib_style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/style */ "./your-extensions/widgets/what3words/src/setting/lib/style.ts");
/* harmony import */ var _translations_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../translations/default */ "./your-extensions/widgets/what3words/src/setting/translations/default.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @jsx jsx */ // <-- make sure to include the jsx pragma





//regular expression for validating the geocode service url
const urlRegExString = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
class AddressSettings extends jimu_core__WEBPACK_IMPORTED_MODULE_0__.React.PureComponent {
    constructor(props) {
        super(props);
        this.geocodeTextBox = jimu_core__WEBPACK_IMPORTED_MODULE_0__.React.createRef();
        this.nls = (id) => {
            return this.props.intl.formatMessage({ id: id, defaultMessage: _translations_default__WEBPACK_IMPORTED_MODULE_4__["default"][id] });
        };
        this.componentDidMount = () => {
            //When using geocode service URL from helper services it was not getting updated in config
            //as we were updating service URL only on OK button click
            // so set geocodeServiceUrl from here it will be updated in config
            this.props.onAddressSettingsUpdated('geocodeServiceUrl', this.state.geocodeLocatorUrl);
        };
        this.onSetLocatorClicked = () => {
            this.setState({
                isAlertPopupOpen: true,
                isInvalidValue: false
            }, () => {
                setTimeout(() => {
                    //for setting the cursor to the front of textbox
                    const ua = window.jimuUA.browser ? (window.jimuUA.browser.name + '').toLowerCase() : '';
                    if (ua === 'chrome' || ua === 'microsoft edge') {
                        this.geocodeTextBox.current.selectionStart = this.geocodeTextBox.current.selectionEnd = 0;
                        this.geocodeTextBox.current.focus();
                    }
                    else {
                        if (this.props.isRTL) {
                            this.geocodeTextBox.current.focus();
                        }
                        else {
                            this.geocodeTextBox.current.selectionStart = this.geocodeTextBox.current.selectionEnd = 0;
                            this.geocodeTextBox.current.focus();
                        }
                    }
                }, 1000);
            });
            setTimeout(() => {
                const currentValue = this.state.geocodeLocatorUrl;
                this.setState({
                    updateGeocodeLocatorUrl: currentValue
                });
            }, 500);
        };
        this.onAlertOkButtonClicked = () => {
            if (this.geocodeTextBox.current.value === '') {
                return;
            }
            //Check if valid url is entered, if not then don't hide the Alert popup on ok button
            if (!this.state.isInvalidValue) {
                this.setState({
                    geocodeLocatorUrl: this.geocodeTextBox.current.value
                });
                this.props.onAddressSettingsUpdated('geocodeServiceUrl', this.geocodeTextBox.current.value);
                this.onAlertCloseButtonClicked();
            }
        };
        this.onAlertCloseButtonClicked = () => {
            this.setState({
                isAlertPopupOpen: false
            });
        };
        this.onInputChange = (value) => {
            this.setState({
                updateGeocodeLocatorUrl: value
            });
            let isValid = false;
            //validate the geocode service url on change of user input url
            this._validateGeocodeService().then((isValidGeocodeService) => {
                // console.log(isValidGeocodeService)
                if (!isValidGeocodeService) {
                    isValid = false;
                }
                else {
                    isValid = true;
                }
                this.setState({
                    isInvalidValue: !isValid
                });
            });
        };
        this._validateGeocodeService = () => __awaiter(this, void 0, void 0, function* () {
            if (this.geocodeTextBox.current.value && urlRegExString.test(this.geocodeTextBox.current.value)) {
                try {
                    return yield fetch(this.geocodeTextBox.current.value + '?f=json')
                        .then(response => response.json())
                        .then(response => {
                        // console.log(response)
                        // The ArcGIS locator URL when added returns a 403 code which means
                        // message: "You do not have permissions to access this resource or perform this operation."
                        // messageCode: "GWM_0003"
                        // This part of the code needs to be reviewed
                        if (response.error.code !== 403) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    });
                }
                catch (error) {
                    console.log('Error: ' + error.message);
                    return false;
                }
            }
            else {
                return false;
            }
        });
        this.geocodeTextBox = jimu_core__WEBPACK_IMPORTED_MODULE_0__.React.createRef();
        let geocodeServiceUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';
        if (this.props.config && this.props.config.geocodeServiceUrl) {
            geocodeServiceUrl = this.props.config.geocodeServiceUrl;
        }
        else if (this.props.portalSelf && this.props.portalSelf.helperServices &&
            this.props.portalSelf.helperServices.geocode &&
            this.props.portalSelf.helperServices.geocode.length > 0 &&
            this.props.portalSelf.helperServices.geocode[0].url) { //Use org's first geocode service if available
            geocodeServiceUrl = this.props.portalSelf.helperServices.geocode[0].url;
        }
        this.state = {
            geocodeLocatorUrl: geocodeServiceUrl,
            updateGeocodeLocatorUrl: geocodeServiceUrl,
            isAlertPopupOpen: false,
            isInvalidValue: false
        };
    }
    render() {
        return (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { height: '100%', marginTop: '5px' } },
            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { css: (0,_lib_style__WEBPACK_IMPORTED_MODULE_3__.getAddressSettingsStyle)(this.props.theme) },
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingRow, null,
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_1__.Button, { role: 'button', "aria-haspopup": 'dialog', className: 'w-100 text-dark', type: 'primary', onClick: this.onSetLocatorClicked.bind(this) }, this.nls('locatorServiceLabel'))),
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingRow, { className: 'locator-url' },
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_1__.Label, { tabIndex: 0, "aria-label": this.state.geocodeLocatorUrl }, this.state.geocodeLocatorUrl)),
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_1__.AlertPopup, { isOpen: this.state.isAlertPopupOpen && !jimu_core__WEBPACK_IMPORTED_MODULE_0__.urlUtils.getAppIdPageIdFromUrl().pageId, css: (0,_lib_style__WEBPACK_IMPORTED_MODULE_3__.getAlertPopupStyle)(this.props.theme), onClickOk: this.onAlertOkButtonClicked.bind(this), onClickClose: this.onAlertCloseButtonClicked, title: this.props.intl ? this.nls('alertPopupTitle') : '' },
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: 'popupContents' },
                        (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: 'alertValidationContent' },
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_1__.TextInput, { role: 'textbox', "aria-label": this.state.geocodeLocatorUrl, required: true, className: this.state.isInvalidValue ? 'locaterUrlTextInput w-100 is-invalid' : 'locaterUrlTextInput w-100 is-valid', size: 'sm', type: 'text', ref: this.geocodeTextBox, value: this.state.updateGeocodeLocatorUrl, onChange: (evt) => this.onInputChange(evt.currentTarget.value) }),
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: this.state.isInvalidValue ? 'invalidServiceURL locatorErrorMessage' : 'validServiceURL' }, this.nls('invalidLocatorServiceURL')))))));
    }
}


/***/ }),

/***/ "./your-extensions/widgets/what3words/src/setting/lib/style.ts":
/*!*********************************************************************!*\
  !*** ./your-extensions/widgets/what3words/src/setting/lib/style.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAddressSettingsStyle: () => (/* binding */ getAddressSettingsStyle),
/* harmony export */   getAlertPopupStyle: () => (/* binding */ getAlertPopupStyle),
/* harmony export */   getWidgetDisplayOptionsStyle: () => (/* binding */ getWidgetDisplayOptionsStyle)
/* harmony export */ });
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jimu-core */ "jimu-core");

function getAddressSettingsStyle(theme) {
    return (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.css) `

  .locator-url {
    background-color: ${theme.colors.palette.dark[200]};
    padding: 2px;
  }
  
  .locator-url label {
    word-break: break-all;
  }

  `;
}
function getAlertPopupStyle(theme) {
    const isRTL = (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.getAppStore)().getState().appContext.isRTL;
    return (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.css) `
    .popupContents {
      width: 450px;
    }

    .invalidServiceURL {
      display: block;
    }

    .validServiceURL {
      display: none;
    }

    .locatorErrorMessage {
      padding-top: 5px;
      color: ${theme.colors.danger};
      font-weight: bold;
    }

    .alertValidationContent {
      height: 42px;
    }
    
    .locaterUrlTextInput .input-wrapper input {
      padding: ${isRTL ? '0 1px' : '0'};
    }
  `;
}
function getWidgetDisplayOptionsStyle(theme) {
    return (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.css) `
      label {
        display: inline-flex;
        margin-left: 5px;
      }
      .switch-select {
        background-color: #01AABB;
        border-color: #01AABB;
      }
      .switch-select .switch-slider {
        background-color: #000 !important;
      }
      .switch-select.checked {
        background-color: #000;
        border-color: #01AABB;
      }
      .switch-select.checked .switch-slider {
        background-color: #01AABB !important;
      }
  `;
}


/***/ }),

/***/ "./your-extensions/widgets/what3words/src/setting/translations/default.ts":
/*!********************************************************************************!*\
  !*** ./your-extensions/widgets/what3words/src/setting/translations/default.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    selectMapWidget: 'Select a Map',
    w3wLocator: 'Select your what3words locator',
    addressSettingsLabel: 'Locator Settings',
    locatorServiceLabel: 'Set locator',
    alertPopupTitle: 'Select Geocode Service',
    invalidLocatorServiceURL: 'Please enter valid geocode service url',
    widgetDisplayOptions: 'Widget Display Options',
    displayCoordinates: 'Display Lat/Long',
    displayCopyButton: 'Display Copy Button',
    displayZoomButton: 'Display Zoom Button',
    displayPopupMessage: 'Display Popup Message'
});


/***/ }),

/***/ "jimu-core":
/*!****************************!*\
  !*** external "jimu-core" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_core__;

/***/ }),

/***/ "jimu-ui":
/*!**************************!*\
  !*** external "jimu-ui" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_ui__;

/***/ }),

/***/ "jimu-ui/advanced/setting-components":
/*!******************************************************!*\
  !*** external "jimu-ui/advanced/setting-components" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!******************************************!*\
  !*** ./jimu-core/lib/set-public-path.ts ***!
  \******************************************/
/**
 * Webpack will replace __webpack_public_path__ with __webpack_require__.p to set the public path dynamically.
 * The reason why we can't set the publicPath in webpack config is: we change the publicPath when download.
 * */
// eslint-disable-next-line
// @ts-ignore
__webpack_require__.p = window.jimuConfig.baseUrl;

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************************************************************!*\
  !*** ./your-extensions/widgets/what3words/src/setting/setting.tsx ***!
  \********************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __set_webpack_public_path__: () => (/* binding */ __set_webpack_public_path__),
/* harmony export */   "default": () => (/* binding */ Setting)
/* harmony export */ });
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jimu-core */ "jimu-core");
/* harmony import */ var _components_locator_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/locator-settings */ "./your-extensions/widgets/what3words/src/setting/components/locator-settings.tsx");
/* harmony import */ var jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jimu-ui/advanced/setting-components */ "jimu-ui/advanced/setting-components");
/* harmony import */ var _translations_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./translations/default */ "./your-extensions/widgets/what3words/src/setting/translations/default.ts");
/* harmony import */ var _lib_style__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/style */ "./your-extensions/widgets/what3words/src/setting/lib/style.ts");
/* harmony import */ var jimu_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! jimu-ui */ "jimu-ui");
/** @jsx jsx */






class Setting extends jimu_core__WEBPACK_IMPORTED_MODULE_0__.React.PureComponent {
    constructor(props) {
        var _a;
        super(props);
        this.nls = (id) => {
            return this.props.intl.formatMessage({ id: id, defaultMessage: _translations_default__WEBPACK_IMPORTED_MODULE_3__["default"][id] });
        };
        this.onMapWidgetSelected = (useMapWidgetIds) => {
            this.props.onSettingChange({
                id: this.props.id,
                useMapWidgetIds: useMapWidgetIds
            });
        };
        this.onToggleAddressSettings = () => {
            this.setState({
                isAddressSettingsOpen: !this.state.isAddressSettingsOpen
            });
        };
        this.updateAddressSettings = (property, value) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['addressSettings', property], value)
            });
        };
        this.setW3wLocator = (w3wLocator) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('w3wLocator', w3wLocator)
            });
        };
        this.switchDisplayCoordinates = (evt) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('displayCoordinates', evt.currentTarget.checked)
            });
        };
        this.switchDisplayCopyButton = (evt) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('displayCopyButton', evt.currentTarget.checked)
            });
        };
        this.switchDisplayZoomButton = (evt) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('displayZoomButton', evt.currentTarget.checked)
            });
        };
        this.switchDisplayPopupMessage = (evt) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('displayPopupMessage', evt.currentTarget.checked)
            });
        };
        this.state = {
            isAddressSettingsOpen: true
        };
        this.isRTL = false;
        const appState = (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.getAppStore)().getState();
        this.isRTL = (_a = appState === null || appState === void 0 ? void 0 : appState.appContext) === null || _a === void 0 ? void 0 : _a.isRTL;
    }
    render() {
        return (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { css: (0,_lib_style__WEBPACK_IMPORTED_MODULE_4__.getWidgetDisplayOptionsStyle)(this.props.theme), className: "widget-what3words-setting" },
            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingSection, { className: "map-selector-section", title: this.props.intl.formatMessage({
                    id: 'selectMapWidget',
                    defaultMessage: _translations_default__WEBPACK_IMPORTED_MODULE_3__["default"].selectMapWidget
                }) },
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingRow, null,
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.MapWidgetSelector, { useMapWidgetIds: this.props.useMapWidgetIds, onSelect: this.onMapWidgetSelected }))),
            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingSection, null,
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingCollapse, { defaultIsOpen: true, label: this.nls('addressSettingsLabel'), isOpen: this.state.isAddressSettingsOpen, onRequestOpen: () => this.onToggleAddressSettings(), onRequestClose: () => this.onToggleAddressSettings() },
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingRow, { flow: 'wrap' },
                        (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_locator_settings__WEBPACK_IMPORTED_MODULE_1__["default"], { intl: this.props.intl, theme: this.props.theme, portalSelf: this.props.portalSelf, config: this.props.config.addressSettings, isRTL: this.isRTL, onAddressSettingsUpdated: this.updateAddressSettings })))),
            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingSection, { className: "map-selector-section", title: this.props.intl.formatMessage({
                    id: 'widgetDisplayOptions',
                    defaultMessage: _translations_default__WEBPACK_IMPORTED_MODULE_3__["default"].widgetDisplayOptions
                }) },
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingRow, null,
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-100" },
                        (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "checkbox-row" },
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_5__.Switch, { checked: (this.props.config && this.props.config.displayCoordinates) || false, onChange: this.switchDisplayCoordinates }),
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", null,
                                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_core__WEBPACK_IMPORTED_MODULE_0__.FormattedMessage, { id: "displayCoordinates", defaultMessage: _translations_default__WEBPACK_IMPORTED_MODULE_3__["default"].displayCoordinates }))))),
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingRow, null,
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-100" },
                        (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "checkbox-row" },
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_5__.Switch, { checked: (this.props.config && this.props.config.displayCopyButton) || false, onChange: this.switchDisplayCopyButton }),
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", null,
                                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_core__WEBPACK_IMPORTED_MODULE_0__.FormattedMessage, { id: "displayCopyButton", defaultMessage: _translations_default__WEBPACK_IMPORTED_MODULE_3__["default"].displayCopyButton }))))),
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingRow, null,
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-100" },
                        (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "checkbox-row" },
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_5__.Switch, { checked: (this.props.config && this.props.config.displayZoomButton) || false, onChange: this.switchDisplayZoomButton }),
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", null,
                                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_core__WEBPACK_IMPORTED_MODULE_0__.FormattedMessage, { id: "displayZoomButton", defaultMessage: _translations_default__WEBPACK_IMPORTED_MODULE_3__["default"].displayZoomButton }))))),
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingRow, null,
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-100" },
                        (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "checkbox-row" },
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_5__.Switch, { checked: (this.props.config && this.props.config.displayPopupMessage) || false, onChange: this.switchDisplayPopupMessage }),
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", null,
                                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_core__WEBPACK_IMPORTED_MODULE_0__.FormattedMessage, { id: "displayPopupMessage", defaultMessage: _translations_default__WEBPACK_IMPORTED_MODULE_3__["default"].displayPopupMessage })))))));
    }
}
function __set_webpack_public_path__(url) { __webpack_require__.p = url; }

})();

/******/ 	return __webpack_exports__;
/******/ })()

			);
		}
	};
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0cy93aGF0M3dvcmRzL2Rpc3Qvc2V0dGluZy9zZXR0aW5nLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxlQUFlLENBQUMsMENBQTBDO0FBQ2lCO0FBQ2I7QUFDRTtBQUNVO0FBQ3JCO0FBSXJELDJEQUEyRDtBQUMzRCxNQUFNLGNBQWMsR0FBRyx5SEFBeUg7QUFrQmpJLE1BQU0sZUFBZ0IsU0FBUSw0Q0FBSyxDQUFDLGFBQTJCO0lBRTVFLFlBQWEsS0FBSztRQUNoQixLQUFLLENBQUMsS0FBSyxDQUFDO1FBRkcsbUJBQWMsR0FBRyw0Q0FBSyxDQUFDLFNBQVMsRUFBb0I7UUF3QnJFLFFBQUcsR0FBRyxDQUFDLEVBQVUsRUFBRSxFQUFFO1lBQ25CLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxjQUFjLEVBQUUsNkRBQWUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ3ZGLENBQUM7UUFFRCxzQkFBaUIsR0FBRyxHQUFHLEVBQUU7WUFDdkIsMEZBQTBGO1lBQzFGLHlEQUF5RDtZQUN6RCxrRUFBa0U7WUFDbEUsSUFBSSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDO1FBQ3hGLENBQUM7UUFFRCx3QkFBbUIsR0FBRyxHQUFHLEVBQUU7WUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDWixnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixjQUFjLEVBQUUsS0FBSzthQUN0QixFQUFFLEdBQUcsRUFBRTtnQkFDTixVQUFVLENBQUMsR0FBRyxFQUFFO29CQUNkLGdEQUFnRDtvQkFDaEQsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFD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OzRCQUN6QiwrQ0FBQywyQ0FBTSxJQUNILE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksS0FBSyxFQUM1RSxRQUFRLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixHQUN4Qzs0QkFDRjtnQ0FDSSwrQ0FBQyx1REFBZ0IsSUFBQyxFQUFFLEVBQUMsbUJBQW1CLEVBQUMsY0FBYyxFQUFFLDZEQUFlLENBQUMsaUJBQWlCLEdBQUksQ0FDMUYsQ0FDTixDQUNKLENBQ0c7Z0JBQ2IsK0NBQUMsMkVBQVU7b0JBQ1Asd0RBQUssU0FBUyxFQUFDLE9BQU87d0JBQ2xCLHdEQUFLLFNBQVMsRUFBQyxjQUFjOzRCQUN6QiwrQ0FBQywyQ0FBTSxJQUNILE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksS0FBSyxFQUM5RSxRQUFRLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixHQUMxQzs0QkFDRjtnQ0FDSSwrQ0FBQyx1REFBZ0IsSUFBQyxFQUFFLEVBQUMscUJBQXFCLEVBQUMsY0FBYyxFQUFFLDZEQUFlLENBQUMsbUJBQW1CLEdBQUksQ0FDOUYsQ0FDTixDQUNKLENBQ0csQ0FDQSxDQUNYO0lBQ1IsQ0FBQztDQUNGO0FBRU8sU0FBUywyQkFBMkIsQ0FBQyxHQUFHLElBQUkscUJBQXVCLEdBQUcsR0FBRyxFQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leGItY2xpZW50Ly4veW91ci1leHRlbnNpb25zL3dpZGdldHMvd2hhdDN3b3Jkcy9zcmMvc2V0dGluZy9jb21wb25lbnRzL2xvY2F0b3Itc2V0dGluZ3MudHN4Iiwid2VicGFjazovL2V4Yi1jbGllbnQvLi95b3VyLWV4dGVuc2lvbnMvd2lkZ2V0cy93aGF0M3dvcmRzL3NyYy9zZXR0aW5nL2xpYi9zdHlsZS50cyIsIndlYnBhY2s6Ly9leGItY2xpZW50Ly4veW91ci1leHRlbnNpb25zL3dpZGdldHMvd2hhdDN3b3Jkcy9zcmMvc2V0dGluZy90cmFuc2xhdGlvbnMvZGVmYXVsdC50cyIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtY29yZVwiIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS11aVwiIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS11aS9hZHZhbmNlZC9zZXR0aW5nLWNvbXBvbmVudHNcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9leGItY2xpZW50Ly4vamltdS1jb3JlL2xpYi9zZXQtcHVibGljLXBhdGgudHMiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL3lvdXItZXh0ZW5zaW9ucy93aWRnZXRzL3doYXQzd29yZHMvc3JjL3NldHRpbmcvc2V0dGluZy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3gganN4ICovIC8vIDwtLSBtYWtlIHN1cmUgdG8gaW5jbHVkZSB0aGUganN4IHByYWdtYVxuaW1wb3J0IHsgUmVhY3QsIGpzeCwgSW50bFNoYXBlLCB1cmxVdGlscywgVGhlbWVWYXJpYWJsZXMgfSBmcm9tICdqaW11LWNvcmUnXG5pbXBvcnQgeyBBbGVydFBvcHVwLCBCdXR0b24sIExhYmVsLCBUZXh0SW5wdXQgfSBmcm9tICdqaW11LXVpJ1xuaW1wb3J0IHsgU2V0dGluZ1JvdyB9IGZyb20gJ2ppbXUtdWkvYWR2YW5jZWQvc2V0dGluZy1jb21wb25lbnRzJ1xuaW1wb3J0IHsgZ2V0QWRkcmVzc1NldHRpbmdzU3R5bGUsIGdldEFsZXJ0UG9wdXBTdHlsZSB9IGZyb20gJy4uL2xpYi9zdHlsZSdcbmltcG9ydCBkZWZhdWx0TWVzc2FnZXMgZnJvbSAnLi4vdHJhbnNsYXRpb25zL2RlZmF1bHQnXG5pbXBvcnQgUG9ydGFsIGZyb20gJ2VzcmkvcG9ydGFsL1BvcnRhbCdcbmltcG9ydCB7IElNQWRkcmVzc1NldHRpbmdzIH0gZnJvbSAnLi4vLi4vY29uZmlnJ1xuXG4vL3JlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgdmFsaWRhdGluZyB0aGUgZ2VvY29kZSBzZXJ2aWNlIHVybFxuY29uc3QgdXJsUmVnRXhTdHJpbmcgPSAvXihodHRwOlxcL1xcL3d3d1xcLnxodHRwczpcXC9cXC93d3dcXC58aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvKT9bYS16MC05XSsoW1xcLVxcLl17MX1bYS16MC05XSspKlxcLlthLXpdezIsNX0oOlswLTldezEsNX0pPyhcXC8uKik/JC9cblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgaW50bDogSW50bFNoYXBlXG4gIHRoZW1lOiBUaGVtZVZhcmlhYmxlc1xuICBwb3J0YWxTZWxmOiBQb3J0YWxcbiAgY29uZmlnOiBJTUFkZHJlc3NTZXR0aW5nc1xuICBpc1JUTDogYm9vbGVhblxuICBvbkFkZHJlc3NTZXR0aW5nc1VwZGF0ZWQ6IChwcm9wOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpID0+IHZvaWRcbn1cblxuaW50ZXJmYWNlIFN0YXRlIHtcbiAgZ2VvY29kZUxvY2F0b3JVcmw6IHN0cmluZ1xuICB1cGRhdGVHZW9jb2RlTG9jYXRvclVybDogc3RyaW5nXG4gIGlzQWxlcnRQb3B1cE9wZW46IGJvb2xlYW5cbiAgaXNJbnZhbGlkVmFsdWU6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWRkcmVzc1NldHRpbmdzIGV4dGVuZHMgUmVhY3QuUHVyZUNvbXBvbmVudDxQcm9wcywgU3RhdGU+IHtcbiAgcHJpdmF0ZSByZWFkb25seSBnZW9jb2RlVGV4dEJveCA9IFJlYWN0LmNyZWF0ZVJlZjxIVE1MSW5wdXRFbGVtZW50PigpXG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuZ2VvY29kZVRleHRCb3ggPSBSZWFjdC5jcmVhdGVSZWY8SFRNTElucHV0RWxlbWVudD4oKVxuXG4gICAgbGV0IGdlb2NvZGVTZXJ2aWNlVXJsID0gJ2h0dHBzOi8vZ2VvY29kZS5hcmNnaXMuY29tL2FyY2dpcy9yZXN0L3NlcnZpY2VzL1dvcmxkL0dlb2NvZGVTZXJ2ZXInXG5cbiAgICBpZiAodGhpcy5wcm9wcy5jb25maWcgJiYgdGhpcy5wcm9wcy5jb25maWcuZ2VvY29kZVNlcnZpY2VVcmwpIHtcbiAgICAgIGdlb2NvZGVTZXJ2aWNlVXJsID0gdGhpcy5wcm9wcy5jb25maWcuZ2VvY29kZVNlcnZpY2VVcmxcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucG9ydGFsU2VsZiAmJiB0aGlzLnByb3BzLnBvcnRhbFNlbGYuaGVscGVyU2VydmljZXMgJiZcbiAgICAgIHRoaXMucHJvcHMucG9ydGFsU2VsZi5oZWxwZXJTZXJ2aWNlcy5nZW9jb2RlICYmXG4gICAgICB0aGlzLnByb3BzLnBvcnRhbFNlbGYuaGVscGVyU2VydmljZXMuZ2VvY29kZS5sZW5ndGggPiAwICYmXG4gICAgICB0aGlzLnByb3BzLnBvcnRhbFNlbGYuaGVscGVyU2VydmljZXMuZ2VvY29kZVswXS51cmwpIHsgLy9Vc2Ugb3JnJ3MgZmlyc3QgZ2VvY29kZSBzZXJ2aWNlIGlmIGF2YWlsYWJsZVxuICAgICAgZ2VvY29kZVNlcnZpY2VVcmwgPSB0aGlzLnByb3BzLnBvcnRhbFNlbGYuaGVscGVyU2VydmljZXMuZ2VvY29kZVswXS51cmxcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZ2VvY29kZUxvY2F0b3JVcmw6IGdlb2NvZGVTZXJ2aWNlVXJsLFxuICAgICAgdXBkYXRlR2VvY29kZUxvY2F0b3JVcmw6IGdlb2NvZGVTZXJ2aWNlVXJsLFxuICAgICAgaXNBbGVydFBvcHVwT3BlbjogZmFsc2UsXG4gICAgICBpc0ludmFsaWRWYWx1ZTogZmFsc2VcbiAgICB9XG4gIH1cblxuICBubHMgPSAoaWQ6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmludGwuZm9ybWF0TWVzc2FnZSh7IGlkOiBpZCwgZGVmYXVsdE1lc3NhZ2U6IGRlZmF1bHRNZXNzYWdlc1tpZF0gfSlcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ID0gKCkgPT4ge1xuICAgIC8vV2hlbiB1c2luZyBnZW9jb2RlIHNlcnZpY2UgVVJMIGZyb20gaGVscGVyIHNlcnZpY2VzIGl0IHdhcyBub3QgZ2V0dGluZyB1cGRhdGVkIGluIGNvbmZpZ1xuICAgIC8vYXMgd2Ugd2VyZSB1cGRhdGluZyBzZXJ2aWNlIFVSTCBvbmx5IG9uIE9LIGJ1dHRvbiBjbGlja1xuICAgIC8vIHNvIHNldCBnZW9jb2RlU2VydmljZVVybCBmcm9tIGhlcmUgaXQgd2lsbCBiZSB1cGRhdGVkIGluIGNvbmZpZ1xuICAgIHRoaXMucHJvcHMub25BZGRyZXNzU2V0dGluZ3NVcGRhdGVkKCdnZW9jb2RlU2VydmljZVVybCcsIHRoaXMuc3RhdGUuZ2VvY29kZUxvY2F0b3JVcmwpXG4gIH1cblxuICBvblNldExvY2F0b3JDbGlja2VkID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNBbGVydFBvcHVwT3BlbjogdHJ1ZSxcbiAgICAgIGlzSW52YWxpZFZhbHVlOiBmYWxzZVxuICAgIH0sICgpID0+IHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAvL2ZvciBzZXR0aW5nIHRoZSBjdXJzb3IgdG8gdGhlIGZyb250IG9mIHRleHRib3hcbiAgICAgICAgY29uc3QgdWEgPSB3aW5kb3cuamltdVVBLmJyb3dzZXIgPyAod2luZG93LmppbXVVQS5icm93c2VyLm5hbWUgKyAnJykudG9Mb3dlckNhc2UoKSA6ICcnXG4gICAgICAgIGlmICh1YSA9PT0gJ2Nocm9tZScgfHwgdWEgPT09ICdtaWNyb3NvZnQgZWRnZScpIHtcbiAgICAgICAgICB0aGlzLmdlb2NvZGVUZXh0Qm94LmN1cnJlbnQuc2VsZWN0aW9uU3RhcnQgPSB0aGlzLmdlb2NvZGVUZXh0Qm94LmN1cnJlbnQuc2VsZWN0aW9uRW5kID0gMFxuICAgICAgICAgIHRoaXMuZ2VvY29kZVRleHRCb3guY3VycmVudC5mb2N1cygpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMucHJvcHMuaXNSVEwpIHtcbiAgICAgICAgICAgIHRoaXMuZ2VvY29kZVRleHRCb3guY3VycmVudC5mb2N1cygpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2VvY29kZVRleHRCb3guY3VycmVudC5zZWxlY3Rpb25TdGFydCA9IHRoaXMuZ2VvY29kZVRleHRCb3guY3VycmVudC5zZWxlY3Rpb25FbmQgPSAwXG4gICAgICAgICAgICB0aGlzLmdlb2NvZGVUZXh0Qm94LmN1cnJlbnQuZm9jdXMoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgMTAwMClcbiAgICB9KVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFZhbHVlID0gdGhpcy5zdGF0ZS5nZW9jb2RlTG9jYXRvclVybFxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHVwZGF0ZUdlb2NvZGVMb2NhdG9yVXJsOiBjdXJyZW50VmFsdWVcbiAgICAgIH0pXG4gICAgfSwgNTAwKVxuICB9XG5cbiAgb25BbGVydE9rQnV0dG9uQ2xpY2tlZCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5nZW9jb2RlVGV4dEJveC5jdXJyZW50LnZhbHVlID09PSAnJykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIC8vQ2hlY2sgaWYgdmFsaWQgdXJsIGlzIGVudGVyZWQsIGlmIG5vdCB0aGVuIGRvbid0IGhpZGUgdGhlIEFsZXJ0IHBvcHVwIG9uIG9rIGJ1dHRvblxuICAgIGlmICghdGhpcy5zdGF0ZS5pc0ludmFsaWRWYWx1ZSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGdlb2NvZGVMb2NhdG9yVXJsOiB0aGlzLmdlb2NvZGVUZXh0Qm94LmN1cnJlbnQudmFsdWVcbiAgICAgIH0pXG4gICAgICB0aGlzLnByb3BzLm9uQWRkcmVzc1NldHRpbmdzVXBkYXRlZCgnZ2VvY29kZVNlcnZpY2VVcmwnLCB0aGlzLmdlb2NvZGVUZXh0Qm94LmN1cnJlbnQudmFsdWUpXG5cbiAgICAgIHRoaXMub25BbGVydENsb3NlQnV0dG9uQ2xpY2tlZCgpXG4gICAgfVxuICB9XG5cbiAgb25BbGVydENsb3NlQnV0dG9uQ2xpY2tlZCA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzQWxlcnRQb3B1cE9wZW46IGZhbHNlXG4gICAgfSlcbiAgfVxuXG4gIG9uSW5wdXRDaGFuZ2UgPSAodmFsdWU6IHN0cmluZykgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdXBkYXRlR2VvY29kZUxvY2F0b3JVcmw6IHZhbHVlXG4gICAgfSlcbiAgICBsZXQgaXNWYWxpZCA9IGZhbHNlXG4gICAgLy92YWxpZGF0ZSB0aGUgZ2VvY29kZSBzZXJ2aWNlIHVybCBvbiBjaGFuZ2Ugb2YgdXNlciBpbnB1dCB1cmxcbiAgICB0aGlzLl92YWxpZGF0ZUdlb2NvZGVTZXJ2aWNlKCkudGhlbigoaXNWYWxpZEdlb2NvZGVTZXJ2aWNlKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhpc1ZhbGlkR2VvY29kZVNlcnZpY2UpXG4gICAgICBpZiAoIWlzVmFsaWRHZW9jb2RlU2VydmljZSkge1xuICAgICAgICBpc1ZhbGlkID0gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlzVmFsaWQgPSB0cnVlXG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaXNJbnZhbGlkVmFsdWU6ICFpc1ZhbGlkXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBfdmFsaWRhdGVHZW9jb2RlU2VydmljZSA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAodGhpcy5nZW9jb2RlVGV4dEJveC5jdXJyZW50LnZhbHVlICYmIHVybFJlZ0V4U3RyaW5nLnRlc3QodGhpcy5nZW9jb2RlVGV4dEJveC5jdXJyZW50LnZhbHVlKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGZldGNoKHRoaXMuZ2VvY29kZVRleHRCb3guY3VycmVudC52YWx1ZSArICc/Zj1qc29uJylcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpXG4gICAgICAgICAgICAvLyBUaGUgQXJjR0lTIGxvY2F0b3IgVVJMIHdoZW4gYWRkZWQgcmV0dXJucyBhIDQwMyBjb2RlIHdoaWNoIG1lYW5zXG4gICAgICAgICAgICAvLyBtZXNzYWdlOiBcIllvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9ucyB0byBhY2Nlc3MgdGhpcyByZXNvdXJjZSBvciBwZXJmb3JtIHRoaXMgb3BlcmF0aW9uLlwiXG4gICAgICAgICAgICAvLyBtZXNzYWdlQ29kZTogXCJHV01fMDAwM1wiXG4gICAgICAgICAgICAvLyBUaGlzIHBhcnQgb2YgdGhlIGNvZGUgbmVlZHMgdG8gYmUgcmV2aWV3ZWRcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvci5jb2RlICE9PSA0MDMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6ICcgKyBlcnJvci5tZXNzYWdlKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICcxMDAlJywgbWFyZ2luVG9wOiAnNXB4JyB9fT5cbiAgICAgIDxkaXYgY3NzPXtnZXRBZGRyZXNzU2V0dGluZ3NTdHlsZSh0aGlzLnByb3BzLnRoZW1lKX0+XG4gICAgICAgIDxTZXR0aW5nUm93PlxuICAgICAgICAgIDxCdXR0b24gcm9sZT17J2J1dHRvbid9IGFyaWEtaGFzcG9wdXA9eydkaWFsb2cnfSBjbGFzc05hbWU9eyd3LTEwMCB0ZXh0LWRhcmsnfSB0eXBlPXsncHJpbWFyeSd9IG9uQ2xpY2s9e3RoaXMub25TZXRMb2NhdG9yQ2xpY2tlZC5iaW5kKHRoaXMpfSA+XG4gICAgICAgICAgICB7dGhpcy5ubHMoJ2xvY2F0b3JTZXJ2aWNlTGFiZWwnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9TZXR0aW5nUm93PlxuXG4gICAgICAgIDxTZXR0aW5nUm93IGNsYXNzTmFtZT17J2xvY2F0b3ItdXJsJ30+XG4gICAgICAgICAgPExhYmVsIHRhYkluZGV4PXswfSBhcmlhLWxhYmVsPXt0aGlzLnN0YXRlLmdlb2NvZGVMb2NhdG9yVXJsfT57dGhpcy5zdGF0ZS5nZW9jb2RlTG9jYXRvclVybH08L0xhYmVsPlxuICAgICAgICA8L1NldHRpbmdSb3c+XG5cbiAgICAgICAgey8qIFBvcHVwIGRpYWxvZyBmb3Igc2VsZWN0aW5nIHRoZSB2YWxpZCBnZW9jb2RlIHNlcnZpY2UgKi99XG4gICAgICAgIDxBbGVydFBvcHVwIGlzT3Blbj17dGhpcy5zdGF0ZS5pc0FsZXJ0UG9wdXBPcGVuICYmICF1cmxVdGlscy5nZXRBcHBJZFBhZ2VJZEZyb21VcmwoKS5wYWdlSWR9XG4gICAgICAgICAgY3NzPXtnZXRBbGVydFBvcHVwU3R5bGUodGhpcy5wcm9wcy50aGVtZSl9XG4gICAgICAgICAgb25DbGlja09rPXt0aGlzLm9uQWxlcnRPa0J1dHRvbkNsaWNrZWQuYmluZCh0aGlzKX0gb25DbGlja0Nsb3NlPXt0aGlzLm9uQWxlcnRDbG9zZUJ1dHRvbkNsaWNrZWR9XG4gICAgICAgICAgdGl0bGU9e3RoaXMucHJvcHMuaW50bCA/IHRoaXMubmxzKCdhbGVydFBvcHVwVGl0bGUnKSA6ICcnfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17J3BvcHVwQ29udGVudHMnfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXsnYWxlcnRWYWxpZGF0aW9uQ29udGVudCd9PlxuICAgICAgICAgICAgICA8VGV4dElucHV0IHJvbGU9eyd0ZXh0Ym94J30gYXJpYS1sYWJlbD17dGhpcy5zdGF0ZS5nZW9jb2RlTG9jYXRvclVybH0gcmVxdWlyZWRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e3RoaXMuc3RhdGUuaXNJbnZhbGlkVmFsdWUgPyAnbG9jYXRlclVybFRleHRJbnB1dCB3LTEwMCBpcy1pbnZhbGlkJyA6ICdsb2NhdGVyVXJsVGV4dElucHV0IHctMTAwIGlzLXZhbGlkJ31cbiAgICAgICAgICAgICAgICBzaXplPXsnc20nfSB0eXBlPSd0ZXh0JyByZWY9e3RoaXMuZ2VvY29kZVRleHRCb3h9XG4gICAgICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudXBkYXRlR2VvY29kZUxvY2F0b3JVcmx9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldnQ6IGFueSkgPT4gdGhpcy5vbklucHV0Q2hhbmdlKGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKX0gLz5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMuc3RhdGUuaXNJbnZhbGlkVmFsdWUgPyAnaW52YWxpZFNlcnZpY2VVUkwgbG9jYXRvckVycm9yTWVzc2FnZScgOiAndmFsaWRTZXJ2aWNlVVJMJ30+XG4gICAgICAgICAgICAgICAge3RoaXMubmxzKCdpbnZhbGlkTG9jYXRvclNlcnZpY2VVUkwnKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9BbGVydFBvcHVwPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIH1cbn1cbiIsImltcG9ydCB7IFRoZW1lVmFyaWFibGVzLCBjc3MsIFNlcmlhbGl6ZWRTdHlsZXMsIGdldEFwcFN0b3JlIH0gZnJvbSAnamltdS1jb3JlJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFkZHJlc3NTZXR0aW5nc1N0eWxlICh0aGVtZTogVGhlbWVWYXJpYWJsZXMpOiBTZXJpYWxpemVkU3R5bGVzIHtcclxuICByZXR1cm4gY3NzYFxyXG5cclxuICAubG9jYXRvci11cmwge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHt0aGVtZS5jb2xvcnMucGFsZXR0ZS5kYXJrWzIwMF19O1xyXG4gICAgcGFkZGluZzogMnB4O1xyXG4gIH1cclxuICBcclxuICAubG9jYXRvci11cmwgbGFiZWwge1xyXG4gICAgd29yZC1icmVhazogYnJlYWstYWxsO1xyXG4gIH1cclxuXHJcbiAgYFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxlcnRQb3B1cFN0eWxlICh0aGVtZTogVGhlbWVWYXJpYWJsZXMpOiBTZXJpYWxpemVkU3R5bGVzIHtcclxuICBjb25zdCBpc1JUTCA9IGdldEFwcFN0b3JlKCkuZ2V0U3RhdGUoKS5hcHBDb250ZXh0LmlzUlRMXHJcblxyXG4gIHJldHVybiBjc3NgXHJcbiAgICAucG9wdXBDb250ZW50cyB7XHJcbiAgICAgIHdpZHRoOiA0NTBweDtcclxuICAgIH1cclxuXHJcbiAgICAuaW52YWxpZFNlcnZpY2VVUkwge1xyXG4gICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIH1cclxuXHJcbiAgICAudmFsaWRTZXJ2aWNlVVJMIHtcclxuICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgIH1cclxuXHJcbiAgICAubG9jYXRvckVycm9yTWVzc2FnZSB7XHJcbiAgICAgIHBhZGRpbmctdG9wOiA1cHg7XHJcbiAgICAgIGNvbG9yOiAke3RoZW1lLmNvbG9ycy5kYW5nZXJ9O1xyXG4gICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIH1cclxuXHJcbiAgICAuYWxlcnRWYWxpZGF0aW9uQ29udGVudCB7XHJcbiAgICAgIGhlaWdodDogNDJweDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLmxvY2F0ZXJVcmxUZXh0SW5wdXQgLmlucHV0LXdyYXBwZXIgaW5wdXQge1xyXG4gICAgICBwYWRkaW5nOiAke2lzUlRMID8gJzAgMXB4JyA6ICcwJ307XHJcbiAgICB9XHJcbiAgYFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0V2lkZ2V0RGlzcGxheU9wdGlvbnNTdHlsZSAodGhlbWU6IFRoZW1lVmFyaWFibGVzKTogU2VyaWFsaXplZFN0eWxlcyB7XHJcbiAgcmV0dXJuIGNzc2BcclxuICAgICAgbGFiZWwge1xyXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgICAgIG1hcmdpbi1sZWZ0OiA1cHg7XHJcbiAgICAgIH1cclxuICAgICAgLnN3aXRjaC1zZWxlY3Qge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwMUFBQkI7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiAjMDFBQUJCO1xyXG4gICAgICB9XHJcbiAgICAgIC5zd2l0Y2gtc2VsZWN0IC5zd2l0Y2gtc2xpZGVyIHtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwICFpbXBvcnRhbnQ7XHJcbiAgICAgIH1cclxuICAgICAgLnN3aXRjaC1zZWxlY3QuY2hlY2tlZCB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDtcclxuICAgICAgICBib3JkZXItY29sb3I6ICMwMUFBQkI7XHJcbiAgICAgIH1cclxuICAgICAgLnN3aXRjaC1zZWxlY3QuY2hlY2tlZCAuc3dpdGNoLXNsaWRlciB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzAxQUFCQiAhaW1wb3J0YW50O1xyXG4gICAgICB9XHJcbiAgYFxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgc2VsZWN0TWFwV2lkZ2V0OiAnU2VsZWN0IGEgTWFwJyxcbiAgdzN3TG9jYXRvcjogJ1NlbGVjdCB5b3VyIHdoYXQzd29yZHMgbG9jYXRvcicsXG4gIGFkZHJlc3NTZXR0aW5nc0xhYmVsOiAnTG9jYXRvciBTZXR0aW5ncycsXG4gIGxvY2F0b3JTZXJ2aWNlTGFiZWw6ICdTZXQgbG9jYXRvcicsXG4gIGFsZXJ0UG9wdXBUaXRsZTogJ1NlbGVjdCBHZW9jb2RlIFNlcnZpY2UnLFxuICBpbnZhbGlkTG9jYXRvclNlcnZpY2VVUkw6ICdQbGVhc2UgZW50ZXIgdmFsaWQgZ2VvY29kZSBzZXJ2aWNlIHVybCcsXG4gIHdpZGdldERpc3BsYXlPcHRpb25zOiAnV2lkZ2V0IERpc3BsYXkgT3B0aW9ucycsXG4gIGRpc3BsYXlDb29yZGluYXRlczogJ0Rpc3BsYXkgTGF0L0xvbmcnLFxuICBkaXNwbGF5Q29weUJ1dHRvbjogJ0Rpc3BsYXkgQ29weSBCdXR0b24nLFxuICBkaXNwbGF5Wm9vbUJ1dHRvbjogJ0Rpc3BsYXkgWm9vbSBCdXR0b24nLFxuICBkaXNwbGF5UG9wdXBNZXNzYWdlOiAnRGlzcGxheSBQb3B1cCBNZXNzYWdlJ1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2ppbXVfY29yZV9fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qaW11X3VpX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2ppbXVfdWlfYWR2YW5jZWRfc2V0dGluZ19jb21wb25lbnRzX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiOyIsIi8qKlxyXG4gKiBXZWJwYWNrIHdpbGwgcmVwbGFjZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB3aXRoIF9fd2VicGFja19yZXF1aXJlX18ucCB0byBzZXQgdGhlIHB1YmxpYyBwYXRoIGR5bmFtaWNhbGx5LlxyXG4gKiBUaGUgcmVhc29uIHdoeSB3ZSBjYW4ndCBzZXQgdGhlIHB1YmxpY1BhdGggaW4gd2VicGFjayBjb25maWcgaXM6IHdlIGNoYW5nZSB0aGUgcHVibGljUGF0aCB3aGVuIGRvd25sb2FkLlxyXG4gKiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcclxuLy8gQHRzLWlnbm9yZVxyXG5fX3dlYnBhY2tfcHVibGljX3BhdGhfXyA9IHdpbmRvdy5qaW11Q29uZmlnLmJhc2VVcmxcclxuIiwiLyoqIEBqc3gganN4ICovXG5pbXBvcnQgeyBSZWFjdCwganN4LCBnZXRBcHBTdG9yZSwgRm9ybWF0dGVkTWVzc2FnZSB9IGZyb20gJ2ppbXUtY29yZSdcbmltcG9ydCB7IEFsbFdpZGdldFNldHRpbmdQcm9wcyB9IGZyb20gJ2ppbXUtZm9yLWJ1aWxkZXInXG5pbXBvcnQgQWRkcmVzc1NldHRpbmdzIGZyb20gJy4vY29tcG9uZW50cy9sb2NhdG9yLXNldHRpbmdzJ1xuaW1wb3J0IHsgTWFwV2lkZ2V0U2VsZWN0b3IsIFNldHRpbmdDb2xsYXBzZSwgU2V0dGluZ1JvdywgU2V0dGluZ1NlY3Rpb24gfSBmcm9tICdqaW11LXVpL2FkdmFuY2VkL3NldHRpbmctY29tcG9uZW50cydcbmltcG9ydCBkZWZhdWx0TWVzc2FnZXMgZnJvbSAnLi90cmFuc2xhdGlvbnMvZGVmYXVsdCdcbmltcG9ydCB7IGdldFdpZGdldERpc3BsYXlPcHRpb25zU3R5bGUgfSBmcm9tICcuL2xpYi9zdHlsZSdcbmltcG9ydCB7IFN3aXRjaCB9IGZyb20gJ2ppbXUtdWknXG5cbmludGVyZmFjZSBTdGF0ZSB7XG4gIGlzQWRkcmVzc1NldHRpbmdzT3BlbjogYm9vbGVhblxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXR0aW5nIGV4dGVuZHMgUmVhY3QuUHVyZUNvbXBvbmVudDxBbGxXaWRnZXRTZXR0aW5nUHJvcHM8YW55PiwgU3RhdGU+IHtcbiAgcHJpdmF0ZSByZWFkb25seSBpc1JUTDogYm9vbGVhblxuXG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc0FkZHJlc3NTZXR0aW5nc09wZW46IHRydWVcbiAgICB9XG5cbiAgICB0aGlzLmlzUlRMID0gZmFsc2VcblxuICAgIGNvbnN0IGFwcFN0YXRlID0gZ2V0QXBwU3RvcmUoKS5nZXRTdGF0ZSgpXG4gICAgdGhpcy5pc1JUTCA9IGFwcFN0YXRlPy5hcHBDb250ZXh0Py5pc1JUTFxuICB9XG5cbiAgbmxzID0gKGlkOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5pbnRsLmZvcm1hdE1lc3NhZ2UoeyBpZDogaWQsIGRlZmF1bHRNZXNzYWdlOiBkZWZhdWx0TWVzc2FnZXNbaWRdIH0pXG4gIH1cblxuICBvbk1hcFdpZGdldFNlbGVjdGVkID0gKHVzZU1hcFdpZGdldElkczogc3RyaW5nW10pID0+IHtcbiAgICB0aGlzLnByb3BzLm9uU2V0dGluZ0NoYW5nZSh7XG4gICAgICBpZDogdGhpcy5wcm9wcy5pZCxcbiAgICAgIHVzZU1hcFdpZGdldElkczogdXNlTWFwV2lkZ2V0SWRzXG4gICAgfSlcbiAgfVxuXG4gIG9uVG9nZ2xlQWRkcmVzc1NldHRpbmdzID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNBZGRyZXNzU2V0dGluZ3NPcGVuOiAhdGhpcy5zdGF0ZS5pc0FkZHJlc3NTZXR0aW5nc09wZW5cbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlQWRkcmVzc1NldHRpbmdzID0gKHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpID0+IHtcbiAgICB0aGlzLnByb3BzLm9uU2V0dGluZ0NoYW5nZSh7XG4gICAgICBpZDogdGhpcy5wcm9wcy5pZCxcbiAgICAgIGNvbmZpZzogdGhpcy5wcm9wcy5jb25maWcuc2V0SW4oWydhZGRyZXNzU2V0dGluZ3MnLCBwcm9wZXJ0eV0sIHZhbHVlKVxuICAgIH0pXG4gIH1cblxuICBzZXRXM3dMb2NhdG9yID0gKHczd0xvY2F0b3I6IHN0cmluZykgPT4ge1xuICAgIHRoaXMucHJvcHMub25TZXR0aW5nQ2hhbmdlKHtcbiAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxuICAgICAgY29uZmlnOiB0aGlzLnByb3BzLmNvbmZpZy5zZXQoJ3czd0xvY2F0b3InLCB3M3dMb2NhdG9yKVxuICAgIH0pXG4gIH1cblxuICBzd2l0Y2hEaXNwbGF5Q29vcmRpbmF0ZXMgPSAoZXZ0OiBSZWFjdC5Gb3JtRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHtcbiAgICB0aGlzLnByb3BzLm9uU2V0dGluZ0NoYW5nZSh7XG4gICAgICBpZDogdGhpcy5wcm9wcy5pZCxcbiAgICAgIGNvbmZpZzogdGhpcy5wcm9wcy5jb25maWcuc2V0KCdkaXNwbGF5Q29vcmRpbmF0ZXMnLCBldnQuY3VycmVudFRhcmdldC5jaGVja2VkKVxuICAgIH0pXG4gIH1cblxuICBzd2l0Y2hEaXNwbGF5Q29weUJ1dHRvbiA9IChldnQ6IFJlYWN0LkZvcm1FdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT4ge1xuICAgIHRoaXMucHJvcHMub25TZXR0aW5nQ2hhbmdlKHtcbiAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxuICAgICAgY29uZmlnOiB0aGlzLnByb3BzLmNvbmZpZy5zZXQoJ2Rpc3BsYXlDb3B5QnV0dG9uJywgZXZ0LmN1cnJlbnRUYXJnZXQuY2hlY2tlZClcbiAgICB9KVxuICB9XG5cbiAgc3dpdGNoRGlzcGxheVpvb21CdXR0b24gPSAoZXZ0OiBSZWFjdC5Gb3JtRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHtcbiAgICB0aGlzLnByb3BzLm9uU2V0dGluZ0NoYW5nZSh7XG4gICAgICBpZDogdGhpcy5wcm9wcy5pZCxcbiAgICAgIGNvbmZpZzogdGhpcy5wcm9wcy5jb25maWcuc2V0KCdkaXNwbGF5Wm9vbUJ1dHRvbicsIGV2dC5jdXJyZW50VGFyZ2V0LmNoZWNrZWQpXG4gICAgfSlcbiAgfVxuXG4gIHN3aXRjaERpc3BsYXlQb3B1cE1lc3NhZ2UgPSAoZXZ0OiBSZWFjdC5Gb3JtRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHtcbiAgICB0aGlzLnByb3BzLm9uU2V0dGluZ0NoYW5nZSh7XG4gICAgICBpZDogdGhpcy5wcm9wcy5pZCxcbiAgICAgIGNvbmZpZzogdGhpcy5wcm9wcy5jb25maWcuc2V0KCdkaXNwbGF5UG9wdXBNZXNzYWdlJywgZXZ0LmN1cnJlbnRUYXJnZXQuY2hlY2tlZClcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gPGRpdiBjc3M9e2dldFdpZGdldERpc3BsYXlPcHRpb25zU3R5bGUodGhpcy5wcm9wcy50aGVtZSl9IGNsYXNzTmFtZT1cIndpZGdldC13aGF0M3dvcmRzLXNldHRpbmdcIj5cbiAgICAgIDxTZXR0aW5nU2VjdGlvblxuICAgICAgICAgIGNsYXNzTmFtZT1cIm1hcC1zZWxlY3Rvci1zZWN0aW9uXCJcbiAgICAgICAgICB0aXRsZT17dGhpcy5wcm9wcy5pbnRsLmZvcm1hdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgaWQ6ICdzZWxlY3RNYXBXaWRnZXQnLFxuICAgICAgICAgICAgZGVmYXVsdE1lc3NhZ2U6IGRlZmF1bHRNZXNzYWdlcy5zZWxlY3RNYXBXaWRnZXRcbiAgICAgICAgICB9KX0+XG4gICAgICAgICAgPFNldHRpbmdSb3c+XG4gICAgICAgICAgPE1hcFdpZGdldFNlbGVjdG9yXG4gICAgICAgICAgICB1c2VNYXBXaWRnZXRJZHM9e3RoaXMucHJvcHMudXNlTWFwV2lkZ2V0SWRzfVxuICAgICAgICAgICAgb25TZWxlY3Q9e3RoaXMub25NYXBXaWRnZXRTZWxlY3RlZH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDwvU2V0dGluZ1Jvdz5cbiAgICAgIDwvU2V0dGluZ1NlY3Rpb24+XG4gICAgICA8U2V0dGluZ1NlY3Rpb24+XG4gICAgICAgIDxTZXR0aW5nQ29sbGFwc2VcbiAgICAgICAgICBkZWZhdWx0SXNPcGVuXG4gICAgICAgICAgbGFiZWw9e3RoaXMubmxzKCdhZGRyZXNzU2V0dGluZ3NMYWJlbCcpfVxuICAgICAgICAgIGlzT3Blbj17dGhpcy5zdGF0ZS5pc0FkZHJlc3NTZXR0aW5nc09wZW59XG4gICAgICAgICAgb25SZXF1ZXN0T3Blbj17KCkgPT4gdGhpcy5vblRvZ2dsZUFkZHJlc3NTZXR0aW5ncygpfVxuICAgICAgICAgIG9uUmVxdWVzdENsb3NlPXsoKSA9PiB0aGlzLm9uVG9nZ2xlQWRkcmVzc1NldHRpbmdzKCl9PlxuICAgICAgICAgIDxTZXR0aW5nUm93IGZsb3c9J3dyYXAnPlxuICAgICAgICAgICAgPEFkZHJlc3NTZXR0aW5nc1xuICAgICAgICAgICAgICBpbnRsPXt0aGlzLnByb3BzLmludGx9XG4gICAgICAgICAgICAgIHRoZW1lPXt0aGlzLnByb3BzLnRoZW1lfVxuICAgICAgICAgICAgICBwb3J0YWxTZWxmPXt0aGlzLnByb3BzLnBvcnRhbFNlbGZ9XG4gICAgICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWcuYWRkcmVzc1NldHRpbmdzfVxuICAgICAgICAgICAgICBpc1JUTD17dGhpcy5pc1JUTH1cbiAgICAgICAgICAgICAgb25BZGRyZXNzU2V0dGluZ3NVcGRhdGVkPXt0aGlzLnVwZGF0ZUFkZHJlc3NTZXR0aW5nc31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9TZXR0aW5nUm93PlxuICAgICAgICA8L1NldHRpbmdDb2xsYXBzZT5cbiAgICAgIDwvU2V0dGluZ1NlY3Rpb24+XG4gICAgICA8U2V0dGluZ1NlY3Rpb25cbiAgICAgICAgY2xhc3NOYW1lPVwibWFwLXNlbGVjdG9yLXNlY3Rpb25cIlxuICAgICAgICB0aXRsZT17dGhpcy5wcm9wcy5pbnRsLmZvcm1hdE1lc3NhZ2Uoe1xuICAgICAgICAgIGlkOiAnd2lkZ2V0RGlzcGxheU9wdGlvbnMnLFxuICAgICAgICAgIGRlZmF1bHRNZXNzYWdlOiBkZWZhdWx0TWVzc2FnZXMud2lkZ2V0RGlzcGxheU9wdGlvbnNcbiAgICAgICAgfSl9PlxuICAgICAgICA8U2V0dGluZ1Jvdz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xMDBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoZWNrYm94LXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXsodGhpcy5wcm9wcy5jb25maWcgJiYgdGhpcy5wcm9wcy5jb25maWcuZGlzcGxheUNvb3JkaW5hdGVzKSB8fCBmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLnN3aXRjaERpc3BsYXlDb29yZGluYXRlc31cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9XCJkaXNwbGF5Q29vcmRpbmF0ZXNcIiBkZWZhdWx0TWVzc2FnZT17ZGVmYXVsdE1lc3NhZ2VzLmRpc3BsYXlDb29yZGluYXRlc30gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1NldHRpbmdSb3c+XG4gICAgICAgIDxTZXR0aW5nUm93PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEwMFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hlY2tib3gtcm93XCI+XG4gICAgICAgICAgICAgICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9eyh0aGlzLnByb3BzLmNvbmZpZyAmJiB0aGlzLnByb3BzLmNvbmZpZy5kaXNwbGF5Q29weUJ1dHRvbikgfHwgZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5zd2l0Y2hEaXNwbGF5Q29weUJ1dHRvbn1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9XCJkaXNwbGF5Q29weUJ1dHRvblwiIGRlZmF1bHRNZXNzYWdlPXtkZWZhdWx0TWVzc2FnZXMuZGlzcGxheUNvcHlCdXR0b259IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9TZXR0aW5nUm93PlxuICAgICAgICA8U2V0dGluZ1Jvdz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xMDBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoZWNrYm94LXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXsodGhpcy5wcm9wcy5jb25maWcgJiYgdGhpcy5wcm9wcy5jb25maWcuZGlzcGxheVpvb21CdXR0b24pIHx8IGZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuc3dpdGNoRGlzcGxheVpvb21CdXR0b259XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPVwiZGlzcGxheVpvb21CdXR0b25cIiBkZWZhdWx0TWVzc2FnZT17ZGVmYXVsdE1lc3NhZ2VzLmRpc3BsYXlab29tQnV0dG9ufSAvPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvU2V0dGluZ1Jvdz5cbiAgICAgICAgPFNldHRpbmdSb3c+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMTAwXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGVja2JveC1yb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17KHRoaXMucHJvcHMuY29uZmlnICYmIHRoaXMucHJvcHMuY29uZmlnLmRpc3BsYXlQb3B1cE1lc3NhZ2UpIHx8IGZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuc3dpdGNoRGlzcGxheVBvcHVwTWVzc2FnZX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9XCJkaXNwbGF5UG9wdXBNZXNzYWdlXCIgZGVmYXVsdE1lc3NhZ2U9e2RlZmF1bHRNZXNzYWdlcy5kaXNwbGF5UG9wdXBNZXNzYWdlfSAvPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvU2V0dGluZ1Jvdz5cbiAgICA8L1NldHRpbmdTZWN0aW9uPlxuICAgIDwvZGl2PlxuICB9XG59XG5cbiBleHBvcnQgZnVuY3Rpb24gX19zZXRfd2VicGFja19wdWJsaWNfcGF0aF9fKHVybCkgeyBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyA9IHVybCB9Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9