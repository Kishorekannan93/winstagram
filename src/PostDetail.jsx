import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PostDetail.css'; // Optional, only if you style this page

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/post/${postId}`, {
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
