const express = require("express");
const app = express();
const { dbConnection } = require("./database/db_config");
const classroom = require("./container/classroom/routes");
const students = require("./container/students/routes");

const _env = require("dotenv").config(); // connect env file
const env = process.env;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/classrooms", classroom);
app.use("/api/students", students);

app.use((req, res) => {
  res.status(500).send({ message: "No api found" });
});

app.listen(env.PORT, () => {
  dbConnection();
  console.info(`Server is started: ${env.PORT}`);
});
  