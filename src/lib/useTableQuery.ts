import { computed, ref, type ComputedRef, type Ref } from "vue"

export type SortDirection = "asc" | "desc"
export type SortIndicator = "" | "▲" | "▼"

type MaybeRefArray<T> = Ref<T[]> | ComputedRef<T[]>
type Primitive = string | number | boolean | Date | null | undefined

type TextFilter = {
    type: "text"
    value: string
}

type DateRangeFilter = {
    type: "date-range"
    from?: string
    to?: string
}

type ColumnFilter = TextFilter | DateRangeFilter

export type UseTableQueryOptions<T> = {
    initialKey?: keyof T | string
    initialDirection?: SortDirection
    pageSize?: number
    globalSearchKeys?: (keyof T | string)[]
    dateKeys?: (keyof T | string)[]
}

export function useTableQuery<T extends Record<string, unknown>>(
    items: MaybeRefArray<T>,
    options: UseTableQueryOptions<T> = {},
) {
    const sortKey = ref<string>(options.initialKey ? String(options.initialKey) : "")
    const sortDirection = ref<SortDirection>(options.initialDirection ?? "asc")

    const columnFilters = ref<Record<string, ColumnFilter>>({})
    const globalSearch = ref("")

    const currentPage = ref(1)
    const pageSize = ref(options.pageSize ?? 10)

    function normalizeValue(value: Primitive): string | number {
        if (value instanceof Date) return value.getTime()
        if (typeof value === "string") return value.toLowerCase().trim()
        if (typeof value === "number") return value
        if (typeof value === "boolean") return value ? 1 : 0
        return ""
    }

    function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
        return path.split(".").reduce<unknown>((acc, key) => {
            if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
                return (acc as Record<string, unknown>)[key]
            }
            return undefined
        }, obj)
    }

    function isDateKey(key: string): boolean {
        return (options.dateKeys ?? []).map(String).includes(key)
    }

    function toTimestamp(value: unknown): number | null {
        if (value instanceof Date) {
            const time = value.getTime()
            return Number.isNaN(time) ? null : time
        }

        if (typeof value === "string" || typeof value === "number") {
            const time = new Date(value).getTime()
            return Number.isNaN(time) ? null : time
        }

        return null
    }

    function setSort(key: string): void {
        if (sortKey.value === key) {
            sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc"
        } else {
            sortKey.value = key
            sortDirection.value = "asc"
        }
        currentPage.value = 1
    }

    function getSortIndicator(key: string): SortIndicator {
        if (sortKey.value !== key) return ""
        return sortDirection.value === "asc" ? "▲" : "▼"
    }

    function setColumnFilter(key: string, value: string): void {
        columnFilters.value[key] = {
            type: "text",
            value,
        }
        currentPage.value = 1
    }

    function setDateRangeFilter(key: string, from?: string, to?: string): void {
        columnFilters.value[key] = {
            type: "date-range",
            from,
            to,
        }
        currentPage.value = 1
    }

    function clearColumnFilter(key: string): void {
        delete columnFilters.value[key]
        currentPage.value = 1
    }

    function setGlobalSearch(value: string): void {
        globalSearch.value = value
        currentPage.value = 1
    }

    function clearFilters(): void {
        columnFilters.value = {}
        globalSearch.value = ""
        currentPage.value = 1
    }

    const filteredItems = computed<T[]>(() => {
        const source = items.value ?? []

        return source.filter((item) => {
            const matchesColumnFilters = Object.entries(columnFilters.value).every(([key, filter]) => {
                if (!filter) return true

                const rawValue = getNestedValue(item, key)

                if (filter.type === "text") {
                    if (!filter.value?.trim()) return true

                    const normalizedItemValue = String(normalizeValue(rawValue as Primitive))
                    const normalizedFilterValue = filter.value.toLowerCase().trim()

                    return normalizedItemValue.includes(normalizedFilterValue)
                }

                if (filter.type === "date-range") {
                    if (!filter.from && !filter.to) return true

                    const itemTimestamp = toTimestamp(rawValue)
                    if (itemTimestamp === null) return false

                    if (filter.from) {
                        const fromDate = new Date(filter.from)
                        fromDate.setHours(0, 0, 0, 0)
                        if (itemTimestamp < fromDate.getTime()) return false
                    }

                    if (filter.to) {
                        const toDate = new Date(filter.to)
                        toDate.setHours(23, 59, 59, 999)
                        if (itemTimestamp > toDate.getTime()) return false
                    }

                    return true
                }

                return true
            })

            if (!matchesColumnFilters) return false

            if (!globalSearch.value.trim()) return true

            const keys = options.globalSearchKeys?.length
                ? options.globalSearchKeys.map(String)
                : Object.keys(item)

            const searchNeedle = globalSearch.value.toLowerCase().trim()

            return keys.some((key) => {
                const rawValue = getNestedValue(item, key)
                const normalizedItemValue = String(normalizeValue(rawValue as Primitive))
                return normalizedItemValue.includes(searchNeedle)
            })
        })
    })

    const sortedItems = computed<T[]>(() => {
        const data = [...filteredItems.value]

        if (!sortKey.value) return data

        return data.sort((a, b) => {
            const aRaw = getNestedValue(a, sortKey.value)
            const bRaw = getNestedValue(b, sortKey.value)

            if (isDateKey(sortKey.value)) {
                const aDate = toTimestamp(aRaw)
                const bDate = toTimestamp(bRaw)

                if (aDate === null && bDate === null) return 0
                if (aDate === null) return 1
                if (bDate === null) return -1

                if (aDate < bDate) return sortDirection.value === "asc" ? -1 : 1
                if (aDate > bDate) return sortDirection.value === "asc" ? 1 : -1
                return 0
            }

            const aValue = normalizeValue(aRaw as Primitive)
            const bValue = normalizeValue(bRaw as Primitive)

            if (aValue < bValue) return sortDirection.value === "asc" ? -1 : 1
            if (aValue > bValue) return sortDirection.value === "asc" ? 1 : -1
            return 0
        })
    })

    const totalItems = computed(() => sortedItems.value.length)
    const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

    const paginatedItems = computed<T[]>(() => {
        const start = (currentPage.value - 1) * pageSize.value
        const end = start + pageSize.value
        return sortedItems.value.slice(start, end)
    })

    function goToPage(page: number): void {
        currentPage.value = Math.min(Math.max(1, page), totalPages.value)
    }

    function nextPage(): void {
        goToPage(currentPage.value + 1)
    }

    function prevPage(): void {
        goToPage(currentPage.value - 1)
    }

    return {
        sortKey,
        sortDirection,
        columnFilters,
        globalSearch,
        currentPage,
        pageSize,

        filteredItems,
        sortedItems,
        paginatedItems,
        totalItems,
        totalPages,

        setSort,
        getSortIndicator,

        setColumnFilter,
        setDateRangeFilter,
        clearColumnFilter,
        setGlobalSearch,
        clearFilters,

        goToPage,
        nextPage,
        prevPage,
    }
}