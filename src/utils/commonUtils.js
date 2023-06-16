export const parseParamToString = (data) => {
    if (data) {
        var url = '?'
        for (var key in data) {
            url += (`${key}=${data[key]}&`)
        }
        return url
    }
    return ''
}

export const convertCurrency = (value, replace = '.') => value?.toString()?.replace(/(.)(?=(\d{3})+$)/g, '$1' + replace) || 0
export const convertCurrency2 = (value, replace = '.') => value?.toString()?.replace(/(.)(?=(\d{2})+$)/g, '$1' + replace) || 0