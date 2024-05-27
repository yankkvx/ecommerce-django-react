import { CART_RESET } from "../constants/cartConstants";
import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    CREATE_ORDER_RESET,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_PAY_RESET,
    USER_ORDERS_REQUEST,
    USER_ORDERS_SUCCESS,
    USER_ORDERS_FAIL,
    USER_ORDERS_RESET,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
} from "../constants/orderConstants";

export const createOrderReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_ORDER_REQUEST:
            return { loading: true };

        case CREATE_ORDER_SUCCESS:
            return { loading: false, success: true, order: action.payload };

        case CREATE_ORDER_FAIL:
            return { loading: false, error: action.payload };

        case CREATE_ORDER_RESET:
            return {};

        case CART_RESET:
            return { ...state, cartItems: [] };

        default:
            return state;
    }
};

export const orderDetailsReducer = (
    state = { loading: true, orderItems: [], shippingAddress: {} },
    action
) => {
    switch (action.type) {
        case ORDER_DETAILS_REQUEST:
            return { ...state, loading: true };

        case ORDER_DETAILS_SUCCESS:
            return { loading: false, order: action.payload };

        case ORDER_DETAILS_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const orderPayReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_PAY_REQUEST:
            return { loading: true };

        case ORDER_PAY_SUCCESS:
            return { loading: false, success: true };

        case ORDER_PAY_FAIL:
            return { loading: false, error: action.payload };

        case ORDER_PAY_RESET:
            return {};

        default:
            return state;
    }
};

export const userOrdersReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case USER_ORDERS_REQUEST:
            return { loading: true };

        case USER_ORDERS_SUCCESS:
            return { loading: false, orders: action.payload };

        case USER_ORDERS_FAIL:
            return { loading: false, error: action.payload };

        case USER_ORDERS_RESET:
            return { orders: [] };

        default:
            return state;
    }
};

export const orderListReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case ORDER_LIST_REQUEST:
            return { loading: true };

        case ORDER_LIST_SUCCESS:
            return { loading: false, orders: action.payload };

        case ORDER_LIST_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};
