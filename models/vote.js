const mongoose = require("mongoose");

const voteSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
    },
    coin_id: {
      type: String,
    },
  },
  { timestamps: true }
);

voteSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

voteSchema.set("toJSON", {
  virtuals: true,
});
exports.Vote = mongoose.model("Vote", voteSchema);
