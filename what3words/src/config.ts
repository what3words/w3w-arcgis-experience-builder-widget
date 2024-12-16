import { type ImmutableArray, type UseUtility, type ImmutableObject } from 'jimu-core'

export interface Config {
  mode: 'apiKey' | 'locatorUrl' // Mode for what3words API key or locator URL
  w3wApiKey: string // what3words API key
  w3wLocator: string // what3words locator
  displayCoordinates: boolean // Show lat/lon values
  displayCopyButton: boolean // Enable 'Copy' functionality
  displayMapsiteButton: boolean // Enable 'Mapsite' functionality
  displayMapAnnotation: boolean // Show map annotation
  w3wLanguage: string //  Language for what3words
  displayNearestPlace: boolean // Show nearest place
  addressSettings: AddressSettings // Nested configuration for geocode service
}

export interface AddressSettings {
  geocodeServiceUrl: string // URL for the geocode service
  useUtilitiesGeocodeService: ImmutableArray<UseUtility>

}

export type IMConfig = ImmutableObject<Config>
export type IMAddressSettings = ImmutableObject<AddressSettings>
