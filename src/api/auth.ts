// src/api/auth.ts
import publicApi from "./public"

export type LoginPayload = {
    username: string
    password: string
}

export type LoginResponse = {
    access: string
    refresh: string
}

export type RefreshPayload = {
    refresh: string
}

export type RefreshResponse = {
    access: string
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await publicApi.post<LoginResponse>("/token/", payload)
    return data
}

export async function refreshToken(
    payload: RefreshPayload
): Promise<RefreshResponse> {
    const { data } = await publicApi.post<RefreshResponse>(
        "/token/refresh/",
        payload
    )
    return data
}

export async function logoutRequest(): Promise<void> {
    // Якщо на бекенді немає logout endpoint, просто прибери цю функцію.
    await publicApi.post("/logout/")
}