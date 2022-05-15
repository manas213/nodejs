const User = require("../Model/user");
const Token = require("../Model/token");
const jwt = require("jsonwebtoken"); //authentication
const expressJWT = require("express-jwt"); //authorization
const cookieParser = require("cookie-parser");
const sendEmail = require("../utils/setEmail");
const crypto = require("crypto");

// To Add User

exports.addUser = async (req, res) => {
  let user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    date_of_birth: req.body.date_of_birth,
    gender: req.body.gender,
    email: req.body.email,
    password: req.body.password,
  });
  User.findOne({ email: user.email }, async (error, data) => {
    if (data == null) {
      user = await user.save();

      let token = new Token({
        token: crypto.randomBytes(16).toString("hex"),
        userId: user._id,
      });
      token = await token.save();
      if (!token) {
        return res.json({ error: "Something went wrong" });
      }

      // send verification email
      const url =
        process.env.FRONTEND_URL + "/email/confirmation/" + token.token;
        sendEmail({
          from: "noreply@ourpage.com",
          to: user.email,
          subject: "Verification Email",
          text: ` Hello, \n Please click on the following link to verify your email.\n ${url}`,
          html: `<a href= '${url}'><button>Verify</button></a>`,
        });

      if (!user) {
        return res.status(400).json({ error: "Something went wrong." });
      } else {
        res.send(user);
      }
    } else {
      return res.status(400).json({ error: "Email already exists." });
    }
  });
};

// Resend Verification Email

exports.resendVerification = async (req, res) => {
  // find user
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .json({ error: "The email is not registered. Please register." });
  }
  // check if user is already verified
  if (user.isVerified) {
    return res
      .status(400)
      .json({ error: "User already veified. Login to continue." });
  }
  // create token
  let token = new Token({
    token: crypto.randomBytes(16).toString("hex"),
    userId: user._id,
  });
  token = await token.save();
  if (!token) {
    return res.json({ error: "Something went wrong" });
  }

  const url = process.env.FRONTEND_URL + "/email/confirmation/" + token.token;
  sendEmail({
    from: "noreply@ourpage.com",
    to: user.email,
    subject: "Verification Email",
    text: ` Hello, \n Please click on the following link to verify your email.\n ${url}`,
    html: `<a href= '${url}'><button>Verify</button></a>`,
  });

  res.json({ message: "Verification link has been sent to your email." });
};

// Verify User

exports.verifyUser = (req, res) => {
  // to check token
  Token.findOne({ token: req.params.token }, (error, token) => {
    if (error || !token) {
      return res
        .status(400)
        .json({ error: "Invalid token or token may have expired." });
    }
    User.findOne({ _id: token.userId }, (error, user) => {
      if (error || !user) {
        return res.status(400).json({ error: "Unable to find user." });
      }

      if (user.isVerified) {
        return res
          .status(400)
          .json({ error: "User already verified. Please login to continue." });
      }
      // verify user
      user.isVerified = true;
      user.save((err) => {
        if (err) {
          return res.status(400).json({ error: err });
        }
        res.json({ message: "Congratulations. Your account is verified." });
      });
    });
  });
};

// Signin

exports.userSignin = async (req, res) => {
  const { email, password } = req.body;
  // check email is registerd or not
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Email not registered" });
  }

  // check password to authenticate
  if (!user.authenticate(password)) {
    return res.status(400).json({ error: "Email and password does not match" });
  }

  // check if user is verified or not
  if (!user.isVerified) {
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
  const { _id, name, role } = user;
  return res.json({ token, user: { name, email, role, _id } });
};

// Signout

exports.userSignout = (req, res) => {
  res.clearCookie("myCookie");
  res.json({ message: "Signed out successfully" });
};

// Forget Password

exports.forgetPassword = async (req, res) => {
  // find user
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ error: "User not found. Please register" });
  }
  // generate token if user is found
  let token = new Token({
    userId: user._id,
    token: crypto.randomBytes(16).toString("hex"),
  });
  // save token in database
  token = await token.save();
  if (!token) {
    return res.status(400).json({ error: "Something went wrong." });
  }
  // send email
  const url = process.env.FRONTEND_URL + "/resetpassword/" + token.token;
  sendEmail({
    from: "no-reply@ourstore.com",
    to: user.email,
    subject: "Password Reset Link",
    text: ` Please click on the link below to reset your password. <br> \n ${url}`,
    html: `<a href= '${url}'><button>Reset Password</button></a>`,
  });
  res.json({message: "Password reset link has been sent to your email"})
};

// Reset Password

exports.resetPassword = async(req, res) =>{
  // find valid token
  let token  = await Token.findOne({token: req.params.token})
  if(!token){
    return res.status(400).json({error: "Invalid token, or token may have expired"})
  }
  // find user if token is valid
  let user = await User.findOne({email: req.body.email, _id: token.userId})
  if(!user){
    return res.status(400).json({error:"Email not found"})
  }
  // reset password
  user.password = req.body.new_password
  user = await  user.save()

  if(!user){
    return res.status(400).json({error: "Failed to update password"})
  }
  res.json({message: "Password has been reset successfully"})
}

// To View All Users

exports.userList = async(req, res) => {
  const user = await User.find().select("-hashed_password")
  if(!user){
    return res.status(400).josn({error: "Something went wrong"})
  }
  res.send(user)
}

// To Find Individual/Particular User

exports.findUser = async(req, res) =>{
  const user =  await User.findById(req.params.userid).select("-hashed_password")
  if(!user){
    return res.status(400).json({error: "User not found."})
  }
  res.send(user)
}

// authorization
exports.requireSignin = expressJWT({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth'
})
