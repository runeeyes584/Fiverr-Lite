import { RedirectToSignIn, useUser } from '@clerk/clerk-react';
import React, { useState } from 'react';
import { FaEdit, FaEnvelope, FaGlobe, FaStore, FaUser, FaUserTag } from 'react-icons/fa';
import "./Profile.scss";

export default function Profile() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  if (!isLoaded) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-container">
            <img 
              className="profile-avatar" 
              src={user.imageUrl || 'https://www.w3schools.com/w3images/avatar2.png'} 
              alt="User Avatar" 
            />
            <div className="avatar-overlay">
              <FaEdit className="edit-icon" />
            </div>
          </div>
          <div className="profile-title">
            <h1>{user.fullName}</h1>
            <p className="username">@{user.username}</p>
            {user.publicMetadata?.isSeller && (
              <div className="seller-badge">
                <FaStore /> Seller
              </div>
            )}
            {user.publicMetadata?.isAdmin && (
              <div className="seller-badge">
                <FaStore /> Admin
              </div>
            )}
          </div>
        </div>
        
        <div className="profile-content">
          <div className="profile-section">
            <h2>Thông tin cá nhân</h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <FaUser />
                </div>
                <div className="info-content">
                  <span className="info-label">Họ và tên</span>
                  <span className="info-value">{user.fullName}</span>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <div className="info-content">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.primaryEmailAddress?.emailAddress}</span>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FaUserTag />
                </div>
                <div className="info-content">
                  <span className="info-label">Tên người dùng</span>
                  <span className="info-value">{user.username}</span>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FaGlobe />
                </div>
                <div className="info-content">
                  <span className="info-label">Quốc gia</span>
                  <span className="info-value">{user.publicMetadata?.country || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              <FaEdit /> Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}