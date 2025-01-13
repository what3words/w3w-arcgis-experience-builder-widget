import {
  type ImmutableArray,
  type UseUtility,
  type ImmutableObject,
} from 'jimu-core';

export type Config = {
  displayCoordinates: boolean; // Show lat/lon values
  displayCopyButton: boolean; // Enable 'Copy' functionality
  displayMapsiteButton: boolean; // Enable 'Mapsite' functionality
  displayMapAnnotation: boolean; // Show map annotation
  w3wLanguage: string; // Language for what3words
  displayNearestPlace: boolean; // Show nearest place
} & (
  | {
      mode: 'apiKey'; // Mode is 'apiKey'
      w3wApiKey: string; // what3words API key is required
    }
  | {
      mode: 'locatorUrl'; // Mode is 'locatorUrl'
      geocodeServiceUrl: string;
      useUtilitiesGeocodeService: ImmutableArray<UseUtility>;
    }
);

export type IMConfig = ImmutableObject<Config>;
