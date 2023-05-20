const ExchangeModel = require("../models/exchangeModel.js");

/**
 * exchangeController.js
 *
 * @description :: Server-side logic for managing exchanges.
 */
module.exports = {
  /**
   * exchangeController.list()
   */
  list: function (req, res) {
    ExchangeModel.find()
      .then((exchanges) => {
        return res.json(exchanges);
      })
      .catch((err) => {
        return res.status(500).json({
          message: "Error when getting exchange.",
          error: err,
        });
      });
  },

  /**
   * exchangeController.show()
   */
  show: function (req, res) {
    var id = req.params.id;

    ExchangeModel.findOne({ _id: id }, function (err, exchange) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting exchange.",
          error: err,
        });
      }

      if (!exchange) {
        return res.status(404).json({
          message: "No such exchange",
        });
      }

      return res.json(exchange);
    });
  },

  /**
   * exchangeController.create()
   */
  create: function (req, res) {
    var exchange = new ExchangeModel({
      name: req.body.name,
      url: req.body.url,
    });

    exchange.save(function (err, exchange) {
      if (err) {
        return res.status(500).json({
          message: "Error when creating exchange",
          error: err,
        });
      }

      return res.status(201).json(exchange);
    });
  },

  /**
   * exchangeController.update()
   */
  update: function (req, res) {
    var id = req.params.id;

    ExchangeModel.findOne({ _id: id }, function (err, exchange) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting exchange",
          error: err,
        });
      }

      if (!exchange) {
        return res.status(404).json({
          message: "No such exchange",
        });
      }

      exchange.name = req.body.name ? req.body.name : exchange.name;
      exchange.url = req.body.url ? req.body.url : exchange.url;

      exchange.save(function (err, exchange) {
        if (err) {
          return res.status(500).json({
            message: "Error when updating exchange.",
            error: err,
          });
        }

        return res.json(exchange);
      });
    });
  },

  /**
   * exchangeController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;

    ExchangeModel.findByIdAndRemove(id, function (err, exchange) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the exchange.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },
};
