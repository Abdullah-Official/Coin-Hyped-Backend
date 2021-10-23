const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.options("*", cors());

// Routes
const userRouters = require("./routers/users");
const coinRouters = require("./routers/coins");
const voteRouters = require("./routers/votes");
const commentRouters = require("./routers/comments");
const adRouters = require("./routers/ads");

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static(__dirname + "/public"));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
require("dotenv/config");

// .env variables
const api = process.env.API_URL;
const PORT = process.env.PORT || 8000;

// Routers
app.use(`${api}/users`, userRouters);
app.use(`${api}/coins`, coinRouters);
app.use(`${api}/votes`, voteRouters);
app.use(`${api}/comments`, commentRouters);
app.use(`${api}/ads`, adRouters);

// database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: false,
    useUnifiedTopology: false,
  })
  .then(() => {
    console.log("Database is successfully conntected.. ");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("COIND HYPED");
});

//server connection
app.listen(PORT, () => {
  console.log(api);
  console.log("Server is running on port " + PORT);
});
