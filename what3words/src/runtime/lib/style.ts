import { ThemeVariables, css, SerializedStyles } from 'jimu-core'
export function getW3WStyle (theme: ThemeVariables): SerializedStyles {
  return css`
  
      .w3wBlock {
        display:block;
        white-space:nowrap;
        overflow:hidden;
      }
      .w3wRed {
        color:#E11F26;
      }
      .w3wCoords {
        background:#0A3049;
        width:100%;
        color:#fff;
        padding: 5px;
      }
      .w3wCoordsProp {
        display:inline-block;
        margin-right:20px;
        margin-left: 5px;
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
        color: #E11F26;
      }
      .actionButton:disabled{
        cursor: default;
      }
    `
}
