const jwt = require("jsonwebtoken");
const { userModel } = require("../users/model");
const { ObjectId } = require("mongodb");

const verifyToken = (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders) {
    res.status(401).json({ message: "token is missing" });
  }
  const token = authHeaders.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decode) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Invalid token or token expired" });
    }
    const revokedToken = await userModel.findOne({
      _id: new ObjectId(decode.user.id),
      accessToken: token,
    });

    if (!revokedToken) {
      return res.status(401).json({ message: "revoked token found" });
    }

    const user = await userModel.findOne({ _id: new ObjectId(decode.user.id) });

    if (!user) {
      return res.status(401).json({ message: "unauthorized" });
    }
    req.jwt_tokens = decode;
    req.user = user;

    next();
  });
};

module.exports = verifyToken;
