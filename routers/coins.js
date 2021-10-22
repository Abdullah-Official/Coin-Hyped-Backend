const { Coin } = require("../models/coin.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.js");
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
  const coinList = await Coin.find().populate({ path: "votes" });

  if (!coinList) {
    res.status(500).json({ success: false });
  }
  res.send(coinList);
});

router.get("/:id", async (req, res) => {
  const coin = await Coin.findById(req.params.id);

  if (!coin) {
    res.status(500).json({ success: false });
  }
  res.send(coin);
});

router.post(
  "/listcoin/:id",
  uploadOptions.single("image"),
  async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send("No image in the request");

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const {
      contract_address,
      token_type,
      network,
      coinName,
      symbol,
      description,
      web,
      telegram,
      twitter,
      discord,
      dateCreated,
      votes,
    } = req.body;
    let coin = new Coin({
      contract_address,
      token_type,
      network,
      coinName,
      symbol,
      description,
      web,
      telegram,
      twitter,
      discord,
      dateCreated,
      image: `${basePath}${fileName}`,
      votes,
    });

    const user = await User.findById(req.params.id);
    await coin.save();
    user.coins.push(coin);
    user.save();
    res.status(200).json({ coin });

    coin = await coin.save();

    if (!coin) {
      res.status(400).send("The coin cannot be listed");
    }
    res.send(coin);
  }
);

router.get("/get/count", async (req, res) => {
  const coinCount = await Coin.countDocuments((count) => count);

  if (!coinCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    coinCount: coinCount,
  });
});

router.delete("/:id", (req, res) => {
  Coin.findByIdAndRemove(req.params.id)
    .then((coin) => {
      if (!coin) {
        res.status(500).send("Coin cannot be deleted");
      } else {
        res.status(200).json({ success: true, message: "Coin deleted" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
