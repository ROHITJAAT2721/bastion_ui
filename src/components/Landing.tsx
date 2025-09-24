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
  );
};

export default Landing;