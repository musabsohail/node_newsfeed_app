require("dotenv").config();
const express = require("express");
const app = express();

const routes = require("./routes");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", routes);

app.use((req, res) => {
  res.status(404);
});

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
