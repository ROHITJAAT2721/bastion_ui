import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="landing">
      <div className="particles"></div>
      <div className="wave-background"></div>
      
      <div className={`landing-content ${isLoaded ? 'loaded' : ''}`}>
        <div className="logo-section">
          <div className="logo-icon">
            <img src="/WhatsApp Image 2025-09-24 at 20.34.23 copy.png" alt="Bastion Protocol Logo" className="logo-image" />
          </div>
          <h1 className="logo">Bastion Protocol</h1>
          <p className="tagline">Decentralized Lending Reimagined</p>
        </div>
        
        <div className="description">
          <p>
            Experience the future of decentralized finance through our innovative 
            peer-to-peer lending platform combined with rotating savings and credit 
            associations (ROSCAs). Build trust, create opportunities, and grow together.
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">🤝</div>
            <h3>P2P Lending</h3>
            <p>Direct lending between peers with competitive rates</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔄</div>
            <h3>ROSCAs</h3>
            <p>Join or create rotating savings circles</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Secure Staking</h3>
            <p>Stake your assets and earn rewards</p>
          </div>
        </div>
        
        <Link to="/dashboard" className="cta-link">
          <button className="cta-button">
            Get Started
            <span className="button-arrow">→</span>
          </button>
        </Link>
      </div>
    </div>
    
    <footer className="landing-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Bastion Protocol</h4>
          <p>Decentralized Lending Reimagined</p>
        </div>
        <div className="footer-section">
          <h4>Resources</h4>
          <div className="footer-links">
            <a href="https://github.com/bastion-protocol/bastion" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>Documentation</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Whitepaper</a>
          </div>
        </div>
        <div className="footer-section">
          <h4>Community</h4>
          <div className="footer-links">
            <a href="#" onClick={(e) => e.preventDefault()}>Discord</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Twitter</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Telegram</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Bastion Protocol. All rights reserved.</p>
        <p>Built with ❤️ for decentralized finance</p>
      </div>
    </footer>
  );
};

export default Landing;