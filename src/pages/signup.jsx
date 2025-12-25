import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';


function SignupPage() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
    const [passwordHints, setPasswordHints] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasNumber: false
  });

    const validatePassword = (password) => {
    setPasswordHints({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password)
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
      if (name === 'password') {
      validatePassword(value);
    }
  };
  const getPasswordStrength = () => {
    const { hasMinLength, hasUpperCase, hasNumber } = passwordHints;
    const metCount = [hasMinLength, hasUpperCase, hasNumber].filter(Boolean).length;
    
    if (metCount === 3) return 'strong';
    if (metCount === 2) return 'good';
    if (metCount === 1) return 'weak';
    return 'none';
  };
    const { login } = useAuth();
  const [getName, setName] = useState("");
  const [getEmail, setEmail] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getConfirm, setGetConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmail(formData.email);
    setName(formData.fullName);
    setPassword(formData.password)
    setGetConfirm(formData.confirmPassword)
    console.log(getPassword)
    console.log(getConfirm)
    // Basic validation
    if (getPassword !== getConfirm) {
      toast.error("Password didn't match !");
      return;
    }
    const res = await api.post("/auth/signup", {
      getName,
      getEmail,
      getPassword,
    });
    login(res.data.token);
    navigate("/dashboard");
    
    // In a real app, you would handle registration here
    toast.success("account created Successfully !")  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Sign Up Card */}
        <div className="signup-card">
          <div className="signup-header">
            <h1>Create your admin account ✨</h1>
            <p className="signup-subtitle">
              Start creating meaningful experiences for your besties in just a few steps.
            </p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">
                Full Name
                <span className="required"> *</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email Address
                <span className="required"> *</span>
              </label>
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
              <label htmlFor="password">
                Password
                <span className="required"> *</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a secure password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

                 {formData.password && (
                <div className="password-strength">
                  <div className="strength-meter">
                    <div 
                      className={`strength-bar ${getPasswordStrength()}`}
                      style={{ 
                        width: `${([passwordHints.hasMinLength, passwordHints.hasUpperCase, passwordHints.hasNumber].filter(Boolean).length / 3) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className={`strength-text ${getPasswordStrength()}`}>
                    {getPasswordStrength() === 'strong' && 'Strong password ✓'}
                    {getPasswordStrength() === 'good' && 'Good password'}
                    {getPasswordStrength() === 'weak' && 'Weak password'}
                    {getPasswordStrength() === 'none' && 'Very weak password'}
                  </span>
                </div>
              )}

              <div className="password-hints">
                <span className={`hint ${passwordHints.hasMinLength ? 'valid' : 'invalid'}`}>
                  {passwordHints.hasMinLength ? '✓' : '•'} At least 8 characters
                </span>
                <span className={`hint ${passwordHints.hasUpperCase ? 'valid' : 'invalid'}`}>
                  {passwordHints.hasUpperCase ? '✓' : '•'} One uppercase letter
                </span>
                <span className={`hint ${passwordHints.hasNumber ? 'valid' : 'invalid'}`}>
                  {passwordHints.hasNumber ? '✓' : '•'} One number
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password
                <span className="required"> *</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter your password"
                required
              />
            </div>

            <div className="terms-agreement">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
              />
              <label htmlFor="terms">
                I agree to the <a onClick={() =>navigate("/terms")} className="terms-link">Terms of Service</a> and <a onClick={() => navigate("/privacy")} className="terms-link">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="create-account-button">
              Create Account
            </button>
          </form>

          <div className="login-prompt">
            <p>
              Already have an account?{' '}
              <a onClick={() => navigate("/login")} className="login-link">Log in</a>
            </p>
          </div>

          <div className="benefits-section">
            <h3>Why join BestieSpace?</h3>
            <div className="benefits-grid">
              <div className="benefit">
                <span className="benefit-icon">🎁</span>
                <p>Create personalized experiences</p>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🔒</span>
                <p>Secure & private by design</p>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🚀</span>
                <p>Simple and intuitive dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Section */}
        <div className="visual-section">
          <div className="image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="Two friends smiling and writing in a journal together in a cozy setting"
              className="signup-image"
            />
            <div className="image-overlay">
              <div className="overlay-content">
                <h2>Every connection matters</h2>
                <p>Join thousands of admins creating special moments for their besties</p>
                <div className="testimonial">
                  <p>"BestieSpace made it so easy to create personalized birthday surprises for all my best friends!"</p>
                  <span className="testimonial-author">– Davie, Admin for 2 years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;