const User = require("../Model/user");

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
