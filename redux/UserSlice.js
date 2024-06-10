import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    shop: null,
  },
  reducers: {
    add_user(state, action) {
      state.data = action.payload;
    },
    add_shop(state, action) {
      state.shop = action.payload;
    },
  },
});

export const { add_user, add_shop } = UserSlice.actions;

export default UserSlice.reducer;
