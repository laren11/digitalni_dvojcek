var CryptocurrencyModel = require("../models/cryptocurrencyModel.js");

/**
 * cryptocurrencyController.js
 *
 * @description :: Server-side logic for managing cryptocurrencies.
 */
module.exports = {
  list: function (req, res) {
    CryptocurrencyModel.find(function (err, cryptocurrencies) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting cryptocurrency.",
          error: err,
        });
      }

      return res.json(cryptocurrencies);
    });
  },

  show: function (req, res) {
    var id = req.params.id;

    CryptocurrencyModel.findOne({ _id: id }, function (err, cryptocurrency) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting cryptocurrency.",
          error: err,
        });
      }

      if (!cryptocurrency) {
        return res.status(404).json({
          message: "No such cryptocurrency",
        });
      }

      return res.json(cryptocurrency);
    });
  },

  create: function (req, res) {
    var cryptocurrency = new CryptocurrencyModel({
      name: req.body.name,
    });

    cryptocurrency.save(function (err, cryptocurrency) {
      if (err) {
        return res.status(500).json({
          message: "Error when creating cryptocurrency",
          error: err,
        });
      }

      return res.status(201).json(cryptocurrency);
    });
  },

  update: function (req, res) {
    var id = req.params.id;

    CryptocurrencyModel.findOne({ _id: id }, function (err, cryptocurrency) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting cryptocurrency",
          error: err,
        });
      }

      if (!cryptocurrency) {
        return res.status(404).json({
          message: "No such cryptocurrency",
        });
      }

      cryptocurrency.name = req.body.name ? req.body.name : cryptocurrency.name;

      cryptocurrency.save(function (err, cryptocurrency) {
        if (err) {
          return res.status(500).json({
            message: "Error when updating cryptocurrency.",
            error: err,
          });
        }

        return res.json(cryptocurrency);
      });
    });
  },

  remove: function (req, res) {
    var id = req.params.id;

    CryptocurrencyModel.findByIdAndRemove(id, function (err, cryptocurrency) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the cryptocurrency.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },
};
