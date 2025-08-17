import express from "express";
const router = express.Router();
import { signup, login, verify, passwordReset, deleteAccount,refreshToken,logout, checkemail, checkusername, resendVerificationEmail , invalidEmailVerification } from "../controller/auth.controller";
import { verifyUser } from "../middlewares/verifyUser";
import { loginLimiter } from "../middlewares/loginratelimit";

router.get("/email-exist" , checkemail)
router.get("/username-exist" , checkusername)
router.post("/signup",  signup)
router.post("/login",loginLimiter, login)
router.get("/verify", verify)
router.get("/resend-verification-email",resendVerificationEmail )
router.get("/invalid-email-verification",invalidEmailVerification)
router.post("/password-reset", verifyUser ,passwordReset)
router.delete("/delete-account",verifyUser, deleteAccount)
router.post("/logout",verifyUser , logout)
router.get("/refresh-token",verifyUser,refreshToken)
export default router ;