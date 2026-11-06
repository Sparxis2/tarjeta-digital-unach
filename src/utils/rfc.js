// Cálculo del RFC de persona física (algoritmo del SAT):
// 4 letras + fecha AAMMDD + homoclave (2) + dígito verificador (1)

const PALABRAS_IGNORADAS = ['DA', 'DAS', 'DE', 'DEL', 'DER', 'DI', 'DIE', 'DD', 'EL', 'LA', 'LOS', 'LAS', 'LE', 'LES', 'MAC', 'MC', 'VAN', 'VON', 'Y'];
const NOMBRES_COMUNES = ['JOSE', 'J', 'J.', 'MARIA', 'MA', 'MA.', 'M', 'M.'];
const ALTISONANTES = [
    'BUEI', 'BUEY', 'CACA', 'CACO', 'CAGA', 'CAGO', 'CAKA', 'CAKO', 'COGE', 'COJA', 'COJE', 'COJI', 'COJO', 'CULO', 'FETO', 'GUEY', 'JOTO', 'KACA', 'KACO', 'KAGA', 'KAGO', 'KOGE', 'KOJO', 'KAKA', 'KULO', 'MAME', 'MAMO', 'MEAR', 'MEAS', 'MEON', 'MION', 'MOCO', 'MULA', 'PEDA', 'PEDO', 'PENE', 'PUTA', 'PUTO', 'QULO', 'RATA', 'RUIN'
];

function normalizar(texto = '') {
    return texto
        .toUpperCase()
        .replace(/Ñ/g, '#') // proteger la Ñ antes de quitar acentos
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/#/g, 'Ñ')
        .replace(/[^A-ZÑ& ]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function limpiar(texto) {
    return normalizar(texto)
        .split(' ')
        .filter((p) => p && !PALABRAS_IGNORADAS.includes(p))
        .join(' ');
}

function nombreParaClave(nombre) {
    const partes = limpiar(nombre).split(' ').filter(Boolean);
    if (partes.length > 1 && NOMBRES_COMUNES.includes(partes[0])) return partes.slice(1).join(' ');
    return partes.join(' ');
}

function primeraVocalInterna(palabra) {
    const m = palabra.slice(1).match(/[AEIOU]/);
    return m ? m[0] : 'X';
}

function letrasIniciales(nombre, paterno, materno) {
    const p = limpiar(paterno);
    const m = limpiar(materno);
    const n = nombreParaClave(nombre);

    let clave;
    if (!p && m) {
        clave = m.slice(0, 2) + n.slice(0, 2);
    } else if (!m) {
        clave = p.slice(0, 2) + n.slice(0, 2);
    } else if (p.length <= 2) {
        clave = p[0] + m[0] + n.slice(0, 2);
    } else {
        clave = p[0] + primeraVocalInterna(p) + m[0] + n[0];
    }
    clave = clave.replace(/Ñ/g, 'X').padEnd(4, 'X');
    if (ALTISONANTES.includes(clave)) clave = clave.slice(0, 3) + 'X';
    return clave;
}

function fechaClave(fecha) {
    // fecha: Date o 'AAAA-MM-DD'
    const d = fecha instanceof Date ? fecha : new Date(fecha + 'T00:00:00');
    const aa = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return aa + mm + dd;
}

function homoclave(nombre, paterno, materno) {
    const completo = `${normalizar(paterno)} ${normalizar(materno)} ${normalizar(nombre)}`.replace(/\s+/g, ' ').trim();
    const valor = (c) => {
        if (c === ' ') return '00';
        if (c === '&') return '10';
        if (c === 'Ñ') return '40';
        if (c >= 'A' && c <= 'I') return String(c.charCodeAt(0) - 54); // A=11
        if (c >= 'J' && c <= 'R') return String(c.charCodeAt(0) - 53); // J=21
        if (c >= 'S' && c <= 'Z') return String(c.charCodeAt(0) - 51); // S=32
        return '00';
    };
    const cadena = '0' + [...completo].map(valor).join('');
    let suma = 0;
    for (let i = 0; i < cadena.length - 1; i++) {
        suma += parseInt(cadena.slice(i, i + 2), 10) * parseInt(cadena[i + 1], 10);
    }
    const tres = suma % 1000;
    const tabla = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
    return tabla[Math.floor(tres / 34)] + tabla[tres % 34];
}

function digitoVerificador(rfc12) {
    const tabla = '0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ';
    const base = rfc12.length === 11 ? ' ' + rfc12 : rfc12;
    let suma = 0;
    for (let i = 0; i < 12; i++) suma += tabla.indexOf(base[i]) * (13 - i);
    const r = suma % 11;
    if (r === 0) return '0';
    const d = 11 - r;
    return d === 10 ? 'A' : String(d);
}

export function generarRFC({ nombre, paterno, materno, fecha }) {
    const base = letrasIniciales(nombre, paterno, materno) + fechaClave(fecha);
    const con = base + homoclave(nombre, paterno, materno);
    return con + digitoVerificador(con);
}
