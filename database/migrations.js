const { sql } = require('slonik');
const pool = require('./database');
const logger = require('../utils/logger');

// Función para crear tabla si no existe
const createTableIfNotExists = async (pool, tableName, schema) => {
    try {
        await pool.query(sql.unsafe`
          CREATE TABLE IF NOT EXISTS ${sql.identifier([tableName])} (
            ${sql.join(
                Object.entries(schema).map(([columnName, columnSchema]) => {
                    let columnDefinition = sql.identifier([columnName]);
                    columnDefinition += ` ${columnSchema.type}`;
                    if (columnSchema.notNull) columnDefinition += ' NOT NULL';
                    if (columnSchema.primaryKey) columnDefinition += ' PRIMARY KEY';
                    if (columnSchema.unique) columnDefinition += ' UNIQUE';
                    if (columnSchema.references) columnDefinition += ` REFERENCES ${sql.identifier([columnSchema.references])}`;
                    return sql.raw(columnDefinition);
                }),
                sql.raw(', ')
            )}
          )
        `);
        logger.info(`Tabla ${tableName} creada o ya existente.`);
    } catch (error) {
        logger.error(`Error al crear la tabla ${tableName}:`, error);
        throw error; // Re-lanza el error para que lo capture el manejador de errores global
    }
};

// Definiciones de Esquemas de la Base de Datos
const libroSchema = {
    id: { type: 'integer', primaryKey: true },
    titulo: { type: 'text', notNull: true },
    descripcion: { type: 'text' },
    fecha_publicacion: { type: 'date' },
    autor_id: { type: 'integer', references: 'autores.id' },
    categoria_id: { type: 'integer', references: 'categorias.id' },
};

const autorSchema = {
    id: { type: 'integer', primaryKey: true },
    nombre: { type: 'text', notNull: true },
    fecha_nacimiento: { type: 'date' },
};

const categoriaSchema = {
    id: { type: 'integer', primaryKey: true },
    nombre: { type: 'text', notNull: true, unique: true },
};

// Ejecutar migraciones
(async () => {
    try {
        await createTableIfNotExists(pool, 'libros', libroSchema);
        await createTableIfNotExists(pool, 'autores', autorSchema);
        await createTableIfNotExists(pool, 'categorias', categoriaSchema);
    } catch (error) {
        // El error ya fue registrado, pero la aplicación puede continuar funcionando (depende de tu lógica)
        logger.error("Error al crear tablas:", error);
    }
})();