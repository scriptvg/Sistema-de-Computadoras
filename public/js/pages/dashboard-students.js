// Importamos lo necesario
import { utilAuth } from "../utils/auth-utils.js";
import { obtenerSolicitudes, crearSolicitud, actualizarSolicitud, eliminarSolicitud } from "../services/calls-admin-dashboard.js";


// Elementos del DOM que vamos a usar
const requestForm = document.getElementById("loanRequestForm");
const userId = document.getElementById("userId");
const campus = document.getElementById("campus");
const equipmentType = document.getElementById("equipmentType");
const departureDate = document.getElementById("departureDate");
const returnDate = document.getElementById("returnDate");
const termsAccepted = document.getElementById("termsAccepted");
const activeLoansTable = document.getElementById("activeLoansTable");
const logoutBtn = document.getElementById("logoutBtn");

// Elementos para los contadores
const availableCount = document.getElementById("availableCount");
const activeLoansCount = document.getElementById("activeLoansCount");
const loanHistoryCount = document.getElementById("loanHistoryCount");

// Función para inicializar todo cuando carga la página
async function init() {
    const user = utilAuth.obtenerUsuarioActual();
    if (!user) {
        window.location.href = '/pages/login.html';
        return;
    }

    userId.value = user.id || user.userId; // Added fallback for userId
    await cargarPrestamos();
    actualizarContadores();
    setupEventListeners();
}

// Configurar los event listeners
function setupEventListeners() {
    requestForm.addEventListener('submit', manejarNuevaSolicitud);
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        utilAuth.cerrarSesion();
    });
}

// Función para manejar nueva solicitud
async function manejarNuevaSolicitud(e) {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
        const solicitud = {
            idUsuario: userId.value,
            sede: campus.value,
            tipoEquipo: equipmentType.value,
            fechaSalida: departureDate.value,
            fechaRegreso: returnDate.value,
            estado: 'pendiente'
        };

        await crearSolicitud(solicitud);

        Swal.fire({
            icon: 'success',
            title: '¡Listo!',
            text: 'Tu solicitud fue enviada'
        });

        requestForm.reset();
        await cargarPrestamos();
        actualizarContadores();

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo enviar la solicitud'
        });
    }
}

// Validar el formulario
function validarFormulario() {
    // Check for empty fields
    if (!campus.value.trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'Por favor selecciona un campus'
        });
        return false;
    }

    if (!equipmentType.value.trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'Por favor selecciona un tipo de equipo'
        });
        return false;
    }

    if (!departureDate.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'Por favor selecciona una fecha de salida'
        });
        return false;
    }

    if (!returnDate.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'Por favor selecciona una fecha de regreso'
        });
        return false;
    }

    if (!termsAccepted.checked) {
        Swal.fire({
            icon: 'warning',
            title: 'Espera',
            text: 'Debes aceptar los términos'
        });
        return false;
    }

    const fechaInicio = new Date(departureDate.value);
    const fechaFin = new Date(returnDate.value);
    const hoy = new Date();

    if (fechaInicio < hoy) {
        Swal.fire({
            icon: 'warning',
            text: 'La fecha de salida no puede ser en el pasado'
        });
        return false;
    }

    if (fechaFin <= fechaInicio) {
        Swal.fire({
            icon: 'warning',
            text: 'La fecha de regreso debe ser después de la salida'
        });
        return false;
    }

    return true;
}

// Cargar los préstamos activos
async function cargarPrestamos() {
    try {
        const prestamos = await obtenerSolicitudes();
        const misPrestamos = prestamos.filter(p => p.idUsuario === userId.value); // Changed from userId to idUsuario
        mostrarPrestamos(misPrestamos);
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los préstamos'
        });
    }
}

// Mostrar los préstamos en la tabla
function mostrarPrestamos(prestamos) {
    if (!Array.isArray(prestamos)) {
        console.error('prestamos no es un array:', prestamos);
        return;
    }

    activeLoansTable.innerHTML = prestamos.map(prestamo => `
        <tr>
            <td>${prestamo.userId?.tipoEquipo || 'No especificado'}</td>
            <td>${prestamo.userId?.fechaSalida ? new Date(prestamo.userId.fechaSalida).toLocaleDateString() : 'No especificado'}</td>
            <td>${prestamo.userId?.fechaRegreso ? new Date(prestamo.userId.fechaRegreso).toLocaleDateString() : 'No especificado'}</td>
            <td>
                <span class="badge badge-${obtenerClaseBadge(prestamo.userId?.estado)}">
                    ${prestamo.userId?.estado || 'pendiente'}
                </span>
            </td>
            <td>
                ${prestamo.userId?.estado === 'aprobado' ? `
                    <button class="btn btn-sm btn-danger" onclick="devolverEquipo('${prestamo.id}')">
                        <i class="fas fa-undo"></i> Devolver
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('') || '<tr><td colspan="5" class="text-center">No tienes préstamos activos</td></tr>';
}

// Obtener la clase para el badge según el estado
function obtenerClaseBadge(estado) {
    const clases = {
        pendiente: 'warning',
        aprobado: 'success',
        rechazado: 'danger',
        devuelto: 'info'
    };
    return clases[estado] || 'secondary';
}

// Función para devolver equipo
async function devolverEquipo(prestamoId) {
    try {
        await actualizarSolicitud(prestamoId, { estado: 'devuelto' });
        await cargarPrestamos();
        actualizarContadores();
        
        Swal.fire({
            icon: 'success',
            title: '¡Listo!',
            text: 'Equipo devuelto correctamente'
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            text: 'Error al devolver el equipo'
        });
    }
}

// Actualizar contadores
async function actualizarContadores() {
    try {
        const prestamos = await obtenerSolicitudes();
        const misPrestamos = prestamos.filter(p => p.userId === userId.value);
        
        const disponibles = 0;
        const activos = misPrestamos.filter(p => p.status === 'activo').length;
        const historial = misPrestamos.length;

        availableCount.textContent = disponibles;
        activeLoansCount.textContent = activos;
        loanHistoryCount.textContent = historial;
    } catch (error) {
        console.error('Error al actualizar contadores:', error);
        availableCount.textContent = '0';
        activeLoansCount.textContent = '0';
        loanHistoryCount.textContent = '0';
    }
}

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', init);

// Hacer disponible la función de devolver equipo globalmente
window.devolverEquipo = devolverEquipo;


