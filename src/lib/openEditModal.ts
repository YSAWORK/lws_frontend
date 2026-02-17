// src/lib/openEntityModal.ts

// IMPORTS
import { createApp, h } from "vue";
import BaseEntityModal from "@/components/modals/BaseEntityModal.vue";

// TYPES
export interface FieldCfg {
    key: string;
    label: string;
    type?: "text" | "textarea" | "number" | "email";
    placeholder?: string;
    rows?: number;
    required?: boolean;
    transformOut?: (v:any)=>any;
    transformIn?: (v:any)=>any;
}

export interface EntityModalOptions<T extends Record<string, any>> {
    title: string;
    entity: T;
    fields: FieldCfg[];
    saveFn: (payload: T) => Promise<T>;
    onSaved?: (updated: T) => void;
}

export function openEntityModal<T extends Record<string, any>>(opts: EntityModalOptions<T>) {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const app = createApp({
        render() {
            return h(BaseEntityModal, {
                title: opts.title,
                entity: opts.entity,
                fields: opts.fields,
                onClose: () => { app.unmount(); container.remove(); },
                onSave: async (localData: T) => {
                    const payload: any = { ...localData };
                    for (const f of opts.fields) {
                        if (f.transformOut && f.key in payload) {
                            payload[f.key] = f.transformOut(payload[f.key]);
                        }
                    }
                    const updated = await opts.saveFn(payload);
                    opts.onSaved?.(updated);
                    app.unmount(); container.remove();
                }
            });
        }
    });

    app.mount(container);
}
