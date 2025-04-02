const express = require('express');
const router = express.Router();
const autorController = require('../controllers/autorController');
const { validateId } = require('../utils/express-validators');
const { check } = require('express-validator');

router.get('/', autorController.getAll);
router.get('/:id', validateId('id'), autorController.getById);
router.post('/', [
    check('nombre').notEmpty().withMessage('El nombre es requerido'),
    // Otras validaciones...
], autorController.create);
router.put('/:id', validateId('id'), autorController.update);
router.delete('/:id', validateId('id'), autorController.delete);

module.exports = router;