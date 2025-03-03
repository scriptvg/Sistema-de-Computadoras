// logoutModule.js
export function setupLogoutButton() {
    const logoutBtn = document.getElementById("logoutBtn");
    console.log('Logout button encontrado:', !!logoutBtn);

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            console.log('Logout clicked');
            e.preventDefault();
            utilAuth.cerrarSesion();
        });
    }
}