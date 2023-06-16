import { HEADERS } from '../constants/config'
import { parseParamToString } from './commonUtils'

export const requestGet = async (url, params, isRefreshed = false) => {
    try {
        console.log(`${url}${parseParamToString(params)}`)
        let requestOptions = {
            method: 'GET',
            headers: HEADERS,
        }

        return fetch(`${url}${parseParamToString(params)}`, requestOptions)
            .then(response => response.text())
            .then(result => JSON.parse(result))
            .catch(error => Promise.reject(error.description));
    } catch (err) {
        console.log(`${url}${parseParamToString(params)}`, err)
        if (!isRefreshed) {
            return requestGet(url, params, true)
        } else return Promise.reject(err)
    }
}