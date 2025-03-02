import { autenticarUser } from "../services/auth.js"

/* Elementos del formulario */
const correo = document.getElementById("email");
const contrasena = document.getElementById("password");
const btnVerContrasena = document.getElementById("togglePassword");
const formInicioSesion = document.getElementById("loginForm")

/* Mostrar/Ocultar contraseña */
btnVerContrasena.addEventListener("click", () => {
    const tipo = contrasena.getAttribute("type") === "password" ? "text" : "password";
    contrasena.setAttribute("type", tipo)
})

/* Manejo del inicio de sesión */
formInicioSesion.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const resultado = await autenticarUser(correo.value.trim(), contrasena.value.trim());

    if (resultado === "") {
        await Swal.fire({
            title: "Error",
            text: "Todos los campos son obligatorios",
            icon: "error"
        });
    }
});
