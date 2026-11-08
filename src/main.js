import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/tailwind.css';
import '@/assets/styles.scss';

// Color principal índigo, como en el mockup
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const UnachPreset = definePreset(Aura, {
    semantic: {
        primary: Object.fromEntries(shades.map((s) => [s, `{indigo.${s}}`]))
    }
});

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: UnachPreset,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
