import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";
import Organization from "../models/Organization";

const generateToken = (userId: string, organizationId: string): string => {
  return jwt.sign(
    { userId, organizationId },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, organizationName } = req.body;

    if (!email || !password || !organizationName) {
      return res.status(400).json({
        success: false,
        message: "Email, password and organization name are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const organization = await Organization.create({
      name: organizationName,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      organizationId: organization._id,
    });

    const token = generateToken(
      user._id.toString(),
      organization._id.toString()
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        organizationId: user.organizationId,
      },
      organization,
    });
  } catch (error: any) {
  console.error("Signup Error:", error);

  return res.status(500).json({
    success: false,
    message: "Server error",
    errorMessage: error.message,
    errorName: error.name,
  });
}
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(
      user._id.toString(),
      user.organizationId.toString()
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        organizationId: user.organizationId,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "Me route working",
  });
};