import { onMounted, onUnmounted, ref } from "vue";
import { subscribeToAuthStateChanges } from "../services/auth";

export default function useAuthUserState() {
    let unsubscribeFromAuth = () => {}

    const user = ref({
        id: null,
        email: null,
        display_name: null,
        bio: null,
        career: null,
    });

    onMounted(() => {
        // Guardamos la función para cancelar la suscripción.
        unsubscribeFromAuth = subscribeToAuthStateChanges(userState => user.value = userState);
    });

    onUnmounted(() => {
        // Cancelamos la suscripción.
        unsubscribeFromAuth();
    });

    return user;
}