import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopBar.css'; 

const TopBar = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profile,setProfile] = useState([])

  useEffect(() => {
    fetch('http://localhost:8080/api/users/me', {
        credentials: 'include'

    })
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.log(err.message));
  }, []);
  

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/register");
    setDrawerOpen(false);
  };

  return (
    <>
      <div className="topbar d-md-none d-flex justify-content-between align-items-center px-3">
        <div className="icon fs-4" onClick={toggleDrawer}>
          <i className="bi bi-list text-white"></i>
        </div>
        <div>
        <b className='fs-2 t text-white'>𝓌𝒾𝓃𝓈𝓉𝒶𝑔𝓇𝒶𝓂</b>
        </div>
        <div className="d-flex gap-3">
          <i className="bi bi-house-door-fill text-white fs-5" onClick={() => navigate('/')}></i>
          <i className="bi bi-plus-square-fill text-white fs-5" onClick={() => navigate('/newpost')}></i>
          <img
            src={profile.profilePictureUrl ||"./src/assets/dp.jpg" }
            alt="Profile"
            className="propicz"
            onClick={() => navigate('/profile')}
            />


        </div>
      </div>

      {drawerOpen && (
        <div className="drawer d-md-none">
          <div className="text-end px-3 py-2">
            <i className="bi bi-x-lg text-white fs-5" onClick={toggleDrawer}></i>
          </div>
          <div className="d-flex flex-column  px-4 gap-3 text-white">
            <div onClick={() => { navigate('/login'); toggleDrawer(); }}>Login</div>
            <div onClick={() => { navigate('/register'); toggleDrawer(); }}>Register</div>
            <div onClick={handleLogout}>Logout</div>
            <div onClick={() => { navigate('/suggested'); toggleDrawer(); }}>Suggested Users</div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;
