import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [editingLink, setEditingLink] = useState(null);

  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editProfileImage, setEditProfileImage] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchData = async () => {
    const res = await fetch("${BACKEND_URL}/api/user/me", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    });
    const data = await res.json();
    setUser(data);
    setEditUsername(data.username || "");
    setEditBio(data.bio || "");
    setEditProfileImage(data.profileImage || "");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addLink = async () => {
    const res = await fetch("${BACKEND_URL}/api/user/me/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({ title, url })
    });
    const links = await res.json();
    setUser({ ...user, links });
    setTitle(""); setUrl("");
  };

  const deleteLink = async (id) => {
    const res = await fetch(`${BACKEND_URL}/api/user/me/links/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });
    const links = await res.json();
    setUser({ ...user, links });
  };

  const updateLink = async () => {
    const res = await fetch(`${BACKEND_URL}/api/user/me/links/${editingLink._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({ title, url })
    });
    const links = await res.json();
    setUser({ ...user, links });
    setTitle(""); setUrl(""); setEditingLink(null);
  };

  const startEditing = (link) => {
    setEditingLink(link);
    setTitle(link.title);
    setUrl(link.url);
  };

  const compressFile = (file, maxWidth = 600) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = err => reject(err);
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const ratio = maxWidth / img.width;
          const canvas = document.createElement("canvas");
          canvas.width = maxWidth;
          canvas.height = img.height * ratio;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };
        img.onerror = err => reject(err);
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await compressFile(file);
      setEditProfileImage(compressed);
    } catch (err) {
      console.error("Compression failed", err);
      const reader = new FileReader();
      reader.onloadend = () => setEditProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    const res = await fetch("${BACKEND_URL}/api/user/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        username: editUsername,
        bio: editBio,
        profileImage: editProfileImage
      })
    });
    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      setEditingProfile(false);
      alert("Profile updated");
    } else {
      alert("Failed to update profile");
    }
  };

  const handleCopyLink = () => {
    const publicLink = `https://linktree-frontend-one.vercel.app/${user.username}`;
    navigator.clipboard.writeText(publicLink).then(() => {
      alert("Public link copied to clipboard!");
    });
  };

  const handleProfileReset = async () => {
    const res = await fetch("${BACKEND_URL}/api/user/me/reset", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });
    if (res.ok) {
      setEditUsername(""); setEditBio(""); setEditProfileImage("");
      setUser(null);
      alert("Profile cleared");
    } else {
      alert("Failed to reset profile");
    }
  };

  return (
    <div>
      <div className="navbar">
        <h2>Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="container">
        {user && (
          <>
            {!editingProfile ? (
              <div className="profile">
                <img src={user.profileImage} alt="avatar" />
                <p className="username">@{user.username}</p>
                <p className="bio">{user.bio}</p>
                <button onClick={() => setEditingProfile(true)}>Edit Profile</button>
                <div style={{ marginTop: "12px" }}>
                  <a
                    href={`https://linktree-frontend-one.vercel.app/${user.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="public-link"
                  >
                    🔗 View Public Page
                  </a>
                  <button className="copy-link" onClick={handleCopyLink}>
                    📋 Copy Link
                  </button>
                </div>
              </div>
            ) : (
              <div className="link-form">
                <h3>Edit Profile</h3>
                <input
                  placeholder="Username"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                />
                <input
                  placeholder="Bio"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                />
                <div className="avatar-upload">
                  <label>Profile Image</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                {editProfileImage && (
                  <div className="avatar-preview">
                    <img
                      src={editProfileImage}
                      alt="Preview"
                      style={{ width: "100px", borderRadius: "8px", marginTop: "8px" }}
                    />
                  </div>
                )}
                <button onClick={handleProfileUpdate}>Update Profile</button>
                <button
                  onClick={handleProfileReset}
                  style={{ backgroundColor: "#ef4444", color: "#fff", marginTop: "8px" }}
                >
                  Reset Profile
                </button>
                <button onClick={() => setEditingProfile(false)} style={{ marginTop: "8px" }}>
                  Cancel
                </button>
              </div>
            )}

            {!editingProfile && (
              <>
                <div className="link-form">
                  <h3>{editingLink ? "Edit Link" : "Add New Link"}</h3>
                  <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
                  {editingLink ? (
                    <button onClick={updateLink}>Update Link</button>
                  ) : (
                    <button onClick={addLink}>Add Link</button>
                  )}
                </div>

                <div className="links-section">
                  <h3>Your Links</h3>
                  {user.links.map(link => (
                    <div className="link-card" key={link._id}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
                      <div className="link-buttons">
                        <button onClick={() => startEditing(link)}>Edit</button>
                        <button onClick={() => deleteLink(link._id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
