<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from "vue"

const props = defineProps<{
  value?: string | number | null
  disabled?: boolean
  name?: string
  size?: "sm" | "md" | "lg" | "100" | "50" | "25" | "auto"
  maxHeight?: number // px, для випадаючого списку
}>()

const emit = defineEmits<{
  (e: "change", event: Event): void
}>()

const slots = useSlots()

const isOpen = ref(false)
const dropUp = ref(false)

const triggerRef = ref<HTMLElement | null>(null)
const hiddenSelectRef = ref<HTMLSelectElement | null>(null)

// Позиція dropdown
const pos = ref({ left: 0, top: 0, width: 0 })
const MH = computed(() => props.maxHeight ?? 240)

// Для лейбла показуємо selected option text
const selectedLabel = computed(() => {
  const v = String(props.value ?? "")
  return findLabelByValue(v)
})

function computePosition() {
  const el = triggerRef.value
  if (!el) return

  const r = el.getBoundingClientRect()
  const spaceBelow = window.innerHeight - r.bottom
  const spaceAbove = r.top

  // Визначаємо напрям
  dropUp.value = spaceBelow < MH.value && spaceAbove > spaceBelow

  pos.value = {
    left: r.left,
    top: dropUp.value ? r.top : r.bottom,
    width: r.width,
  }
}

async function open() {
  if (props.disabled) return
  isOpen.value = true
  await nextTick()
  computePosition()
}

function close() {
  isOpen.value = false
}

function toggle() {
  if (isOpen.value) close()
  else void open()
}

function onWin() {
  if (isOpen.value) computePosition()
}

// Закриття по Escape
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") close()
}

// Емітимо твій старий change-івент, не ламаючи підпис
function emitNativeChange() {
  const el = hiddenSelectRef.value
  if (!el) return

  // створюємо event
  const evt = new Event("change", { bubbles: true })

  // важливо: диспатчимо на select — тоді evt.target стане el
  el.dispatchEvent(evt)

  // і цей же evt передаємо наверх
  emit("change", evt)
}

function selectValue(val: string) {
  const el = hiddenSelectRef.value
  if (!el) return

  el.value = val
  emitNativeChange()
  close()
}

function findLabelByValue(val: string): string {
  for (const block of parsedOptions.value) {
    if (block.kind === "option") {
      if (block.value === val) return block.label
    } else {
      const hit = block.options.find(o => o.value === val)
      if (hit) return hit.label
    }
  }
  return ""
}

// Витягуємо опції зі слота (option / optgroup)
type ParsedOpt =
    | { kind: "option"; value: string; label: string; disabled?: boolean }
    | { kind: "group"; label: string; options: { value: string; label: string; disabled?: boolean }[] }

const parsedOptions = computed<ParsedOpt[]>(() => {
  const vnodes = slots.default?.() ?? []
  const out: ParsedOpt[] = []

  const walk = (nodes: any[]) => {
    for (const n of nodes) {
      if (!n) continue
      const type = n.type
      const propsN = n.props ?? {}
      const children = n.children

      if (type === "option") {
        const value = String(propsN.value ?? "")
        const label =
            typeof children === "string"
                ? children
                : Array.isArray(children)
                    ? children.map((c: any) => (typeof c === "string" ? c : "")).join("").trim()
                    : ""
        out.push({ kind: "option", value, label, disabled: !!propsN.disabled })
        continue
      }

      if (type === "optgroup") {
        const groupLabel = String(propsN.label ?? "")
        const groupOpts: { value: string; label: string; disabled?: boolean }[] = []

        const groupChildren = Array.isArray(children?.default?.()) ? children.default() : (Array.isArray(children) ? children : [])
        for (const gc of groupChildren) {
          if (gc?.type === "option") {
            const gv = String(gc.props?.value ?? "")
            const gl =
                typeof gc.children === "string"
                    ? gc.children
                    : Array.isArray(gc.children)
                        ? gc.children.map((c: any) => (typeof c === "string" ? c : "")).join("").trim()
                        : ""
            groupOpts.push({ value: gv, label: gl, disabled: !!gc.props?.disabled })
          }
        }

        out.push({ kind: "group", label: groupLabel, options: groupOpts })
        continue
      }

      // інші вузли — пробуємо пройтись по дітях
      if (Array.isArray(children)) walk(children)
      else if (children?.default) walk(children.default())
    }
  }

  walk(vnodes)
  return out
})

