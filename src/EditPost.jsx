import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditPost.css";

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/post/${postId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setPost(res.data);
        setCaption(res.data.caption);
        setPreviewImage(res.data.imageUrl);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load post");
      });
  }, [postId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdate = () => {
    const formData = new FormData();

    const postRequest = {
      content: caption,
    };

    formData.append("postRequest", JSON.stringify(postRequest));
    if (image) {
      formData.append("file", image);
    }

    axios
      .put(`http://localhost:8080/api/post/update/${postId}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Post updated!");
        navigate("/profile");
      })
      .catch((err) => {
        console.error(err);
        alert("Update failed");
      });
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="edit-post-container">
      <h2>Edit Post</h2>

      <div className="form-group">
        <label>Caption</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows="3"
        />
        <p className="fs-6 text-mutted">
          *can't update only caption please update with img.
        </p>
      </div>

      <div className="form-group">
        <label>Post Image</label>
        <input type="file" onChange={handleImageChange} />
        {previewImage && (
          <img src={previewImage} alt="Preview" className="preview-image" />
        )}
      </div>

      <button className="update-btn" onClick={handleUpdate}>
        Update Post
      </button>
    </div>
  );
};

export default EditPost;
