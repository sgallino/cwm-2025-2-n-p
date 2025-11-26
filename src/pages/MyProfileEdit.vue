<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import AppH1 from '../components/AppH1.vue';
import AppLoader from '../components/AppLoader.vue';
import { subscribeToAuthStateChanges, updateAuthUserProfile } from '../services/auth';

const { formData, loading, handleSubmit } = useProfileEditForm();

function useProfileEditForm() {
    let unsubscribeFromAuth = () => {}

    const formData = ref({
        display_name: null,
        bio: null,
        career: null,
    });
    const loading = ref(false);

    async function handleSubmit() {
        try {
            loading.value = true;

            await updateAuthUserProfile(formData.value);
        } catch (error) {
            // TODO...
        }
        loading.value = false;
    }

    onMounted(() => unsubscribeFromAuth = subscribeToAuthStateChanges(userState => {
        formData.value = {
            display_name: userState.display_name,
            bio: userState.bio,
            career: userState.career,
        }
    }));

    onUnmounted(() => unsubscribeFromAuth());

    return {
        formData,
        loading,
        handleSubmit,
    }
}
</script>

<template>
    <AppH1>Actualizar mi perfil</AppH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="bio" class="block mb-1">Biografía</label>
            <textarea
                id="bio"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="formData.bio"
            ></textarea>
        </div>
        <div class="mb-4">
            <label for="display_name" class="block mb-1">Nombre</label>
            <input
                type="text"
                id="display_name"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="formData.display_name"
            >
        </div>
        <div class="mb-4">
            <label for="career" class="block mb-1">Carrera</label>
            <input
                type="text"
                id="career"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="formData.career"
            >
        </div>
        <button type="submit" class="transition px-4 py-2 rounded cursor-pointer bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">
            <template v-if="!loading">
                Actualizar
            </template>
            <template v-else>
                <AppLoader />
            </template>
        </button>
    </form>
</template>