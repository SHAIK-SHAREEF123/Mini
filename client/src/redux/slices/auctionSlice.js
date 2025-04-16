import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action to fetch auctions
export const fetchAuctions = createAsyncThunk("auctions/fetchAuctions", async () => {
  try {
    // console.log("Fetching auctions...");
    const response = await axios.get("http://localhost:5000/api/auctions");
    // console.log("Fetched auctions:", response.data); // Log the fetched auctions data
    return response.data;
  } catch (error) {
    // console.error("Error fetching auctions:", error); // Log error if the request fails
    throw error; // Ensure the error is passed to the rejected case
  }
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
        // console.log("Fetching auctions... Pending state");
        state.status = "loading";
      })
      .addCase(fetchAuctions.fulfilled, (state, action) => {
        // console.log("Auctions fetched successfully. Updating state.");
        // console.log("Fetched data:", action.payload); // Log the data after it's been fetched
        state.status = "succeeded";
        state.auctions = action.payload;
      })
      .addCase(fetchAuctions.rejected, (state, action) => {
        console.error("Failed to fetch auctions:", action.error.message); // Log error message if the request fails
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default auctionSlice.reducer;
