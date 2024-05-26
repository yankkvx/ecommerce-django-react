import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    SINGLE_PRODUCT_REQUEST,
    SINGLE_PRODUCT_SUCCESS,
    SINGLE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_SUCCESS,
    CREATE_PRODUCT_FAIL,
    CREATE_PRODUCT_RESET,
    EDIT_PRODUCT_REQUEST,
    EDIT_PRODUCT_SUCCESS,
    EDIT_PRODUCT_FAIL,
    EDIT_PRODUCT_RESET,
} from "../constants/productConstants";

export const productListReducer = (state = { products: [] }, action) => {
    switch (action.type) {
        case PRODUCT_LIST_REQUEST:
            return { loading: true, products: [] };

        case PRODUCT_LIST_SUCCESS:
            return { loading: false, products: action.payload };

        case PRODUCT_LIST_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const singleProductReducer = (
    state = { product: { reviews: [] } },
    action
) => {
    switch (action.type) {
        case SINGLE_PRODUCT_REQUEST:
            return { loading: true, ...state };

        case SINGLE_PRODUCT_SUCCESS:
            return { loading: false, product: action.payload };

        case SINGLE_PRODUCT_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const productDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case DELETE_PRODUCT_REQUEST:
            return { loading: true };

        case DELETE_PRODUCT_SUCCESS:
            return { loading: false, success: true };

        case DELETE_PRODUCT_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const createProductReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_PRODUCT_REQUEST:
            return { loading: true };

        case CREATE_PRODUCT_SUCCESS:
            return { loading: false, product: action.payload, success: true };

        case CREATE_PRODUCT_FAIL:
            return { loading: false, error: action.payload };

        case CREATE_PRODUCT_RESET:
            return {};

        default:
            return state;
    }
};

export const editProductReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case EDIT_PRODUCT_REQUEST:
            return { loading: true };

        case EDIT_PRODUCT_SUCCESS:
            return { loading: false, product: action.payload, success: true };

        case EDIT_PRODUCT_FAIL:
            return { loading: false, error: action.payload };

        case EDIT_PRODUCT_RESET:
            return { product: {} };

        default:
            return state;
    }
};
