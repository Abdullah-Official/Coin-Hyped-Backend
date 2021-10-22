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

//middleware
app.use(express.json());
app.use(morgan("tiny"));
require("dotenv/config");

// .env variables
const api = process.env.API_URL;
const PORT = process.env.PORT || 8000;

// Routers
app.use(`${api}/users`, userRouters);
app.use(`${api}/coins`, coinRouters);

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
