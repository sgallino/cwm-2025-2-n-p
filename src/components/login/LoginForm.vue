<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../../services/auth';
import AppButton from '../AppButton.vue';
import AppLoader from '../AppLoader.vue';
import { GLOBAL_FEEDBACK_PROVIDER_KEY } from '../../symbols/keys';
import NotificationBox from '../NotificationBox.vue';

// En la Composition API no tenemos acceso a "this". Esto significa
// que tampoco tenemos acceso a ninguna variable especial que existe
// en this, como "$router", "$route", "$refs" o "$nextTick".
// En su lugar, tenemos usar funciones que nos ofrezcan esas 
// funcionalidades.
// Por ejemplo, para obtener el $router, tenemos el "composable"
// useRouter de vue-router.
const router = useRouter();

// const emit = defineEmits(['updateFeedback']);

// Pedimos que se nos inyecte la dependencia "global-feedback" que
// un ancestro está proveyendo a través de la función "inject()".
// const { updateFeedback: updateGlobalFeedback } = inject('global-feedback');
const { updateFeedback: updateGlobalFeedback } = inject(GLOBAL_FEEDBACK_PROVIDER_KEY);

const { user, loading, feedback, handleSubmit } = useLoginForm(router);

// En la Composition API definimos valores del "state" del componente
// usando funciones propias de Vue. La principal, y más importante, es
// la función "ref" (abreviatura de "reactive reference").
// En general, cada propiedad que pondríamos en el objeto del data
// pasaría a ser una variable con ref().
// Las variables definidas con ref() se deben actualizar o leer usando
// la propiedad ".value" de la variable.
// Es decir, si tenemos:
//  const ejemplo = ref("Hola");
// Para leer hacemos:
//  console.log(ejemplo.value);
// Y para escribir:
//  ejemplo.value = "Mundo";
// La razón es que Vue envuelve al valor que le pasamos en el ref en un
// objeto con la propiedad "value".
// Por ejemplo, el ref() que creamos va a ser un objeto similar a este:
//  { value: "Hola" }
// Estrictatemente hablando, no es un objeto común, sino un "Proxy".
function useLoginForm(router) {
    const user = ref({
        email: '',
        password: '',
    });
    const loading = ref(false);
    const feedback = ref({
        message: null,
        type: 'success',
    });

    // Con respecto a los "methods", pasan a ser funciones comunes dentro
    // del script.
    async function handleSubmit() {
        try {
            loading.value = true;

            await login(user.value.email, user.value.password);

            // feedback.value = {
            //     message: '¡Hola de nuevo!',
            //     type: 'success',
            // }
            // emit('updateFeedback', {
            //     message: '¡Hola de nuevo!',
            //     type: 'success',
            // });
            // globalFeedback.value = {
            //     message: '¡Hola de nuevo!',
            //     type: 'success',
            // }
            // updateGlobalFeedback({
            //     message: '¡Hola de nuevo!',
            //     type: 'success',
            // });
            updateGlobalFeedback({
                message: '¡Hola de nuevo!',
                type: 'success',
            });
        
            // Usamos el router que definimos con useRouter.
            router.push('/mi-perfil');
        } catch (error) {
            console.error("Error en la autenticación: ", error);
            feedback.value = {
                message: 'Las credenciales ingresadas no coinciden con nuestros registros.',
                type: 'error',
            }
        }
        loading.value = false;
    }

    return {
        user,
        loading,
        feedback,
        handleSubmit,
    }
}
</script>

<template>
    <NotificationBox
        v-if="feedback.message !== null"
        :data="feedback" 
    />

    <!-- <div 
        v-if="feedback.message !== null"
        class="p-4 mb-4 rounded"
        :class="{
            'bg-red-100': feedback.type === 'error',
            'bg-green-100': feedback.type === 'success',
        }"
    >
        {{ feedback.message }}
    </div> -->

    <form
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="email" class="block mb-1">Email</label>
            <input
                type="email"
                id="email"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="user.email"
            >
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-1">Contraseña</label>
            <input
                type="password"
                id="password"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="user.password"
            >
        </div>
        <AppButton 
            type="submit"
            variant="secondary"
        >
            <template v-if="!loading">
                Ingresar
            </template>
            <template v-else>
                <AppLoader />
            </template>
        </AppButton>
    </form>
</template>