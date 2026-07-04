import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";
import bcrypt from "bcryptjs";
import User from "../models/User";

//Register 
export const register = async (req: Request, res: Response ) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    const user = await registerUser(
        name,
        email,
        password
      );

    res.status(201).json({message:"User registered successfully", user});

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    });

  }
};

//Login
export const login = async (req: Request, res: Response ) => { 
  try {

    const { email, password } = req.body;

    const result = await loginUser(
        email,
        password
      );

    res.json(result);

  } catch (error: any) {

    res.status(401).json({
      message: error.message
    });

  }
};

//Profile
export const getProfile = async ( req: any, res: any ) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    });

  }
};

//change password
export const changePassword = async ( req: any, res: any ) => {

  try {
    const {
      oldPassword,
      newPassword
    } = req.body;

    const user = await User.findById( req.user.id );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
        oldPassword,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password incorrect"
      });
    }

    const hashedPassword = await bcrypt.hash( newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    });

  }
};