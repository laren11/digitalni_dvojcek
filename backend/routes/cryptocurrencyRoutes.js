var express = require("express");
var router = express.Router();
var cryptocurrencyController = require("../controllers/cryptocurrencyController.js");

router.get("/", cryptocurrencyController.list);
router.get("/:id", cryptocurrencyController.show);

router.post("/", cryptocurrencyController.create);

router.put("/:id", cryptocurrencyController.update);

router.delete("/:id", cryptocurrencyController.remove);

module.exports = router;
