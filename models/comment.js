const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    user_name: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
    likes: {
      type: [String],
      default: [],
    },
    coin_id:{
        type: String,
        require: true,
    }
  },
  { timestamps: true }
);

commentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

commentSchema.set("toJSON", {
  virtuals: true,
});
exports.Comment = mongoose.model("Comment", commentSchema);
