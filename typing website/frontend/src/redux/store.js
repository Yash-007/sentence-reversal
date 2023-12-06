import { configureStore } from "@reduxjs/toolkit";
import colorReducer from './colorSlice';

const store= configureStore({
    reducer: {
        colors: colorReducer,
    }
});

export default store