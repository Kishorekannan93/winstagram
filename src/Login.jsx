import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const { data } = await axios.post(
        "http://localhost:8080/auth/login",
        {
          username,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
  
      setError(false);
      setMessage(data.message || "Login successfully!");
      localStorage.setItem("isLoggedIn", "true");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(true);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
  
      setMessage(msg); 
      console.log("Login error:", msg);
    }
  };

  return (
    <div className=".body">
      <div className="setposition">
        <h2 className="fs-1 mt-5 text-success">Login</h2>
        <form
          onSubmit={handleSubmit}
          className="formchange m-auto mt-5"
          autoComplete="off"
        >
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="form-control"
              autoComplete="off"
              required
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
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="form-control"
              autoComplete="new-password"
              required
            />
            <div className="mb-3">
              <small className="text-muted">
                * At least 8 characters, one special character & one capital
                letter
              </small>
            </div>
            {message && (
              <div
                className={`alert ${
                  error ? "alert-danger" : "alert-success"
                } py-2`}
              >
                {message}
              </div>
            )}

            <button className="btn btn-primary">Submit</button>
            <button
              onClick={() => navigate("/register")}
              className="btn btn-primary"
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
