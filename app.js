const express = require("express");
const app = express();
const _env = require("dotenv").config(); // connect env file
const env = process.env;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res) => {
  res.status(500).send({ message: "No api found" });
});


app.listen(env.PORT, () => {
  console.info(`Server is started: ${env.PORT}`);
});