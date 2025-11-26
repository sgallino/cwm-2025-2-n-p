<script setup>
import { computed } from 'vue';

// En la Composition API, las propiedades se definen usando la "macro"
// defineProps(). Esta macro recibe el mismo valor que llevaría asignada
// la propiedad "props" de la Options API.
// Si queremos usar alguna de las propiedades en el script, podemos
// capturar el "retorno" de "defineProps".
// Nota: Una "macro" no es una función común. De ahí que pueden ver
// que no la estamos importando.
// Una "macro" es una instrucción para el compilador de Vue. El 
// compilador reconoce la macro y realiza transformaciones en el código
// según ella.
const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
    },
});

const { buttonColor } = useButtonStyling(props);

function useButtonStyling(props) {
    // Para las propiedad computadas usamos la función computed().
    const buttonColor = computed(() => {
        switch(props.variant) {
            case 'secondary':
                return 'bg-gray-600 hover:bg-gray-500 focus:bg-gray-500 active:bg-gray-700';

            case 'success':
                return 'bg-green-600 hover:bg-green-500 focus:bg-green-500 active:bg-green-700';

            case 'danger':
                return 'bg-red-600 hover:bg-red-500 focus:bg-red-500 active:bg-red-700';

            case 'primary':
            default:
                return 'bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700';
        }
    });

    return {
        buttonColor,
    }
}
</script>

<template>
    <button 
        :class="`transition px-4 py-2 rounded cursor-pointer ${buttonColor} text-white`"
    >
        <slot />
    </button>
</template>