import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "http://localhost:5000"; // Adjust this to your actual API base URL

// Async thunk for fetching sender and receiver data
export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/get-receiver`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk for adding a new contact (either sender or receiver)
export const addContact = createAsyncThunk(
  "contacts/addContact",
  async (contactData, { rejectWithValue }) => {
    console.log('hyyy')
    try {
      const response = await axios.post(`${baseUrl}/add-receiver`, contactData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk for editing a contact
export const editContact = createAsyncThunk(
  "contacts/editContact",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseUrl}/edit-receiver/${id}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk for deleting a contact
export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseUrl}/delete-receiver/${id}`);
      return id; // Return the deleted contact's id
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Contacts slice
const contactsSlice = createSlice({
  name: "receiver",
  initialState: {
    entities: [],
    loading: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = "idle";
        state.entities = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.payload;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.entities.push(action.payload);
      })
      .addCase(editContact.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (contact) => contact.id === action.payload.id
        );
        if (index !== -1) {
          state.entities[index] = action.payload;
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (contact) => contact.id !== action.payload
        );
      });
  },
});

export default contactsSlice.reducer;
