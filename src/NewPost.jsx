import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditPost.css";

const NewPost = () => {
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
   // Use Vite environment variables
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSumbit = () => {
    const formData = new FormData();

    const postRequest = {
      content: caption,
    };

    formData.append("postRequest", JSON.stringify(postRequest));
    if (image) {
      formData.append("file", image);
    }

    axios
      .post(`${API_BASE_URL}/api/post/create`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Post created!");
        navigate("/profile");
      })
      .catch((err) => {
        console.error(err);
        alert("post failed");
      });
  };

  return (
    <div className="edit-post-container">
      <h2 className="text-success mb-3 m">New Post</h2>

      <div className="form-group">
        <label>Caption</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows="3"
        />
        <p className="fs-6 text-mutted">
          *can't upload only caption please upload with img.
        </p>
      </div>

      <div className="form-group">
        <label>Post Image</label>
        <input type="file" onChange={handleImageChange} />
        {previewImage && (
          <img src={previewImage} alt="Preview" className="preview-image" />
        )}
      </div>

      <button className="update-btn" onClick={handleSumbit}>
        submit
      </button>
    </div>
  );
};

export default NewPost;
