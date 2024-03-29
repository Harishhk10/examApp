const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = "harishProjects";

function tokenGenerate(id, name, email, role) {
  try {
    const token = jwt.sign(
      { id: id, username: name, email: email, role: role },
      JWT_SECRET_KEY,
      {
        expiresIn: "12hr",
      }
    );
    return token;
  } catch (error) {
    console.error("Error generating JWT:", error);
    return null;
  }
}

module.exports = tokenGenerate;