import { createSlice } from "@reduxjs/toolkit";

const UtilSlice = createSlice({
  name: "util",
  initialState: {
    loading: false,
  },
  reducers: {
    setLoading(state, action) {
      console.log("Loading:", action.payload);
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = UtilSlice.actions;

export default UtilSlice.reducer;
