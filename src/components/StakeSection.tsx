import React, { useState } from 'react';
import { AppState } from '../App';

interface StakeSectionProps {
  appState: AppState;
  setAppState: (state: AppState | ((prev: AppState) => AppState)) => void;
  addTransaction: (type: 'stake' | 'lend' | 'borrow' | 'circle', amount: number) => void;
}

const StakeSection: React.FC<StakeSectionProps> = ({ appState, setAppState, addTransaction }) => {
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [isStaking, setIsStaking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleStake = async () => {
    const amount = parseFloat(stakeAmount);
    
    if (amount <= 0 || amount > appState.walletBalance) return;
    
    setIsStaking(true);
    
    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAppState(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - amount,
      stakedAmount: prev.stakedAmount + amount
    }));
    
    addTransaction('stake', amount);
    setStakeAmount('');
    setIsStaking(false);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleUnstake = async () => {
    if (appState.stakedAmount === 0) return;
    
    setIsStaking(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAppState(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + prev.stakedAmount,
      stakedAmount: 0
    }));
    
    setIsStaking(false);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isValidAmount = () => {
    const amount = parseFloat(stakeAmount);
    return amount > 0 && amount <= appState.walletBalance;
  };

  return (
    <div className="section">
      <h2 className="section-title">Stake Your Assets</h2>
      
      <div className="card">
        <div className="stake-info">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Available to Stake</span>
              <span className="info-value">${appState.walletBalance.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Currently Staked</span>
              <span className="info-value">${appState.stakedAmount.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Estimated APY</span>
              <span className="info-value">8.5%</span>
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="stakeAmount">Amount to Stake (USD)</label>
            <input
              id="stakeAmount"
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Enter amount..."
              min="0"
              max={appState.walletBalance}
              disabled={isStaking}
            />
            {stakeAmount && !isValidAmount() && (
              <span className="error-message">
                {parseFloat(stakeAmount) > appState.walletBalance 
                  ? 'Insufficient balance' 
                  : 'Please enter a valid amount'}
              </span>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <button
            onClick={handleStake}
            disabled={!isValidAmount() || isStaking}
            className={`action-button ${isStaking ? 'loading' : ''}`}
          >
            {isStaking ? (
              <>
                <div className="loading-spinner"></div>
                Processing...
              </>
            ) : (
              'Stake Tokens'
            )}
          </button>

          {appState.stakedAmount > 0 && (
            <button
              onClick={handleUnstake}
              disabled={isStaking}
              className="action-button secondary"
            >
              Unstake All (${appState.stakedAmount.toFixed(2)})
            </button>
          )}
        </div>

        {showSuccess && (
          <div className="success-animation">
            <div className="success-icon">✓</div>
            <span>Transaction successful!</span>
          </div>
        )}
      </div>

      <div className="staking-benefits card">
        <h3>Staking Benefits</h3>
        <ul className="benefits-list">
          <li>
            <span className="benefit-icon">💰</span>
            Earn 8.5% APY on your staked tokens
          </li>
          <li>
            <span className="benefit-icon">🗳️</span>
            Participate in protocol governance
          </li>
          <li>
            <span className="benefit-icon">🛡️</span>
            Help secure the network and earn rewards
          </li>
          <li>
            <span className="benefit-icon">⚡</span>
            Flexible unstaking with no lock-up period
          </li>
        </ul>
      </div>

      <style jsx>{`
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .info-item {
          text-align: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .info-label {
          display: block;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }

        .info-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFC107;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .action-button.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }

        .action-button.secondary:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .action-button.loading {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(30, 30, 30, 0.3);
          border-top: 2px solid #1E1E1E;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .success-animation {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
          padding: 16px;
          background: rgba(76, 175, 80, 0.2);
          border: 1px solid rgba(76, 175, 80, 0.4);
          border-radius: 8px;
          color: #4CAF50;
          animation: slideIn 0.5s ease-out;
        }

        .success-icon {
          width: 24px;
          height: 24px;
          background: #4CAF50;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          animation: checkmark 0.5s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes checkmark {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        .staking-benefits {
          margin-top: 30px;
        }

        .staking-benefits h3 {
          margin-bottom: 20px;
          color: #FFC107;
        }

        .benefits-list {
          list-style: none;
          display: grid;
          gap: 16px;
        }

        .benefits-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .benefit-icon {
          font-size: 1.2rem;
        }

        .error-message {
          color: #f44336;
          font-size: 0.85rem;
          margin-top: 4px;
        }

        @media (max-width: 768px) {
          .info-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default StakeSection;