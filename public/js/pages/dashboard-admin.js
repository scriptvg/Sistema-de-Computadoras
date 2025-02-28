// Importamos lo necesario
import { utilAuth } from "../utils/auth-utils.js";
import { obtenerSolicitudes, actualizarSolicitud, eliminarSolicitud, obtenerPrestamosActivos } from "../services/calls-admin-dashboard.js";
import { showLoading } from "../utils/main.js";

// Elementos del DOM
const prestamosActivos = document.getElementById("activeLoans");
const tablaSolicitudes = document.getElementById("tableBody");
// const logoutBtn = document.getElementById("logoutBtn");
// const contenedorEstadisticas = document.getElementById("statsContainer");

// Elementos para estadísticas
const totalSolicitudes = document.getElementById("totalRequests");
const solicitudesPendientes = document.getElementById("pendingRequests");
const solicitudesAprobadas = document.getElementById("approvedRequests");

// Inicializar el dashboard

async function inicializar() {
    console.log('Iniciando dashboard admin...');
    const user = utilAuth.obtenerUsuarioActual();
    console.log('Usuario actual:', user);

    if (!user || user.role !== 'admin') {
        console.log('Usuario no autorizado o no es admin:', user);
        window.location.href = '/pages/login.html';
        return;
    }

    const userId = user.id || user.userId.idUsuario;
    console.log('ID de usuario:', userId);

    try {
        console.log('Cargando datos iniciales...');
        await cargarSolicitudes();
        await actualizarEstadisticas();
        await actualizarPrestamosActivos(userId);
        configurarEventListeners();
        console.log('Inicialización completada');
    } catch (error) {
        console.error('Error en inicialización:', error);
    }
}

function configurarEventListeners() {
    console.log('Configurando event listeners...');
    
    const logoutBtn = document.getElementById("logoutBtn");
    console.log('Logout button encontrado:', !!logoutBtn);
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            console.log('Logout clicked');
            e.preventDefault();
            utilAuth.cerrarSesion();
        });
    }

    const filterSelect = document.getElementById('statusFilter');
    console.log('Filter select encontrado:', !!filterSelect);
    
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            console.log('Filtro cambiado');
            cargarSolicitudes();
        });
    }
}

async function cargarSolicitudes() {
    console.log('Iniciando carga de solicitudes...');
    try {
        const solicitudes = await obtenerSolicitudes();
        for (let i = 0; i < solicitudes.length; i++) {
            console.log('Solicitudes obtenidas:', solicitudes);
            
        }
        console.log('Solicitudes obtenidas:', solicitudes);
        mostrarSolicitudes(solicitudes);
    } catch (error) {
        console.error('Error en cargarSolicitudes:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las solicitudes'
        });
    }
}

