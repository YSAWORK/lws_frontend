// .src/components/modals/person/editNaturalPersonalInfo/openEditNaturalPersonalInfo.ts

/// IMPORT TOOLS
import { createApp, h } from "vue"
import EditNaturalPersonInfoModal from "@/components/modals/person/editNaturalPersonalInfo/editNaturalPersonalInfoVue.vue";
import type {NaturalPersonEditDTO } from "@/model_schemas/dto/person/natural_person.dto";

type Options = {
    personInfo: NaturalPersonEditDTO,
    onCreated?: () => void | Promise<void>
}

export function openEditNaturalPersonInfoModal(opts: Options) {
    const host = document.createElement("div")
    document.body.appendChild(host)

    const app = createApp({
        render() {
            return h(EditNaturalPersonInfoModal, {
                personInfo: opts.personInfo,
                onClose: () => {
                    app.unmount()
                    host.remove()
                },
                onCreated: async () => {
                    await opts.onCreated?.()
                    app.unmount()
                    host.remove()
                },
            })
        },
    })

    app.mount(host)
}