import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

export const treeSlice = createSlice({
    name: 'tree',
    initialState: {
        value: ''
    },
    reducers: {
        select: (state, action) => {
            state.value = action.payload
        }
    }
});

export const fetchUri = createAsyncThunk('tree/fetchUri', async (uri) => {
    const response = await client.get('/fakeApi/posts')
    return response.posts
})

export const { select } = treeSlice.actions

export default treeSlice.reducer