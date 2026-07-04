import { Request, Response } from "express";
import User from "../models/User";

// Get All Users
export const getAllUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users"
    });
  }
};

// Get Single User
export const getUserById = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(
      req.params.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user"
    });
  }
};

// Create User
export const createUser = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user"
    });
  }
};

// Update User
export const updateUser = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({ message:"User updated successfully ",user});

  } catch (error) {
    res.status(500).json({
      message: "Failed to update user"
    });
  }
};

// Delete User
export const deleteUser = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user"
    });
  }
};