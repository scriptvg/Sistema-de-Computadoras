// Importamos la función para obtener usuarios desde el módulo userCalls
import { getUsers } from "./userCalls.js"

// Obtenemos la lista de usuarios de forma asíncrona
const users = await getUsers();

// Función para validar las credenciales del usuario
export async function validateCredentials(email, password) {
    // Verificamos que se hayan proporcionado tanto el email como la contraseña
    if (!email || !password) {
        throw new Error("Todos los campos son obligatorios");
    }

    // Buscamos un usuario que coincida con el email y contraseña proporcionados
    const user = users.find(user => user.email === email && user.password === password)

    // Si no se encuentra un usuario, lanzamos un error
    if (!user) {
        throw new Error("Email o contraseña incorrectos");
    }

    // Retornamos el usuario si las credenciales son correctas
    return user;
}

export function validateForm(formData) {
    const errors = [];

    for (const [key, value] of Object.entries(formData)) {
        if (!value || value.trim() === "") {
            errors.push(`El campo ${key} es obligatorio`);
        }
    }

    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }

    return true
}