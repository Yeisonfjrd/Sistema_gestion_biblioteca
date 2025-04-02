const Libro = require('../models/libro');
const logger = require('../utils/logger');
const { validateId } = require('../utils/express-validators');
const createError = require('http-errors');

const libroController = {
    getAll: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const perPage = parseInt(req.query.per_page, 10) || 10;
            const filters = {
                titulo: req.query.titulo,
                autor_id: req.query.autor_id ? parseInt(req.query.autor_id, 10) : null,
                categoria_id: req.query.categoria_id ? parseInt(req.query.categoria_id, 10) : null,
                fecha_publicacion: req.query.fecha_publicacion
            };
            const sortBy = req.query.sort_by;
            const sortOrder = req.query.sort_order || 'asc';

            const { items, pagination } = await Libro.getAll(page, perPage, filters, sortBy, sortOrder);
            res.json({ libros: items, pagination });
        } catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const libro = await Libro.getById(req.params.id);
            res.json(libro);
        } catch (error) {
            if (error.message === 'No rows returned') {
                next(createError(404, 'Libro no encontrado'));
            } else {
                next(error);
            }
        }
    },
    create: async (req, res, next) => {
        try {
            const nuevoLibro = await Libro.create(req.body);
            logger.info(`Libro creado con ID: ${nuevoLibro.id}`);
            res.status(201).json(nuevoLibro);
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
             const { titulo, descripcion, fecha_publicacion, autor_id, categoria_id } = req.body;
            // Validar que al menos un campo se está actualizando
            if (!titulo && !descripcion && !fecha_publicacion && !autor_id && !categoria_id) {
                return next(createError(400, 'Se debe proporcionar al menos un campo para actualizar'));
            }
            const libroActualizado = await Libro.update(req.params.id, req.body);
            logger.info(`Libro actualizado con ID: ${libroActualizado.id}`);
            res.json(libroActualizado);
        } catch (error) {
             if (error.message === 'No rows returned') {
                next(createError(404, 'Libro no encontrado'));
            } else {
                next(error);
            }
        }
    },
    delete: async (req, res, next) => {
        try {
            const libroEliminado = await Libro.delete(req.params.id);
             if (!libroEliminado) {
                return next(createError(404, 'Libro no encontrado'));
            }
            logger.info(`Libro eliminado con ID: ${libroEliminado.id}`);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};

module.exports = libroController;