import { ThemeVariables, css, SerializedStyles } from 'jimu-core'
export function getW3WStyle (theme: ThemeVariables): SerializedStyles {
  return css`
  
      .w3wBlock {
        display:block;
        white-space:nowrap;
        overflow:hidden;
      }
      .w3wRed {
        color:#e11f26;
      }
      .w3wCoords {
        background:#00456b;
        width:100%;
        color:#fff;
      }
      .w3wCoordsProp {
        display:inline-block;
        margin-right:20px;
      }
      .w3wCoordsFirstCol {
        display:inline-block;
        margin-right:5px;
        font-weight: 700;
      }
      .float-right {
        float:right;
      }
      .actionButton {
        margin: 2px 2px 0px 2px;
      }
      .actionButton {
        color: #e11f26;
      }
      .actionButton:disabled{
        cursor: default;
      }
    `
}
