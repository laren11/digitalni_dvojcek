var express = require('express');
var router = express.Router();
var exchangeController = require('../controllers/exchangeController.js');

/*
 * GET
 */
router.get('/', exchangeController.list);

/*
 * GET
 */
router.get('/:id', exchangeController.show);

/*
 * POST
 */
router.post('/', exchangeController.create);

/*
 * PUT
 */
router.put('/:id', exchangeController.update);

/*
 * DELETE
 */
router.delete('/:id', exchangeController.remove);

module.exports = router;