function mostrarSolicitudes(solicitudes) {
    console.log('Mostrando solicitudes:', solicitudes);
    if (!Array.isArray(solicitudes)) {
        console.error('Formato inválido de solicitudes:', typeof solicitudes);
        return;
    }

    const tablaSolicitudesElement = document.getElementById("tableBody");
    console.log('Elemento tabla encontrado:', !!tablaSolicitudesElement);

    if (!tablaSolicitudesElement) {
        console.error('No se encontró el elemento tableBody');
        return;
    }
    
    tablaSolicitudes.innerHTML = solicitudes.map(solicitud => {
        const userId = solicitud.userId || {};
        return `
            <tr>
                <td>${userId.idUsuario || '[No ID]'}</td>
                <td>${userId.tipoEquipo || 'No especificado'}</td>
                <td>${userId.fechaSalida ? new Date(userId.fechaSalida).toLocaleDateString() : 'No especificado'}</td>
                <td>${userId.fechaRegreso ? new Date(userId.fechaRegreso).toLocaleDateString() : 'No especificado'}</td>
                <td>${userId.sede || 'No especificado'}</td>
                <td>
                    <span class="badge badge-${obtenerClaseBadge(userId.estado)}">
                        ${userId.estado || 'pendiente'}
                    </span>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <select class="form-control form-control-sm mr-2" 
                                onchange="cambiarEstado('${solicitud.id}', this.value)"
                                style="width: auto;">
                            <option value="pendiente" ${userId.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="aprobado" ${userId.estado === 'aprobado' ? 'selected' : ''}>Aprobado</option>
                            <option value="rechazado" ${userId.estado === 'rechazado' ? 'selected' : ''}>Rechazado</option>
                            <option value="devuelto" ${userId.estado === 'devuelto' ? 'selected' : ''}>Devuelto</option>
                        </select>
                        <button class="btn btn-sm btn-danger ml-2" onclick="eliminarSolicitudAdmin('${solicitud.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn btn-sm btn-info ml-2" onclick="verDetalles('${JSON.stringify(userId).replace(/'/g, "&apos;")}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('') || '<tr><td colspan="7" class="text-center">No hay solicitudes</td></tr>';
}

/* Función para eliminiar Solicitudes */
async function eliminarSolicitudAdmin(solicitudId) {
    if (!solicitudId) {
        Swal.fire({
            icon: 'error',
            text: 'ID de solicitud inválido'
        });
        return;
    }

    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            showLoading('Eliminando solicitud...');
            await eliminarSolicitud(solicitudId);
            await cargarSolicitudes();
            await actualizarEstadisticas();
            
            Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: 'La solicitud ha sido eliminada'
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                text: 'Error al eliminar la solicitud'
            });
        }
    }
}

/* Función para ver detalles */
function verDetalles(solicitudJSON) {
    const solicitud = JSON.parse(solicitudJSON);
    
    Swal.fire({
        title: 'Detalles de la Solicitud',
        html: `
            <div class="text-left">
                <p><strong>ID de Usuario:</strong> ${solicitud.userId}</p>
                <p><strong>Equipo:</strong> ${solicitud.requestDate}</p>
                <p><strong>Campus:</strong> ${solicitud.userId.sede || 'No especificado'}</p>
                <p><strong>Fecha de Salida:</strong> ${new Date(solicitud.departureDate).toLocaleDateString()}</p>
                <p><strong>Fecha de Regreso:</strong> ${new Date(solicitud.returnDate).toLocaleDateString()}</p>
                <p><strong>Estado:</strong> ${solicitud.status}</p>
                <p><strong>Fecha de Solicitud:</strong> ${new Date(solicitud.requestDate).toLocaleString()}</p>
            </div>
        `,
        confirmButtonText: 'Cerrar'
    });
}

/* Punto de mira global */
window.eliminarSolicitudAdmin = eliminarSolicitudAdmin;
window.verDetalles = verDetalles;

// Obtener la clase para el badge según el estado
function obtenerClaseBadge(status) {
    const clases = {
        pendiente: 'warning',
        aprobado: 'success',
        rechazado: 'danger',
        devuelto: 'info'
    };
    return clases[status] || 'secondary';
}

async function cambiarEstado(solicitudId, nuevoEstado) {
    if (!solicitudId) {
        Swal.fire({
            icon: 'error',
            text: 'ID de solicitud inválido'
        });
        return;
    }

    try {
        showLoading('Actualizando estado...');
        /* Obtener solicitud actual */
        const solicitudes = await obtenerSolicitudes();
        const solicitud = solicitudes.find(s => s.id === solicitudId);
        
        if (!solicitud) {
            throw new Error('Solicitud no encontrada');
        }

        /* Solicitud Actualizada */
        const datosActualizados = {
            ...solicitud.userId,
            estado: nuevoEstado
        };

        await actualizarSolicitud(solicitudId, { userId: datosActualizados });
        await cargarSolicitudes();
        await actualizarEstadisticas();
        
        Swal.fire({
            icon: 'success',
            title: '¡Listo!',
            text: 'Estado actualizado correctamente'
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            text: 'Error al actualizar el estado'
        });
    }
}

window.cambiarEstado = cambiarEstado;

async function aprobarSolicitud(solicitudId) {
    if (!solicitudId) {
        Swal.fire({
            icon: 'error',
            text: 'ID de solicitud inválido'
        });
        return;
    }

    try {
        showLoading('Procesando solicitud...');
        await actualizarSolicitud(solicitudId, { status: 'aprobado' });
        await cargarSolicitudes();
        await actualizarEstadisticas();
        
        Swal.fire({
            icon: 'success',
            title: '¡Listo!',
            text: 'Solicitud aprobada correctamente'
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            text: 'Error al aprobar la solicitud'
        });
    }
}

async function rechazarSolicitud(solicitudId) {
    if (!solicitudId) {
        Swal.fire({
            icon: 'error',
            text: 'ID de solicitud inválido'
        });
        return;
    }

    try {
        showLoading('Procesando solicitud...');
        await actualizarSolicitud(solicitudId, { status: 'rechazado' });
        await cargarSolicitudes();
        await actualizarEstadisticas();
        
        Swal.fire({
            icon: 'success',
            title: '¡Listo!',
            text: 'Solicitud rechazada correctamente'
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            text: 'Error al rechazar la solicitud'
        });
    }
}

async function actualizarEstadisticas() {
    try {
        showLoading('Actualizando estadísticas...');
        const solicitudes = await obtenerSolicitudes();
        
        if (!Array.isArray(solicitudes)) {
            throw new Error('Formato de datos inválido');
        }

        const total = solicitudes.length;
        const pendientes = solicitudes.filter(s => s.status === 'pendiente').length;
        const aprobadas = solicitudes.filter(s => s.status === 'aprobado').length;

        totalSolicitudes.textContent = total;
        solicitudesPendientes.textContent = pendientes;
        solicitudesAprobadas.textContent = aprobadas;

        Swal.close();
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las estadísticas'
        });
    }
}

async function actualizarPrestamosActivos(userId) {
    try {
        showLoading('Actualizando préstamos activos...');
        const prestamos = await obtenerPrestamosActivos(userId);
        
        if (!Array.isArray(prestamos)) {
            throw new Error('Formato de datos inválido');
        }

        if (prestamosActivos) {
            prestamosActivos.textContent = prestamos.length;
        } else {
            console.error('No se encontró el elemento prestamosActivos');
        }

        Swal.close();
    } catch (error) {
        console.error('Error en actualizarPrestamosActivos:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los préstamos activos'
        });
    }
}

document.addEventListener('DOMContentLoaded', inicializar);

window.aprobarSolicitud = aprobarSolicitud;
window.rechazarSolicitud = rechazarSolicitud;