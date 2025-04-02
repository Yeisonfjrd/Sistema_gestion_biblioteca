const Categoria = require('../models/categoria');
const logger = require('../utils/logger');
const { validateId } = require('../utils/express-validators');
const createError = require('http-errors');

const categoriaController = {
    getAll: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const perPage = parseInt(req.query.per_page, 10) || 10;
            const sortBy = req.query.sort_by;
            const sortOrder = req.query.sort_order || 'asc';
            const { items, pagination } = await Categoria.getAll(page, perPage, sortBy, sortOrder);
            res.json({ categorias: items, pagination });
        } catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const categoria = await Categoria.getById(req.params.id);
            res.json(categoria);
        } catch (error) {
            if (error.message === 'No rows returned') {
                next(createError(404, 'Categoría no encontrada'));
            } else {
                next(error);
            }
        }
    },
    create: async (req, res, next) => {
        try {
            const nuevaCategoria = await Categoria.create(req.body);
            logger.info(`Categoría creada con ID: ${nuevaCategoria.id}`);
            res.status(201).json(nuevaCategoria);
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const categoriaActualizada = await Categoria.update(req.params.id, req.body);
            logger.info(`Categoría actualizada con ID: ${categoriaActualizada.id}`);
            res.json(categoriaActualizada);
        } catch (error) {
            if (error.message === 'No rows returned') {
                next(createError(404, 'Categoría no encontrada'));
            } else {
                next(error);
            }
        }
    },
    delete: async (req, res, next) => {
        try {
            const categoriaEliminada = await Categoria.delete(req.params.id);
            if (!categoriaEliminada) {
                return next(createError(404, 'Categoría no encontrada'));
            }
            logger.info(`Categoría eliminada con ID: ${categoriaEliminada.id}`);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};

module.exports = categoriaController;