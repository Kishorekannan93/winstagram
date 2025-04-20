import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/post/posts", {
        withCredentials: true,
      })
      .then((res) => setPosts(res.data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false)); 
  }, []);

  const truncateMessage = (msg, maxLength = 30) => {
    if (!msg) return "";
    return msg.length > maxLength ? msg.slice(0, maxLength) + "..." : msg;
  };

  return (
    <div className="d-flex container align-items-center flex-column mt-2 vh-100">
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      
      {loading ? (
        <p className="my-5">Loading...</p>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="edit"
            onClick={() => navigate(`/post/${post.id}`)}
          >
            <div className="d-flex align-items-center mb-3">
              <img
                src={post.user.profilePictureUrl || "./src/assets/dp.jpg"}
                className="dp rounded-circle"
                alt="profilepic"
              />
              <h5 className="mx-2 username">{post.user.username}</h5>
            </div>
            <div>
              <img src={post.imageUrl} className="post mb-2" alt="post" />
              <div className="caption-box">
                <p className="caption-label text-success mb-0">Caption:</p>
                <p>{truncateMessage(post.content || "")}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="my-5">No posts...</p>
      )}
    </div>
  );
};

export default Feed;
