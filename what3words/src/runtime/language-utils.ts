export interface AvailableLanguage {
  code: string
  name: string
  nativeName: string
}

export const getAvailableLanguages = async (
  apiKey: string,
  version: string
): Promise<AvailableLanguage[]> => {
  if (!apiKey) {
    throw new Error('API key is required to fetch available languages.')
  }

  return await fetch(
    'https://api.what3words.com/v3/available-languages?' +
      new URLSearchParams({ key: apiKey }).toString(),
    {
      headers: {
        'X-W3W-Wrapper': `ArcGIS Experience App (v${version})`
      }
    }
  )
    .then((response) => response.json())
    .then(({ languages }) => languages)
    .catch((error) => {
      console.error(
        'Error fetching available languages:',
        error?.response?.data?.error?.message || error
      )
      return [
        {
          code: 'en',
          name: 'English',
          nativeName: 'English'
        }
      ]
    })
}
