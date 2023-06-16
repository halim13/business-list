import axios from 'axios'
import { BASE_URL, HEADERS } from '../../constants/config'

const baseURL = BASE_URL

export default axios.create({
    baseURL,
    headers: HEADERS,
})
