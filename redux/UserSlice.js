import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
  },
  reducers: {
    add_user(state, action) {
      state.data = action.payload;
    },
  },
});

export const { add_user } = UserSlice.actions;

export default UserSlice.reducer;
