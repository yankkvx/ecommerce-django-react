import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    SAVE_SHIPPING_ADDRESS,
} from "../constants/cartConstants";

export const cartReducer = (
    state = { cartItems: [], shippingAddress: {} },
    action
) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            const item = action.payload;
            // Check if the item is already in the cart.
            const existItem = state.cartItems.find(
                (x) => x.product === item.product
            );
            // If the item already exist in the cart.
            if (existItem) {
                // Return the new state with updated product quantity.
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) =>
                        x.product === existItem.product ? item : x
                    ),
                };
            } else {
                // If the item doesnt already exist in the cart add it and return the new state with the added product
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                };
            }

        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (x) => x.product !== action.payload
                ),
            };

        case SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload,
            };

        default:
            return state;
    }
};
