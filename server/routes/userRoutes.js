import express from "express";
import {
  checkAuth,
  signup,
  updateProfile,
} from "../controllers/userControllers.js";
import { protectRoute } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login");
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;
