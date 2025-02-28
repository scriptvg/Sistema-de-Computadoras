// Configuración de alertas
export const ConfigAlerta = {
    tiempoDefecto: 1500,
    botones: {
        confirmar: 'Sí',
        cancelar: 'No'
    }
};

// Alerta de éxito
export const AlertaExito = (titulo = '¡Bienvenido!', texto = 'Inicio de sesión exitoso') => {
    return Swal.fire({
        title: titulo,
        text: texto,
        icon: 'success',
        showConfirmButton: false,
        timer: ConfigAlerta.tiempoDefecto
    });
};

// Alerta de error
export const AlertaError = (titulo = 'Error', texto = 'Ha ocurrido un error') => {
    return Swal.fire({
        icon: 'error',
        title: titulo,
        text: texto
    });
};

// Alerta de advertencia
export const AlertaAdvertencia = (titulo = 'Advertencia', texto) => {
    return Swal.fire({
        icon: 'warning',
        title: titulo,
        text: texto
    });
};

// Alerta de confirmación
export const AlertaConfirmacion = (titulo = '¿Está seguro?', texto) => {
    return Swal.fire({
        icon: 'question',
        title: titulo,
        text: texto,
        showCancelButton: true,
        confirmButtonText: ConfigAlerta.botones.confirmar,
        cancelButtonText: ConfigAlerta.botones.cancelar
    });
};

