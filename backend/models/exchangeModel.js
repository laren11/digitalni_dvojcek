var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var exchangeSchema = new Schema({
  name: String,
  url: String,
});

module.exports = Exchange = mongoose.model("exchange", exchangeSchema);
