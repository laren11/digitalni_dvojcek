var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var cryptocurrencySchema = new Schema({
  name: String,
});

module.exports = Cryptocurrency = mongoose.model(
  "cryptocurrency",
  cryptocurrencySchema
);
