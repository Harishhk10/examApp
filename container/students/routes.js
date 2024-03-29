const express = require("express");
const router = express.Router();
const {
  StudentViewAdd,
  StudentDeleteView,
  StudentUpdateView,studentsGetallView,studentSingleGetView
} = require("./views");

router.post("/add", StudentViewAdd);
router.delete("/:id", StudentDeleteView);
router.put("/:id", StudentUpdateView);
router.get("/", studentsGetallView)
router.get("/:id", studentSingleGetView)

module.exports = router;
