const { sql } = require('slonik');
const pool = require('../database/database');

const Autor = {
    async getAll(page, perPage, sortBy, sortOrder) {
        let query = sql`SELECT * FROM autores`;
        query = sortQuery(query, sortBy, sortOrder);
        return await paginateQuery(query, page, perPage);
    },
    async getById(id) {
        const query = sql`
            SELECT autores.*,
                   json_agg(libros.*) AS libros
            FROM autores
            LEFT JOIN libros ON autores.id = libros.autor_id
            WHERE autores.id = ${id}
            GROUP BY autores.id
        `;
        return await pool.one(query);
    },
    async create(autor) {
        const { nombre, fecha_nacimiento } = autor;
        const query = sql`
            INSERT INTO autores (nombre, fecha_nacimiento)
            VALUES (${nombre}, ${fecha_nacimiento})
            RETURNING *
        `;
        return await pool.one(query);
    },
    async update(id, autor) {
        const { nombre, fecha_nacimiento } = autor;
        let query = sql`UPDATE autores SET `;
        const updates = [];
        if (nombre) updates.push(sql`nombre = ${nombre}`);
        if (fecha_nacimiento) updates.push(sql`fecha_nacimiento = ${fecha_nacimiento}`);

        query = sql.join(updates, sql`, `);
        query = sql`
            ${query}
            WHERE id = ${id}
            RETURNING *
        `;
        return await pool.one(query);
    },
    async delete(id) {
        const query = sql`DELETE FROM autores WHERE id = ${id} RETURNING *`;
        return await pool.maybeOne(query);
    }
};

module.exports = Autor;