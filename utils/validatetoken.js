const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateToken = async (token) => {
  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return { valid: false, message: "Invalid Token" };
    }
    console.log("validate token data:", data);

    const user = await User.findOne({ _id: data.id });

    if (!user) {
      return { message: "InValid Token No user Found", valid: "False" };
    }
    console.log(user);
    return { valid: true, role: user.user_role, user: user._id };
  });
};

module.exports = { validateToken };
