# Sistema de Gestión de Préstamos de Computadoras

## Descripción del Proyecto
Sistema web desarrollado para gestionar el préstamo de equipos de cómputo, permitiendo a los administradores controlar el inventario y a los estudiantes solicitar préstamos de manera eficiente.

## Características
- Panel de administración para gestión de solicitudes
- Sistema de autenticación de usuarios (estudiantes y administradores)
- Gestión de inventario de equipos
- Sistema de solicitudes de préstamo
- Seguimiento de estado de préstamos en tiempo real
- Interfaz responsiva y amigable

## Stack Tecnológico
### Frontend:
- HTML5, CSS3, JavaScript
- Bootstrap 4.5.2
- SweetAlert2 para notificaciones
- Font Awesome para iconos

### Backend:
- Node.js
- JSON Server para API REST
- Arquitectura modular

### Base de Datos:
- JSON (db.json) para almacenamiento de datos
  - Usuarios (USERS)
  - Equipos (COMPUTERS)
  - Solicitudes (REQUEST)
  - Sedes (SEDES)

### Herramientas Adicionales:
- Git para control de versiones
- npm para gestión de paquetes
- Visual Studio Code como IDE

## Estructura del Proyecto
```
Sistema-de-Computadoras/
├── public/
│   ├── js/
│   │   ├── pages/         # Lógica específica de páginas
│   │   ├── services/      # Servicios y llamadas API
│   │   └── utils/         # Utilidades y funciones comunes
│   ├── css/              # Estilos
│   └── pages/            # Páginas HTML
├── db.json              # Base de datos
└── README.md
```

## Instalación
1. Clonar el repositorio:
```bash
git clone [https://github.com/scriptvg/Sistema-de-Computadoras.git]
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor JSON:
```bash
json-server --watch db.json --port 3001
```

4. Abrir el archivo index.html en un navegador web

## Funcionalidades Principales

### Panel de Administrador
- Visualización de todas las solicitudes
- Gestión de estados de préstamos
- Estadísticas de préstamos
- Control de inventario
- Admin User: admin
- Admin Pass: admin

### Panel de Estudiante
- Solicitud de préstamos
- Seguimiento de solicitudes
- Historial de préstamos
- Estudiante User: student
- Estudiante Pass: student

## Estado de Préstamos
- Pendiente: Solicitud en espera de aprobación
- Aprobado: Préstamo autorizado
- Rechazado: Solicitud denegada
- Devuelto: Equipo retornado

## Seguridad
- Autenticación de usuarios
- Roles diferenciados (admin/student)
- Validación de sesiones
- Protección de rutas