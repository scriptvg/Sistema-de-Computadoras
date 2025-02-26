const express = require('express');
const path = require('path');
const cors = require('cors'); // Importar cors

const app = express();

app.use(cors()); // Habilitar CORS para todas las rutas

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});