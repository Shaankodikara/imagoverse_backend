import express from "express";
import { authorizeUser } from "../middlewares/auth.js";

import { signin, signup, signout, forgotPassword, resetPassword, verifyUser } from "../controllers/authController.js"; 

const router = express.Router();

router.post("/signup", signup );
router.post("/signin", signin );
router.get("/logout", signout );
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify", authorizeUser, verifyUser)

export { router as authRouter };