watch(isOpen, (v) => {
  if (v) {
    window.addEventListener("resize", onWin)
    window.addEventListener("scroll", onWin, true)
    window.addEventListener("keydown", onKeydown)
  } else {
    window.removeEventListener("resize", onWin)
    window.removeEventListener("scroll", onWin, true)
    window.removeEventListener("keydown", onKeydown)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", onWin)
  window.removeEventListener("scroll", onWin, true)
  window.removeEventListener("keydown", onKeydown)
})
</script>

<template>
  <div class="base-select-wrap">
    <!-- Прихований нативний select: зберігаємо слоти option -->
    <select
        ref="hiddenSelectRef"
        class="native-select"
        :value="value ?? ''"
        :disabled="disabled"
        :name="name"
        aria-hidden="true"
        tabindex="-1"
    >
      <slot />
    </select>

    <!-- Тригер -->
    <button
        ref="triggerRef"
        type="button"
        class="base-select"
        :class="[`size-${size}`]"
        :disabled="disabled"
        @click="toggle"
    >
      <span class="trigger-text">{{ selectedLabel || "—" }}</span>
      <span class="trigger-icon">▾</span>
    </button>

    <!-- Dropdown в body -->
    <Teleport to="body">
      <div v-if="isOpen" class="overlay" @click="close">
        <div
            class="dropdown"
            :style="{
            left: pos.left + 'px',
            width: pos.width + 'px',
            maxHeight: MH + 'px',
            top: dropUp ? 'auto' : pos.top + 'px',
            bottom: dropUp ? (window.innerHeight - pos.top) + 'px' : 'auto',
          }"
            @click.stop
        >
          <!-- Рендеримо опції з твого слота -->
          <template v-for="block in parsedOptions" :key="block.kind + (block as any).label + (block as any).value">
            <template v-if="block.kind === 'option'">
              <button
                  type="button"
                  class="opt"
                  :class="{ selected: String(value ?? '') === block.value }"
                  :disabled="block.disabled"
                  @click="selectValue(block.value)"
              >
                {{ block.label || "—" }}
              </button>
            </template>

            <template v-else>
              <div class="group-label">{{ block.label }}</div>
              <button
                  v-for="opt in block.options"
                  :key="opt.value"
                  type="button"
                  class="opt"
                  :class="{ selected: String(value ?? '') === opt.value }"
                  :disabled="opt.disabled"
                  @click="selectValue(opt.value)"
              >
                {{ opt.label || "—" }}
              </button>
            </template>
          </template>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.base-select-wrap {
  width: 100%;
}

/* нативний select лишаємо для форми/семантики, але ховаємо */
.native-select {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
}

/* тригер у твоєму стилі */
.base-select {
  height: var(--input-min-height);
  font-size: var(--input-font-size);
  text-align: left;
  font-family: var(--font-button), sans-serif;
  color: var(--text-primary);
  padding: 0 0.6vw;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border);
  margin: var(--margin-base);
  background: white;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.base-select:focus {
  outline: none;
  box-shadow: var(--shadow-dark);
  border: 1px solid var(--text-disabled);
}

.trigger-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.trigger-icon {
  opacity: 0.7;
}

/* overlay ловить клік “зовні” */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
}

/* dropdown fixed — не обрізається модалкою */
.dropdown {
  position: fixed;
  z-index: 100000;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-dark);
  overflow-y: auto;
  padding: 4px 0;
}

/* option items */
.opt {
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: var(--btn-font-size-lmd);
  font-family: var(--font-button), sans-serif;
  color: var(--text-primary);
}

.opt:hover {
  background: var(--button-primary)
}

.opt.selected {
  background: var(--button-primary);
  font-weight: 600;
}

.opt:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.group-label {
  padding: 6px 10px;
  font-size: 12px;
  opacity: 0.7;
}

/* === SIZE (твій набір) === */
.size-sm { width: clamp(50px, 2vw, 100px); }
.size-md { width: clamp(100px, 20vw, 400px); }
.size-lg { width: clamp(400px, 40vw, 80000px); }
.size-100 { width: 100%; }
.size-50 { width: 50%; }
.size-25 { width: 25%; }
.size-auto { width: auto; }
</style>