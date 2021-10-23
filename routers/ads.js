const express = require("express");
const { Ads } = require("../models/ads-images");
const router = express.Router();
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/gif": "gif",
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
  const adsList = await Ads.find();

  if (!adsList) {
    res.status(500).json({ success: false });
  }
  res.send(adsList);
});

router.post("/", uploadOptions.single("image"), async (req, res) => {
  const { type } = req.body;
  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let ads = new Ads({
    type,
    image: `${basePath}${fileName}`,
  });

  ads = await ads.save();

  if (!ads) {
    res.status(400).send("The ads cannot be listed");
  }
  res.send(ads);
});

router.delete("/:id", (req, res) => {
  Ads.findByIdAndRemove(req.params.id)
    .then((ad) => {
      if (!ad) {
        res.status(500).send("ad cannot be deleted");
      } else {
        res.status(200).json({ success: true, message: "ad deleted" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
