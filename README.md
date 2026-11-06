# Tarjeta Digital de Empleado — Facultad de Negocios UNACH

Interfaz en **Vue 3 + PrimeVue** (plantilla Sakai) que genera el **RFC** de una persona física y su **tarjeta digital** de empleado con código de barras.

## Funcionalidad
- Formulario: nombre(s), apellido paterno, apellido materno y fecha de nacimiento.
- Cálculo del RFC con el algoritmo del SAT: 4 letras, fecha AAMMDD, homoclave y dígito verificador (`src/utils/rfc.js`).
- Tarjeta digital con nombre, puesto, RFC como ID y código de barras CODE128 (JsBarcode).
- Validación de campos obligatorios y notificaciones (Toast).

Ruta del módulo: `/#/formClientes` (menú **Modulos → Demo Clientes**).

## Ejecutar en local
```bash
npm install
npm run dev
```
Abrir http://localhost:5173

## Compilar
```bash
npm run build
```
Se genera la carpeta `dist/`, lista para Netlify o Vercel.
