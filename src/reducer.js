export default function reducer(state = {}, action) {
    switch (action.type) {
        case 'SELECT_ITEM':
            return {
                ...state,
                uri: action.payload
            }
    }
    return state;
}
