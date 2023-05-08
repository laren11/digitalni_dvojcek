const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  displayName: { type: String },
  cryptocurrencies: [{ type: Schema.Types.ObjectId, ref: "Cryptocurrency" }],
});

module.exports = User = mongoose.model("user", userSchema);
