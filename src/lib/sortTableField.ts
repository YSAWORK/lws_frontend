// src/lib/sortTableField

state: () => ({
    sortBy: null,
    sortOrder: 'asc'
})

actions: {
    toggleSort(field) {
        if (this.sortBy === field) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
        } else {
            this.sortBy = field
            this.sortOrder = 'asc'
        }
    }
}