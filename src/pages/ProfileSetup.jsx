import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/ProfileSetup.css';

function ProfileSetup() {
  const [username, setUsername]         = useState("");
  const [bio, setBio]                   = useState("");
  const [avatarBase64, setAvatarBase64] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://linktree-backend-3ekq.onrender.com/api/user/me", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(r => r.json())
      .then(data => {
        if (data.username) navigate("/dashboard");
      });
  }, []);

  const compressFile = (file, maxWidth = 600) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = err => reject(err);
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
      
          const ratio = maxWidth / img.width;
          const w = maxWidth;
          const h = img.height * ratio;
        
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
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
      const compressedDataUrl = await compressFile(file);
      setAvatarBase64(compressedDataUrl);
    } catch (err) {
      console.error("Image compression failed", err);
      const fr = new FileReader();
      fr.onloadend = () => setAvatarBase64(fr.result);
      fr.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const res = await fetch("https://linktree-backend-3ekq.onrender.com/api/user/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:  "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        username,
        bio,
        profileImage: avatarBase64
      })
    });
    if (res.ok) navigate("/dashboard");
    else {
    if (data?.error?.toLowerCase().includes("username already exists")) {
      alert("Username already exists. Please choose a different one.");
    }
    else alert("Failed to save profile");
  }
  };

  return (
    <div className="setup-container">
      <h2>Set Up Your Profile</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <input
        placeholder="Bio"
        value={bio}
        onChange={e => setBio(e.target.value)}
      />

      <div className="avatar-upload">
        <label htmlFor="avatar">Choose Avatar:</label>
        <input
          type="file"
          id="avatar"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

    
      {avatarBase64 && (
        <div className="avatar-preview">
          <img src={avatarBase64} alt="Avatar Preview" />
        </div>
      )}

      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}

export default ProfileSetup;
