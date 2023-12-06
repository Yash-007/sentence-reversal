import {createSlice} from '@reduxjs/toolkit';

const colorSlice = createSlice({
    name: "colors",
    initialState: {
        color: "white",
        bgColor: "yellow",
    },
    reducers: {
        setColor(state, action){
            state.color= action.payload.color;
            state.bgColor=action.payload.bgColor;
        }
    }
});

 export const {setColor} = colorSlice.actions;
 export default colorSlice.reducer;