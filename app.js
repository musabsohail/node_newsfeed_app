require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const routes = require("./routes");

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || "";

// Connect to the database
mongoose
  .connect(DB_URL)
  .then(() => console.log("Connected to the database", DB_URL))
  .catch(() => {
    console.log("Failed to connect to the database");
  });

// Middlewares
app.use(express.json());

// API Routes
app.use("/api", routes);

app.use((req, res) => {
  res.status(404);
});

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
