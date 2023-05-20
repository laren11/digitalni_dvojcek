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
  show: function (req, res) {
    var id = req.params.id;

    PriceModel.findOne({ _id: id }, function (err, price) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting price.",
          error: err,
        });
      }

      if (!price) {
        return res.status(404).json({
          message: "No such price",
        });
      }

      return res.json(price);
    });
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
};
