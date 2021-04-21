import { configureStore } from '@reduxjs/toolkit'
import treeReducer from '../components/tree/treeSlice'

export default configureStore({
    reducer: {
        tree: treeReducer,
    }
})