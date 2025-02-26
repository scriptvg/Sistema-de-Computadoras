import { autenticarUser } from "../services/auth.js"
const email = document.getElementById("email");
const password = document.getElementById("password");



document.getElementById("loginForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const result = await autenticarUser(email.value.trim(), password.value.trim());

        if (result === "") {
            await Swal.fire({
                title: "Error",
                text: "Todos los campos son obligatorios",
                icon: "error"
            });
        }

    });
