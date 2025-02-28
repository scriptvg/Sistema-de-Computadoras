// Servicios para el panel de estudiantes

// Obtener todas las computadoras
async function obtenerComputadoras() {
    try {
        const respuesta = await fetch('http://localhost:3001/COMPUTERS', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error('Error al obtener computadoras');
        }

        const computadoras = await respuesta.json();
        return computadoras;
    } catch (error) {
        console.error('Error al obtener computadoras:', error);
        throw error;
    }
}

// Crear nueva computadora
async function crearComputadora(idUsuario, tipoEquipo, fechaSalida) {
    try {
        const datosComputadora = { 
            userId: idUsuario,
            equipmentType: tipoEquipo,
            departureDate: fechaSalida,
            status: 'activo',
            requestDate: new Date().toISOString()
        };

        const respuesta = await fetch("http://localhost:3001/COMPUTERS", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosComputadora)
        });

        return await respuesta.json();
    } catch (error) {
        console.error('Error al crear computadora:', error);
        throw error;
    }
}

// Actualizar computadora existente
async function actualizarComputadora(nombre, apellido, edad, id) {
    try {
        const datosComputadora = { 
            nombre, 
            apellido,
            edad
        };

        const respuesta = await fetch(`http://localhost:3001/COMPUTERS/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosComputadora)
        });

        return await respuesta.json();
    } catch (error) {
        console.error('Error al actualizar computadora:', error);
        throw error;
    }
}

// Eliminar computadora
async function eliminarComputadora(id) {
    try {
        const respuesta = await fetch(`http://localhost:3001/COMPUTERS/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error(`Error al eliminar computadora con id ${id}`);
        }

        return { mensaje: `Computadora con id ${id} eliminada exitosamente` };
    } catch (error) {
        console.error('Error al eliminar computadora:', error);
        throw error;
    }
}

// Exportar funciones con nombres compatibles para mantener la funcionalidad existente
export {
    obtenerComputadoras as getComputers,
    crearComputadora as postComputer,
    actualizarComputadora as updateComputer,
    eliminarComputadora as deleteComputer
};
