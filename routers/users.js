const { User } = require("../models/user.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get(`/`, async (req, res) => {
  const userList = await User.find()
    .select("-password -confirmPassword")
    .populate({ path: "coins", populate: { path: "votes" } });

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    res.status(500).json({ success: false });
  }
  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!user) {
    res.status(400).send("User not found..");
  }
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      secret,
      { expiresIn: "1d" }
    );
    return res.status(200).send({ user, token });
  } else {
    res.status(400).send("Password is wrong");
  }
});

router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    confirmPassword: bcrypt.hashSync(req.body.confirmPassword, 10),
  });
  user = await user.save();

  if (!user) {
    res.status(400).send("The user cannot be registered");
  }
  res.send(user);
});

router.get("/get/count", async (req, res) => {
  const userCount = await User.countDocuments((count) => count);

  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
});

router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(500).send("User cannot be deleted");
      } else {
        res.status(200).json({ success: true, message: "User deleted" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
