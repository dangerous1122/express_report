import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const payment = createAsyncThunk(
  "upload/file-upload",
  async (formData, { rejectWithValue }) => {
    const token = localStorage.getItem("expr");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/payment-intent`,
        formData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    entities: [],
    loading: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(payment.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(payment.fulfilled, (state, action) => {
        state.loading = "idle";
        state.entities = action.payload;
      })
      .addCase(payment.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
