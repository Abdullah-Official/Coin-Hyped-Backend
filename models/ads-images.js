const mongoose = require("mongoose");

const adsSchema = mongoose.Schema(
  {
    type: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
  },
);

adsSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

adsSchema.set("toJSON", {
  virtuals: true,
});
exports.Ads = mongoose.model("Ad", adsSchema);
