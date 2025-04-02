const { sql } = require('slonik');
const pool = require('../database/database');

const Categoria = {
    async getAll(page, perPage, sortBy, sortOrder) {
        let query = sql`SELECT * FROM categorias`;
        query = sortQuery(query, sortBy, sortOrder);
        return await paginateQuery(query, page, perPage);
    },
    async getById(id) {
        const query = sql`
            SELECT categorias.*,
                   json_agg(libros.*) AS libros
            FROM categorias
            LEFT JOIN libros ON categorias.id = libros.categoria_id
            WHERE categorias.id = ${id}
            GROUP BY categorias.id
        `;
        return await pool.one(query);
    },
    async create(categoria) {
        const { nombre } = categoria;
        const query = sql`
            INSERT INTO categorias (nombre)
            VALUES (${nombre})
            RETURNING *
        `;
        return await pool.one(query);
    },
    async update(id, categoria) {
        const { nombre } = categoria;
        const query = sql`
            UPDATE categorias
            SET nombre = ${nombre}
            WHERE id = ${id}
            RETURNING *
        `;
        return await pool.one(query);
    },
    async delete(id) {
        const query = sql`DELETE FROM categorias WHERE id = ${id} RETURNING *`;
        return await pool.maybeOne(query);
    }
};

module.exports = Categoria;