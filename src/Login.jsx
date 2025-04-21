import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Use Vite environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://winstagram-back.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError(false);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { username, email, password },
        { withCredentials: true }
      );

      setMessage(data.message || "Login successful!");
      localStorage.setItem("isLoggedIn", "true");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(true);
      setMessage(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=".body">
      <div className="setposition">
        <h2 className="fs-1 mt-5 text-success">Login</h2>
        <form onSubmit={handleSubmit} className="formchange m-auto mt-5" autoComplete="off">
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              autoComplete="off"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              autoComplete="new-password"
              required
              disabled={isLoading}
            />
            <div className="mb-3">
              <small className="text-muted">
                * At least 8 characters, one special character & one capital letter
              </small>
            </div>
            
            {message && (
              <div className={`alert ${error ? "alert-danger" : "alert-success"} py-2`}>
                {message}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary me-2"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;