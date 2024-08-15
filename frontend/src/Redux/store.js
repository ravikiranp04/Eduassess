import {configureStore} from '@reduxjs/toolkit';
import userLoginReducer from './slices/userLoginSlice'
const reduxStore=configureStore({
    reducer:{
        userLogin:userLoginReducer
    }
})
export default reduxStore;