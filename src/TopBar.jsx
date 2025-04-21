import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';
import defaultProfilePic from './assets/dp.jpg'; // Import default image

const TopBar = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://winstagram-back.onrender.com";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("Profile fetch error:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [API_BASE_URL]);

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
          <i 
            className="bi bi-house-door-fill text-white fs-5" 
            onClick={() => navigate('/')}
            role="button"
          ></i>
          <i 
            className="bi bi-plus-square-fill text-white fs-5" 
            onClick={() => navigate('/newpost')}
            role="button"
          ></i>
          <img
            src={profile?.profilePictureUrl || defaultProfilePic}
            alt="Profile"
            className="propicz"
            onClick={() => navigate('/profile')}
            onError={(e) => {
              e.target.src = defaultProfilePic;
            }}
            role="button"
          />
        </div>
      </div>

      {drawerOpen && (
        <div className="drawer d-md-none">
          <div className="text-end px-3 py-2">
            <i 
              className="bi bi-x-lg text-white fs-5" 
              onClick={toggleDrawer}
              role="button"
            ></i>
          </div>
          <div className="d-flex flex-column px-4 gap-3 text-white">
            <div 
              onClick={() => { navigate('/login'); toggleDrawer(); }}
              role="button"
            >
              Login
            </div>
            <div 
              onClick={() => { navigate('/register'); toggleDrawer(); }}
              role="button"
            >
              Register
            </div>
            <div 
              onClick={handleLogout}
              role="button"
            >
              Logout
            </div>
            <div 
              onClick={() => { navigate('/suggested'); toggleDrawer(); }}
              role="button"
            >
              Suggested Users
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;