<script setup>
import { provide, ref } from 'vue';
import AppFooter from './components/AppFooter.vue';
import AppNavbar from './components/AppNavbar.vue';
import { GLOBAL_FEEDBACK_PROVIDER_KEY } from './symbols/keys';
import NotificationBox from './components/NotificationBox.vue';

const feedback = ref({
    message: null,
    type: 'success',
    closable: true,
});

function updateFeedback(data) {
    if(typeof data !== 'object') throw new Error("[updateFeedback] La data debe ser un objeto.");

    feedback.value = {
        ...feedback.value,
        ...data,
    }
}

// Definimos una dependencia que proveemos usando "provide()".
// Esta función recibe 2 argumentos:
//  1. Clave identificatoria.
//  2. El valor de la dependencia. Típicamente, un objeto.
// Dentro de los datos de la dependencia podemos pasar lo que deseemos.
// Esto incluye el poder pasar variables reactivas (como las definidas
// con ref()).
// Que podamos pasar una variable reactiva no significa que sea una 
// buena idea hacerlo.
// De hecho, Vue expresamente nos recomienda evitar esta práctica.
// La razón es que pasar variables reactivas permite que cualquier
// descediente pueda modificar con total libertad el valor. Esto 
// incluye asignarle datos que sean incorrectos.
// No solo no podemos evitarlo. Sino encontrar el error luego puede
// ser notablemente difícil.
// En su lugar, la recomendación es pasar una función que permita
// modificar el valor, en caso de ser necesario.
//
// Adicionalmente, es importante tener cuidado con cómo usamos la
// clave.
// Si ponemos un string como clave, existe el posible problema de que
// los descendientes escriban erroneamente el nombre de la dependencia.
// Ese problema se puede resolver fácilmente usando una constante 
// externa para definir la clave.
// Pero hay otro problema más que tiene usar un string como clave.
// Existe la posibilidad de que otro componente defina un provide usando
// el mismo string. De hacer esto, vamos a tener conflictos. Uno va a
// sobrescribir al otro.
// Esto puede pasar por diversas razones. Por ejemplo, puede ser una
// biblioteca de terceros que estamos usando y define esa clave. O
// puede ser alguien que no sabe que ya se está usando esa clave para
// algo.
// Por estas razones, la recomendación para las claves siempre es usar
// un Symbol.
// provide('global-feedback', {
provide(GLOBAL_FEEDBACK_PROVIDER_KEY, {
    // feedback,
    updateFeedback,
});
</script>

<template>
    <AppNavbar />
    <main class="container mx-auto p-4">
        <NotificationBox 
            v-if="feedback.message !== null"
            :data="feedback" 
            @close="() => feedback.message = null"
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
        <!-- 
        El componente "RouterView" no necesita importarse. Se registra
        globalmente en todos los componentes cuando registramos el
        router en la aplicación.
        -->
        <RouterView 
        />
        <!-- @update-feedback="handleUpdateFeedback" -->
    </main>
    <AppFooter />
</template>