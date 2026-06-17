import { useState, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { loginUser } from "../../services/authService";
import "./Auth.css";

const LoginForm = () => {
  const navigate = useNavigate();

  const auth = useContext(AuthContext);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  
    

  const handleSubmit = async ( e: React.FormEvent ) => {
    e.preventDefault();
   try{

     const response = await loginUser({
        email,
        password
      });

     auth?.login(
      response.user,
      response.token
    );
     alert("Login Success");
     navigate("/dashboard");
    }catch(error){
     alert("login failed");
    }
   
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">
          Login to your ERP account
        </p>
       
       
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Email</label>
         <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
      />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />
      </div>

      <button  className="auth-btn" type="submit">
        Login
      </button>
    </form>
    <div className="auth-footer">
      Don't have an account? <Link to="/register">Register</Link>
    </div>
      </div>
    </div>
  );
};

export default LoginForm;