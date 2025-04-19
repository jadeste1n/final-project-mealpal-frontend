import axios from "axios";

export const api = axios.create({
    baseURL: ['https://mealpal-backend.onrender.com', 'http://localhost:5050'],
    headers: {
        'Conten-Type': 'application/json'
    },
    withCredentials: true,
});

