import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./userSlice";
import loaderSlice from "./loaderSlice";


const store= configureStore({
    reducer : {
        users : usersReducer,
        loaders: loaderSlice,
    },
});

export default store;

