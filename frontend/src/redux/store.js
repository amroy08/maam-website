import {configureStore} from "@reduxjs/toolkit";
import {userReducer} from "./Reducers/user";
import {shopReducer} from "./Reducers/shop.js";
import {productReducer} from "./Reducers/product";
import {eventReducer} from "./Reducers/event";
import {cartReducer} from "./Reducers/cart.js";
import {wishlistReducer} from "./Reducers/wishlist.js";
import { orderReducer } from "./Reducers/order";


const Store = configureStore({
    reducer: {
        user: userReducer,
        shop: shopReducer,
        products: productReducer,
        events: eventReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        order: orderReducer,
    },
});

export default Store;
