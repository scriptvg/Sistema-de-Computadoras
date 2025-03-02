import { postUsers } from "../services/userCalls.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log('Formulario de registro inicializado');
    const formRegistro = document.getElementById('registerForm');

    if (!formRegistro) {
        console.error('No se encontró el formulario de registro');
        return;
    }

    /* Funcionalidad para mostrar/ocultar contraseña */
    const btnVerContrasena = document.getElementById('togglePassword');
    const btnVerConfirmarContrasena = document.getElementById('toggleConfirmPassword');
    const inptContrasena = document.getElementById('password');
    const inptConfirmarContrasena = document.getElementById('confirmPassword');

    btnVerContrasena.addEventListener('click', () => {
        const tipo = inptContrasena.getAttribute('type') === 'password' ? 'text' : 'password';
        inptContrasena.setAttribute('type', tipo);
        btnVerContrasena.querySelector('i').classList.toggle('fa-eye');
        btnVerContrasena.querySelector('i').classList.toggle('fa-eye-slash');
    });

    btnVerConfirmarContrasena.addEventListener('click', () => {
        const tipo = inptConfirmarContrasena.getAttribute('type') === 'password' ? 'text' : 'password';
        inptConfirmarContrasena.setAttribute('type', tipo);
        btnVerConfirmarContrasena.querySelector('i').classList.toggle('fa-eye');
        btnVerConfirmarContrasena.querySelector('i').classList.toggle('fa-eye-slash');
    });

    formRegistro.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        console.log('Inicio del proceso de registro');

        const nombre = document.getElementById('name').value;
        const correo = document.getElementById('email').value;
        const contrasena = document.getElementById('password').value;
        const confirmarContrasena = document.getElementById('confirmPassword').value;
        const rol = 'student'; // Rol predeterminado como estudiante

        console.log('Datos capturados:', { nombre, correo, longitudContrasena: contrasena.length, rol });

        /* Validaciones básicas */
        if (!nombre || !correo || !contrasena || !confirmarContrasena) {
            console.warn('Validación fallida: campos vacíos');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, complete todos los campos'
            });
            return;
        }

        /* Validar formato de correo */
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo)) {
            console.warn('Validación fallida: formato de correo inválido:', correo);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, ingrese un correo válido'
            });
            return;
        }

        if (contrasena !== confirmarContrasena) {
            console.warn('Validación fallida: las contraseñas no coinciden');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden'
            });
            return;
        }

        try {
            console.log('Iniciando petición al servidor...');
            const respuesta = await postUsers(nombre, correo, contrasena, rol);
            console.log('Respuesta del servidor:', respuesta);
            
            if (respuesta) {
                console.log('Registro exitoso, redirigiendo a login...');
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Usuario registrado correctamente'
                }).then(() => {
                    window.location.href = 'login.html';
                });
            }
        } catch (error) {
            console.error('Error en el proceso de registro:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al registrar usuario. Por favor, intente nuevamente'
            });
        }
    });
});