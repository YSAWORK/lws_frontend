// src/main.ts
import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "../router"
import "@/styles/tokens.css"
import { useAuthStore } from "@/stores/auth"

export const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(router)

useAuthStore(pinia).initFromStorage()

app.mount("#app")
