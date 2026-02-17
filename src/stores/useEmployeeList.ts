// .src/stores/useEmployeeList.ts


// IMPORT TOOLS
import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { api } from "@/api"


// IMPORT SCHEMAS AND TYPES
import { EmployeeListSchema } from "@/model_schemas/dto/person/employee.dto"
import { mapEmployee } from "@/model_schemas/mapped/person/employee.mapped"
import type { EmployeeList } from "@/model_schemas/models/person/employee.model"
type SortOrder = "asc" | "desc"
type SortField = keyof EmployeeList
type AttorneyFilter = "Всі" | "Так" | "Ні"

// DEFINE STORE
export const useEmployeeListStore = defineStore("employeeList", () => {
    // STATE
    const employeeList = ref<EmployeeList[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // SORT STATE
    const sortBy = ref<SortField | null>(null)
    const sortOrder = ref<SortOrder>("asc")

    // ===== FILTER STATE =====
    // Position: multi-checkbox
    const positionFilter = ref<Set<string>>(new Set())

    // FullName: text search
    const fullNameQuery = ref<string>("")

    // IsAttorney: tri-state
    const attorneyFilter = ref<AttorneyFilter>("Всі")

    // ACTIONS
    async function fetchEmployeeList(): Promise<EmployeeList[]> {
        isLoading.value = true
        error.value = null

        try {
            const {data} = await api.get("person/team/")
            const dtos = EmployeeListSchema.parse(data)
            const mapped = dtos.map(mapEmployee)
            employeeList.value = mapped
            return mapped

        } catch (err) {
            error.value = 'Помилка завантаження списку співробітників.'
            console.error(err)
            employeeList.value = []
            return []
        } finally {
            isLoading.value = false}
    }

    function toggleSort(field: SortField) {
        if (sortBy.value === field) {
            sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"
        } else {
            sortBy.value = field
            sortOrder.value = "asc"
        }
    }

    // ===== FILTER ACTIONS =====
    // === POSITION ===
    function togglePosition(position: string) {
        positionFilter.value.has(position)
            ? positionFilter.value.delete(position)
            : positionFilter.value.add(position)
    }

    function clearPositionFilter() {
        positionFilter.value.clear()
    }

    // === FULLNAME ===
    function setFullNameQuery(v: string) {
        fullNameQuery.value = v
    }

    function clearFullNameFilter() {
        fullNameQuery.value = ""
    }

    // === IsATTORNEY ===
    function setAttorneyFilter(v: AttorneyFilter) {
        attorneyFilter.value = v
    }

    function resetFilters() {
        clearPositionFilter()
        clearFullNameFilter()
        attorneyFilter.value = "Всі"
    }

    // ===== FILTER OPTIONS (for UI) =====
    const availablePositions = computed(() => {
        return Array.from(new Set(employeeList.value.map(e => e.Position))).sort((a, b) =>
            a.localeCompare(b, "uk")
        )
    })

    const availableFullNames = computed(() => {
        return Array.from(new Set(employeeList.value.map(e => e.FullName))).sort((a, b) =>
            a.localeCompare(b, "uk")
        )
    })

    // GETTERS (computed)
    const filteredEmployeeList = computed(() => {
        const q = fullNameQuery.value.trim().toLowerCase()

        return employeeList.value.filter(e => {
            // FullName query
            if (q && !e.FullName.toLowerCase().includes(q)) return false

            // Position multi-select
            if (positionFilter.value.size > 0 && !positionFilter.value.has(e.Position)) return false

            // IsAttorney tri-state
            if (attorneyFilter.value === "Так" && !e.IsAttorney) return false
            if (attorneyFilter.value === "Ні" && e.IsAttorney) return false

            return true
        })
    })

    const sortedEmployeeList = computed(() => {
        const field = sortBy.value
        const base = filteredEmployeeList.value

        if (!field) return base

        return [...base].sort((a, b) => {
            const A = a[field]
            const B = b[field]

            // boolean (e.g. IsAttorney)
            if (typeof A === "boolean" && typeof B === "boolean") {
                return sortOrder.value === "asc"
                    ? Number(A) - Number(B)
                    : Number(B) - Number(A)
            }

            // number (if you ever add one)
            if (typeof A === "number" && typeof B === "number") {
                return sortOrder.value === "asc" ? A - B : B - A
            }

            // string fallback
            const sA = String(A ?? "").toLowerCase()
            const sB = String(B ?? "").toLowerCase()

            return sortOrder.value === "asc"
                ? sA.localeCompare(sB, "uk")
                : sB.localeCompare(sA, "uk")
        })
    })


    return {
        // data
        employeeList,
        filteredEmployeeList,
        sortedEmployeeList,

        // loading/error
        isLoading,
        error,

        // sorting
        sortBy,
        sortOrder,
        toggleSort,

        // filters state
        positionFilter,
        fullNameQuery,
        attorneyFilter,

        // filter options
        availablePositions,
        availableFullNames,

        // filter actions
        togglePosition,
        clearPositionFilter,
        setFullNameQuery,
        clearFullNameFilter,
        setAttorneyFilter,
        resetFilters,

        // actions
        fetchEmployeeList,
    }
})