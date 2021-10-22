const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    text: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
    likes:{
        type: [String],
        default: []
    },
  },
  { timestamps: true }
);

commentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

commentSchema.set("toJSON", {
  virtuals: true,
});
exports.Vote = mongoose.model("Comment", commentSchema);
