export default interface AsyncStatus {
    status: "idle" | "loading" | "success" | "error";
    error: string | object | null;
}
