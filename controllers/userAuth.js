const User = require("../models/User");
const Admin = require("../models/Admin");

// exports.register = async (req, res, nex) => {
//   const { username, email, password } = req.body;

//   try {
//     const user = await User.create({
//       username,
//       email,
//       password,
//     });
//     res.status(200).json({ success: true, user: user });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error });
//   }
// };

exports.register = async (req, res, nex) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.create({
      email,
      password,
    });
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // if email and password not valid
  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, error: "Please Provide email and password" });
  }

  try {
    try {
      //check admin data.............................
      const admin = await Admin.findOne({ email }).select("+password");
      const isAdminMatch = await admin.matchPasswords(password);
      //if the user is admin then run this condition
      if (isAdminMatch) {
        const sms = "Hello Admin";
        sendToken(admin, 200, res, sms);
      }
    } catch (error) {}
    //...
    try {
      //check users data.............................
      const user = await User.findOne({ email }).select("+password");
      const isMatch = await user.matchPasswords(password);
      if (!isMatch) {
        res.status(500).json({ success: false, error: "something is wrong" });
      }
      sendToken(user, 200, res);
    } catch (error) {
      res.status(500).json({ success: false, error: error });
    }
  } catch (error) {}
};

const sendToken = (user, statusCode, res, admin = false) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token, admin });
};
