var express = require('express');
var router = express.Router();
var cryptocurrencyController = require('../controllers/cryptocurrencyController.js');

/*
 * GET
 */
router.get('/', cryptocurrencyController.list);

/*
 * GET
 */
router.get('/:id', cryptocurrencyController.show);

/*
 * POST
 */
router.post('/', cryptocurrencyController.create);

/*
 * PUT
 */
router.put('/:id', cryptocurrencyController.update);

/*
 * DELETE
 */
router.delete('/:id', cryptocurrencyController.remove);

module.exports = router;
