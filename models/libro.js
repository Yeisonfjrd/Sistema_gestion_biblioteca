const { sql } = require('slonik');
const pool = require('../database/database');

const Libro = {
    async getAll(page, perPage, filters, sortBy, sortOrder) {
        let query = sql`SELECT * FROM libros`;
        query = filterQuery(query, filters);
        query = sortQuery(query, sortBy, sortOrder);
        return await paginateQuery(query, page, perPage);
    },
    async getById(id) {
        const query = sql`SELECT * FROM libros WHERE id = ${id}`;
        return await pool.one(query);
    },
    async create(libro) {
        const { titulo, descripcion, fecha_publicacion, autor_id, categoria_id } = libro;
        const query = sql`
            INSERT INTO libros (titulo, descripcion, fecha_publicacion, autor_id, categoria_id)
            VALUES (${titulo}, ${descripcion}, ${fecha_publicacion}, ${autor_id}, ${categoria_id})
            RETURNING *
        `;
        return await pool.one(query);
    },
    async update(id, libro) {
        const { titulo, descripcion, fecha_publicacion, autor_id, categoria_id } = libro;

        let query = sql`UPDATE libros SET `;
        const updates = [];
        if (titulo) updates.push(sql`titulo = ${titulo}`);
        if (descripcion) updates.push(sql`descripcion = ${descripcion}`);
        if (fecha_publicacion) updates.push(sql`fecha_publicacion = ${fecha_publicacion}`);
        if (autor_id) updates.push(sql`autor_id = ${autor_id}`);
        if (categoria_id) updates.push(sql`categoria_id = ${categoria_id}`);
        query = sql.join(updates, sql`, `);
        query = sql`
          ${query}
          WHERE id = ${id}
          RETURNING *
        `;
        return await pool.one(query);
    },

    async delete(id) {
        const query = sql`DELETE FROM libros WHERE id = ${id} RETURNING *`;
        return await pool.maybeOne(query);
    }
};

module.exports = Libro;
