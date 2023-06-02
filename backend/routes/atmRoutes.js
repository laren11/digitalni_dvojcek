var express = require("express");
var router = express.Router();
var atmController = require("../controllers/atmController.js");

router.get("/", atmController.list);
router.get("/:id", atmController.show);

router.post("/", atmController.create);

router.put("/:id", atmController.update);

router.delete("/:id", atmController.remove);

module.exports = router;
