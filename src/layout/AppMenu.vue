<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Universidad Autónoma de Chiapas',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Modulos',
        items: [
            { label: 'Demo Clientes', icon: 'pi pi-fw pi-id-card', to: '/formClientes' },
            { label: 'BarCode-QR', icon: 'pi pi-fw pi-qrcode', to: '/barcode' },
            { label: 'Empleados', icon: 'pi pi-fw pi-users', to: '/empleados' },
          
          ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
