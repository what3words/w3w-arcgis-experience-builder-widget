import type { IMThemeVariables, SerializedStyles } from 'jimu-core'
import { css } from 'jimu-core'
export function getW3WStyle (theme: IMThemeVariables): SerializedStyles {
  return css`

      .w3w-card {
        background-color: ${theme.ref.palette.neutral[200]};
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        max-width: 400px;
        margin: 16px auto;
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
      }

      .w3w-slash {
        color: #E11F26;
        font-size: 20px;
      }

      .w3w-text {
        font-size: 20px;
        color: #0A3049;
      }

      .w3w-placeholder {
        font-size: 14px; 
        line-height: 1.2; 
        font-weight: 400; 
        color: #525252;
        text-align: center; 
      }

      .w3w-address {
        font-size: 20px;
        font-weight: bold;
        color: #0A3049;
      }

      .w3w-actions {
        display: flex;
        gap: 4px;
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

      .button-group-container {
        width: 100%; 
      }

      .full-width {
        display: flex;
        width: 100%; 
        margin: 0; 
        padding: 0; 
        box-sizing: border-box;
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
      }

      .action-buttons button:hover {
        background-color: #005379;
      }

      .action-buttons button span {
        white-space: nowrap;
      }
            
      .toggle-grid-button.jimu-btn, 
      .export-button.jimu-btn,
      .mapsite-button.jimu-btn {
        flex: 1; /* Equal width for all buttons */
        display: flex; /* Flexbox inside the button for alignment */
        align-items: center; /* Center content vertically */
        justify-content: center; /* Center content horizontally */
        text-align: center; /* Center-align text */
        box-sizing: border-box; /* Include padding and border in width calculation */
        font-size: 13px; /* Set font size */
        padding: 5px; /* Padding for spacing inside buttons */
        background-color: #00456b; /* Button background */
        color: #ffffff; /* Text color */
        font-weight: bold; /* Bold text */
      }

      .toggle-grid-button.disabled, 
      .export-button.disabled, 
      .mapsite-button.disabled {
        pointer-events: none; /* Prevent click events */
        opacity: 0.5; /* Reduce visibility */
      }

      .toggle-grid-button img {
        transition: opacity 0.3s ease; /* Smooth transition for better UI */
      }

      .toggle-grid-button.disabled img {
        opacity: 0.5; /* Apply greyed-out effect */
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
