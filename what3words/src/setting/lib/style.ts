import { ThemeVariables, css, SerializedStyles, getAppStore } from 'jimu-core'

export function getAddressSettingsStyle (theme: ThemeVariables): SerializedStyles {
  return css`

  .locator-url {
    background-color: ${theme.colors.palette.dark[200]};
    padding: 2px;
  }
  
  .locator-url label {
    word-break: break-all;
  }

  `
}

export function getAlertPopupStyle (theme: ThemeVariables): SerializedStyles {
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
      color: ${theme.colors.danger};
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

export function getWidgetDisplayOptionsStyle (theme: ThemeVariables): SerializedStyles {
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
  `
}
