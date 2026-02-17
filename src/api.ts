// src/api.ts
import axios from "axios";

export const api = axios.create({
    baseURL: "/api",
    timeout: 10_000,
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
}});

// ===== ADD AUTH TOKEN TO REQUESTS =====//
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

//===== HARD LOGOUT =====//
function hardLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("employee_id");
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.assign(`/login?next=${next}`);
}

let refreshing: Promise<string> | null = null;

// ===== HANDLE 401 RESPONSES =====//
api.interceptors.response.use(
    (r) => r,
    async (error) => {
        const original: any = error.config;

        // якщо прийшов 401 і ще не пробували рефреш
        if (error?.response?.status === 401 && !original?._retry) {
            original._retry = true;

            const refresh = localStorage.getItem("refresh");
            if (!refresh) {
                hardLogout();
                return Promise.reject(error);
            }

            if (!refreshing) {
                refreshing = axios
                    .post("auth/token/refresh/", { refresh })
                    .then(({ data }) => {
                        if (!data?.access) throw new Error("No access in refresh response");
                        localStorage.setItem("access", data.access);
                        return data.access as string;
                    })
                    .catch((e) => {
                        hardLogout();
                        throw e;
                    })
                    .finally(() => {
                        refreshing = null;
                    });
            }

            const newAccess = await refreshing;
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${newAccess}`;
            return api(original);
        }

        return Promise.reject(error);
    }
);

export default api;
