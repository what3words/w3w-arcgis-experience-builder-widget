import what3words, { ApiVersion, axiosTransport } from '@what3words/api'
import type { What3wordsService, AvailableLanguagesResponse } from '@what3words/api'

interface AvailableLanguage {
  code: string
  name: string
  nativeName: string
}

export const getAvailableLanguages = async (apiKey: string): Promise<AvailableLanguage[]> => {
  if (!apiKey) {
    throw new Error('API key is required to fetch available languages.')
  }

  const w3wService: What3wordsService = what3words(
    apiKey,
    { host: 'https://api.what3words.com', apiVersion: ApiVersion.Version3 },
    { transport: axiosTransport() }
  )

  try {
    const response: AvailableLanguagesResponse = await w3wService.availableLanguages()
    return response.languages.map((lang) => ({
      code: lang.code,
      name: lang.name,
      nativeName: lang.nativeName
    }))
  } catch (error) {
    console.error('Error fetching available languages:', error)
    return []
  }
}
