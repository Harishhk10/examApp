const { userModel } = require("./model");
const { emailSend } = require("../components/sendEmail");
const password = require("../components/password");
const bcrypt = require("bcryptjs");
const generateToken = require("../middleware/generateToken");
const jwt = require("jsonwebtoken");

const userSignupView = async (req, res) => {
  let Password = password(8);

  let { name, email, contactNumber, city, state, country } = req.body;
  const hashedPassword = await bcrypt.hash(Password, 10);

  try {
    const user = await new userModel({
      name: name,
      email: email,
      contactNumber: contactNumber,
      password: hashedPassword,
      city: city,
      state: state,
      country: country,
      createdAt: new Date(),
    });

    await user
      .save()
      .then(() => {
        emailSend(email, "password", Password);

        res.status(200).json({ status: true, message: "Added successfully" });
      })
      .catch((error) => {
        res.status(422).json({ status: false, message: error.message });
      });
  } catch (error) {
    console.error(error);

    res.status(500).json({ status: false, message: "Error while adding data" });
  }
};

const userLoginView = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password cannot be empty" });
  }

  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const generateTokens = await generateToken(
        user._id,
        user.name,
        user.email
      );
      const access = await userModel.updateOne(
        { email: email },
        {
          accessToken: generateTokens.accessToken,
          lastLoginTime: new Date(),
          refreshToken: generateTokens.refreshToken,
        }
      );
      return res.status(200).json({
        message: "successful! login",
        accessToken: generateTokens.accessToken,
      });
    } else {
      return res.status(401).json({ message: "Authentication failed!" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error authenticating user" });
  }
};

const accessTokenExpires = async () => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    return res.status(401).send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
    const accessToken = jwt.sign(
      { user: decoded.user },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.header("Authorization", accessToken).send(decoded.user);
  } catch (error) {
    return res.status(400).send("Invalid refresh token.");
  }
};

module.exports = { userSignupView, userLoginView, accessTokenExpires };
