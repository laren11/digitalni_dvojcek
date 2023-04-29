var express = require('express');
var router = express.Router();
var priceController = require('../controllers/priceController.js');

/*
 * GET
 */
router.get('/', priceController.list);

/*
 * GET
 */
router.get('/:id', priceController.show);

/*
 * POST
 */
router.post('/', priceController.create);

/*
 * PUT
 */
router.put('/:id', priceController.update);

/*
 * DELETE
 */
router.delete('/:id', priceController.remove);

module.exports = router;
