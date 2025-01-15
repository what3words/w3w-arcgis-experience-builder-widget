import type { AllWidgetProps } from 'jimu-core'
import type { IMConfig } from '../../config'
import { UtilityManager } from 'jimu-core'

type Config = AllWidgetProps<IMConfig>['config']
const getDefaultGeocodeServiceURL = (props: AllWidgetProps<IMConfig>) => {
  if (props.config.mode === 'apiKey') return
  const geocodeServiceURL =
    'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
  return (
    props.config?.geocodeServiceUrl ||
    props.portalSelf?.helperServices?.geocode?.[0]?.url ||
    geocodeServiceURL
  )
}

const getGeocodeURLFromUtility = async (config: Config): Promise<string | undefined> => {
  if (config.mode === 'apiKey') {
    throw new Error(
      'Cannot retrieve geocode url from utility in API key mode'
    )
  }
  if (config.useUtilitiesGeocodeService?.length > 0) {
    return await UtilityManager.getInstance()
      .getUrlOfUseUtility(config.useUtilitiesGeocodeService?.[0])
  }
}

export const getGeocodeServiceURL = async (props: AllWidgetProps<IMConfig>): Promise<string> => {
  if (props.config.mode === 'apiKey') {
    throw new Error('Cannot retrieve geocode service url in API key mode')
  }
  const defaultGeocodeServiceUrl = getDefaultGeocodeServiceURL(props)
  const { geocodeServiceUrl } = props.config || {}
  const orgGeocodeUrl =
    props.portalSelf?.helperServices?.geocode?.[0]?.url
  const geocodeURlFromUtility = await getGeocodeURLFromUtility(props.config)
  return (
    geocodeURlFromUtility ||
    geocodeServiceUrl ||
    orgGeocodeUrl ||
    defaultGeocodeServiceUrl
  )
}

/* API Key mode */
export const getApiKey = (config: Config): string | null => {
  if (config.mode === 'locatorUrl') {
    throw new Error('Unable to get API key on URL locator mode')
  }
  const apiKey = config.w3wApiKey
  if (!apiKey) {
    console.warn(
      'API Key is missing. Please provide an API key in the settings.'
    )
    return null
  }
  return apiKey
}

export const validApiKey = (config: Config) =>
  config.mode === 'apiKey' && config.w3wApiKey

export const validLocator = (config: Config) =>
  config.mode === 'locatorUrl' &&
  config.useUtilitiesGeocodeService &&
  config.useUtilitiesGeocodeService.length > 0
