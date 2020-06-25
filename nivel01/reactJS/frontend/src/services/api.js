
import axios from "axios"

const api = axios.create({
    baseURL: "http://172.22.223.197:3333"
});

export default api;