export const searchReducer = (state = { text: "" }, action) => {
    switch (action.type) {
        case SEARCH_QUERY:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

export const SEARCH_QUERY = "SEARCH_QUERY";