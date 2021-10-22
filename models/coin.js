const mongoose = require("mongoose");

const coinSchema = mongoose.Schema({
  network: {
    type: String,
    required: true,
  },
  coinName: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  web: {
    type: String,
    required: false,
  },
  telegram: {
    type: String,
    required: false,
  },
  twitter: {
    type: String,
    required: false,
  },
  discord: {
    type: String,
    required: false,
  },
  dateCreated: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  votes: {
    type: Number,
    default: 0,
  },
});
coinSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

coinSchema.set("toJSON", {
  virtuals: true,
});
exports.Coin = mongoose.model("Coin", coinSchema);
