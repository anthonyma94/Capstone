import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStatus from "./AsyncStatus";
import { RootState } from "../reduxStore";
import IJobTitle from "./jobTitle";
import axios from "../services/axios";

export default interface IPerson {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    province: string;
    postal: string;
    jobTitle: IJobTitle;
    role: "FT" | "PT";
    pay: number;
    phone: string;
    maxWeeklyHours: number;
}

interface IState extends AsyncStatus {
    data: IPerson[];
}

const initialState: IState = {
    data: [],
    status: "idle",
    error: null,
};

export const fetchPeople = createAsyncThunk("person/fetchPeople", async () => {
    const res = await axios.get("/people");
    return res.data as IPerson[];
});

const peopleSlice = createSlice({
    name: "person",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPeople.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = "success";
        });
        builder.addCase(fetchPeople.pending, (state, action) => {
            state.status = "loading";
        });
    },
});

export const selectPeople = (state: RootState) => state.person;

export const personReducer = peopleSlice.reducer;
