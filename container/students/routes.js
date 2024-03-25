const express = require("express");
const router = express.Router();
const {
  StudentViewAdd,
  StudentDeleteView,
  StudentUpdateView,
} = require("./views");

router.post("/add", StudentViewAdd);
router.delete("/:id", StudentDeleteView);
router.put("/:id", StudentUpdateView);

module.exports = router;
