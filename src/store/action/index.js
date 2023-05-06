import axios from 'axios'

export const getBeerList = params => {
    return async dispatch => {
        let url
        if (params.dateFilter === null) {
            url = `https://api.punkapi.com/v2/beers?page=${params.pageNum}&per_page=10`
        } else {
            url = `https://api.punkapi.com/v2/beers?${params.dateFilter}&page=${params.pageNum}&per_page=10`
        }
        await axios.get(url).then(response => {

            console.log(response, ')))')
            dispatch({
                type: 'GET_LIST',
                data: response?.data
            })
        })
    }
}