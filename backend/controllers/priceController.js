var PriceModel = require('../models/priceModel.js');

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
        PriceModel.find(function (err, prices) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting price.',
                    error: err
                });
            }

            return res.json(prices);
        });
    },

    /**
     * priceController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PriceModel.findOne({_id: id}, function (err, price) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting price.',
                    error: err
                });
            }

            if (!price) {
                return res.status(404).json({
                    message: 'No such price'
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
			cryptocurrency : req.body.cryptocurrency,
			exchange : req.body.exchange,
			price : req.body.price,
			date : req.body.date
        });

        price.save(function (err, price) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating price',
                    error: err
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

        PriceModel.findOne({_id: id}, function (err, price) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting price',
                    error: err
                });
            }

            if (!price) {
                return res.status(404).json({
                    message: 'No such price'
                });
            }

            price.cryptocurrency = req.body.cryptocurrency ? req.body.cryptocurrency : price.cryptocurrency;
			price.exchange = req.body.exchange ? req.body.exchange : price.exchange;
			price.price = req.body.price ? req.body.price : price.price;
			price.date = req.body.date ? req.body.date : price.date;
			
            price.save(function (err, price) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating price.',
                        error: err
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
                    message: 'Error when deleting the price.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
