const express = require("express");
const { Coin } = require("../models/coin");
const { Comment } = require("../models/comment");
const router = express.Router();
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {
  const commentList = await Comment.find();

  if (!commentList) {
    res.status(500).json({ success: false });
  }
  res.send(commentList);
});

router.post("/:id", uploadOptions.single("image"), async (req, res) => {
  const { user_name, text, likes } = req.body;
  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let comment = new Comment({
    user_name,
    text,
    image: `${basePath}${fileName}`,
    likes,
    coin_id: req.params.id,
  });

  const coin = await Coin.findById(req.params.id);
  await comment.save();
  coin.comments.push(comment);
  coin.save();
  res.status(200).json({ coin });

  comment = await comment.save();

  if (!comment) {
    res.status(400).send("The comment cannot be listed");
  }
  res.send(comment);
});

router.put("/:id/:userId", async (req, res) => {
  const { id, userId } = req.params;

  const comment = await Comment.findById(id);

  const index = comment.likes.findIndex((id) => id === String(userId));

  if (index === -1) {
    // like the comment ..
    comment.likes.push(userId);
  } else {
    // dislike a comment ..
    comment.likes = comment.likes.filter((id) => id !== String(userId));
  }

  const updatedComment = await Comment.findByIdAndUpdate(id, comment, {
    new: true,
  });

  res.json(updatedComment);
});

module.exports = router;
