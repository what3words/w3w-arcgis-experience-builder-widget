import { css, getAppStore } from 'jimu-core'
import type { IMThemeVariables, SerializedStyles } from 'jimu-core'

export function getAddressSettingsStyle (theme: IMThemeVariables): SerializedStyles {
  return css`

  .locator-url {
    background-color: ${theme.ref.palette.neutral[800]};
    padding: 2px;
  }
  
  .locator-url label {
    word-break: break-all;
  }

  `
}

export function getAlertPopupStyle (theme: IMThemeVariables): SerializedStyles {
  const isRTL = getAppStore().getState().appContext.isRTL

  return css`
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
      color: ${theme.sys.color.error.main};
      font-weight: bold;
    }

    .alertValidationContent {
      height: 42px;
    }
    
    .locaterUrlTextInput .input-wrapper input {
      padding: ${isRTL ? '0 1px' : '0'};
    }
  `
}

export function getWidgetDisplayOptionsStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
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


      .lang-dropdown {
        max-width: 300px; 
        max-height: 200px; 
        overflow-y: auto; 
        font-size: 14px; 
        /* width: 100%; */
      }

      .lang-item {
        display: 'flex'; 
        flex-direction: 'column';
        font-size: 14px;
      }

      .jimu-btn.jimu-dropdown-button.dropdown-button.app-root-emotion-cache-ltr-g3evx9.btn.btn-link {
        height: auto;
      }
  `
}
