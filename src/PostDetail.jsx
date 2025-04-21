import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PostDetail.css'; // Optional, only if you style this page

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://winstagram-back.onrender.com";

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/post/${postId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(setPost)
      .catch(err => console.error(err));
  }, [postId]);

  if (!post) return <p className="loading">Loading...</p>;

  return (
    <div className="post-detail">
      <img src={post.imageUrl} alt="Post" />
      <div className="post-info">
        <h3>{post.content}</h3>
        {/* You can add comments, likes, etc. here */}
      </div>
    </div>
  );
};

export default PostDetail;
