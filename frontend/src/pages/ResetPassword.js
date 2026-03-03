import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const validatePasswordStrength = (password) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return "Password must contain at least one special character";
  }
  return null;
};

const ResetPassword = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    // Validate password strength
    const passwordError = validatePasswordStrength(newPassword);
    if (passwordError) {
      setMsg(passwordError);
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/password-reset-confirm/`, {
        uid,
        token,
        new_password: newPassword,
      });
      setMsg('Password reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 5000);
    } catch {
      setMsg('Failed to reset password. The link may have expired.');
    }
  };

  return (
    <>
    <Navbar/>
    <div style={{ height: '50px' }}></div>
    <div>
      <h2>Reset Password</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          New Password:
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Set New Password</button>
      </form>
    </div>
    <div style={{ height: '100px' }}></div>
    <Footer/>
    </>
  );
};

export default ResetPassword;
