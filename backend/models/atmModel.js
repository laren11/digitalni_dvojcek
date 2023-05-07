var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var atmSchema = new Schema({
  name: String,
  address: String,
  buy: Boolean,
  sell: Boolean,
  geolocation: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
});

atmSchema.index({ geolocation: "2dsphere" });

module.exports = mongoose.model("atm", atmSchema);
