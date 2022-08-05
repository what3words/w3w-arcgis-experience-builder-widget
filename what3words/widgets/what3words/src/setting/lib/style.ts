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
