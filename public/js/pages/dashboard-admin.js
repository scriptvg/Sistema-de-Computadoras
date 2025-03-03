// Importamos lo necesario
import { utilAuth } from "../utils/auth-utils.js";
import { obtenerDetallesUsuario, obtenerSolicitudes, actualizarSolicitud, eliminarSolicitud, obtenerPrestamosActivos } from "../services/calls-admin-dashboard.js";
import { showLoading } from "../utils/main.js";

// Elementos del DOM
const prestamosActivos = document.getElementById("activeLoans");
const tablaSolicitudes = document.getElementById("tableBody");
 const logoutBtn = document.getElementById("logoutBtn");
 const contenedorEstadisticas = document.getElementById("statsContainer");

// Elementos para estadísticas
const totalSolicitudes = document.getElementById("totalRequests");
const solicitudesPendientes = document.getElementById("pendingRequests");
const solicitudesAprobadas = document.getElementById("approvedRequests");

// Inicializar el dashboard

function initializeKanban() {
    const columnas = document.querySelectorAll('.status-column');
    columnas.forEach(columna => {
        new Sortable(columna, {
            group: 'solicitudes',
            animation: 150,
            ghostClass: 'sortable-ghost',
            dragClass: 'sortable-drag',
            async onEnd(evt) {
                const solicitudId = evt.item.dataset.id;
                const nuevoEstado = evt.to.id;
                
                try {
                    await cambiarEstado(solicitudId, nuevoEstado);
                    await actualizarEstadisticas();
                } catch (error) {
                    console.error('Error al actualizar estado:', error);
                    evt.from.appendChild(evt.item);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo actualizar el estado de la solicitud'
                    });
                }
            }
        });
    });
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
    
    // Actualizar la tabla de solicitudes
    tablaSolicitudes.innerHTML = solicitudes.map(solicitud => {
        const userId = solicitud.userId || {};
        const solicitudData = {
            ...solicitud,  // Include all solicitud data
            id: solicitud.id,
            idUsuario: solicitud.userId?.idUsuario,
            name: solicitud.user?.name,
            email: solicitud.user?.email,
            tipoEquipo: solicitud.userId?.tipoEquipo,
            sede: solicitud.userId?.sede,
            fechaSalida: solicitud.userId?.fechaSalida,
            fechaRegreso: solicitud.userId?.fechaRegreso,
            estado: solicitud.userId?.estado
        }
        console.log('Solicitud procesada:', solicitudData);
        
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
                        <button class="btn btn-sm btn-info ml-2 ver-detalles" data-solicitud='${JSON.stringify(solicitudData)}'>
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('') || '<tr><td colspan="7" class="text-center">No hay solicitudes</td></tr>';

    // Actualizar el tablero kanban
    const columnas = {
        pendiente: document.getElementById('pendiente'),
        aprobado: document.getElementById('aprobado'),
        rechazado: document.getElementById('rechazado'),
        devuelto: document.getElementById('devuelto')
    };

    // Limpiar todas las columnas
    Object.values(columnas).forEach(columna => {
        if (columna) columna.innerHTML = '';
    });

    // Poblar columnas con solicitudes
    solicitudes.forEach(solicitud => {
        const estado = solicitud.userId?.estado || 'pendiente';
        const columna = columnas[estado];
        
        if (columna) {
            columna.innerHTML += `
                <div class="request-card" data-id="${solicitud.id}">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <strong>Usuario: ${solicitud.userId?.idUsuario || 'Sin ID'}</strong>
                        <span class="badge badge-${obtenerClaseBadge(estado)}">${estado}</span>
                    </div>
                    <div class="mb-1">
                        <i class="fas fa-laptop"></i> ${solicitud.userId?.tipoEquipo || 'No especificado'}
                    </div>
                    <div class="mb-1">
                        <i class="fas fa-calendar"></i> 
                        ${solicitud.userId?.fechaSalida ? new Date(solicitud.userId.fechaSalida).toLocaleDateString() : 'No fecha'}
                    </div>
                    <div class="mt-2 text-right">
                        <button class="btn btn-sm btn-info ver-detalles" data-solicitud='${JSON.stringify(solicitud)}'>
                            <i class="fas fa-eye"></i> Ver detalles
                        </button>
                    </div>
                </div>
            `;
        }
    });
}

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
        initializeKanban();
        console.log('Inicialización completada');
    } catch (error) {
        console.error('Error en inicialización:', error);
    }
}

