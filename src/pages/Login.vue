<script setup>
import { provide } from 'vue';
import AppH1 from '../components/AppH1.vue';
import LoginForm from '../components/login/LoginForm.vue';

// defineEmits(['updateFeedback']);
provide(Symbol(), {
    texto: null,
})
</script>

<template>
    <AppH1>Ingresar a mi cuenta</AppH1>

    <LoginForm />
    <!-- <LoginForm
        @update-feedback="data => $emit('updateFeedback', data)"
    /> -->
</template>