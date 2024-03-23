import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./UserSlice";
import OrderReducer from "./OrderSlice";

const MyStore = configureStore({
  reducer: {
    user: UserReducer,
    order: OrderReducer,
  },
});

export default MyStore;
