import { createSlice } from "@reduxjs/toolkit";
import myApi from "../api/myApi";

export const registerUser = async (payload) => {
  try {
    const response = await myApi.post("/signup", payload);
    const user = response.data;
    return user;
  } catch (err) {
    console.log("Something went wrong while creating user! ", err);
  }
};

export const fetchUser = async (payload) => {
  try {
    const response = await myApi.post("/signin", payload);
    return response.data;
  } catch (err) {
    console.log("Error while fetching user details: ", err);
  }
};

const UserSlice = createSlice({
  name: "user",
  initialState: {
    data: [],
  },
  reducers: {
    add_user(state, action) {
      state.data.push(action.payload);
    },
  },
});

export const { add_user } = UserSlice.actions;

export default UserSlice.reducer;
