import User from "../models/user.js";
import { generateToken } from "../config/utils.js";

/*
    Status Codes
    400 -> for bad requests (like missing fields).
    409 -> for "already exists" situations (Conflict).
    201 -> for successful resource creation.
    500 -> for unexpected server errors.
*/

// Controller to Signup a user.
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const user = User.findOne({ email });
    if (user) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const salt = await bcrypt.getSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);
    res.status(201).json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status();
  }
};
