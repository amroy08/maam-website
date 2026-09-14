import {createReducer} from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    adminShopLoading: true,
    // loading: false,
    // user: null,
    // error: null,
};

export const shopReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("LoadShopRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("LoadShopSuccess", (state, action) => {
            state.isShop = true;
            state.isLoading = false;
            state.shop = action.payload;
        })
        .addCase("LoadShopFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isShop = false;
        })

        // Get all sellers ----------Admin
        .addCase("getAllShopsRequest", (state) => {
            state.adminShopLoading = true;
        })
        .addCase("getAllShopsSuccess", (state, action) => {
            state.adminShopLoading = false;
            state.shops = action.payload;
        })
        .addCase("LoadAllShopFail", (state, action) => {
            state.error = action.payload;
            state.adminShopLoading = false;
        })


        .addCase("clearErrors", (state) => {
            state.error = null;
        });
});


