import { configureStore } from "@reduxjs/toolkit";
import { storeReducer } from "./models/store";
import { personReducer } from "./models/person";
import { jobTitleReducer } from "./models/jobTitle";

const store = configureStore({
    reducer: {
        store: storeReducer,
        person: personReducer,
        jobTitle: jobTitleReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
