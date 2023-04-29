var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var priceSchema = new Schema({
  cryptocurrency: {
    type: Schema.Types.ObjectId,
    ref: "Cryptocurrency",
  },
  exchange: {
    type: Schema.Types.ObjectId,
    ref: "Exchange",
  },
  price: Number,
  date: Date,
});

module.exports = Price = mongoose.model("price", priceSchema);
