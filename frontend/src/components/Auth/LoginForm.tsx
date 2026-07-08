import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";
import { toast } from "sonner";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt
} from "react-icons/fa";
import "./Auth.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const response = await loginUser({
        email,
        password
      });

      auth?.login(response.user, response.token);
      toast.success("Welcome back! Logged in successfully.");
      navigate("/employees");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed. Please check credentials.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Top Left Brand Logo */}
      <div className="auth-brand">
        <div className="brand-logo-icon">
          <div className="square-dot-grid">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <span className="brand-name">Amdox ERP</span>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header-icon-container">
            <FaSignInAlt className="auth-header-icon" />
          </div>

          <h1 className="auth-title">Login</h1>
          <p className="auth-subtitle">
            Login to your account
          </p>

          {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group-custom">
              <div className="input-with-icon">
                <FaEnvelope className="input-icon-left" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-custom">
              <div className="input-with-icon">
                <FaLock className="input-icon-left" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="forgot-password-container">
              <Link to="#" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Get Started"}
            </button>
          </form>

          {/* <div className="social-divider">
            <span className="divider-line"></span>
            <span className="divider-text">Or sign in with</span>
            <span className="divider-line"></span>
          </div>

          <div className="social-buttons-container">
            <button type="button" className="social-btn" aria-label="Sign in with Google">
              <FaGoogle className="social-icon google-color" />
            </button>
            <button type="button" className="social-btn" aria-label="Sign in with Facebook">
              <FaFacebookF className="social-icon facebook-color" />
            </button>
            <button type="button" className="social-btn" aria-label="Sign in with Apple">
              <FaApple className="social-icon apple-color" />
            </button>
          </div> */}

          <div className="auth-footer-custom">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;