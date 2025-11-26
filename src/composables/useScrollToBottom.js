import { nextTick, useTemplateRef } from "vue";

export function useScrollToBottom(refId) {
    const element = useTemplateRef(refId);

    async function scrollToBottom() {
        await nextTick();

        element.value.scrollTop = element.value.scrollHeight;
    }

    return {
        scrollToBottom,
    }
}