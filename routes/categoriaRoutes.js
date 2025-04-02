const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { validateId } = require('../utils/express-validators');
const { check } = require('express-validator');

router.get('/', categoriaController.getAll);
router.get('/:id', validateId('id'), categoriaController.getById);
router.post('/', [
    check('nombre').notEmpty().withMessage('El nombre es requerido'),
    // Otras validaciones...
], categoriaController.create);
router.put('/:id', validateId('id'), categoriaController.update);
router.delete('/:id', validateId('id'), categoriaController.delete);

module.exports = router;