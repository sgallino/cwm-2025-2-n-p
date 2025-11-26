import { onMounted, ref } from "vue";
import { getUserProfileById } from "../services/user-profiles";

export default function useUserProfile(id) {
    const user = ref({
        id: null,
        email: null,
        display_name: null,
        bio: null,
        career: null,
    })
    const loading = ref(false);

    // Para las funciones del ciclo de vida de Vue (como mounted o 
    // unmounted) tenemos que usar las funciones importadas onMounted y
    // onUnmounted que recibe un callback como argumento.
    onMounted(async () => {
        try {
            loading.value = true;

            user.value = await getUserProfileById(id);
        } catch (error) {
            // TODO...
        }
        loading.value = false;
    });

    return {
        user,
        loading,
    }
}