<script setup>
import { useLayout } from '@/layout/composables/layout';
import { edad, empleados } from '@/utils/empleados';
import { computed, onMounted, ref, watch } from 'vue';

const { isDarkTheme } = useLayout();

const total = computed(() => empleados.length);
const mujeres = computed(() => empleados.filter((e) => e.sexo === 'M').length);
const hombres = computed(() => empleados.filter((e) => e.sexo === 'H').length);
const hoy = new Date().toISOString().slice(0, 10);
const generadasHoy = computed(() => empleados.filter((e) => (e.generado || '').slice(0, 10) === hoy).length);
const edadPromedio = computed(() => (total.value ? Math.round(empleados.reduce((s, e) => s + edad(e.fechaNac), 0) / total.value) : 0));
const recientes = computed(() => empleados.slice(0, 5));

const rangos = [
    { etiqueta: '18-25', min: 0, max: 25 },
    { etiqueta: '26-35', min: 26, max: 35 },
    { etiqueta: '36-45', min: 36, max: 45 },
    { etiqueta: '46+', min: 46, max: 200 }
];

const barData = ref(null);
const barOptions = ref(null);
const pieData = ref(null);
const pieOptions = ref(null);

function armarGraficas() {
    const css = getComputedStyle(document.documentElement);
    const texto = css.getPropertyValue('--text-color');
    const textoSec = css.getPropertyValue('--text-color-secondary');
    const borde = css.getPropertyValue('--surface-border');

    barData.value = {
        labels: rangos.map((r) => r.etiqueta),
        datasets: [
            {
                label: 'Empleados',
                backgroundColor: css.getPropertyValue('--p-primary-500'),
                borderRadius: 6,
                data: rangos.map((r) => empleados.filter((e) => edad(e.fechaNac) >= r.min && edad(e.fechaNac) <= r.max).length)
            }
        ]
    };
    barOptions.value = {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: textoSec }, grid: { display: false } },
            y: { beginAtZero: true, ticks: { color: textoSec, precision: 0 }, grid: { color: borde } }
        }
    };

    pieData.value = {
        labels: ['Mujeres', 'Hombres'],
        datasets: [
            {
                data: [mujeres.value, hombres.value],
                backgroundColor: [css.getPropertyValue('--p-indigo-500'), css.getPropertyValue('--p-teal-500')]
            }
        ]
    };
    pieOptions.value = {
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: texto, usePointStyle: true } } }
    };
}

function formatoFecha(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

onMounted(armarGraficas);
watch(isDarkTheme, armarGraficas);
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <!-- Indicadores -->
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Empleados registrados</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ total }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-indigo-100 dark:bg-indigo-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-indigo-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-muted-color">Con tarjeta digital</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Tarjetas generadas hoy</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ generadasHoy }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-id-card text-green-500 text-xl!"></i>
                    </div>
                </div>
                <router-link to="/formClientes" class="text-primary font-medium hover:underline">Generar una nueva</router-link>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Mujeres / Hombres</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ mujeres }} / {{ hombres }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-chart-pie text-cyan-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-muted-color">Distribución del personal</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Edad promedio</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ edadPromedio }} años</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-calendar text-orange-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-muted-color">Según fecha de nacimiento</span>
            </div>
        </div>

        <!-- Tarjetas recientes -->
        <div class="col-span-12 xl:col-span-7">
            <div class="card">
                <div class="flex justify-between items-center mb-4">
                    <div class="font-semibold text-xl">Tarjetas recientes</div>
                    <router-link to="/empleados"><Button label="Ver todos" text size="small" /></router-link>
                </div>
                <DataTable :value="recientes" :rows="5" responsiveLayout="scroll">
                    <Column field="id" header="ID">
                        <template #body="{ data }"><span class="font-mono text-sm">{{ data.id }}</span></template>
                    </Column>
                    <Column header="Nombre">
                        <template #body="{ data }">{{ data.nombre }} {{ data.apellidos }}</template>
                    </Column>
                    <Column field="puesto" header="Puesto" />
                    <Column header="Generada">
                        <template #body="{ data }">{{ formatoFecha(data.generado) }}</template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!-- Gráficas -->
        <div class="col-span-12 xl:col-span-5">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Personal por género</div>
                <div style="height: 260px">
                    <Chart type="doughnut" :data="pieData" :options="pieOptions" class="h-full" />
                </div>
            </div>
        </div>
        <div class="col-span-12">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Empleados por rango de edad</div>
                <div style="height: 280px">
                    <Chart type="bar" :data="barData" :options="barOptions" class="h-full" />
                </div>
            </div>
        </div>
    </div>
</template>
