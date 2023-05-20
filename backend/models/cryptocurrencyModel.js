const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cryptocurrencySchema = new Schema({
  name: String,
});

module.exports = mongoose.model("Cryptocurrency", cryptocurrencySchema);
