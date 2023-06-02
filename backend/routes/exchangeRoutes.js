var express = require("express");
var router = express.Router();
var exchangeController = require("../controllers/exchangeController.js");

router.get("/", exchangeController.list);
router.get("/:id", exchangeController.show);

router.post("/", exchangeController.create);

router.put("/:id", exchangeController.update);

router.delete("/:id", exchangeController.remove);

module.exports = router;
