import axios from "axios";

export default axios.create({
    baseURL: "/api",
    proxy: {
        host: "localhost",
        port: 3000
    }
});
