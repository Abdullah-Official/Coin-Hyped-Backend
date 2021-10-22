const mongoose = require("mongoose");

const coinSchema = mongoose.Schema({
  contract_address: {
    type: String,
    required: true,
  },
  token_type: {
    type: String,
    required: true,
  },
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
  votes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vote",
    },
  ],
});
coinSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

coinSchema.set("toJSON", {
  virtuals: true,
});
exports.Coin = mongoose.model("Coin", coinSchema);
