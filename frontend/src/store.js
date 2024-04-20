import { combineReducers, applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import {
    productListReducers,
    singleProductReducers,
} from "./reducers/productReducers";

const reducer = combineReducers({
    productList: productListReducers,
    singleProduct: singleProductReducers,
});

const initialState = {};

const middleware = [thunk];

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
    devTools: process.env.NODE_ENV !== "production",
});

export default store;
