const { check, validationResult } = require('express-validator');
const createError = require('http-errors');

// Middleware para validar el ID en las rutas
const validateId = (paramName) => [
    check(paramName).isInt({ min: 1 }).withMessage(`${paramName} debe ser un entero positivo`),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(createError(400, errors.array()[0].msg));
        }
        next();
    }
];

// Función para paginar los resultados de la consulta
const paginateQuery = async (query, page, perPage) => {
    const offset = (page - 1) * perPage;
    const result = await query.offset(offset).limit(perPage).execute();
    const total = await query.clone().count().execute(); // Obtener el total de elementos
    const totalCount = total[0].count;

    return {
        items: result,
        pagination: {
            page,
            perPage,
            total: totalCount,
            pages: Math.ceil(totalCount / perPage),
        },
    };
};

// Función para filtrar la consulta
const filterQuery = (query, filters) => {
    for (const key in filters) {
        const value = filters[key];
         if (value !== undefined && value !== null) { // Permite valores null explícitos
          if (key === 'fecha_publicacion' || key === 'fecha_nacimiento') {
            query = query.where(key, '=', new Date(value)); // Suponiendo formato de fecha ISO
          } else {
            query = query.where(key, '=', value);
          }
        }
    }
    return query;
};

// Función para ordenar la consulta
const sortQuery = (query, sortBy, sortOrder = 'asc') => {
    if (sortBy) {
        const order = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';
        query = query.order(sortBy, order);
    }
    return query;
};

module.exports = {
    validateId,
    paginateQuery,
    filterQuery,
    sortQuery
};