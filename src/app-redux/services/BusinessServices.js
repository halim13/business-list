import http from './common'

const getHistory = params => http.get('/search', {
    params
})

const BusinessServices = {
    getHistory,
}

export default BusinessServices