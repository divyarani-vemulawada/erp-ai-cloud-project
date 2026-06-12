import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  registerUser
} from "../../services/authService";

const RegisterForm = () => {
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "employee"
    });
   const navigate = useNavigate();
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    await registerUser(
      formData
    );

    alert(
      "Registered Successfully"
    );
    navigate("/")
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
      />

      <br />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <br />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <br />

      <select
        name="role"
        onChange={handleChange}
      >
        <option value="employee">
          Employee
        </option>

        <option value="manager">
          Manager
        </option>

        <option value="hr">
          HR
        </option>

        <option value="finance">
          Finance
        </option>

        <option value="admin">
          Admin
        </option>
      </select>

      <br />

      <button type="submit">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;