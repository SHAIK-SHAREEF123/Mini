import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; // ✅ Ensure correct import
import auctionReducer from "./slices/auctionSlice"; // ✅ Ensure auction slice is properly set up

// Configure Redux Store
const store = configureStore({
  reducer: {
    auth: authReducer,
    auctions: auctionReducer,
  },
});

export default store; // ✅ Export the store correctly