function configurarEventListeners() {
    console.log('Configurando event listeners...');

    document.addEventListener("click", function (e) {
        if (e.target.closest(".ver-detalles")) {
            const button = e.target.closest(".ver-detalles");
            const solicitudData = JSON.parse(button.dataset.solicitud);
            verDetalles(solicitudData);
        }
    });
    
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
async function verDetalles(solicitudJSON) {
    try {
        const solicitud = typeof solicitudJSON === 'string' ? JSON.parse(solicitudJSON) : solicitudJSON;
        
        // Improved ID extraction logic
        const userId = solicitud.idUsuario || solicitud.userId?.idUsuario;
        if (!userId) {
            throw new Error('ID de usuario no encontrado en la solicitud');
        }

        let userDetails;
        try {
            userDetails = await obtenerDetallesUsuario(userId);
        } catch (error) {
            console.error('Error al obtener detalles del usuario:', error);
            userDetails = {
                id: userId,
                name: 'No disponible',
                email: 'No disponible'
            };
        }
        
        Swal.fire({
            icon: 'info',
            title: 'Detalles de la Solicitud',
            html: `
                <div class="text-left">
                    <p><strong>ID de Usuario:</strong> ${userDetails.id || 'No especificado'}</p>
                    <p><strong>Nombre:</strong> ${userDetails.name || 'No especificado'}</p>
                    <p><strong>Correo:</strong> ${userDetails.email || 'No especificado'}</p>
                    <hr>
                    <p><strong>Equipo:</strong> ${solicitud.tipoEquipo || solicitud.userId?.tipoEquipo || 'No especificado'}</p>
                    <p><strong>Sede:</strong> ${solicitud.sede || solicitud.userId?.sede || 'No especificado'}</p>
                    <p><strong>Fecha de Salida:</strong> ${(solicitud.fechaSalida || solicitud.userId?.fechaSalida) ? new Date(solicitud.fechaSalida || solicitud.userId?.fechaSalida).toLocaleDateString() : 'No especificado'}</p>
                    <p><strong>Fecha de Devolución:</strong> ${(solicitud.fechaRegreso || solicitud.userId?.fechaRegreso) ? new Date(solicitud.fechaRegreso || solicitud.userId?.fechaRegreso).toLocaleDateString() : 'No especificado'}</p>
                    <p><strong>Estado:</strong> ${solicitud.estado || solicitud.userId?.estado || 'No especificado'}</p>
                </div>
            `,
            confirmButtonText: 'Cerrar'
        });
    } catch (error) {
        console.error('Error al mostrar detalles:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'No se pudieron cargar los detalles de la solicitud'
        });
    }
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

        const prestamosActivosElement = document.getElementById("activeLoans");
        
        if (prestamosActivosElement) {
            prestamosActivosElement.textContent = prestamos.length;
        } else {
            console.warn('Elemento "activeLoans" no encontrado en el DOM. Asegúrese de que existe en el HTML.');
        }

        Swal.close();
    } catch (error) {
        console.error('Error en actualizarPrestamosActivos:', error);
        // Continue execution even if this fails
        console.warn('Continuando ejecución a pesar del error en préstamos activos');
    }
}

document.addEventListener('DOMContentLoaded', inicializar);

window.aprobarSolicitud = aprobarSolicitud;
window.rechazarSolicitud = rechazarSolicitud;