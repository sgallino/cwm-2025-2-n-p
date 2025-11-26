<script setup>
defineProps({
    data: {
        type: Object,
        required: true,
    }
});
defineEmits(['close']);
</script>

<template>
    <div 
        class="relative p-4 mb-4 rounded"
        :class="{
            'bg-red-100': data.type === 'error',
            'bg-green-100': data.type === 'success',
        }"
    >
        {{ data.message }}

        <button
            v-if="data.closable"
            class="absolute top-0 bottom-0 right-0 flex justify-center items-center w-12"
            @click="$emit('close')"
        >
            &times;
        </button>
    </div>
</template>