import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import axios from 'axios';
import './Profile.css';
import defaultProfilePic from './assets/dp.jpg'; // Import default image

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('followers');
  const [refreshProfile, setRefreshProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Use Vite environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/users/me`, { 
          withCredentials: true 
        });
        setProfile(response.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [refreshProfile, API_BASE_URL]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.put(
        `${API_BASE_URL}/api/users/update`, 
        formData, 
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      setProfile(response.data);
      setRefreshProfile(prev => !prev);
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Profile update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/post/delete/${postId}`, {
        withCredentials: true
      });
      setProfile(prev => ({
        ...prev,
        posts: prev.posts.filter(post => post.id !== postId)
      }));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete the post");
    }
  };

  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleUnfollow = async (userId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/users/unfollow/${userId}`, 
        {}, 
        { withCredentials: true }
      );
      setProfile(prev => ({
        ...prev,
        following: prev.following.filter(user => user.id !== userId)
      }));
    } catch (err) {
      console.error("Unfollow error:", err);
    }
  };

  if (isLoading && !profile) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!profile) {
    return <div className="error-message">Failed to load profile</div>;
  }

  const { username, profilePictureUrl, followers = [], following = [], posts = [] } = profile;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-pic-wrapper">
          <img
            src={profilePictureUrl || defaultProfilePic}
            alt="Profile"
            className="profile-pic"
            onError={(e) => { e.target.src = defaultProfilePic }}
          />
          <label htmlFor="profile-upload" className="edit-icon">
            <FaPen />
          </label>
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleProfilePicChange}
            disabled={isLoading}
          />
        </div>
        <div className="profile-info">
          <h2>{username}</h2>
          <ul className="profile-stats">
            <li><strong>{posts.length}</strong> Posts</li>
            <li 
              onClick={() => { setShowModal(true); setModalType('followers'); }} 
              style={{ cursor: 'pointer' }}
            >
              <strong>{followers.length}</strong> Followers
            </li>
            <li 
              onClick={() => { setShowModal(true); setModalType('following'); }} 
              style={{ cursor: 'pointer' }}
            >
              <strong>{following.length}</strong> Following
            </li>
          </ul>
        </div>
      </div>

      <div className="posts-grid">
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet</p>
        ) : (
          posts.map(post => (
            <div className="post-card" key={post.id}>
              <img
                src={post.imageUrl}
                alt="Post"
                className="post-image"
                onClick={() => navigate(`/post/${post.id}`)}
                onError={(e) => { 
                  e.target.src = "https://via.placeholder.com/300x300?text=Post+Image" 
                }}
              />
              <div className="post-buttons">
                <button 
                  onClick={() => handleEdit(post.id)} 
                  className="edit-btn"
                  disabled={isLoading}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(post.id)} 
                  className="delete-btn"
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{modalType === 'followers' ? 'Followers' : 'Following'}</h3>
            <ul className="user-list">
              {(modalType === 'followers' ? followers : following).map(user => (
                <li key={user.id} className="user-item">
                  <img 
                    src={user.profilePictureUrl || defaultProfilePic} 
                    alt="User" 
                    onError={(e) => { e.target.src = defaultProfilePic }}
                  />
                  <span>{user.username}</span>
                  {modalType === 'following' && (
                    <button 
                      onClick={() => handleUnfollow(user.id)} 
                      className="unfollow-btn"
                      disabled={isLoading}
                    >
                      Unfollow
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;