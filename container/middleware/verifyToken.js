const jwt = require("jsonwebtoken");
const { universityAddData } = require("../model");
const { StudentsSignUpView } = require("../students/models");
const verifyToken = (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders) {
    res.status(401).json({ message: "token is missing" });
  }
  const token = authHeaders.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decode) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    if (decode["role"] === "university") {
      data = universityAddData;
    } else if (decode["role"] === "student") {
      data = StudentsSignUpView;
    } else {
      return res.status(403).json({ message: "malfunction" });
    }

    const revokedToken = await data.findOne({
      _id: decode.id,
      accessToken: token,
    });

    if (!revokedToken) {
      return res.status(401).json({ message: "revoked token found" });
    }

    const user = await data.findOne({ _id: decode.id });

    if (!user) {
      return res.status(401).json({ message: "unauthorized" });
    }
    req.jwt_tokens = decode;
    req.user = user;

    next();
  });
};

module.exports = verifyToken;