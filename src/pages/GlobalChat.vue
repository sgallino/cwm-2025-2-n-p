<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import AppH1 from '../components/AppH1.vue';
import AppLoader from '../components/AppLoader.vue';
import useAuthUserState from '../composables/useAuthUserState';
import { fetchGlobalChatLastMessages, sendGlobalChatNewMessage, subscribeToGlobalChatNewMessages } from '../services/global-chat';
import { useScrollToBottom } from '../composables/useScrollToBottom';
import { formatDate } from '../helpers/date';

const user = useAuthUserState();
const { messages, loadingMessages } = useGlobalChatMessages();
const { newMessage, handleSubmit } = useGlobalChatMessageForm(user);

// Composables locales
// Los composables que creamos deberían solo trabajar con los datos 
// que definen, y no depender de variables que existan por fuera de
// la función.
// Esto es importante porque es lo que permite que podamos luego 
// reutilizar fácilmente la función en otros componentes, si así se
// necesita.
// Esto no significa que no puedan necesitar datos más allá de los que
// definen. Por ejemplo, como sucede con useGlobalChatMessageForm() que
// necesita el usuario autenticado, que definimos fuera de la función.
// En estos casos, el composable solo debe pedir como parámetro de la
// función sus dependencias externas.
function useGlobalChatMessages() {
    let unsubscribeFromChat = () => {}
    
    const messages = ref([]);
    const loadingMessages = ref(false);

    onMounted(async () => {
        // useTemplateRef es el composable que nos permite obtener un
        // elemento del DOM. Equivalente a el uso de this.$refs.
        // const chatContainer = useTemplateRef('chatContainer');
        const { scrollToBottom } = useScrollToBottom('chatContainer');
        loadingMessages.value = true;

        unsubscribeFromChat = subscribeToGlobalChatNewMessages(async newMessage => {
            messages.value.push(newMessage);
            
            scrollToBottom();
            // await nextTick();
            
            // chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        });
        
        messages.value = await fetchGlobalChatLastMessages();
        
        loadingMessages.value = false;

        // $refs es la propiedad especial de la Options API que contiene todas las template
        // refs del componente.
        // console.log("Alto del contenedor del chat antes del $nextTick es: ", chatContainer.value.scrollHeight);
        
        /*
            ¿Qué hace el nextTick?
            Una de las tareas más exigentes que pueden tener que realizar los browsers es 
            dibujar / renderizar (paint) la página.
            Por esta razón, es que Vue no actualiza el DOM apenas tiene alguna indicación de
            hacerlo.
            Por ejemplo, cuando lo agregamos los nuevos mensajes de chat, eso implica que 
            tiene que actualizar el DOM, para actualizar la lista de HTML.
            Pero no lo hace de una. Sino que espera un rato para ver si hay más cambios que
            se pidan sobre el DOM.
            Trata de hacer un "batch" de múltiples cambios para aplicarlos todos juntos,
            y ahorrar repaintings.

            Típicamente, esto puede pasar desapercibido por nosotros. Vue es bastante hábil
            en cómo maneja este tipo de repaintings.

            Pero hay circunstancias donde nosotros necesitamos explícitamente esperar a que
            alguna modificación del DOM se realice antes de proceder. Como es este caso de
            actualizar la ubicación del scroll.

            Eso es lo que nextTick() hace. Retorna una Promise que se resuelve cuando Vue
            ejecuta un repainting a través de modificar el DOM.
        */
        // await nextTick();
        
        // // console.log("Alto del contenedor del chat después del $nextTick es: ", chatContainer.value.scrollHeight);
        // chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        scrollToBottom();

    });

    onUnmounted(() => unsubscribeFromChat());

    return {
        messages,
        loadingMessages,
    }
}

function useGlobalChatMessageForm(user) {
    const newMessage = ref({
        content: ''
    });

    async function handleSubmit() {
        try {
            await sendGlobalChatNewMessage({
                sender_id: user.value.id,
                email: user.value.email,
                content: newMessage.value.content,
            });
        } catch (error) {
            // TODO ...
        }

        newMessage.value.content = '';
    }

    return {
        newMessage,
        handleSubmit,
    }
}
</script>

<template>
    <AppH1>Chat general</AppH1>

    <div class="flex gap-4">
        <!-- 
        En Vue, podemos agregarle a los elementos de HTML un atributo "ref" que contenga un identificador.
        Este identificador permite que el elemento del DOM sea accesible en el script a través de una 
        "template ref".
        -->
        <section class="overflow-y-auto w-9/12 h-100 p-4 border border-gray-200 rounded" ref="chatContainer">
            <h2 class="sr-only">Lista de mensajes</h2>
            <template v-if="!loadingMessages">
                <ol class="flex flex-col items-start gap-4">
                    <!-- 
                    v-for es un "directiva".
                    Las directivas son funciones que permiten transformar o modificar de 
                    alguna manera el elemento.
                    -->
                    <li
                        v-for="message in messages"
                        :key="message.id"
                        class="p-4 rounded bg-gray-100"
                    >
                        <div class="mb-1">
                            <RouterLink
                                :to="`/usuario/${message.sender_id}`" 
                                class="font-bold text-blue-700 underline"
                            >
                                {{ message.email }}
                            </RouterLink> 
                            dijo:
                        </div>
                        <div class="mb-1">{{ message.content }}</div>
                        <div class="text-sm text-gray-700">{{ formatDate(message.created_at) }}</div>
                    </li>
                </ol>
            </template>
            <template v-else>
                <AppLoader />
            </template>
        </section>
        <section class="w-3/12">
            <h2 class="mb-4 text-xl">Enviar un mensaje</h2>
            <form
                action="#"
                @submit.prevent="handleSubmit"
            >
                <div class="mb-4">
                    <span class="block mb-1">Email</span>
                    {{ user.email }}
                </div>
                <div class="mb-4">
                    <label for="content" class="block mb-1">Mensaje</label>
                    <!-- 
                    v-model genera un "two-way data binding".
                    Esto significa que Vue mantiene en sincronía el valor del state y del control
                    (campo) del form.
                    Si el "state" cambia, Vue actualiza el valor del campo.
                    Si el usuario cambia el valor del campo, Vue actualiza el "state".
                    -->
                    <textarea
                        id="content"
                        class="w-full p-2 border border-gray-300 rounded"
                        v-model="newMessage.content"
                    ></textarea>
                </div>
                <button type="submit" class="transition px-4 py-2 rounded cursor-pointer bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">Enviar</button>
            </form>
        </section>
    </div>
</template>