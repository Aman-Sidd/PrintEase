import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageSize: null,
  color: null,
  printType: null,
  pdfUri: null,
  pdfName: null,
  noOfpages: null,
  pricePerPage: null,
  totalPrice: null,
};

const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setPageSize(state, action) {
      state.pageSize = action.payload.pageSize;
    },
    setColor(state, action) {
      state.color = action.payload.color;
    },
    setPrintType(state, action) {
      state.printType = action.payload.printType;
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
  },
});

export const {
  setPageSize,
  setColor,
  setNoOfPages,
  setPdfName,
  setPdfUri,
  setPrintType,
  setPricePerPage,
  setTotalPrice,
} = OrderSlice.actions;

export default OrderSlice.reducer;
