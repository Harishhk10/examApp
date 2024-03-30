const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
  examResultsViewAdd,
  examsResultsUpdateView,
  examResultsGetView,
  examFResultsDeleteView,
} = require("./views");

router.post("/add", verifyToken, examResultsViewAdd);
router.put("/:id", verifyToken, examsResultsUpdateView);
router.delete("/:id", verifyToken, examFResultsDeleteView);
router.get("/", verifyToken, examResultsGetView);
module.exports = router;
