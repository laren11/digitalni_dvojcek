var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var atmSchema = new Schema({
  name: String,
  address: String,
  buy: Boolean,
  sell: Boolean,
  //define geolocation as subdocument that contains type and coordinates
  //type is a string that accepts value 'Point', because we use MonogDB 2dsphere to enable geospatial queries
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

//we are telling mongoose to create a 2dspehere index on geolocation field
atmSchema.index({ geolocation: "2dsphere" });

module.exports = mongoose.model("atm", atmSchema);
