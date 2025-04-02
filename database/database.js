const { Pool } = require('pg');
const logger = require('../utils/logger'); // Importa el logger

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
    user: 'tu_usuario',       // Cambiar
    host: 'localhost',
    database: 'nombre_de_la_base_de_datos', // Cambiar
    password: 'tu_contraseña', // Cambiar
    port: 5432,
});

// Test de conexión a la base de datos
pool.connect()
    .then(() => logger.info('Conexión a la base de datos establecida'))
    .catch(err => logger.error('Error al conectar a la base de datos:', err));

module.exports = pool;