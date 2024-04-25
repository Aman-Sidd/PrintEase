import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./UserSlice";
import OrderReducer from "./OrderSlice";
import UtilReducer from "./UtilSlice";

const MyStore = configureStore({
  reducer: {
    user: UserReducer,
    order: OrderReducer,
    util: UtilReducer,
  },
});

export default MyStore;
