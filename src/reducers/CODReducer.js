export const CODReducer = (state = false, action) => {
    switch (action.type) {
        case CODTYPE:
            return action.payload;
        default:
            return state;
    }
}

export const CODTYPE = "CODTYPE";