// Servicios para el panel de estudiantes

// Obtener todas las solicitudes
async function 
obtenerSolicitudes() {
    try {
        const respuesta = await fetch('http://localhost:3001/REQUEST', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error('Error al obtener solicitudes');
        }

        const solicitudes = await respuesta.json();
        return solicitudes;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

/* Obtener préstamos activos */
async function obtenerPrestamosActivos(userId) {
    try {
        
        const respuesta = await fetch(`http://localhost:3001/REQUEST?=${userId}&status=activo}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!respuesta.ok) {
            throw new Error('Error al obtener préstamos activos');
        }

        const prestamos = await respuesta.json();
        return prestamos;

    } catch (error) {
       console.error.apply("Error al obtener préstamos activos:", error);
         throw error; 
    }
}

// Crear nueva solicitud
async function crearSolicitud(idUsuario, tipoEquipo, fechaSalida) {
    try {
        const datosSolicitud = { 
            userId: idUsuario,
            equipmentType: tipoEquipo,
            departureDate: fechaSalida,
            status: 'activo',
            requestDate: new Date().toISOString()
        };

        const respuesta = await fetch("http://localhost:3001/REQUEST", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosSolicitud)
        });

        return await respuesta.json();
    } catch (error) {
        console.error('Error al crear solicitud:', error);
        throw error;
    }
}

// Actualizar solicitud existente
async function actualizarSolicitud(id, datos) {
    try {
        const respuesta = await fetch(`http://localhost:3001/REQUEST/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        return await respuesta.json();
    } catch (error) {
        console.error('Error al actualizar solicitud:', error);
        throw error;
    }
}

// Eliminar solicitud
async function eliminarSolicitud(id) {
    try {
        const respuesta = await fetch(`http://localhost:3001/REQUEST/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error(`Error al eliminar solicitud con id ${id}`);
        }

        return { mensaje: `Solicitud con id ${id} eliminada exitosamente` };
    } catch (error) {
        console.error('Error al eliminar solicitud:', error);
        throw error;
    }
}

// Exportar funciones
export { obtenerSolicitudes, crearSolicitud, actualizarSolicitud, eliminarSolicitud, obtenerPrestamosActivos };
