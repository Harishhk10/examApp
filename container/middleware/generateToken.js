const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = "harishProjects";

function tokenGenerate(id, name, email, role) {
  const user = { id: id, username: name, email: email };

  try {
    const accessToken = jwt.sign({ user }, JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign({ user }, JWT_SECRET_KEY, { expiresIn: "2d" });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating JWT:", error);
    return null;
  }
}





module.exports = tokenGenerate;
