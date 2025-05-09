import User from "../models/user.js";
import { generateToken } from "../config/utils.js";

/*
    Status Codes
    400 (missing fields) -> for bad requests.
    409 (Conflict) -> for "already exists" situations.
    201 -> for successful resource creation.
    500 -> for unexpected server errors.
    401 (Unauthorized) -> is appropriate for incorrect login attempts.
    200 (OK) -> is the standard response for successful GET or POST operations.
*/

// Controller to Signup a user.
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, bio } = req.body;
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
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Controller to Login a user.
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const userData = await User.findOne({ email });

    const isPasswordMatch = await bcrypt.compare(password, userData.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userData._id);
    res.status(200).json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
