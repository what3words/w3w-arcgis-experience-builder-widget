System.register(["jimu-core","jimu-ui","jimu-ui/advanced/setting-components"],(function(e,t){var s={},o={},i={};return{setters:[function(e){s.FormattedMessage=e.FormattedMessage,s.React=e.React,s.css=e.css,s.getAppStore=e.getAppStore,s.jsx=e.jsx,s.urlUtils=e.urlUtils},function(e){o.AlertPopup=e.AlertPopup,o.Button=e.Button,o.Label=e.Label,o.Switch=e.Switch,o.TextInput=e.TextInput},function(e){i.MapWidgetSelector=e.MapWidgetSelector,i.SettingCollapse=e.SettingCollapse,i.SettingRow=e.SettingRow,i.SettingSection=e.SettingSection}],execute:function(){e((()=>{var e={891:e=>{"use strict";e.exports=s},726:e=>{"use strict";e.exports=o},756:e=>{"use strict";e.exports=i}},t={};function r(s){var o=t[s];if(void 0!==o)return o.exports;var i=t[s]={exports:{}};return e[s](i,i.exports,r),i.exports}r.d=(e,t)=>{for(var s in t)r.o(t,s)&&!r.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.p="";var a={};return r.p=window.jimuConfig.baseUrl,(()=>{"use strict";r.r(a),r.d(a,{default:()=>c});var e=r(891),t=r(726),s=r(756);function o(t){const s=(0,e.getAppStore)().getState().appContext.isRTL;return e.css`
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
      color: ${t.colors.danger};
      font-weight: bold;
    }

    .alertValidationContent {
      height: 42px;
    }
    
    .locaterUrlTextInput .input-wrapper input {
      padding: ${s?"0 1px":"0"};
    }
  `}const i={selectMapWidget:"Select a Map",w3wLocator:"Select your what3words locator",addressSettingsLabel:"Locator Settings",locatorServiceLabel:"Set locator",alertPopupTitle:"Select Geocode Service",invalidLocatorServiceURL:"Please enter valid geocode service url",widgetDisplayOptions:"Widget Display Options",displayCoordinates:"Display Lat/Long",displayCopyButton:"Display Copy Button",displayZoomButton:"Display Zoom Button",displayPopupMessage:"Display Popup Message"};const n=/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;class l extends e.React.PureComponent{constructor(t){super(t),this.geocodeTextBox=e.React.createRef(),this.nls=e=>this.props.intl.formatMessage({id:e,defaultMessage:i[e]}),this.componentDidMount=()=>{this.props.onAddressSettingsUpdated("geocodeServiceUrl",this.state.geocodeLocatorUrl)},this.onSetLocatorClicked=()=>{this.setState({isAlertPopupOpen:!0,isInvalidValue:!1},(()=>{setTimeout((()=>{const e=window.jimuUA.browser?(window.jimuUA.browser.name+"").toLowerCase():"";"chrome"===e||"microsoft edge"===e?(this.geocodeTextBox.current.selectionStart=this.geocodeTextBox.current.selectionEnd=0,this.geocodeTextBox.current.focus()):(this.props.isRTL||(this.geocodeTextBox.current.selectionStart=this.geocodeTextBox.current.selectionEnd=0),this.geocodeTextBox.current.focus())}),1e3)})),setTimeout((()=>{const e=this.state.geocodeLocatorUrl;this.setState({updateGeocodeLocatorUrl:e})}),500)},this.onAlertOkButtonClicked=()=>{""!==this.geocodeTextBox.current.value&&(this.state.isInvalidValue||(this.setState({geocodeLocatorUrl:this.geocodeTextBox.current.value}),this.props.onAddressSettingsUpdated("geocodeServiceUrl",this.geocodeTextBox.current.value),this.onAlertCloseButtonClicked()))},this.onAlertCloseButtonClicked=()=>{this.setState({isAlertPopupOpen:!1})},this.onInputChange=e=>{this.setState({updateGeocodeLocatorUrl:e});let t=!1;this._validateGeocodeService().then((e=>{console.log(e),t=!!e,this.setState({isInvalidValue:!t})}))},this._validateGeocodeService=()=>{return e=this,t=void 0,o=function*(){if(!this.geocodeTextBox.current.value||!n.test(this.geocodeTextBox.current.value))return!1;try{return yield fetch(this.geocodeTextBox.current.value+"?f=json").then((e=>e.json())).then((e=>403===e.error.code))}catch(e){return console.log("Error: "+e.message),!1}},new((s=void 0)||(s=Promise))((function(i,r){function a(e){try{l(o.next(e))}catch(e){r(e)}}function n(e){try{l(o.throw(e))}catch(e){r(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof s?t:new s((function(e){e(t)}))).then(a,n)}l((o=o.apply(e,t||[])).next())}));var e,t,s,o},this.geocodeTextBox=e.React.createRef();let s="https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";this.props.config&&this.props.config.geocodeServiceUrl?s=this.props.config.geocodeServiceUrl:this.props.portalSelf&&this.props.portalSelf.helperServices&&this.props.portalSelf.helperServices.geocode&&this.props.portalSelf.helperServices.geocode.length>0&&this.props.portalSelf.helperServices.geocode[0].url&&(s=this.props.portalSelf.helperServices.geocode[0].url),this.state={geocodeLocatorUrl:s,updateGeocodeLocatorUrl:s,isAlertPopupOpen:!1,isInvalidValue:!1}}render(){return(0,e.jsx)("div",{style:{height:"100%",marginTop:"5px"}},(0,e.jsx)("div",{css:(i=this.props.theme,e.css`

  .locator-url {
    background-color: ${i.colors.palette.dark[200]};
    padding: 2px;
  }
  
  .locator-url label {
    word-break: break-all;
  }

  `)},(0,e.jsx)(s.SettingRow,null,(0,e.jsx)(t.Button,{role:"button","aria-haspopup":"dialog",className:"w-100 text-dark",type:"primary",onClick:this.onSetLocatorClicked.bind(this)},this.nls("locatorServiceLabel"))),(0,e.jsx)(s.SettingRow,{className:"locator-url"},(0,e.jsx)(t.Label,{tabIndex:0,"aria-label":this.state.geocodeLocatorUrl},this.state.geocodeLocatorUrl)),(0,e.jsx)(t.AlertPopup,{isOpen:this.state.isAlertPopupOpen&&!e.urlUtils.getAppIdPageIdFromUrl().pageId,css:o(this.props.theme),onClickOk:this.onAlertOkButtonClicked.bind(this),onClickClose:this.onAlertCloseButtonClicked,title:this.props.intl?this.nls("alertPopupTitle"):""},(0,e.jsx)("div",{className:"popupContents"},(0,e.jsx)("div",{className:"alertValidationContent"},(0,e.jsx)(t.TextInput,{role:"textbox","aria-label":this.state.geocodeLocatorUrl,required:!0,className:this.state.isInvalidValue?"locaterUrlTextInput w-100 is-invalid":"locaterUrlTextInput w-100 is-valid",size:"sm",type:"text",ref:this.geocodeTextBox,value:this.state.updateGeocodeLocatorUrl,onChange:e=>this.onInputChange(e.currentTarget.value)}),(0,e.jsx)("div",{className:this.state.isInvalidValue?"invalidServiceURL locatorErrorMessage":"validServiceURL"},this.nls("invalidLocatorServiceURL")))))));var i}}class c extends e.React.PureComponent{constructor(t){var s;super(t),this.nls=e=>this.props.intl.formatMessage({id:e,defaultMessage:i[e]}),this.onMapWidgetSelected=e=>{this.props.onSettingChange({id:this.props.id,useMapWidgetIds:e})},this.onToggleAddressSettings=()=>{this.setState({isAddressSettingsOpen:!this.state.isAddressSettingsOpen})},this.updateAddressSettings=(e,t)=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.setIn(["addressSettings",e],t)})},this.setW3wLocator=e=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.set("w3wLocator",e)})},this.switchDisplayCoordinates=e=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.set("displayCoordinates",e.currentTarget.checked)})},this.switchDisplayCopyButton=e=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.set("displayCopyButton",e.currentTarget.checked)})},this.switchDisplayZoomButton=e=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.set("displayZoomButton",e.currentTarget.checked)})},this.switchDisplayPopupMessage=e=>{this.props.onSettingChange({id:this.props.id,config:this.props.config.set("displayPopupMessage",e.currentTarget.checked)})},this.state={isAddressSettingsOpen:!0},this.isRTL=!1;const o=(0,e.getAppStore)().getState();this.isRTL=null===(s=null==o?void 0:o.appContext)||void 0===s?void 0:s.isRTL}render(){return(0,e.jsx)("div",{css:(this.props.theme,e.css`
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
  `),className:"widget-what3words-setting"},(0,e.jsx)(s.SettingSection,{className:"map-selector-section",title:this.props.intl.formatMessage({id:"selectMapWidget",defaultMessage:i.selectMapWidget})},(0,e.jsx)(s.SettingRow,null,(0,e.jsx)(s.MapWidgetSelector,{useMapWidgetIds:this.props.useMapWidgetIds,onSelect:this.onMapWidgetSelected}))),(0,e.jsx)(s.SettingSection,null,(0,e.jsx)(s.SettingCollapse,{defaultIsOpen:!0,label:this.nls("addressSettingsLabel"),isOpen:this.state.isAddressSettingsOpen,onRequestOpen:()=>this.onToggleAddressSettings(),onRequestClose:()=>this.onToggleAddressSettings()},(0,e.jsx)(s.SettingRow,{flow:"wrap"},(0,e.jsx)(l,{intl:this.props.intl,theme:this.props.theme,portalSelf:this.props.portalSelf,config:this.props.config.addressSettings,isRTL:this.isRTL,onAddressSettingsUpdated:this.updateAddressSettings})))),(0,e.jsx)(s.SettingSection,{className:"map-selector-section",title:this.props.intl.formatMessage({id:"widgetDisplayOptions",defaultMessage:i.widgetDisplayOptions})},(0,e.jsx)(s.SettingRow,null,(0,e.jsx)("div",{className:"w-100"},(0,e.jsx)("div",{className:"checkbox-row"},(0,e.jsx)(t.Switch,{checked:this.props.config&&this.props.config.displayCoordinates||!1,onChange:this.switchDisplayCoordinates}),(0,e.jsx)("label",null,(0,e.jsx)(e.FormattedMessage,{id:"displayCoordinates",defaultMessage:i.displayCoordinates}))))),(0,e.jsx)(s.SettingRow,null,(0,e.jsx)("div",{className:"w-100"},(0,e.jsx)("div",{className:"checkbox-row"},(0,e.jsx)(t.Switch,{checked:this.props.config&&this.props.config.displayCopyButton||!1,onChange:this.switchDisplayCopyButton}),(0,e.jsx)("label",null,(0,e.jsx)(e.FormattedMessage,{id:"displayCopyButton",defaultMessage:i.displayCopyButton}))))),(0,e.jsx)(s.SettingRow,null,(0,e.jsx)("div",{className:"w-100"},(0,e.jsx)("div",{className:"checkbox-row"},(0,e.jsx)(t.Switch,{checked:this.props.config&&this.props.config.displayZoomButton||!1,onChange:this.switchDisplayZoomButton}),(0,e.jsx)("label",null,(0,e.jsx)(e.FormattedMessage,{id:"displayZoomButton",defaultMessage:i.displayZoomButton}))))),(0,e.jsx)(s.SettingRow,null,(0,e.jsx)("div",{className:"w-100"},(0,e.jsx)("div",{className:"checkbox-row"},(0,e.jsx)(t.Switch,{checked:this.props.config&&this.props.config.displayPopupMessage||!1,onChange:this.switchDisplayPopupMessage}),(0,e.jsx)("label",null,(0,e.jsx)(e.FormattedMessage,{id:"displayPopupMessage",defaultMessage:i.displayPopupMessage})))))))}}})(),a})())}}}));