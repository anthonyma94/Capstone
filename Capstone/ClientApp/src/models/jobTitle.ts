import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStatus from "./AsyncStatus";
import axios from "../services/axios";
import { RootState } from "../reduxStore";

export default interface IJobTitle {
    id: string;
    name: string;
}

interface IState extends AsyncStatus {
    data: IJobTitle[];
}

const initialState: IState = {
    data: [],
    status: "idle",
    error: null,
};

export const fetchJobTitles = createAsyncThunk(
    "store/fetchJobTitles",
    async () => {
        const res = await axios.get("/jobtitles");
        return res.data as IJobTitle[];
    }
);

export const addJobTitle = createAsyncThunk(
    "store/addJobTitle",
    async (title: string) => {
        const res = await axios.post("/jobtitles", { name: title });
        return res.data as IJobTitle;
    }
);

const jobTitleSlice = createSlice({
    name: "jobTitles",
    initialState,
    reducers: {
        setJobTitle: (state, action: PayloadAction<IJobTitle[]>) => {
            state.data = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchJobTitles.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = "success";
        });
        builder.addCase(fetchJobTitles.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(addJobTitle.fulfilled, (state, action) => {
            state.data.push(action.payload);
            state.status = "success";
        });
        builder.addCase(addJobTitle.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(addJobTitle.rejected, (state, action) => {
            console.log(action);
        });
    },
});

export const selectJobTitles = (state: RootState) => state.jobTitle;

export const jobTitleReducer = jobTitleSlice.reducer;
