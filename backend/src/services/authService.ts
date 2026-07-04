import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/jwt";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {

  const exists = await User.findOne({ email });

  if (exists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const { password: _pw, ...safeUser } = user.toObject();
  return safeUser;
};

export const loginUser = async (
  email: string,
  password: string
) => {

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const isMatch = await bcrypt.compare(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  const token = generateToken(
    user._id.toString(),
    user.role
  );

  const { password: _pw, ...safeUser } = user.toObject();
  return {
    token,
    user: safeUser,
  };
};