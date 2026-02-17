// .src/stores/useEmployee.ts

// IMPORT TOOLS
import { defineStore } from "pinia"
import { ref } from "vue"
import { api } from "@/api"

// IMPORT SCHEMAS AND TYPES
import { EmployeeFullGetSchema } from "@/model_schemas/dto/person/employee.dto";
import { mapEmployeeFullGet } from "@/model_schemas/mapped/person/employee.mapped";
import type {EmployeeFullGet } from "@/model_schemas/models/person/employee.model"

// DEFINE STORE
export const useEmployeeFullGetStore = defineStore("employeeFullGet", () => {
    // STATE
    const employee = ref<EmployeeFullGet | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // ACTIONS
    async function fetchEmployeeFullGet(id: number): Promise<EmployeeFullGet | null> {
        isLoading.value = true
        error.value = null

        try {
            const {data} = await api.get(`person/employees/${id}/`)
            const dto = EmployeeFullGetSchema.parse(data)
            const mapped = mapEmployeeFullGet(dto)
            employee.value = mapped
            return mapped

        } catch (err) {
            error.value = 'Помилка завантаження даних співробітника.'
            console.error(err)
            employee.value = null
            return null
        } finally {
            isLoading.value = false}
        }

    function clear() {
        employee.value = null
        error.value = null
    }

    return {
        employee,
        isLoading,
        error,
        fetchEmployeeFullGet,
        clear
    }
})