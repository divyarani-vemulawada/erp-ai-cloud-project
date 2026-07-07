import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, checkEmailExists } from "../../services/authService";
import { toast } from "sonner";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import "./Auth.css";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateEmailFormat = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  // Debounced email format and database check
  useEffect(() => {
    if (!email) {
      setEmailError("");
      setEmailAvailable(null);
      return;
    }

    if (!validateEmailFormat(email)) {
      setEmailError("Invalid email format");
      setEmailAvailable(null);
      return;
    }

    setEmailError("");
    setEmailAvailable(null);

    const delayDebounce = setTimeout(async () => {
      setCheckingEmail(true);
      try {
        const res = await checkEmailExists(email);
        if (res.exists) {
          setEmailError("Email is already registered");
          setEmailAvailable(false);
        } else {
          setEmailError("");
          setEmailAvailable(true);
        }
      } catch (err) {
        console.error("Error checking email availability", err);
      } finally {
        setCheckingEmail(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [email]);

  // Live password matching check
  useEffect(() => {
    if (!confirmPassword) {
      setPasswordError("");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!name || !email || !password || !confirmPassword) {
      setSubmitError("Please fill in all fields.");
      return;
    }

    if (emailError || emailAvailable === false) {
      setSubmitError(emailError || "Email is unavailable.");
      return;
    }

    if (password !== confirmPassword) {
      setSubmitError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name,
        email,
        password,
        role: "employee" // Defaulting to employee role internally
      });

      toast.success("Account registered successfully!");
      navigate("/");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Registration failed. Please try again.";
      setSubmitError(msg);
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
            <FaUserPlus className="auth-header-icon" />
          </div>

          <h1 className="auth-title">Register Account</h1>
          <p className="auth-subtitle">Create your ERP account to get started.</p>

          {submitError && <div className="auth-error-banner">{submitError}</div>}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group-custom">
              <div className="input-with-icon">
                <FaUser className="input-icon-left" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
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
                <span className="validation-indicator">
                  {checkingEmail && <FaSpinner className="spin-icon" />}
                  {!checkingEmail && emailAvailable === true && (
                    <FaCheckCircle className="valid-icon" />
                  )}
                  {!checkingEmail && (emailAvailable === false || emailError) && email && (
                    <FaTimesCircle className="invalid-icon" />
                  )}
                </span>
              </div>
              {emailError && <p className="validation-msg error-msg">{emailError}</p>}
              {!checkingEmail && emailAvailable === true && (
                <p className="validation-msg success-msg">Email is available</p>
              )}
            </div>

            {/* Password */}
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

            {/* Confirm Password */}
            <div className="form-group-custom">
              <div className="input-with-icon">
                <FaLock className="input-icon-left" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {passwordError && <p className="validation-msg error-msg">{passwordError}</p>}
            </div>

            <button className="auth-submit-btn" type="submit" disabled={loading || checkingEmail}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="auth-footer-custom">
            Already have an account? <Link to="/">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;