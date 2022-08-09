import { ImmutableObject } from 'jimu-core'

export interface Config {
  w3wLocator: string
  displayCoordinates: boolean
  displayCopyButton: boolean
  displayZoomButton: boolean
  displayPopupMessage: boolean
  addressSettings: AddressSettings
}
export interface AddressSettings {
  geocodeServiceUrl: string
}
export type IMConfig = ImmutableObject<Config>
export type IMAddressSettings = ImmutableObject<AddressSettings>
