var AtmModel = require("../models/atmModel.js");

/**
 * atmController.js
 *
 * @description :: Server-side logic for managing atms.
 */
module.exports = {
  list: function (req, res) {
    AtmModel.find()
      .then((atms) => {
        return res.json(atms);
      })
      .catch((err) => {
        return res.status(500).json({
          message: "Error when getting atm.",
          error: err,
        });
      });
  },

  show: function (req, res) {
    var id = req.params.id;

    AtmModel.findOne({ _id: id }, function (err, atm) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting atm.",
          error: err,
        });
      }

      if (!atm) {
        return res.status(404).json({
          message: "No such atm",
        });
      }

      return res.json(atm);
    });
  },

  create: function (req, res) {
    var atm = new AtmModel({
      name: req.body.name,
      address: req.body.address,
      buy: req.body.buy,
      sell: req.body.sell,
      geolocation: {
        type: "Point",
        coordinates: [req.body.longtitude, req.body.latitude],
      },
    });

    atm.save(function (err, atm) {
      if (err) {
        return res.status(500).json({
          message: "Error when creating atm",
          error: err,
        });
      }

      return res.status(201).json(atm);
    });
  },

  update: function (req, res) {
    var id = req.params.id;

    AtmModel.findOne({ _id: id }, function (err, atm) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting atm",
          error: err,
        });
      }

      if (!atm) {
        return res.status(404).json({
          message: "No such atm",
        });
      }

      atm.name = req.body.name ? req.body.name : atm.name;
      atm.address = req.body.address ? req.body.address : atm.address;
      atm.buy = req.body.buy ? req.body.buy : atm.buy;
      atm.sell = req.body.sell ? req.body.sell : atm.sell;
      if (req.body.longitude && req.body.latitude) {
        atm.geolocation.coordinates = [req.body.longitude, req.body.latitude];
      }

      atm.save(function (err, atm) {
        if (err) {
          return res.status(500).json({
            message: "Error when updating atm.",
            error: err,
          });
        }

        return res.json(atm);
      });
    });
  },

  remove: function (req, res) {
    var id = req.params.id;

    AtmModel.findByIdAndRemove(id, function (err, atm) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the atm.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },
};
