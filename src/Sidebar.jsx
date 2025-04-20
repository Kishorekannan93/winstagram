import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/register");
  };

  return (
    <div className="m-5 position-fixed wow">
      <b className="fs-2 text-success">𝓌𝒾𝓃𝓈𝓉𝒶𝑔𝓇𝒶𝓂</b>
      <div className="d-flex flex-column gap-3 mx-5 my-5">
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <i className="bi bi-house"></i>Home
        </div>
        <div className="cursor-pointer" onClick={() => navigate("/profile")}>
          <i className="bi bi-person-circle"></i>Profile
        </div>
        <div className="cursor-pointer" onClick={() => navigate("/register")}>
          <i className="bi bi-person-plus-fill"></i>Register
        </div>
        <div className="cursor-pointer" onClick={() => navigate("/login")}>
          <i className="bi bi-person-check-fill"></i>Login
        </div>
        <div className="cursor-pointer" onClick={() => handleLogout()}>
          <i className="bi bi-person-dash-fill"></i>Logout
        </div>
        <div className="cursor-pointer" onClick={() => navigate("/newpost")}>
          <i className="bi bi-plus-square-fill "></i>NewPost
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
