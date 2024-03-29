const express = require("express");
const router = express.Router();
const {
  ExamViewAdd,
  ExamUpdateView,
  ExamDeleteView,
  examGetAllView,
  examgetSingleView,
} = require("./views");

router.post("/add", ExamViewAdd);
router.put("/:id", ExamUpdateView);
router.delete("/:id", ExamDeleteView);
router.get("/", examGetAllView);
router.get("/:id", examgetSingleView);
module.exports = router;
