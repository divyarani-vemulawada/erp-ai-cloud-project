import {
  useState,
  useContext
} from "react";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { loginUser } from "../../services/authService";

const LoginForm = () => {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const auth =
    useContext(AuthContext);
   const navigate = useNavigate(); 

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const response =
      await loginUser({
        email,
        password
      });

    auth?.login(
      response.user,
      response.token
    );

    alert("Login Success");
    navigate("/dashboard");
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

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

      <br />

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

      <br />

      <button type="submit">
        Login
      </button>
    </form>
  );
};

export default LoginForm;