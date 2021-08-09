export const userReducer = (state = null, action) => {
    switch (action.type) {
        case LOGGED_IN_USER:
            return action.payload;
        case LOGOUT:
            return action.payload;
        default:
            return state;
    }
}

export const LOGGED_IN_USER = "LOGGED_IN_USER";
export const LOGOUT = "LOGOUT";