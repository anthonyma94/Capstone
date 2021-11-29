import { DefaultState } from "@/store/types";

export interface Auth {
    user?: string;
    role?: string;
}

export interface AuthState extends DefaultState<Auth> {}
