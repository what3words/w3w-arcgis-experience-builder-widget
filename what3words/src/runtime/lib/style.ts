import type { IMThemeVariables, SerializedStyles } from 'jimu-core'
import { css } from 'jimu-core'
export function getW3WStyle (theme: IMThemeVariables): SerializedStyles {
  return css`

      .w3w-card {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
      }

      .card-title {
        font-size: 16px;
        color: #0A3049;
        font-weight: bold;
        margin: 0;
      }

      .w3w-address-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }

      .w3w-slash {
        color: #E11F26;
        font-size: 20px;
      }

      .w3w-text {
        font-size: 20px;
        color: #0A3049;
        flex: 1;
        word-wrap: break-word;
      }

      .w3w-placeholder {
        font-size: 14px;
        line-height: 1.2;
        font-weight: 400;
        color: #525252;
        text-align: center;
      }

      .w3w-error {
        color: #E11F26;
        font-weight: 600;
        font-size: 14px;
      }

      .w3w-address {
        font-size: 20px;
        font-weight: bold;
        color: #0A3049;
      }

      .w3w-actions {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }

      .copy-button{
        display: flex;
        margin: 0 4px;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        & svg {
          width: 18px;
          height: 18px;
        }
      }

      .card-subtitle {
        font-size: 14px;
        color: #525252;
        margin: 0;
      }

      .show-grid-title {
        font-size: 14px;
        color: #0A3049;
        font-weight: bold;
        margin-inline-start: 8px;
      }

      .button-group-container {
        width: 100%;
      }

      .full-width {
        display: flex;
        width: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        flex-wrap: wrap;
      }

      .full-width .jimu-btn span {
        margin-left: 6px;
        flex-shrink: 1; /* Allow text to resize or ellipsis if needed */
        text-overflow: ellipsis; /* Truncate text if it's too long */
        white-space: nowrap; /* Prevent wrapping of text */
      }

      .full-width .jimu-btn img {
        margin-right: 6px;
        flex-shrink: 0;
      }

      .full-width .jimu-btn.active {
        background-color: #00456b; 
      }

      .action-buttons {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .action-buttons button {
        display: flex;
        align-items: center;
        padding: 6px 10px;
        font-size: 14px;
        background: none;
        border: .1px solid transparent;
        border-radius: 4px;
        transition: all 0.2s;
        flex: 1;
        justify-content: center;
      }

      .action-buttons button:hover {
        background-color: #005379;
      }

      .action-buttons button span {
        white-space: nowrap;
      }

      .full-width .jimu-btn.active {
        background-color: #005379; /* Active background color */
        color: #ffffff; /* White text for contrast */
        font-weight: bolder;
        cursor: pointer;
      }

      .full-width .jimu-btn.active img,
      .full-width .jimu-btn.active span {
        color: #ffffff; /* Ensure text and icons are visible */
      }

      .full-width .export-button {
        border-left: 1px solid #fff; /* Left border for the Export button */
        border-right: 1px solid #fff; /* Right border for the Export button */
      }

      button span {
        margin-left: 5px;
      }

      @media (max-width: 768px) {
      .w3w-card {
        padding: 12px; /* Reduce padding for smaller screens */
        gap: 8px; /* Reduce spacing */
      }

      .full-width .jimu-btn {
        padding: 8px; /* Adjust padding for smaller buttons */
        font-size: 13px; /* Reduce font size */
      }

      .action-buttons button {
        padding: 6px 8px; /* Compact button padding */
        font-size: 12px; /* Smaller font for mobile */
      }
    }
    `
}
