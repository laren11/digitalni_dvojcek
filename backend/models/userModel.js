const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const cryptoPairSchema = new mongoose.Schema({
  cryptoId: { type: Schema.Types.ObjectId, ref: "Cryptocurrency" },
  exchangeId: { type: Schema.Types.ObjectId, ref: "Exchange" },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  displayName: { type: String },
  saved: [cryptoPairSchema],
});

module.exports = User = mongoose.model("user", userSchema);
