import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStatus from "./AsyncStatus";
import axios from "../services/axios";
import { RootState } from "../reduxStore";
import IDayLineItem from "./dayLineItem";
import { WritableDraft } from "@reduxjs/toolkit/node_modules/immer/dist/internal";

export default interface IStore {
    id: string;
    name: string;
    storeHours: {
        id: string;
        day: IDayLineItem;
    }[];
}

interface IState extends AsyncStatus {
    data: IStore;
}

const initialState: IState = {
    data: {
        id: "",
        name: "",
        storeHours: [],
    },
    status: "idle",
    error: null,
};

const path = "/store";

export const fetchStore = createAsyncThunk("store/fetchStore", async () => {
    const res = await axios.get(path);
    return res.data[0] as IStore;
});

export const changeStoreName = createAsyncThunk(
    "store/changeStoreName",
    async (store: { id: string; name: string }) => {
        const res = await axios.put(`${path}/changename/${store.id}`, {
            name: store.name,
        });
        return res.data as IStore;
    }
);

export const createStore = createAsyncThunk(
    "store/createStore",
    async (name: string) => {
        const res = await axios.post(path, { name });
        return res.data as IStore;
    }
);

export const changeHours = createAsyncThunk(
    "store/changeHours",
    async (data: {
        storeId: string;
        data: { id?: string; start: string; end: string }[];
    }) => {
        const res = await axios.put(
            `${path}/changehours/${data.storeId}`,
            data.data
        );
        console.log(res.data);
        return res.data as IStore;
    }
);

const saveOnSuccess = (state: WritableDraft<IState>, action: any) => {
    state.data = action.payload;
    state.status = "success";
};

const storeSlice = createSlice({
    name: "store",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchStore.fulfilled, saveOnSuccess);
        builder.addCase(fetchStore.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(createStore.fulfilled, saveOnSuccess);
        builder.addCase(createStore.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(changeStoreName.fulfilled, saveOnSuccess);
        builder.addCase(changeStoreName.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(changeHours.fulfilled, saveOnSuccess);
        builder.addCase(changeHours.pending, (state, action) => {
            state.status = "loading";
        });
    },
});

export const selectStore = (state: RootState) => state.store;
export const selectStoreHours = (state: RootState) =>
    state.store.data.storeHours;
export const storeReducer = storeSlice.reducer;
