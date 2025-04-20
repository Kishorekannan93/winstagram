import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Suggested.css";
import defaultProfilePic from "./assets/dp.jpg"; // Import default image

function Suggested() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [suggestion, setSuggestion] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use Vite environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [profileRes, suggestionsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/users/me`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/api/users/suggested-users`, { 
            withCredentials: true 
          })
        ]);
        
        setProfile(profileRes.data);
        setSuggestion(suggestionsRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  const handleFollowToggle = async (id, username, isCurrentlyFollowed) => {
    try {
      setIsLoading(true);
      const endpoint = isCurrentlyFollowed ? "unfollow" : "follow";
      
      await axios.post(
        `${API_BASE_URL}/api/users/${endpoint}/${id}`,
        {},
        { withCredentials: true }
      );
      
      setFollowedUsers(prev => 
        isCurrentlyFollowed 
          ? prev.filter(userId => userId !== id) 
          : [...prev, id]
      );
      
      alert(`${username} ${isCurrentlyFollowed ? "unfollowed" : "followed"} successfully!`);
    } catch (err) {
      console.error("Follow error:", err);
      alert("Operation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFollowed = (id) => followedUsers.includes(id);

  if (isLoading && !profile) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="suggestion-container">
      {profile && (
        <div className="suggestion-profile">
          <div
            className="d-flex align-items-center profile-top"
            onClick={() => navigate("/profile")}
          >
            <img
              src={profile.profilePictureUrl || defaultProfilePic}
              alt="Profile"
              className="profile-pic12"
              onError={(e) => { e.target.src = defaultProfilePic }}
            />
            <div className="profile-info">
              <h5 className="username mb-0">{profile.username}</h5>
              <small className="text-primary switch-text">Switch</small>
            </div>
          </div>

          <div className="suggestions-header d-flex justify-content-between align-items-center">
            <h6 className="text-muted">Suggestions for you</h6>
            <b className="cursor-pointer">View All</b>
          </div>
        </div>
      )}

      <div className="suggested-users">
        {suggestion.length > 0 ? (
          suggestion.map((user) => (
            <div
              key={user.id}
              className="suggested-user d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center">
                <img
                  src={user.profilePictureUrl || defaultProfilePic}
                  alt="profile"
                  className="dpS rounded-circle"
                  onError={(e) => { e.target.src = defaultProfilePic }}
                />
                <h5 className="mb-0 ms-2">{user.username}</h5>
              </div>
              <button
                onClick={() => handleFollowToggle(user.id, user.username, isFollowed(user.id))}
                className={`follow-btn ${isFollowed(user.id) ? "following" : ""}`}
                disabled={isLoading}
              >
                {isFollowed(user.id) ? "Following" : "Follow"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-muted">No suggested users</p>
        )}
      </div>
    </div>
  );
}

export default Suggested;