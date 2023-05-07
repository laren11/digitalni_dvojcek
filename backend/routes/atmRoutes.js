var express = require('express');
var router = express.Router();
var atmController = require('../controllers/atmController.js');

/*
 * GET
 */
router.get('/', atmController.list);

/*
 * GET
 */
router.get('/:id', atmController.show);

/*
 * POST
 */
router.post('/', atmController.create);

/*
 * PUT
 */
router.put('/:id', atmController.update);

/*
 * DELETE
 */
router.delete('/:id', atmController.remove);

module.exports = router;
