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
        font-size: 14px; /* Smaller, compact font size */
        line-height: 1.2; /* Reduced line height for compactness */
        font-weight: 400; /* Lighter weight for a cleaner look */
        color: #666; /* Subtle placeholder color */
        text-align: center; /* Center-align text */
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

      .w3w-actions-row {
        display: flex;
        justify-content: space-around;
        align-items: center;
        gap: 12px;
      }

      button span {
        margin-left: 8px;
      }
    `
}
