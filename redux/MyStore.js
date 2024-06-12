import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./UserSlice";
import OrderReducer from "./OrderSlice";
import UtilReducer from "./UtilSlice";
import ShopsReducer from "./ShopsSlice";

const MyStore = configureStore({
  reducer: {
    user: UserReducer,
    order: OrderReducer,
    util: UtilReducer,
    shops: ShopsReducer,
  },
});

export default MyStore;
