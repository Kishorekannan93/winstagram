import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://winstagram-back.onrender.com";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(false);
        setMessage("");

        // Client-side validation
        if (!validatePassword(formData.password)) {
            setError(true);
            setMessage("Password must be at least 8 characters with one special character and one capital letter");
            setIsSubmitting(false);
            return;
        }

        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/auth/register`,
                formData,
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            setMessage(data.message || "Registration successful!");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(true);
            let errorMessage = "Registration failed. Please try again.";
            
            if (err.response) {
                if (err.response.data?.error?.includes("already exists")) {
                    errorMessage = "Username or email already exists";
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.data) {
                    errorMessage = JSON.stringify(err.response.data);
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setMessage(errorMessage);
            console.error("Registration error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-container">
            <div className="setposition">
                <h2 className="fs-1 mt-5 text-success">Register</h2>
                <form onSubmit={handleSubmit} className='formchange m-auto mt-5' autoComplete="off">
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            id='username'
                            name='username'
                            value={formData.username}
                            onChange={handleChange}
                            className="form-control"
                            autoComplete="off"
                            required
                            minLength="3"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id='password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            className="form-control"
                            autoComplete="new-password"
                            required
                            minLength="8"
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
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Registering..." : "Submit"}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/login')} 
                            className="btn btn-secondary"
                            disabled={isSubmitting}
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;