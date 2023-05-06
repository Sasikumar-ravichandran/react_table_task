// ** Initial State
const initialState = {
    allData: '',
    spinnerLoad: true
}

const beerList = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_LIST':
            return { ...state, allData: action.data, spinnerLoad: false }
        default:
            return { ...state }
    }
}
export default beerList
