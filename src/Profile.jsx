import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/post/posts`, {
          withCredentials: true,
        });
        setPosts(response.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [API_BASE_URL]);

  const truncateMessage = (msg, maxLength = 30) => {
    if (!msg) return "No caption";
    return msg.length > maxLength ? msg.slice(0, maxLength) + "..." : msg;
  };

  return (
    <div className="d-flex container align-items-center flex-column mt-2 vh-100">
      {error && (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      )}
      
      {loading ? (
        <div className="spinner-border my-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="edit"
            onClick={() => navigate(`/post/${post.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center mb-3">
              <img
                src={post.user?.profilePictureUrl}
                className="dp rounded-circle"
                alt={`${post.user?.username || 'User'}'s profile`}
                onError={(e) => {
                  e.target.src = dp;
                }}
              />
              <h5 className="mx-2 username">{post.user?.username || "Unknown"}</h5>
            </div>
            <div>
              <img 
                src={post.imageUrl} 
                className="post mb-2" 
                alt="Post content" 
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/500x500?text=Image+Not+Available";
                }}
              />
              <div className="caption-box">
                <p className="caption-label text-success mb-0">Caption:</p>
                <p>{truncateMessage(post.content)}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="my-5">No posts available yet</p>
      )}
    </div>
  );
};

export default Profile;
