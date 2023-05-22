var express = require("express");
var router = express.Router();
var priceController = require("../controllers/priceController.js");

/*
 * GET
 */
router.get("/", priceController.list);

router.get(
  "/getLatestPrices/:exchangeName",
  priceController.getLatestCoinPrices
);
router.post("/graphdata", priceController.graphData);
router.get("/getTopFive", priceController.getTopFive);

/*
 * GET
 */
router.get("/:id", priceController.show);

/*
 * POST
 */
router.post("/", priceController.create);

/*
 * PUT
 */
router.put("/:id", priceController.update);

/*
 * DELETE
 */
router.delete("/:id", priceController.remove);

router.post("/scrapeddata", priceController.scrapedData);

module.exports = router;
