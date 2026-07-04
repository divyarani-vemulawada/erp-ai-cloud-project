import type { LoginData, RegisterData } from "../types/auth";
import axios from "axios";
import { API_URL } from "../config/env";

const API = `${API_URL}/auth`;



export const registerUser = async (data: RegisterData) => {
  const response = await axios.post(`${API}/register`,data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await axios.post(`${API}/login`,data);
  return response.data
};