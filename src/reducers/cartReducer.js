let initialState = [];

// load cart item from local storage

if (window !== 'undefined') {
    if (localStorage.getItem('cart')) {
        initialState = JSON.parse(localStorage.getItem("cart"));
    } else {
        initialState = [];
    }
}
export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADDTO_CART:
            return action.payload;
        default:
            return state;
    }
}

export const ADDTO_CART = "ADDTO_CART";