import { combineReducers, applyMiddleware } from "redux";
import { createStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import {
    productListReducer,
    singleProductReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";

const reducer = combineReducers({
    productList: productListReducer,
    singleProduct: singleProductReducer,
    cart: cartReducer,
});

// Load data into state
const cartItemsFromStorage = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];


const initialState = {
    cart: { cartItems: cartItemsFromStorage },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
