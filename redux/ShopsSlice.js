import { createSlice } from "@reduxjs/toolkit";

const ShopsSlice = createSlice({
  name: "shops",
  initialState: {
    shops: [],
  },
  reducers: {
    add_shop(state, action) {
      state.shops = action.payload;
    },
  },
});

export const { add_shop } = ShopsSlice.actions;

export default ShopsSlice.reducer;
