const express = require("express");
const router = express.Router();

const {
  examResultsViewAdd,
  examsResultsUpdateView,
  examResultsGetView,
  examFResultsDeleteView,
} = require("./views");

router.post("/add", examResultsViewAdd);
router.put("/:id", examsResultsUpdateView);
router.delete("/:id", examFResultsDeleteView);
router.get("/", examResultsGetView);
module.exports = router;
