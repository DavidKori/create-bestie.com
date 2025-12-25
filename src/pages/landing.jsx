import React from 'react';
import { useNavigate } from 'react-router';
import './landings.css';

function LandingPage() {
    const navigate = useNavigate();
  return (
    <div className="app">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Create meaningful moments for your besties.</h1>
          <p className="hero-subtext">
            BestieSpace lets you create personalized messages, memories, and experiences for the people who matter most — all in one simple place.
          </p>
          <div className="hero-buttons">
            <a  onClick={() => navigate("/login") } className="btn btn-primary">Login</a>
            <a  onClick={() => navigate("/signup") } className="btn btn-secondary">Sign Up</a>
          </div>
        </div>
      </section>

      {/* Visual Section */}
      <section className="visual-section">
        <div className="container">
          <div className="image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80" 
              alt="Two friends smiling and sharing a happy moment together"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">📝</div>
              <h3>Step 1: Create an account</h3>
              <p>Sign up as an admin and get access to your personal dashboard.</p>
            </div>
            
            <div className="step-card">
              <div className="step-icon">👥</div>
              <h3>Step 2: Create your besties</h3>
              <p>Add one or many besties and decide exactly what each one will see.</p>
            </div>
            
            <div className="step-card">
              <div className="step-icon">✨</div>
              <h3>Step 3: Publish personalized content</h3>
              <p>Write messages, add images, and publish content uniquely for each bestie.</p>
            </div>
            
            <div className="step-card">
              <div className="step-icon">🔑</div>
              <h3>Step 4: They view using a unique code</h3>
              <p>Your bestie enters their unique identifier and sees content made just for them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to create something special?</h2>
          <div className="cta-buttons">
            <a href="/login" className="btn btn-primary btn-large">Login</a>
            <a href="/signup" className="btn btn-secondary btn-large">Sign Up</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>BestieSpace — Built for meaningful connections.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;