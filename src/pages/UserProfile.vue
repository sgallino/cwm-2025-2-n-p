<script setup>
import { useRoute } from 'vue-router';
import AppH1 from '../components/AppH1.vue';
import AppLoader from '../components/AppLoader.vue';
import useUserProfile from '../composables/useUserProfile';
import { getFileURL } from '../services/storage';

const route = useRoute();

const { user, loading } = useUserProfile(route.params.id);
</script>

<template>
    <template v-if="!loading">
        <div class="flex items-end gap-4">
            <AppH1>Perfil de {{ user.email }}</AppH1>
        </div>

        <div class="flex gap-4 my-6">
            <div class="w-1/4">
                <img 
                    v-if="user.photo_url"
                    :src="getFileURL(user.photo_url)" 
                    alt=""
                >
                <span v-else>Sin foto de perfil</span>
                <!-- TODO: Mostrar una foto por defecto. -->
            </div>
            <div class="w-3/4">
                <div class="ms-4 text-gray-800 italic">{{ user.bio ?? 'Sin especificar...' }}</div>

                <dl class="mb-4">
                    <dt class="font-bold">Email</dt>
                    <dd class="mb-2">{{ user.email }}</dd>
                    <dt class="font-bold">Nombre</dt>
                    <dd class="mb-2">{{ user.display_name ?? 'Sin especificar...' }}</dd>
                    <dt class="font-bold">Carrera</dt>
                    <dd class="mb-2">{{ user.career ?? 'Sin especificar...' }}</dd>
                </dl>
            </div>
        </div>

        <hr class="mb-4">

        <RouterLink
            class="text-blue-700 underline"
            :to="`/usuario/${user.id}/chat`"
        >
            Iniciar conversación privada con {{ user.email }}
        </RouterLink>
    </template>
    <template v-else>
        <AppLoader />
    </template>
</template>