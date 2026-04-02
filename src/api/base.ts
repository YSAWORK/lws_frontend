// src/api/base.ts
// Базовий instance без авторизації.

import axios from "axios"

const baseApi = axios.create({
    baseURL: "/api",
    timeout: 15000,
})

export default baseApi