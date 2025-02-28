// Funciones de utilidad comunes e inicialización

// Inicializar tooltips y popovers de Bootstrap
function initializeBootstrapComponents() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
}

// Formatear fecha a cadena local
// Format date to locale string
function formatDate(date) {
    if (!date) return 'No especificado';
    try {
        return new Date(date).toLocaleDateString('es-CR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Fecha inválida';
    }
}

// Initialize common components
document.addEventListener('DOMContentLoaded', () => {
    initializeBootstrapComponents();
    
    // Set min date and required attributes for date inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    
    // Handle date inputs configuration
    dateInputs.forEach(input => {
        // Set minimum date to today
        input.min = today;
        
        // Generate unique ID if not present
        if (!input.id) {
            const uniqueId = `date-input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            input.id = uniqueId;
        }
        
        // Set name attribute if missing
        if (!input.name) {
            input.name = input.id;
        }
        
        // Make field required
        input.required = true;
    });

    // Handle alert animations
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        if (alert) {
            setTimeout(() => {
                alert.classList.add('fade');
            }, 3000);
        }
    });
});

// Formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC'
    }).format(amount);
}

// Manejar errores de API con mensajes personalizados
function handleApiError(error, customMessage = '') {
    console.error('API Error:', error);
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: customMessage || 'Ha ocurrido un error al procesar su solicitud.',
        confirmButtonText: 'Entendido'
    });
}

// Mostrar indicador de carga
function showLoading(message = 'Cargando...') {
    Swal.fire({
        title: message,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

// Ocultar indicador de carga
function hideLoading() {
    Swal.close();
}
// Exportar funciones de utilidad
export {
    formatDate as formatDate,
    formatCurrency as formatCurrency,
    handleApiError as handleApiError,
    showLoading as showLoading,
    hideLoading as hideLoading
};
function main() {
    console.log('Aplicación inicializada');
}
// Remove duplicate event listener
// document.addEventListener('DOMContentLoaded', main);
