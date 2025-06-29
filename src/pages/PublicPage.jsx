import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../index.css"
function PublicPage() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/profile/` + username)
      .then(res => res.json())
      .then(setUser);
  }, [username]);

return (
  <div className="public-container">
    {user ? (
      <>
        <img src={user.profileImage} alt="avatar" />
        <h2>@{user.username}</h2>
        <p>{user.bio}</p>
        <div className="public-links">
          {user.links.map(link => (
            <div className="link-card" key={link._id}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
            </div>
          ))}
        </div>
      </>
    ) : (
      <p>Loading...</p>
    )}
  </div>
);
}

export default PublicPage;
