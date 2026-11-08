// Registro sencillo de empleados con tarjeta generada (se guarda en el navegador)
import { reactive } from 'vue';

const CLAVE = 'unach-empleados';

const ejemplos = [
    { id: 'ROMS920822MCSJRS08', nombre: 'SUSANA', apellidos: 'ROJAS MERIDA', puesto: 'Empleada', sexo: 'M', fechaNac: '1992-08-22', generado: '2026-11-02T10:15:00' },
    { id: 'PELC880315HCSRPR02', nombre: 'CARLOS', apellidos: 'PEREZ LOPEZ', puesto: 'Empleado', sexo: 'H', fechaNac: '1988-03-15', generado: '2026-11-03T12:40:00' },
    { id: 'GAHA950710MCSRRN07', nombre: 'ANA', apellidos: 'GARCIA HERNANDEZ', puesto: 'Empleada', sexo: 'M', fechaNac: '1995-07-10', generado: '2026-11-04T09:05:00' },
    { id: 'MORL011120HCSRZSA5', nombre: 'LUIS', apellidos: 'MORALES RUIZ', puesto: 'Empleado', sexo: 'H', fechaNac: '2001-11-20', generado: '2026-11-05T16:30:00' }
];

function cargar() {
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE) || 'null');
        if (Array.isArray(guardado) && guardado.length) return guardado;
    } catch (e) {
        /* sin almacenamiento disponible: usar ejemplos */
    }
    return [...ejemplos];
}

export const empleados = reactive(cargar());

function guardar() {
    try {
        localStorage.setItem(CLAVE, JSON.stringify(empleados));
    } catch (e) {
        /* ignorar */
    }
}

export function registrarEmpleado(emp) {
    const i = empleados.findIndex((e) => e.id === emp.id);
    const registro = { ...emp, generado: new Date().toISOString() };
    if (i >= 0) empleados.splice(i, 1);
    empleados.unshift(registro);
    guardar();
}

export function eliminarEmpleado(id) {
    const i = empleados.findIndex((e) => e.id === id);
    if (i >= 0) {
        empleados.splice(i, 1);
        guardar();
    }
}

export function edad(fechaNac) {
    const n = new Date(fechaNac + 'T00:00:00');
    const h = new Date();
    let a = h.getFullYear() - n.getFullYear();
    if (h.getMonth() < n.getMonth() || (h.getMonth() === n.getMonth() && h.getDate() < n.getDate())) a--;
    return a;
}
