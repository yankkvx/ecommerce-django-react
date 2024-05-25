import { combineReducers, applyMiddleware } from "redux";
import { createStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import {
    productDeleteReducer,
    productListReducer,
    singleProductReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
    userLoginReducer,
    userRegisterReducer,
    userProfileReducer,
    userUpdateReducer,
    userListReducer,
    userDeleteReducer,
    adminUserUpdateReducer,
} from "./reducers/userReducers";
import {
    createOrderReducer,
    orderDetailsReducer,
    orderPayReducer,
    userOrdersReducer,
} from "./reducers/orderReducers";

const reducer = combineReducers({
    productList: productListReducer,
    singleProduct: singleProductReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userProfile: userProfileReducer,
    userUpdate: userUpdateReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    adminUserUpdate: adminUserUpdateReducer,
    productDelete: productDeleteReducer,
    orderCreate: createOrderReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    userOrders: userOrdersReducer,
});

// Load data into state
const cartItemsFromStorage = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : [];

const shippingInfoFromStorage = localStorage.getItem("shippingAddress")
    ? JSON.parse(localStorage.getItem("shippingAddress"))
    : {};

const initialState = {
    cart: {
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingInfoFromStorage,
    },
    userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
