// src/lib/formatPhoneNumber.ts

// Форматує номер телефону +380952586531 -> +38 (095) 258-65-31
export function formatPhoneNumber(input: string | null | undefined): string {
    if (!input) return ""

    // Видаляємо всі символи-не цифри
    const digits = input.replace(/\D/g, "")

    // Перевіряємо - 12 цифр
    if (digits.length !== 12) {
        return input
    }

    const country = digits.slice(0, 2)      // 38
    const operator = digits.slice(2, 5)     // 095
    const part1 = digits.slice(5, 8)        // 258
    const part2 = digits.slice(8, 10)       // 65
    const part3 = digits.slice(10, 12)      // 31

    return `+${country} (${operator}) ${part1}-${part2}-${part3}`
}