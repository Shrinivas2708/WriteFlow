import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { verifyToken } from "../utils/verifyToken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import { sendEmailVerificationmail } from "../utils/emailHandler";
import { prisma } from "..";
import axios from "axios";
import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { DecodedUser, ENV } from "../utils/exports";
import MailChecker from "mailchecker";
import { logger } from "../utils/logger";

export const checkemail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email.trim().toLowerCase();

  try {
    if (!MailChecker.isValid(email)) {
       res.status(400).json({
        message: "Disposable or invalid email addresses are not allowed.",
      });
      return
    }
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      res.status(409).json({
        message: "Email already exist!",
      });
      return;
    }
    if (ENV !== "development") {
      const Verification = await axios.get(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.EMAIL_VALIDATION_API}&email=${email}`
      );
      if (Verification.data.deliverability == "UNDELIVERABLE") {
        res.status(409).json({
          message: "Email doesn't exist!",
        });
        return;
      }
    }
    res.status(200).json({
      msg: "Email is valid and available!",
    });
  } catch (error: any) {
    next(error instanceof AppError ? error : new AppError(500, error.message));
  }
};
export const checkusername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (user) {
      res.status(409).json({
        message: "User already exist!",
      });
      return;
    }
    res.status(200).json({ message: "Username available!" });
  } catch (error) {
    next(error);
  }
};
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, firstName, lastName, email, password } = req.body;
  const ip = req.ip!;
  try {
    const user = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        email,
        password,
      },
    });
    const userId = user.id;
    const emailToken = await sendEmailVerificationmail(ip, userId, email);
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerificationAttempts: { increment: 1 },
        lastEmailSentAt: new Date(),
      },
    });
    ENV === "development"
      ? res.status(200).json({ message: "Email Sent!", emailToken: emailToken, userId , ip})
      : res.status(200).json({ message: "Email Sent!" });
  } catch (error: any) {
    next(error);
  }
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email && !password) {
    throw new AppError(401, "Credentials doesnt exist!");
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if(!user) throw new AppError(401,"User doesnt exist!")
    if (user?.password != password) {
      throw new AppError(401, "Invalid Password!");
    }
    if (!user?.verified && user?.emailStatus === "PENDING") {
      throw new AppError(401, "User isnt verified!");
    }
    if (user?.emailError && user?.emailStatus === "INVALID") {
      throw new AppError(401, "User email doesnt exist!");
    }
    const accessToken = generateAccessToken(user?.id!);
    const refreshToken = generateRefreshToken(user?.id!);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Successfully logged in!",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};
export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  if (!req.query.token ) {
    throw new AppError(400, "Invalid or missing token in query!");
  }
  if ( !req.query.id ) {
    throw new AppError(400, "missing userid in query!");
  }
  const token = req.query.token as string;
  const userId = req.query.id as string

  try {
    const verifyCheck = await prisma.user.findUnique({
      where:{
        id:userId
      }
    })
    if(verifyCheck?.verified){
      throw new AppError(409,"Email already verified!")
    }
    const decoded = jwt.verify(
      token,
      process.env.EMAIL_VERIFICATION_SECRET!
    ) as DecodedUser;
    console.log(decoded);
    if (req.ip !== decoded.ip) {
      res.status(403).json({
        message: "IP mismatch! use the same browser you used to create account",
      });
      return;
    }
    const user = await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        verified: true,
        emailStatus: "VERIFIED",
      },
    });
    const accessToken = generateAccessToken(user?.id!);
    const refreshToken = generateRefreshToken(user?.id!);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Successfully verified and  logged in!",
      accessToken,
    });
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      next(new AppError(401, "Verification link expired!", "TOKEN_EXPIRED"));
    } else if (error instanceof JsonWebTokenError) {
      next(new AppError(400, "Invalid verification token!", "INVALID_TOKEN"));
    } else if (error instanceof NotBeforeError) {
      next(new AppError(400, "Token not active yet!", "TOKEN_NOT_ACTIVE"));
    } else {
      next(
        error
      );
    }
  }
};
export const passwordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.user?.id;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword) throw new AppError(401, "Send old password!");
  if (!newPassword) throw new AppError(401, "Send new password!");
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: newPassword,
      },
    });
    res.status(200).json({
      message: "Password channged successfully!",
    });
  } catch (error) {
    next(error);
  }
};
export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.refreshToken) throw new AppError(401, "Refresh token missing!");
  try {
    await prisma.user.delete({
      where: { id: req.user?.id },
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new AppError(401, "Refresh token missing!");
  try {
    logger.info("From the Refresh token!");
    const decoded = verifyToken(token, process.env.JWT_SECRET_REFRESHTOKEN!);

    const newAccessToken = generateAccessToken(decoded.id);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return next(
      new AppError(401, "Invalid or expired refresh token", "TOKEN_EXPIRED")
    );
  }
};
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
 
  if (!req.cookies.refreshToken) throw new AppError(401, "Refresh token missing!");
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
export const resendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const RESEND_COOLDOWN_MINUTES = 30;
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (user?.verified && user?.emailStatus === "VERIFIED") {
    res.status(409).json({
      message: "Email is already verified!",
    });
    return;
  }
  if ( user?.emailStatus === "INVALID") {
    res.status(409).json({
      message: "Email is invalid!",
    });
    return;
  }
  const now = new Date();
  const lastSent = user?.lastEmailSentAt ?? new Date(0);
  const minutesSinceLastSend = (now.getTime() - lastSent.getTime()) / 60000;
  if (minutesSinceLastSend < RESEND_COOLDOWN_MINUTES) {
    const wait = Math.ceil(RESEND_COOLDOWN_MINUTES - minutesSinceLastSend);
    res.status(429).json({
      error: true,
      message: `You need to wait ${wait} more minute(s) before requesting another verification email.`,
    });
    return;
  }
  try {
    await sendEmailVerificationmail(req.ip!, user?.id!, user?.email!);
    await prisma.user.update({
      where: { email: user?.email },
      data: {
        lastEmailSentAt: now,
      },
    });
    res.status(200).json({ message: "Verification email resent." });
  } catch (error) {
    next(error);
  }
};
export const invalidEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.oldEmail,
      },
    });
    if (user?.verified && user?.emailStatus === "VERIFIED") {
      res.status(409).json({
        message: "Email is already verified!",
      });
      return;
    }
    if (user?.emailStatus === "PENDING") {
      res.status(409).json({
        message: "Email is in pending state! You can't change the email! ",
      });
      return;
    }
    const updateduser = await prisma.user.update({
      where: {
        email: req.body.oldEmail,
      },
      data: {
        email: req.body.newEmail,
        lastEmailSentAt: new Date(),
        emailVerificationAttempts: { increment: 1 },
      },
    });
    await sendEmailVerificationmail(req.ip!, updateduser.id, updateduser.email);
    res.status(200).json({
      message: "Verification code sent!",
    });
  } catch (error) {
    next(error);
  }
};
