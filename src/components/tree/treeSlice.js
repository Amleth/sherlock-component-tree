import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {getUriChildren} from '../../api/select'
import * as common from "../../common";

export const fetchUri = createAsyncThunk('tree/fetchUri', async (uri, {getState, rejectWithValue, dispatch}) => {
    const loadedUris = getState().tree.loadedUris;
    if (common.isUri(uri) && !loadedUris.includes(uri)) {
        const response = await getUriChildren(uri);
        return response.results.bindings
    }
    dispatch(selectUri(uri));
    return rejectWithValue(uri);
})

export const treeSlice = createSlice({
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
            state.treeData = [...state.treeData, ...action.payload];
            state.loadedUris = [...state.loadedUris, action.payload[0].s.value];
            state.selectedUri = action.payload[0].s.value;
        },
    }
});

export const { selectUri } = treeSlice.actions

export default treeSlice.reducer