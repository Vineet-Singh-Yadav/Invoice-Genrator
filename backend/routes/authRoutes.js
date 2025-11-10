import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import authVerify from "../middleware/jwtVerify.js";

const router = express.Router();

router.post("/register", [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ success, message: errors.array()[0].msg });
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) { return res.json({ success, message: "User with this email already exists" }) }

    const salt = await bcrypt.genSalt(10);
    const setPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      password: setPass,
      email: req.body.email,
    })

    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, process.env.JWT_SECRET);
    success = true;
    res.json({ success, authToken, message: "User registered successfully!" });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/login", [
  body("email").isEmail().withMessage("please enter a valid email"),
  body("password").exists().withMessage("please enter a valid password"),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) { return res.json({ success, message: errors.array()[0].msg }) };

  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) { return res.json({ success, message: "Invalid credentials! Please try again." }) }

    const comparePassword = await bcrypt.compare(req.body.password, user.password);
    if (!comparePassword) { return res.json({ success, message: "Invalid credentials! Please try again." }) };

    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, process.env.JWT_SECRET);
    success = true;
    res.json({ success, authToken, message: "Login successful!" });

  } catch (error) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


router.get("/getUser", [authVerify], async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select("-password");
    console.log(user);
    res.json({ success: true, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


// router.post("/updateUserInfo", [authVerify], [
//   body("name").notEmpty().withMessage("Name is required"),
//   body("email").isEmail().withMessage("Enter a valid email"),
// ], async (req, res) => {

//   const error = validationResult(req);
//   if (!error.isEmpty()) { return res.json({ error: error.array() }) };

//   try {
//     const userId = req.user.id;

//     let user = await User.findById({ _id: userId });
//     if (!user) { return res.json("User not find") };

//     const existingEmail = await User.findOne({ email: req.body.email });
//     if (existingEmail && existingEmail._id.toString() !== userId) { return res.json("User with this email already exists") };

//     user = await User.findByIdAndUpdate({ _id: userId }, {
//       name: req.body.name,
//       email: req.body.email,
//     },
//       { new: true });

//     const safeUser = user.toObject();
//     delete safeUser.password;
//     res.json(safeUser);

//   } catch (error) {
//     console.log(error.message);
//     res.json("Internal Server Error");
//   }
// });

// router.post("/updatePassword", [authVerify],
//   [body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")],
//   async (req, res) => {
//     const error = validationResult(req);
//     if (!error.isEmpty()) { return res.json({ error: error.array() }) };

//     try {
//       const userId = req.user.id;

//       let user = await User.findById( userId );
//       if (!user) { return res.json("User not found") };

//       const salt = await bcrypt.genSalt(10);
//       const newPassword = await bcrypt.hash(req.body.password, salt);

//       await User.findByIdAndUpdate(userId, 
//         { password: newPassword }
//       );

//       res.json("Password Updated Successfully");
//     } catch (error) {
//       console.log(error.message);
//       res.json("Internal Server Error");
//     }
//   })

// ------------------ UPDATE USER INFO ------------------
router.post(
  "/updateUserInfo",
  [
    authVerify,
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, message: errors.array()[0].msg });
    }

    try {
      const userId = req.user.id;

      // 1️⃣ Check if user exists
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success, message: "User not found" });
      }

      // 2️⃣ Check if new email already exists
      const existingEmail = await User.findOne({ email: req.body.email });
      if (existingEmail && existingEmail._id.toString() !== userId) {
        return res.status(400).json({ success, message: "Email already in use" });
      }

      // 3️⃣ Update user
      user = await User.findByIdAndUpdate(
        userId,
        { name: req.body.name, email: req.body.email },
        { new: true }
      );

      const safeUser = user.toObject();
      delete safeUser.password;

      success = true;
      res.status(200).json({ success, user: safeUser, message: "User info updated successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
);

// ------------------ UPDATE PASSWORD ------------------
router.post(
  "/updatePassword",
  [
    authVerify,
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, message: errors.array()[0].msg });
    }

    try {
      const userId = req.user.id;

      // 1️⃣ Find user
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success, message: "User not found" });
      }

      // 2️⃣ Compare old password (make sure frontend sends oldPassword)
      const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success, message: "Old password is incorrect" });
      }

      // 3️⃣ Hash and update new password
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(req.body.password, salt);
      await User.findByIdAndUpdate(userId, { password: newPassword });

      success = true;
      res.status(200).json({ success, message: "Password updated successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
);

export default router;