import { validateCredentials } from "./validators.js";


export async function autenticarUser(email, password) {
    try {
        
        const user = await validateCredentials(email, password);
       
        sessionStorage.setItem("currentUser", JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }))
        
        if (user) {

            await Swal.fire({
                title: "Usuario encontrado",
                /* icon: "success", */
                timerProgressBar: true,
                showConfirmButton: false,
                timer: 1000,
                didOpen: () => {
                    Swal.showLoading()
                }
            });
            
            const redirectPath = user.role === "admin" 
            ? "/pages/admin/admin_dashboard.html"
            : "/pages/dashboard.html";
            window.location.href = redirectPath;


        } else {
            Swal.fire({
                title: "Inicio de sesión incorrecto",
                text: "Email o contraseña incorrectos",
                icon: "error"
            })
        }
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: "Error al iniciar sesión",
            icon: "error"
        })
    }
}   