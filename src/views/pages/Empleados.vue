<script setup>
import { edad, eliminarEmpleado, empleados } from '@/utils/empleados';
import { useConfirm } from 'primevue/useconfirm';
import { ref } from 'vue';

const confirm = useConfirm();
const filtro = ref('');

function borrar(emp) {
    confirm.require({
        message: `¿Eliminar a ${emp.nombre} ${emp.apellidos}?`,
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => eliminarEmpleado(emp.id)
    });
}

function formatoFecha(iso) {
    return iso ? new Date(iso.length === 10 ? iso + 'T00:00:00' : iso).toLocaleDateString('es-MX') : '';
}
</script>

<template>
    <div class="card">
        <div class="flex flex-wrap gap-4 justify-between items-center mb-4">
            <div class="font-semibold text-xl">EMPLEADOS CON TARJETA DIGITAL</div>
            <div class="flex gap-2">
                <IconField>
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="filtro" placeholder="Buscar..." />
                </IconField>
                <router-link to="/formClientes"><Button label="Nueva tarjeta" icon="pi pi-plus" /></router-link>
            </div>
        </div>

        <DataTable :value="empleados" :globalFilterFields="['id', 'nombre', 'apellidos', 'puesto']" :filters="{ global: { value: filtro, matchMode: 'contains' } }" paginator :rows="10" dataKey="id" stripedRows>
            <template #empty>No hay empleados registrados.</template>
            <Column field="id" header="ID" sortable>
                <template #body="{ data }"><span class="font-mono text-sm">{{ data.id }}</span></template>
            </Column>
            <Column field="nombre" header="Nombre" sortable>
                <template #body="{ data }">{{ data.nombre }} {{ data.apellidos }}</template>
            </Column>
            <Column field="puesto" header="Puesto" sortable />
            <Column field="fechaNac" header="Nacimiento" sortable>
                <template #body="{ data }">{{ formatoFecha(data.fechaNac) }} ({{ edad(data.fechaNac) }} años)</template>
            </Column>
            <Column field="generado" header="Tarjeta generada" sortable>
                <template #body="{ data }">{{ formatoFecha(data.generado) }}</template>
            </Column>
            <Column style="width: 4rem">
                <template #body="{ data }">
                    <Button icon="pi pi-trash" severity="danger" text rounded @click="borrar(data)" />
                </template>
            </Column>
        </DataTable>
    </div>
    <ConfirmDialog />
</template>
