const express = require("express");
const router = express.Router();
const { userSignupView, userLoginView, accessTokenExpires } = require("./view");

router.post("/login-in", userLoginView);
router.post("/sign-up", userSignupView);
router.post("/refresh-token", accessTokenExpires);

module.exports = router;
