export const couponReducer = (state = false, action) => {
    switch (action.type) {
        case COUPON_APPLIED:
            return action.payload;
        default:
            return state;
    }
}

export const COUPON_APPLIED = "COUPON_APPLIED";