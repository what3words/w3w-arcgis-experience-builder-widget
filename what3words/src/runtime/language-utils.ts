import axios from 'axios'

interface AvailableLanguage {
  code: string
  name: string
  nativeName: string
}

export const getAvailableLanguages = async (apiKey: string): Promise<AvailableLanguage[]> => {
  if (!apiKey) {
    throw new Error('API key is required to fetch available languages.')
  }

  try {
    const response = await axios.get('https://api.what3words.com/v3/available-languages', {
      params: {
        key: apiKey
      }
    })

    return response.data.languages.map((lang: any) => ({
      code: lang.code,
      name: lang.name,
      nativeName: lang.nativeName
    }))
  } catch (error) {
    console.error('Error fetching available languages:', error.response?.data.error.message || error)
    return []
  }
}
