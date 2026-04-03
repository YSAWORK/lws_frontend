// src/tools/checkIsPlainObject.ts

// функція яка перевіряє чи є значення звичайним об'єктом
export function isPlainObject(value: unknown): value is Record<string, unknown> {
    return (
        // відсіює рядки, числа, булеві, undefined
        typeof value === "object" &&
        // відсіює null
        value !== null &&
        // відсіює масиви, бо вони теж об'єкти
        !Array.isArray(value)
    )
}