import qs from "qs";
export class RequestClient {
  constructor(axios, cookies, store)
  {
    this.axios = axios
    this.cookies = cookies
    this.store = store
    this.hasRetried = false
  }

  async get(uri, params = {}) {
    const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    const query = queryString.length > 0 ? `${uri}?${queryString}` : uri
    return await this.axios.$get(query)
      .catch (err => {
        return this.retry(err)
      })
  }

  async post(uri) {
    return await this.axios.$post(uri)
    .catch (err => {
      return this.retry(err)
    })
  }

  async retry(err) {
    const code = parseInt(err.response && err.response.status)
    const resfreshToken = this.cookies.get('refresh_token') || null

    if (code === 401 && resfreshToken && this.hasRetried === false) {
      this.hasRetried = true
      const apiKey = process.env.API_KEY;

      if (resfreshToken) {
        const data = {
          'grant_type': 'refresh_token',
          'refresh_token': resfreshToken
        }

        const res = await this.axios.$request({
          method: 'POST',
          headers: {'content-type': 'application/x-www-form-urlencoded'},
          data: qs.stringify(data),
          url: `https://securetoken.googleapis.com/v1/token?key=${apiKey}`
        })

        this.store.dispatch('setToken', res.id_token)

        return await this.axios.$request({
          method: err.response.config.method,
          headers: {'Authorization': `Bearer ${res.id_token}`},
          uri: err.response.config.uri,
          data: err.response.config.data
        })
      }
    }
  }
}

export function createRequestClient(axios, cookies, store) {
  return new RequestClient(axios, cookies, store)
}
