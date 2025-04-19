import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Conten-Type': 'application/json'
    },
    withCredentials: true,
});

