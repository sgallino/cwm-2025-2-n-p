<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import AppH1 from '../components/AppH1.vue';
import AppLoader from '../components/AppLoader.vue';
import { subscribeToAuthStateChanges, updateAuthUserAvatar, updateAuthUserProfile } from '../services/auth';
import AppButton from '../components/AppButton.vue';

const { imageData, loading, handleSubmit, handleFileChange } = useProfileEditAvatarForm();

function useProfileEditAvatarForm() {
    const imageData = ref({
        file: null,
        preview: null,
    });
    const loading = ref(false);

    async function handleSubmit() {
        try {
            if(loading.value || imageData.value.file === null) {
                return;
            }
            
            loading.value = true;

            await updateAuthUserAvatar(imageData.value.file);
        } catch (error) {
            console.error(error);
            
        }
        loading.value = false;
    }

    function handleFileChange(event) {
        /*
            Todas las funciones que asociemos a un evento nativo de 
            HTML / JS va a recibir automáticamente un objeto Event.
            Como sabemos, desde el event podemos acceder a la propiedad
            "target" para obtener el elemento que disparó el evento.
            En los <input type="file"> tenemos una propiedad llamada
            "files" que contiene un objeto FileList. El cual es, 
            básicamente, un array de objetos File.
            Como nuestro input no tiene el atributo "multiple", solo
            puede seleccionar un único archivo por vez. Esto permite
            que podamos simplemente hardcodear la posición 0.
        */
        imageData.value.file = event.target.files[0];
        // console.log('Archivo seleccionado: ', imageData.value.file);

        // Cuando la imagen cambie revocamos la anterior, si existe.
        if(imageData.value.preview !== null) {
            URL.revokeObjectURL(imageData.value.preview);
            imageData.value.preview = null;
        }
        
        /*
            Teniendo el objeto File podemos ahora hacer la 
            previsualización.
            La forma más directa de hacerlo es a través de la clase URL
            y su método createObjectURL(), que recibe un File o Blob.
            Este método levanta el archivo recibido en memoria, le
            asigna una URL relativa al dominio del sitio, y lo guarda
            en el elemento "document".
            Con esa URL vamos a poder acceder a utilizar el archivo,
            por ejemplo, para mostrarlo en un <img>.
            Importante: Como mencionamos, el archivo queda cargado en
            memoria, y asociado al document. Esto implica que el 
            archivo, o todos los archivos que levantemos de esta manera,
            van a quedar cargados en memoria hasta que:
            - Descarguemos de la página (por ejemplo, un refresh, o 
                yendo a otra página).
            - Indiquemos que debe revocarse ese archivo.

            En páginas MPA tradicionales, esto no supone un problema.
            Por su naturaleza, no quedan mucho tiempo cargadas, por lo
            que en cuando naveguen a otra pantalla los archivos se 
            liberan.
            Pero en páginas que viven largo tiempo, como una SPA, esto
            si no se controla puede generar importantes filtraciones de
            memoria ("memory leaks").
            Para prevenirlo, tenemos que acordarnos de revocar el 
            archivo cuando no lo necesitemos más. Por ejemplo, en un
            unmounted.
        */
        if(imageData.value.file != null) {
            imageData.value.preview = URL.createObjectURL(imageData.value.file);
        }
    }

    onUnmounted(() => {
        if(imageData.value.preview !== null) {
            // Limpiamos el archivo de la memoria.
            URL.revokeObjectURL(imageData.value.preview);
        }
    });

    return {
        imageData,
        loading,
        handleSubmit,
        handleFileChange,
    }
}
</script>

<template>
    <AppH1>Actualizar mi foto de perfil</AppH1>

    <div class="flex gap-4">
        <form 
            action="#"
            class="w-1/2"
            @submit.prevent="handleSubmit"
        >
            <div class="mb-4">
                <label for="image" class="block mb-1">Imagen</label>
                <input
                    type="file"
                    id="image"
                    class="w-full p-2 border border-gray-300 rounded"
                    @change="handleFileChange"
                >
            </div>
            <AppButton type="submit">
                <template v-if="!loading">
                    Actualizar
                </template>
                <template v-else>
                    <AppLoader />
                </template>
            </AppButton>
        </form>
        <div class="w-1/2">
            <h2 class="text-lg">Imagen seleccionada:</h2>
            <img 
                v-if="imageData.preview !== null"
                :src="imageData.preview" 
                alt=""
            >
            <span v-else>No hay una imagen seleccionada</span>
        </div>
    </div>
</template>