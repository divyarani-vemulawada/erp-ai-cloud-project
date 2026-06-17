import type { LoginData, RegisterData } from "../types/auth";
import axios from "axios";

const API = "http://localhost:1000/api/auth";



export const registerUser = async (data: RegisterData) => {
  const response = await axios.post(`${API}/register`,data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await axios.post(`${API}/login`,data);
  return response.data
};