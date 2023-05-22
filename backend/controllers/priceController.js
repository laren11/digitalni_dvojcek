const CryptocurrencyModel = require("../models/cryptocurrencyModel.js");
const ExchangeModel = require("../models/exchangeModel.js");
const PriceModel = require("../models/priceModel.js");

/**
 * priceController.js
 *
 * @description :: Server-side logic for managing prices.
 */
module.exports = {
  /**
   * priceController.list()
   */
  list: function (req, res) {
    console.log("HERE");
    PriceModel.find()
      .then((prices) => {
        return res.json(prices);
      })
      .catch((err) => {
        return res.status(500).json({
          message: "Error when getting price.",
          error: err,
        });
      });
  },

  /**
   * priceController.show()
   */
  show: async function (req, res) {
    const priceId = req.params.id;
    try {
      const price = await PriceModel.findById(priceId);
      res.json(price);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },

  /**
   * priceController.create()
   */
  create: function (req, res) {
    var price = new PriceModel({
      cryptocurrency: req.body.cryptocurrency,
      exchange: req.body.exchange,
      price: req.body.price,
      date: req.body.date,
    });

    price.save(function (err, price) {
      if (err) {
        return res.status(500).json({
          message: "Error when creating price",
          error: err,
        });
      }

      return res.status(201).json(price);
    });
  },

  /**
   * priceController.update()
   */
  update: function (req, res) {
    var id = req.params.id;

    PriceModel.findOne({ _id: id }, function (err, price) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting price",
          error: err,
        });
      }

      if (!price) {
        return res.status(404).json({
          message: "No such price",
        });
      }

      price.cryptocurrency = req.body.cryptocurrency
        ? req.body.cryptocurrency
        : price.cryptocurrency;
      price.exchange = req.body.exchange ? req.body.exchange : price.exchange;
      price.price = req.body.price ? req.body.price : price.price;
      price.date = req.body.date ? req.body.date : price.date;

      price.save(function (err, price) {
        if (err) {
          return res.status(500).json({
            message: "Error when updating price.",
            error: err,
          });
        }

        return res.json(price);
      });
    });
  },

  /**
   * priceController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;

    PriceModel.findByIdAndRemove(id, function (err, price) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the price.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },

  scrapedData: function (req, res) {
    const data = req.body; // JSON data sent from Kotlin application

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      //Find the cryptocurrency model
      CryptocurrencyModel.findOne({ name: item.name }).then(
        (existingCryptocurrency) => {
          //If it exists, find the exchange and create price, else create new cryptocurrency and save the price
          if (existingCryptocurrency) {
            ExchangeModel.findOne({ name: item.exchange }).then((exchange) => {
              var price = new PriceModel({
                cryptocurrency: existingCryptocurrency._id,
                exchange: exchange._id,
                price: parseFloat(item.price.slice(1).replace(",", "")),
                date: new Date(),
              });
              price
                .save()
                .then((savedPrice) => {
                  console.log("Price saved successfully: ", savedPrice);
                })
                .catch((error) => {
                  console.error("Error when creating price: ", error);
                  res.status(500).json({
                    message: "Error when creating price",
                    error: error,
                  });
                });
            });
          } else {
            var cryptocurrency = new CryptocurrencyModel({
              name: item.name,
            });
            cryptocurrency.save().then((savedCryptocurrency) => {
              ExchangeModel.findOne({ name: item.exchange }).then(
                (exchange) => {
                  var price = new PriceModel({
                    cryptocurrency: savedCryptocurrency._id,
                    exchange: exchange._id,
                    price: parseFloat(item.price.slice(1).replace(",", "")),
                    date: new Date(),
                  });
                  price
                    .save()
                    .then((savedPrice) => {
                      console.log("Price saved successfully: ", savedPrice);
                    })
                    .catch((error) => {
                      console.error("Error when creating price: ", error);
                      res.status(500).json({
                        message: "Error when creating price",
                        error: error,
                      });
                    });
                }
              );
            });
          }
        }
      );
    }

    res.status(200).json({ message: "Prices created successfully" });
  },

  graphData: async function (req, res) {
    try {
      const { value, exchange } = req.body;
      const cryptocurrency = await CryptocurrencyModel.findOne({ name: value });

      if (!cryptocurrency) {
        return res.status(404).json({ message: "Cryptocurrency not found." });
      }

      console.log("I AM HEREEE1");
      // Find the corresponding exchange
      const exchangeObj = await ExchangeModel.findOne({ name: exchange });

      if (!exchangeObj) {
        return res.status(404).json({ message: "Exchange not found." });
      }
      console.log(
        "I AM HEREEE2, cryproID: ",
        cryptocurrency._id,
        ", exchangeID: ",
        exchangeObj._id
      );

      // Find prices with the provided cryptocurrency and exchange
      const prices = await PriceModel.find({
        cryptocurrency: cryptocurrency._id,
        exchange: exchangeObj._id,
      })
        .populate("cryptocurrency")
        .populate("exchange");
      console.log("I AM HERE 3");
      res.status(200).json(prices);
    } catch (error) {
      // Handle any errors that occur during processing
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Failed to process the request." });
    }
  },

  getLatestCoinPrices: async function (req, res) {
    try {
      const { exchangeName } = req.params;

      // Find the exchange by its name
      const exchange = await ExchangeModel.findOne({ name: exchangeName });

      if (!exchange) {
        return res.status(404).json({ error: "Exchange not found" });
      }

      // Find the latest prices for each cryptocurrency on the given exchange
      const latestPrices = await PriceModel.aggregate([
        {
          $match: { exchange: exchange._id },
        },
        {
          $sort: { cryptocurrency: 1, date: -1 },
        },
        {
          $group: {
            _id: "$cryptocurrency",
            cryptocurrency: { $first: "$cryptocurrency" },
            prices: { $push: "$price" },
            dates: { $push: "$date" },
          },
        },
        {
          $lookup: {
            from: "cryptocurrencies",
            localField: "cryptocurrency",
            foreignField: "_id",
            as: "cryptocurrency",
          },
        },
        {
          $unwind: "$cryptocurrency",
        },
        {
          $project: {
            _id: 0,
            cryptocurrency: "$cryptocurrency.name",
            price: { $arrayElemAt: ["$prices", 0] },
            date: { $arrayElemAt: ["$dates", 0] },
            prevPrice: { $arrayElemAt: ["$prices", 1] },
          },
        },
        {
          $project: {
            cryptocurrency: 1,
            price: 1,
            date: 1,
            change: {
              $round: [{ $subtract: ["$price", "$prevPrice"] }, 2],
            },
            changePercentage: {
              $cond: {
                if: { $eq: ["$prevPrice", 0] },
                then: null,
                else: {
                  $round: [
                    {
                      $multiply: [
                        {
                          $divide: [
                            { $subtract: ["$price", "$prevPrice"] },
                            "$prevPrice",
                          ],
                        },
                        100,
                      ],
                    },
                    2,
                  ],
                },
              },
            },
            changeSign: {
              $cond: {
                if: { $gt: [{ $subtract: ["$price", "$prevPrice"] }, 0] },
                then: "positive",
                else: "negative",
              },
            },
          },
        },
      ]);

      if (latestPrices.length === 0) {
        return res
          .status(404)
          .json({ error: "No prices found for the given exchange" });
      }

      res.json(latestPrices);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },

  getTopFive: async function (req, res) {
    try {
      const latestPrices = await PriceModel.aggregate([
        {
          $sort: { date: -1 }, // Sort prices by date in descending order
        },
        {
          $group: {
            _id: "$cryptocurrency",
            cryptocurrency: { $first: "$cryptocurrency" },
            prices: { $push: "$price" },
            dates: { $push: "$date" },
            exchanges: { $push: "$exchange" },
          },
        },
        {
          $lookup: {
            from: "cryptocurrencies",
            localField: "cryptocurrency",
            foreignField: "_id",
            as: "cryptocurrency",
          },
        },
        {
          $unwind: "$cryptocurrency",
        },
        {
          $project: {
            cryptocurrency: "$cryptocurrency.name",
            price: { $arrayElemAt: ["$prices", 0] },
            date: { $arrayElemAt: ["$dates", 0] },
            prevPrice: { $arrayElemAt: ["$prices", 1] },
            exchange: { $arrayElemAt: ["$exchanges", 0] },
          },
        },
        {
          $project: {
            cryptocurrency: 1,
            price: 1,
            date: 1,
            exchange: 1,
            change: {
              $round: [{ $subtract: ["$price", "$prevPrice"] }, 2],
            },
            changePercentage: {
              $cond: {
                if: { $eq: ["$prevPrice", 0] },
                then: null,
                else: {
                  $round: [
                    {
                      $multiply: [
                        {
                          $divide: [
                            { $subtract: ["$price", "$prevPrice"] },
                            "$prevPrice",
                          ],
                        },
                        100,
                      ],
                    },
                    2,
                  ],
                },
              },
            },
          },
        },
        {
          $sort: { changePercentage: -1 }, // Sort prices by change percentage in descending order
        },
        {
          $limit: 5, // Retrieve only the top 5 prices
        },
        {
          $project: {
            _id: 0,
            cryptocurrency: 1,
            price: 1,
            date: 1,
            exchange: 1,
            change: 1,
            changePercentage: 1,
          },
        },
      ]);

      res.json(latestPrices);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
};
