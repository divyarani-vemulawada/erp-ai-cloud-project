import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";

import "./Auth.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "employee"
    });
   
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async ( e: React.FormEvent ) => {
    e.preventDefault();
    try{

    await registerUser(formData);

    alert(
      "User Registered Successfully"
    );
    navigate('/');
   }catch(error){
    alert("Registration Failed");
   } 
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Register Account</h1>
        <p className="auth-subtitle">Create your ERP account to get started.
        </p>
       
       
    <form onSubmit={handleSubmit}>
      
     <div className="form-group">
      <label> 👤Full Name</label>
      <input
        type="text"
        name="name"
        placeholder="Enter Full Name"
        onChange={handleChange}
      />
     </div>
    
     <div className="form-group">
      <label>📧Email</label>
       <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
     </div>
     
     <div className="form-group">
      <label>🔒Password</label>
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
     </div>
      
      <div className="form-group">
        <label>Select Role</label>
        
      <select
       className="role-select"
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
      </div>


      <button className="auth-btn" type="submit">
        Register
      </button>
    </form>
     <div className="auth-footer">
       Already have an account? <Link to="/" >Login</Link>
     </div>
      </div>
    </div>
  );
};

export default RegisterForm;