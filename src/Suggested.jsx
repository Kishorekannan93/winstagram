// Suggested.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Suggested.css";

function Suggested() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [suggestion, setSuggestion] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);

 
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users/me", { withCredentials: true })
      .then((res) => setProfile(res.data))
      .catch(console.error);

    axios
      .get("http://localhost:8080/api/users/suggested-users", {
        withCredentials: true,
      })
      .then((res) => setSuggestion(res.data))
      .catch(console.error);
  }, []);

  const handleFollowToggle = async (id, username, isCurrentlyFollowed) => {
    try {
      if (isCurrentlyFollowed) {
        await axios.post(
          `http://localhost:8080/api/users/unfollow/${id}`,
          {},
          { withCredentials: true }
        );
        setFollowedUsers((prev) => prev.filter((userId) => userId !== id));
        alert(`${username} unfollowed successfully!`);
      } else {
        await axios.post(
          `http://localhost:8080/api/users/follow/${id}`,
          {},
          { withCredentials: true }
        );
        setFollowedUsers((prev) => [...prev, id]);
        alert(`${username} followed successfully!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isFollowed = (id) => followedUsers.includes(id);

  return (
    <div className="suggestion-container">
      {profile && (
        <div className="suggestion-profile">
          <div
            className="d-flex align-items-center profile-top"
            onClick={() => navigate("/profile")}
          >
            <img
              src={profile.profilePictureUrl || "./src/assets/dp.jpg"}
              alt="Profile"
              className="profile-pic12"
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
                  src={user.profilePictureUrl || "./src/assets/dp.jpg"}
                  alt="profile"
                  className="dpS rounded-circle"
                />
                <h5 className="mb-0 ms-2">{user.username}</h5>
              </div>
              <button
                onClick={() =>
                  handleFollowToggle(
                    user.id,
                    user.username,
                    isFollowed(user.id)
                  )
                }
                className={`follow-btn ${
                  isFollowed(user.id) ? "following" : ""
                }`}
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
