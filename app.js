const express = require('express');
const bodyParser = require('body-parser');
const libroRoutes = require('./routes/libroRoutes');
const autorRoutes = require('./routes/autorRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const logger = require('./utils/logger');
const createError = require('http-errors');

const app = express();
app.use(bodyParser.json());

// Rutas
app.use('/libros', libroRoutes);
app.use('/autores', autorRoutes);
app.use('/categorias', categoriaRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    next(createError(404, 'Ruta no encontrada'));
});

// Manejo de errores global
app.use((err, req, res, next) => {
    logger.error(`Error no manejado: ${err.message}`, err); // Registra el error
    if (err.status) {
        res.status(err.status).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    logger.info(`Servidor escuchando en el puerto ${port}`);
});
