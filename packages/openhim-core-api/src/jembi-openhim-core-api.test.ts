import axios from 'axios'
import {getImportMap} from './jembi-openhim-core-api'

jest.mock('axios')

describe('getImportMap', () => {
  const responseData = {
    "imports" : {
      "app1": "url1",
      "app2": "url2"
    }
  }

  it('fetches data successfully from the API', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockResolvedValueOnce({ data: responseData })

    const result = await getImportMap()
    expect(result).toEqual(responseData)
  })
})

