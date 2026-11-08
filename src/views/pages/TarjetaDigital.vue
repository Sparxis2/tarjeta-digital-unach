<script setup>
import { registrarEmpleado } from '@/utils/empleados';
import { generarClave18, sexoPorNombre } from '@/utils/rfc';
import JsBarcode from 'jsbarcode';
import { useToast } from 'primevue/usetoast';
import { computed, nextTick, onMounted, ref } from 'vue';

const toast = useToast();

// Valores iniciales iguales al mockup
const form = ref({
    nombre: 'Susana',
    paterno: 'Rojas',
    materno: 'Merida',
    fecha: '1992-08-22' // input type="date" trabaja con AAAA-MM-DD
});
const rfc = ref('');
const enviado = ref(false);
const hoy = new Date().toISOString().slice(0, 10);

// Lo que muestra la tarjeta (se actualiza al presionar GENERAR)
const tarjeta = ref({ nombre: '', apellidos: '', puesto: '', rfc: '', sexo: 'M' });
const barcode = ref(null);

const invalido = (campo) => enviado.value && !String(form.value[campo] ?? '').trim();
const fechaInvalida = computed(() => enviado.value && !form.value.fecha);

async function generar(registrar = true) {
    enviado.value = true;
    const f = form.value;
    if (!f.nombre.trim() || !f.paterno.trim() || !f.fecha) {
        toast.add({ severity: 'warn', summary: 'Datos incompletos', detail: 'Captura nombre, apellido paterno y fecha de nacimiento.', life: 3000 });
        return;
    }

    const sexo = sexoPorNombre(f.nombre);
    rfc.value = generarClave18({ nombre: f.nombre, paterno: f.paterno, materno: f.materno, fecha: f.fecha, sexo });

    tarjeta.value = {
        nombre: f.nombre.trim().toUpperCase(),
        apellidos: `${f.paterno} ${f.materno}`.trim().toUpperCase(),
        puesto: sexo === 'M' ? 'Empleada' : 'Empleado',
        rfc: rfc.value,
        sexo
    };

    await nextTick();
    dibujarCodigo();

    if (registrar) {
        registrarEmpleado({ id: rfc.value, nombre: tarjeta.value.nombre, apellidos: tarjeta.value.apellidos, puesto: tarjeta.value.puesto, sexo, fechaNac: f.fecha });
        toast.add({ severity: 'success', summary: 'Tarjeta generada', detail: rfc.value, life: 2500 });
    }
}

function dibujarCodigo() {
    if (!barcode.value || !tarjeta.value.rfc) return;
    try {
        JsBarcode(barcode.value, tarjeta.value.rfc, {
            format: 'CODE128',
            width: 1.3,
            height: 42,
            margin: 0,
            fontSize: 11,
            textMargin: 3,
            background: 'transparent',
            lineColor: '#0b1f3a'
        });
    } catch (e) {
        console.error('No se pudo dibujar el código de barras', e);
    }
}

// Al abrir la página se muestra la tarjeta de ejemplo (sin registrarla ni mostrar aviso)
onMounted(() => generar(false));
</script>

