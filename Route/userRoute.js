const express = require("express");
const { addUser,userSignin, userSignout, verifyUser, resendVerification, forgetPassword, resetPassword, userList, findUser, requireSignin } = require("../Controller/userController");
// const sendEmail = require("../utils/setEmail");
// const { userValidation } = require("../Validation/userValidation");
const { userCheck, validation } = require("../Validation/validation");
const router = express.Router();

router.post("/adduser", userCheck, validation, addUser);
router.post("/signin", userSignin);
router.get("/signout", userSignout);
router.post("/confirmation/:token", verifyUser)
router.post("/resendverification", resendVerification)
router.post("/forgetpassword", forgetPassword)
router.post("/resetpassword/:token", resetPassword)
router.get("/userlist", requireSignin, userList);
router.get("/finduser/:userid", requireSignin, findUser);

module.exports = router;
