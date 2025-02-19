import axios from "axios";

export default function AxiosInstance() {

    const header = {
        "Content-Type": "application/json",
    };

    const token = localStorage.getItem('authToken');
    if (token) {
        header.Authorization = `Bearer ${token}`;
    }

    return (
        axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            headers: header,
        })
    )
};