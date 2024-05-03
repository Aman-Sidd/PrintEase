import { createSlice } from "@reduxjs/toolkit";

const UtilSlice = createSlice({
  name: "util",
  initialState: {
    loading: false,
    isDesktop: false,
  },
  reducers: {
    setLoading(state, action) {
      console.log("Loading:", action.payload);
      state.loading = action.payload;
    },
    setIsDesktop(state, action) {
      state.isDesktop = action.payload;
    },
  },
});

export const { setLoading, setIsDesktop } = UtilSlice.actions;

export default UtilSlice.reducer;
