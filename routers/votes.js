const express = require("express");
const { Coin } = require("../models/coin");
const { Vote } = require("../models/vote");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const voteList = await Vote.find();

  if (!voteList) {
    res.status(500).json({ success: false });
  }
  res.send(voteList);
});

router.post("/", async (req, res) => {
  const { user_id, coin_id } = req.body;
  let vote = new Vote({
    user_id,
    coin_id,
  });

  const coin = await Coin.findById(coin_id);
  await vote.save();
  coin.votes.push(vote);
  coin.save();
  res.status(200).json({ coin });

  vote = await vote.save();

  if (!vote) {
    res.status(400).send("The vote cannot be listed");
  }
  res.send(vote);
});

module.exports = router;
