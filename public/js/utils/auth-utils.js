// Utilidades de autenticación
export const utilAuth = {
    // Obtener usuario actual de la sesión
    obtenerUsuarioActual() {
        const usuario = sessionStorage.getItem("currentUser");
        return usuario ? JSON.parse(usuario) : null;
    },

    // Verificar si hay un usuario autenticado
    estaAutenticado() {
        return !!this.obtenerUsuarioActual()
    },

    // Cerrar sesión del usuario
    cerrarSesion() {
        sessionStorage.removeItem("currentUser");
        window.location.href = "/pages/login.html"
    }
}