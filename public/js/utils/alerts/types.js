export const AlertConfig = {
    defaultTimer: 1500,
    buttons: {
        confirm: 'Sí',
        cancel: 'No'
    }
};

export const SuccessAlert = (title = '¡Bienvenido!', text = 'Inicio de sesión exitoso') => {
    return Swal.fire({
        title,
        text,
        icon: 'success',
        showConfirmButton: false,
        timer: AlertConfig.defaultTimer
    });
};

export const ErrorAlert = (title = 'Error', text = 'Ha ocurrido un error') => {
    return Swal.fire({
        icon: 'error',
        title,
        text
    });
};

export const WarningAlert = (title = 'Advertencia', text) => {
    return Swal.fire({
        icon: 'warning',
        title,
        text
    });
};

export const ConfirmAlert = (title = '¿Está seguro?', text) => {
    return Swal.fire({
        icon: 'question',
        title,
        text,
        showCancelButton: true,
        confirmButtonText: AlertConfig.buttons.confirm,
        cancelButtonText: AlertConfig.buttons.cancel
    });
};

