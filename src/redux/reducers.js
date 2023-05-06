import { combineReducers } from 'redux'


import beerList from '../store/reducer'

const reducers = combineReducers({
    beerList,
})

export default reducers