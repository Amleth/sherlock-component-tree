import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {getUriChildren} from '../../api/select'
import * as common from "../../common";

export const fetchUri = createAsyncThunk('tree/fetchUri', async (uri, thunkAPI) => {
    const loadedUris = thunkAPI.getState().tree.loadedUris;
    if (common.isUri(uri) && !loadedUris.includes(uri)) {
        const response = await getUriChildren(uri);
        return {bindings: response.results.bindings, uri};
    }
    return thunkAPI.rejectWithValue(uri);
})


export const oldTreeSlice = createSlice({
    name: 'tree',
    initialState: {
        selectedUri: '',
        treeData: [],
        loadedUris: []
    },
    reducers: {
        selectUri: (state, action) => {
            state.selectedUri = action.payload;
        }
    },
    extraReducers: {
        [fetchUri.fulfilled]: (state, action) => {
            state.treeData = [...state.treeData, ...action.payload.bindings];
            state.loadedUris = [...state.loadedUris, action.payload.uri];
        },
    }
});

export const { selectUri } = oldTreeSlice.actions

export default oldTreeSlice.reducer