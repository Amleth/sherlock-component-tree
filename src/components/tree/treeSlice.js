import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {fetchUri, oldTreeSlice} from "./oldTreeSlice";
import {sparqlEndpoint} from "../../sparql"
import identityQuery from "./identityQuery";
import predicatesQuery from "./predicatesQuery";
import {
    resourcesByPredicateAndObjectQuery,
    resourcesByPredicateAndSubjectQuery
} from "./resourcesByPredicateAndResourceQuery";

const adapter = createEntityAdapter()
const initialState = adapter.getInitialState({
    root: null,
    status: 'idle'
})

export const getResourceIdentity = createAsyncThunk('tree/fetchResourceIdentity', async (uri, thunkAPI) => {
    const identity = thunkAPI.getState().tree.ids[uri];
    if (identity)
        return identity
    //TODO: sortir le count de la requete : si une ressource a des prédicats et pas d'identity, on ne pourra pas les fetch
    const response = await sparqlEndpoint(identityQuery(uri));
    return {id: uri, identity: response.results.bindings};
})

export const getResourcePredicates = createAsyncThunk('tree/fetchResourcePredicates', async (uri, thunkAPI) => {
    const predicates = thunkAPI.getState().tree.entities[uri].predicates;
    if (predicates)
        return {id: uri, predicates};
    const response = await sparqlEndpoint(predicatesQuery(uri));
    return {id: uri, predicates: response.results.bindings};
})

export const getResourcesByPredicateAndLinkedResource = createAsyncThunk('tree/fetchResourcesByPredicateAndLinkedResource', async (payload , thunkAPI) => {
    const predicate = thunkAPI.getState().tree.entities[payload.uri].predicates.find(predicate => predicate.p.value === payload.p);
    if (predicate.resources) {
        return {id: payload.uri, p: payload.p, resources: predicate.resources};
    }
    const response = predicate.direction.value === 'o'
        ? await sparqlEndpoint(resourcesByPredicateAndSubjectQuery(payload.p, payload.uri))
        : await sparqlEndpoint(resourcesByPredicateAndObjectQuery(payload.p, payload.uri));
    //TODO: faire en une requête
    response.results.bindings.forEach(resource => {
        thunkAPI.dispatch(getResourceIdentity(resource.r.value));
    })
    return {id: payload.uri, p: payload.p, resources: response.results.bindings};
})

export const treeSlice = createSlice({
    name: 'tree',
    initialState,
    reducers: {
        rootSet: (state, action) => {
            state.root = action.payload;
        }
    },
    extraReducers: {
        [getResourceIdentity.fulfilled]: (state, action) => {
            adapter.addOne(state, action.payload)
            state.status = 'idle';
        },
        [getResourceIdentity.pending]: (state, action) => {
            state.status = 'loading';
        },

        [getResourcePredicates.fulfilled]: (state, action) => {
            state.entities[action.payload.id].predicates = action.payload.predicates;
            state.status = 'idle';
        },
        [getResourcePredicates.pending]: (state, action) => {
            state.status = 'loading';
        },

        [getResourcesByPredicateAndLinkedResource.fulfilled]: (state, action) => {
            state.entities[action.payload.id].predicates.find(predicate => predicate.p.value === action.payload.p).resources = action.payload.resources;
            state.status = 'idle';
        },
        [getResourcesByPredicateAndLinkedResource.pending]: (state, action) => {
            state.status = 'loading';
        },
    }
})

export const {rootSet} = treeSlice.actions
export const { selectById: selectResourceByUri } = adapter.getSelectors(state => state.tree)

export default treeSlice.reducer
