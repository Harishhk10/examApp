const express = require("express");
const router = express.Router();
const {
  classroomView,
  classroomwDeleteView,
  classroomGetView,
  classroomSingleGetView,
  examsResultsUpdateView,
} = require("./views");

router.post("/add", classroomView);
router.delete("/:id", classroomwDeleteView);
router.get("/", classroomGetView);
router.get("/:id", classroomSingleGetView);
router.put("/:id", examsResultsUpdateView);

module.exports = router;
