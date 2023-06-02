var express = require("express");
var router = express.Router();
var priceController = require("../controllers/priceController.js");

router.get("/", priceController.list);
router.get(
  "/getLatestPrices/:exchangeName",
  priceController.getLatestCoinPrices
);
router.get("/getTopFive", priceController.getTopFive);
router.get("/getUserPrices/:id", priceController.getUserPrices);
router.get("/:id", priceController.show);

router.post("/graphdata", priceController.graphData);
router.post("/", priceController.create);
router.post("/scrapeddata", priceController.scrapedData);

router.put("/:id", priceController.update);

router.delete("/:id", priceController.remove);

module.exports = router;
