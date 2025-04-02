const Autor = require('../models/autor');
const logger = require('../utils/logger');
const { validateId } = require('../utils/express-validators');
const createError = require('http-errors');

const autorController = {
    getAll: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const perPage = parseInt(req.query.per_page, 10) || 10;
            const sortBy = req.query.sort_by;
            const sortOrder = req.query.sort_order || 'asc';
            const { items, pagination } = await Autor.getAll(page, perPage, sortBy, sortOrder);
            res.json({ autores: items, pagination });
        } catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const autor = await Autor.getById(req.params.id);
            res.json(autor);
        } catch (error) {
            if (error.message === 'No rows returned') {
                next(createError(404, 'Autor no encontrado'));
            } else {
                next(error);
            }
        }
    },
    create: async (req, res, next) => 
        try {
            const nuevoAutor = await Autor.create(req.body);
            logger.info(`Autor creado con ID: ${nuevoAutor.id}`);
            res.status(201).json(nuevoAutor);
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const { nombre, fecha_nacimiento } = req.body;
            if (!nombre && !fecha_nacimiento) {
                return next(createError(400, 'Se debe proporcionar al menos un campo para actualizar'));
            }
            const autorActualizado = await Autor.update(req.params.id, req.body);
            logger.info(`Autor actualizado con ID: ${autorActualizado.id}`);
            res.json(autorActualizado);
        } catch (error) {
            if (error.message === 'No rows returned') {
                next(createError(404, 'Autor no encontrado'));
            } else {
                next(error);
            }
        }
    },
    delete: async (req, res, next) => {
        try {
            const autorEliminado = await Autor.delete(req.params.id);
            if (!autorEliminado) {
                return next(createError(404, 'Autor no encontrado'));
            }
            logger.info(`Autor eliminado con ID: ${autorEliminado.id}`);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};

module.exports = autorController;