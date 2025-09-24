import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppState, Loan, Circle } from '../App';
import StakeSection from './StakeSection';
import LendSection from './LendSection';
import BorrowSection from './BorrowSection';
import CirclesSection from './CirclesSection';
import './Dashboard.css';

interface DashboardProps {
  appState: AppState;
  setAppState: (state: AppState | ((prev: AppState) => AppState)) => void;
}

type ActiveTab = 'stake' | 'lend' | 'borrow' | 'circles';

const Dashboard: React.FC<DashboardProps> = ({ appState, setAppState }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('stake');

  const addTransaction = (type: 'stake' | 'lend' | 'borrow' | 'circle', amount: number) => {
    setAppState(prev => ({
      ...prev,
      transactions: [
        {
          id: Date.now().toString(),
          type,
          amount,
          timestamp: new Date()
        },
        ...prev.transactions
      ].slice(0, 10) // Keep only last 10 transactions
    }));
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'stake':
        return (
          <StakeSection 
            appState={appState} 
            setAppState={setAppState}
            addTransaction={addTransaction}
          />
        );
      case 'lend':
        return (
          <LendSection 
            appState={appState} 
            setAppState={setAppState}
            addTransaction={addTransaction}
          />
        );
      case 'borrow':
        return (
          <BorrowSection 
            appState={appState} 
            setAppState={setAppState}
            addTransaction={addTransaction}
          />
        );
      case 'circles':
        return (
          <CirclesSection 
            appState={appState} 
            setAppState={setAppState}
            addTransaction={addTransaction}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="dashboard">
      <header className="dashboard-header">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
        <div className="header-logo">
          <img src="/WhatsApp Image 2025-09-24 at 20.34.23 copy.png" alt="Bastion Protocol Logo" className="header-logo-image" />
          <h1>Bastion Protocol</h1>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="wallet-overview">
          <div className="wallet-card card">
            <h2>Your Wallet</h2>
            <div className="balance-display">
              <span className="balance-amount">${appState.walletBalance.toFixed(2)}</span>
              <span className="balance-label">Available Balance</span>
            </div>
            
            <div className="wallet-stats">
              <div className="stat">
                <span className="stat-value">${appState.stakedAmount.toFixed(2)}</span>
                <span className="stat-label">Staked</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  {appState.loans.filter(l => l.type === 'lent').length}
                </span>
                <span className="stat-label">Loans Given</span>
              </div>
              <div className="stat">
                <span className="stat-value">{appState.circles.length}</span>
                <span className="stat-label">Active Circles</span>
              </div>
            </div>
          </div>

          {appState.transactions.length > 0 && (
            <div className="transactions-card card">
              <h3>Recent Activity</h3>
              <div className="transactions-list">
                {appState.transactions.slice(0, 5).map(tx => (
                  <div key={tx.id} className="transaction-item">
                    <div className="transaction-type">
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </div>
                    <div className="transaction-amount">${tx.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="main-content">
          <nav className="tab-nav">
            {(['stake', 'lend', 'borrow', 'circles'] as ActiveTab[]).map(tab => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          <div className="tab-content">
            {renderActiveSection()}
          </div>
        </div>
      </div>
      </div>
      
      <footer className="dashboard-footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo">
            <img src="/WhatsApp Image 2025-09-24 at 20.34.23 copy.png" alt="Bastion Protocol Logo" className="footer-logo-image" />
            <span>Bastion Protocol</span>
          </div>
          <p>Decentralized Lending Reimagined</p>
        </div>
        <div className="footer-right">
          <div className="footer-links">
            <a href="https://github.com/bastion-protocol/bastion" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>Documentation</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Community</a>
          </div>
          <p className="footer-copyright">&copy; 2025 Bastion Protocol</p>
        </div>
      </div>
      </footer>
    </>
  );
};

export default Dashboard;