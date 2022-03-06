const User = require("../Model/user");
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
const cookieParser = require("cookie-parser");

// to add user
exports.addUser = async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  User.findOne({ email: user.email }, async (error, data) => {
    if (data == null) {
      user = await user.save();
      if (!user) {
        return res.status(400).json({ error: "Something went wrong." });
      } else {
        res.send(user);
      }
    }
    return res.status(400).json({ error: "Email already exists." });
  });
};

// signin
exports.userSignin = async (req, res) => {
  const { email, password } = req.body;
  // check email is registerd or not
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Email not found" });
  }

  // check password to authenticate
  if (!user.authenticate(password)) {
    return res.status(400).json({ error: "Email and password does not match" });
  }

  // check if user is verified or not
  if (!user.isVerfied) {
    return res
      .status(400)
      .json({ error: "User not verified. Please verify to continue" });
  }

  // generate token using user_id and jwt
  const token = jwt.sign(
    { _id: user._id, user: user.role },
    process.env.JWT_SECRET
  );

  res.cookie("myCookie", token, { expire: Date.now() + 999999 });

  // return information to frontend
  const { id, name, isAdmin } = user;
  return res.json({ token, user: { name, email, isAdmin, _id } });
};
