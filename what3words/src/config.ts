import { type ImmutableArray, type UseUtility, type ImmutableObject } from 'jimu-core'

export interface Config {
  mode: 'apiKey' | 'locatorUrl' // Mode for what3words API key or locator URL
  w3wApiKey: string
  w3wLocator: string
  displayCoordinates: boolean // Show lat/lon values
  displayCopyButton: boolean // Enable 'Copy' functionality
  displayGridButton: boolean
  displayExportButton: boolean
  displayMapsiteButton: boolean
  displayPopupMessage: boolean // Show popup messages on click
  addressSettings: AddressSettings // Nested configuration for geocode service
}

export interface AddressSettings {
  geocodeServiceUrl: string // URL for the geocode service
  useUtilitiesGeocodeService: ImmutableArray<UseUtility>

}

export type IMConfig = ImmutableObject<Config>
export type IMAddressSettings = ImmutableObject<AddressSettings>