<template>
    <div class="grid grid-cols-12 gap-6">
        <!-- Formulario -->
        <div class="col-span-12 lg:col-span-6 xl:col-span-7">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">GENERAR EL RFC DE UNA PERSONA</div>

                <div class="flex flex-col gap-2">
                    <label for="nombre">Nombre(s):</label>
                    <InputText id="nombre" v-model="form.nombre" :invalid="invalido('nombre')" />
                    <Message v-if="invalido('nombre')" severity="error" size="small" variant="simple">El nombre es obligatorio.</Message>
                </div>

                <div class="flex flex-col gap-2">
                    <label for="paterno">Apellido Paterno:</label>
                    <InputText id="paterno" v-model="form.paterno" :invalid="invalido('paterno')" />
                    <Message v-if="invalido('paterno')" severity="error" size="small" variant="simple">El apellido paterno es obligatorio.</Message>
                </div>

                <div class="flex flex-col gap-2">
                    <label for="materno">Apellido Materno:</label>
                    <InputText id="materno" v-model="form.materno" />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="fecha">Fecha Nacimiento:</label>
                    <InputText id="fecha" v-model="form.fecha" type="date" :max="hoy" :invalid="fechaInvalida" />
                    <Message v-if="fechaInvalida" severity="error" size="small" variant="simple">La fecha es obligatoria.</Message>
                </div>

                <div class="flex flex-col gap-2">
                    <label for="rfc">RFC:</label>
                    <InputText id="rfc" v-model="rfc" readonly class="font-mono tracking-wider" />
                </div>

                <div>
                    <Button label="GENERAR" severity="success" class="w-full sm:w-48 font-bold" @click="generar()" />
                </div>
            </div>
        </div>

        <!-- Tarjeta -->
        <div class="col-span-12 lg:col-span-6 xl:col-span-5">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">TARJETA DIGITAL</div>

                <div class="id-card mx-auto">
                    <!-- Fondo con ondas -->
                    <svg class="id-bg" viewBox="0 0 300 470" preserveAspectRatio="none" aria-hidden="true">
                        <rect width="300" height="470" fill="#ffffff" />
                        <path d="M0 0 H300 V118 C240 70 200 150 150 150 C100 150 60 70 0 118 Z" fill="#0b1f3a" />
                        <path d="M0 118 C60 70 100 150 150 150 C200 150 240 70 300 118 V128 C240 86 200 162 150 162 C100 162 60 86 0 128 Z" fill="#1e6fd9" />
                        <path d="M0 400 C80 430 220 370 300 395 V470 H0 Z" fill="#1e6fd9" />
                        <path d="M0 425 C90 450 210 405 300 422 V470 H0 Z" fill="#0b1f3a" />
                    </svg>

                    <div class="id-header">
                        <div class="id-logo"><i class="pi pi-building-columns"></i></div>
                        <div>
                            <div class="id-company">UNACH</div>
                            <div class="id-slogan">Facultad de Negocios</div>
                        </div>
                    </div>

                    <div class="id-photo">
                        <svg viewBox="0 0 100 100" aria-hidden="true">
                            <circle cx="50" cy="50" r="50" fill="#e8edf3" />
                            <template v-if="tarjeta.sexo === 'M'">
                                <path d="M30 52 C28 30 38 20 50 20 C62 20 72 30 70 52 C70 60 66 64 62 66 L38 66 C34 64 30 60 30 52 Z" fill="#0b1f3a" />
                                <ellipse cx="50" cy="44" rx="13" ry="16" fill="#0b1f3a" />
                                <path d="M20 100 C22 76 36 68 50 68 C64 68 78 76 80 100 Z" fill="#0b1f3a" />
                            </template>
                            <template v-else>
                                <ellipse cx="50" cy="42" rx="15" ry="18" fill="#0b1f3a" />
                                <path d="M18 100 C20 74 36 66 50 66 C64 66 80 74 82 100 Z" fill="#0b1f3a" />
                            </template>
                        </svg>
                    </div>

                    <div class="id-body">
                        <div class="id-name">{{ tarjeta.nombre }}</div>
                        <div class="id-name">{{ tarjeta.apellidos }}</div>
                        <div class="id-role">{{ tarjeta.puesto }}</div>
                        <div class="id-rfc">ID : {{ tarjeta.rfc }}</div>
                        <svg ref="barcode" class="id-barcode"></svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.id-card {
    position: relative;
    width: 300px;
    max-width: 100%;
    aspect-ratio: 300 / 470;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(11, 31, 58, 0.25);
    font-family: 'Lato', system-ui, sans-serif;
}
.id-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}
.id-header {
    position: absolute;
    top: 6%;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #fff;
}
.id-logo {
    width: 34px;
    height: 34px;
    border: 2px solid #fff;
    border-radius: 6px;
    transform: rotate(45deg);
    display: grid;
    place-items: center;
}
.id-logo i {
    transform: rotate(-45deg);
    font-size: 14px;
}
.id-company {
    font-weight: 700;
    letter-spacing: 1px;
    font-size: 15px;
}
.id-slogan {
    font-size: 11px;
    opacity: 0.8;
}
.id-photo {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 31%;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 6px solid #fff;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    background: #e8edf3;
}
.id-photo svg {
    width: 100%;
    height: 100%;
    display: block;
}
.id-body {
    position: absolute;
    top: 47%;
    left: 0;
    right: 0;
    text-align: center;
    color: #0b1f3a;
    padding: 0 12px;
}
.id-name {
    font-size: 19px;
    font-weight: 800;
    line-height: 1.2;
}
.id-role {
    margin-top: 4px;
    font-size: 15px;
    color: #6b7280;
    letter-spacing: 0.5px;
}
.id-rfc {
    margin-top: 14px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
}
.id-barcode {
    margin-top: 10px;
    max-width: 85%;
    height: auto;
}
</style>
