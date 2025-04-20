import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('followers');
  const [refreshProfile, setRefreshProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/users/me', { withCredentials: true })
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, [refreshProfile]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file); 
  
    axios
      .put("http://localhost:8080/api/users/update", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => setProfile(res.data))
      .then(() => setRefreshProfile(prev => !prev))
      .catch((err) => {
        console.log(err);
        alert("Profile update failed");
      });
  };
  
  const handleDelete = (postId) => {
    axios.delete(`http://localhost:8080/api/post/delete/${postId}`, {
      withCredentials: true
    })
    .then(() => {
      setProfile(prev => ({
        ...prev,
        posts: prev.posts.filter(post => post.id !== postId)
      }));
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to delete the post");
    });
  };
  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };
  
  
  

  const handleUnfollow = (userId) => {
    axios.post(`http://localhost:8080/api/users/unfollow/${userId}`, {}, { withCredentials: true })
      .then(() => {
        setProfile(prev => ({
          ...prev,
          following: prev.following.filter(user => user.id !== userId)
        }));
      });
  };

  if (!profile) return <p className="loading">Loading...</p>;

  const { username, profilePictureUrl, followers = [], following = [], posts = [] } = profile;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-pic-wrapper">
          <img
            src={profilePictureUrl || "./src/assets/dp.jpg"}
            alt="Profile"
            className="profile-pic"
          />
          <label htmlFor="profile-upload" className="edit-icon">
            <FaPen />
          </label>
          <input
            type="file"
            id="profile-upload"
            style={{ display: 'none' }}
            onChange={handleProfilePicChange}
          />
        </div>
        <div className="profile-info">
          <h2>{username}</h2>
          <ul className="profile-stats">
            <li><strong>{posts.length}</strong> Posts</li>
            <li onClick={() => { setShowModal(true); setModalType('followers'); }} style={{ cursor: 'pointer' }}>
              <strong>{followers.length}</strong> Followers
            </li>
            <li onClick={() => { setShowModal(true); setModalType('following'); }} style={{ cursor: 'pointer' }}>
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
              />
              <div className="post-buttons">
                <button onClick={()=>handleEdit(post.id)} className="edit-btn">Edit</button>
                <button onClick={()=>handleDelete(post.id)} className="delete-btn">Delete</button>
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
                  <img src={user.profilePictureUrl || "./src/assets/dp.jpg"} alt="User" />
                  <span>{user.username}</span>
                  {modalType === 'following' && (
                    <button onClick={() => handleUnfollow(user.id)} className="unfollow-btn">
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
