import type { IMThemeVariables, SerializedStyles } from 'jimu-core'
import { css } from 'jimu-core'
export function getW3WStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
      .toggle-grid-button.disabled {
        pointer-events: none; /* Prevent click events */
        opacity: 0.5; /* Reduce visibility */
      }

      .toggle-grid-button img {
        transition: opacity 0.3s ease; /* Smooth transition for better UI */
      }

      .toggle-grid-button.disabled img {
        opacity: 0.5; /* Apply greyed-out effect */
      }

      .toggle-grid-button.active {
        cursor: pointer;
      }
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
        color: #E11F26;
      }
      .actionButton.disabled {
        pointer-events: none; /* Prevent click events */
        color: grey; /* Grey out text */
        opacity: 0.5; /* Reduce visibility */
      }
    `
}
