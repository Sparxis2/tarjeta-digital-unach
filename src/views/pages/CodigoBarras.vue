<script setup>
import JsBarcode from 'jsbarcode';
import { onMounted, ref, watch } from 'vue';

const texto = ref('ROMS920822MCSJRS08');
const formato = ref('CODE128');
const formatos = ['CODE128', 'CODE39', 'EAN13', 'UPC'];
const svg = ref(null);
const error = ref('');

function dibujar() {
    error.value = '';
    if (!svg.value) return;
    try {
        JsBarcode(svg.value, texto.value || ' ', { format: formato.value, width: 2, height: 80, fontSize: 14, background: 'transparent' });
    } catch (e) {
        error.value = `El texto no es válido para ${formato.value}.`;
    }
}

onMounted(dibujar);
watch([texto, formato], dibujar);
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">GENERADOR DE CÓDIGO DE BARRAS</div>
        <div class="flex flex-col md:flex-row gap-4">
            <div class="flex flex-col gap-2 grow">
                <label for="texto">Texto a codificar:</label>
                <InputText id="texto" v-model="texto" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="formato">Formato:</label>
                <Select id="formato" v-model="formato" :options="formatos" class="w-full md:w-48" />
            </div>
        </div>
        <Message v-if="error" severity="warn">{{ error }}</Message>
        <div class="flex justify-center p-6 border border-surface rounded-border overflow-x-auto">
            <svg ref="svg"></svg>
        </div>
    </div>
</template>
