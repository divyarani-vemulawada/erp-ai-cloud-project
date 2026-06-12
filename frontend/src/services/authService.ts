import type {
  LoginData,
  RegisterData
} from "../types/auth";

export const loginUser = async (
  data: LoginData
) => {
  return {
    token: "dummy-jwt-token",
    user: {
      id: "1",
      name: "Divya",
      email: data.email,
      role: "employee"
    }
  };
};

export const registerUser = async (
  data: RegisterData
) => {
  return {
    success: true,
    user: data
  };
};