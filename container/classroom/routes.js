const express = require("express");
const router = express.Router();
const { classroomView, classroomwDeleteView } = require("./views");

router.post("/add", classroomView);
router.delete("/:id", classroomwDeleteView);

module.exports = router;
