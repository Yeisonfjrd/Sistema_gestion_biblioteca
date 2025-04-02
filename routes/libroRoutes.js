const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');
const { validateId } = require('../utils/express-validators');
const { check } = require('express-validator');

router.get('/', libroController.getAll);
router.get('/:id', validateId('id'), libroController.getById);
router.post('/', [
    check('titulo').notEmpty().withMessage('El título es requerido'),
    // Otras validaciones...
], libroController.create);
router.put('/:id', validateId('id'), libroController.update);
router.delete('/:id', validateId('id'), libroController.delete);

module.exports = router;