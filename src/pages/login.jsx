import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router';
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function LoginPage() {

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt with:', formData);
    // In a real app, you would handle authentication here
       try {
      setEmail(formData.email);
      setPassword(formData.password);
      const res = await api.post("/auth/login", {email, password } );
      login(res.data.token);
       navigate("/dashboard") ;
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Visual Section */}
        <div className="visual-section">
          <div className="image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="Person working on laptop in a cozy, creative workspace with plants"
              className="login-image"
            />
            <div className="login-overlay">
              <h3>Create meaningful connections</h3>
              <p>Every message, every memory, every moment matters</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome back 👋</h1>
            <p className="login-subtitle">
              Log in to continue creating meaningful moments for your besties.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="forgot-password">
              <a  onClick={() => navigate("/forgot-password")} className="forgot-link">
                Forgot your password?
              </a>
            </div>

            <button type="submit" className="login-button">
              Log In
            </button>
          </form>

          <div className="signup-prompt">
            <p>
              Don't have an account?{' '}
              <a onClick={() => navigate("/signup")} className="signup-link">Sign up</a>
            </p>
          </div>

          <div className="security-note">
            <p>🔐 Your account security is important to us</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;