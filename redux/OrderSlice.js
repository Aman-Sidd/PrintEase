import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageSize: null,
  color: null,
  printType: null,
  spiralBinding: null,
  pdfUri: null,
  pdfName: null,
  noOfPages: null,
  pricePerPage: null,
  totalPrice: null,
  file: null,
  shopId: null,
};

const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setPageSize(state, action) {
      state.pageSize = action.payload.pageSize;
    },
    setFile(state, action) {
      state.file = action.payload.file;
    },
    setColor(state, action) {
      state.color = action.payload.color;
    },
    setPrintType(state, action) {
      state.printType = action.payload.printType;
    },
    setSpiralBinding(state, action) {
      state.spiralBinding = action.payload.spiralBinding;
    },
    setPdfUri(state, action) {
      state.pdfUri = action.payload.pdfUri;
    },
    setPdfName(state, action) {
      state.pdfName = action.payload.pdfName;
    },
    setNoOfPages(state, action) {
      state.noOfPages = action.payload.noOfPages;
    },
    setPricePerPage(state, action) {
      state.pricePerPage = action.payload.pricePerPage;
    },
    setTotalPrice(state, action) {
      state.totalPrice = action.payload.totalPrice;
    },
    setShopId(state, action) {
      state.shopId = action.payload.shopId;
    },
  },
});

export const {
  setPageSize,
  setColor,
  setSpiralBinding,
  setNoOfPages,
  setPdfName,
  setPdfUri,
  setPrintType,
  setPricePerPage,
  setTotalPrice,
  setFile,
  setShopId,
} = OrderSlice.actions;

export default OrderSlice.reducer;
