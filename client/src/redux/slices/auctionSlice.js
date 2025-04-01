import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action to fetch auctions
export const fetchAuctions = createAsyncThunk("auctions/fetchAuctions", async () => {
  const response = await axios.get("http://localhost:5000/api/auctions");
  return response.data;
});

const auctionSlice = createSlice({
  name: "auctions",
  initialState: {
    auctions: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuctions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAuctions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.auctions = action.payload;
      })
      .addCase(fetchAuctions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default auctionSlice.reducer;
