import axios from "axios";

export const api = axios.create({
    baseURL: 'https://mealpal-backend.onrender.com',
    headers: {
        'Conten-Type': 'application/json'
    }
});

