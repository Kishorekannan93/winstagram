import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import './Register.css'


const Register = () => {

    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError] = useState(false);
    const [message,setMessage] = useState("")
    const navigate = useNavigate();

     // Use Vite environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
          const { data } = await axios.post(
              `${API_BASE_URL}/auth/register`,
              { username, email, password },
              { withCredentials: true }
          );
          
          setError(false);
          setMessage(data.message || "Registration successful!");
          setTimeout(() => navigate("/login"), 1000);
      } catch (err) {
          setError(true);
          
        
          const backendError = err.response?.data?.error || err.response?.data?.message;
          
          let displayMessage;
          if (backendError?.includes("already exists")) {
              displayMessage = "This username/email is already taken. Please try another one.";
          } else {
              displayMessage = err.response?.data || "Registration failed. Please try again.";
          }
          
          setMessage(displayMessage);
          console.error("Registration error:", err.response?.data || err.message);
      }
  };
    
    

    
  return (
   <div >
     <div className="setposition">
      <h2 className="fs-1 mt-5 text-success">Register</h2>
        <form onSubmit={handleSubmit} className='formchange m-auto mt-5'  autoComplete="off">
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" 
                    id='username'
                    name='username'
                    value={username}
                    onChange={(e)=>{setUsername(e.target.value)}}
                    className="form-control"
                    autoComplete="off"
                    required
                />
            </div>

           <div className="mb-3" >
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" 
                id='email'
                name='email'
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
                className="form-control" 
                autoComplete="off"
                required                   
                />
             </div>

            <div className="mb-3" >
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" 
                id='password'
                name='password'
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
                className="form-control"
                autoComplete="new-password"
                required
                                 
                />
                  <div className="mb-3">
                   <small className="text-muted">* At least 8 characters, one special character & one capital letter</small>
                  </div>
                 {message && (
                 <div className={`alert ${error ? "alert-danger" : "alert-success"} py-2`}>
                  {message}
                 </div>
                  )}


                <button className="btn btn-primary">Submit</button>
                <button onClick={() => navigate('/login')} className="btn">Login</button>
             </div>
        </form>
        </div>
   </div>
  )
}

export default Register
