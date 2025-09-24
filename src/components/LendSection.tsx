import React, { useState } from 'react';
import { AppState, Loan } from '../App';

interface LendSectionProps {
  appState: AppState;
  setAppState: (state: AppState | ((prev: AppState) => AppState)) => void;
  addTransaction: (type: 'stake' | 'lend' | 'borrow' | 'circle', amount: number) => void;
}

const LendSection: React.FC<LendSectionProps> = ({ appState, setAppState, addTransaction }) => {
  const [formData, setFormData] = useState({
    amount: '',
    interestRate: '5',
    duration: '30'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLend = async () => {
    const amount = parseFloat(formData.amount);
    const interestRate = parseFloat(formData.interestRate);
    const duration = parseInt(formData.duration);

    if (amount <= 0 || amount > appState.walletBalance || interestRate < 0 || duration <= 0) return;

    setIsProcessing(true);

    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newLoan: Loan = {
      id: Date.now().toString(),
      amount,
      interestRate,
      duration,
      status: 'active',
      type: 'lent'
    };

    setAppState(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - amount,
      loans: [...prev.loans, newLoan]
    }));

    addTransaction('lend', amount);
    setFormData({ amount: '', interestRate: '5', duration: '30' });
    setIsProcessing(false);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isValidForm = () => {
    const amount = parseFloat(formData.amount);
    const interestRate = parseFloat(formData.interestRate);
    const duration = parseInt(formData.duration);
    
    return amount > 0 && amount <= appState.walletBalance && 
           interestRate >= 0 && duration > 0;
  };

  const activeLentLoans = appState.loans.filter(loan => loan.type === 'lent' && loan.status === 'active');
  const totalLent = activeLentLoans.reduce((sum, loan) => sum + loan.amount, 0);

  return (
    <div className="section">
      <h2 className="section-title">Lend to Peers</h2>
      
      <div className="lending-overview">
        <div className="overview-stats">
          <div className="stat-card">
            <span className="stat-number">{activeLentLoans.length}</span>
            <span className="stat-label">Active Loans</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">${totalLent.toFixed(2)}</span>
            <span className="stat-label">Total Lent</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {activeLentLoans.length > 0 
                ? (activeLentLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / activeLentLoans.length).toFixed(1)
                : '0'}%
            </span>
            <span className="stat-label">Avg. Interest Rate</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Create New Loan</h3>
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="lendAmount">Loan Amount (USD)</label>
            <input
              id="lendAmount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="Enter amount to lend..."
              min="0"
              max={appState.walletBalance}
              disabled={isProcessing}
            />
            {formData.amount && parseFloat(formData.amount) > appState.walletBalance && (
              <span className="error-message">Insufficient balance</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="interestRate">Interest Rate (%)</label>
            <input
              id="interestRate"
              type="number"
              value={formData.interestRate}
              onChange={(e) => handleInputChange('interestRate', e.target.value)}
              placeholder="e.g., 5.5"
              min="0"
              step="0.1"
              disabled={isProcessing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (days)</label>
            <select
              id="duration"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              disabled={isProcessing}
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
            </select>
          </div>
        </div>

        {formData.amount && formData.interestRate && (
          <div className="loan-preview">
            <h4>Loan Preview</h4>
            <div className="preview-details">
              <div className="preview-item">
                <span>Principal:</span>
                <span>${parseFloat(formData.amount || '0').toFixed(2)}</span>
              </div>
              <div className="preview-item">
                <span>Expected Return:</span>
                <span>
                  $
                  {(parseFloat(formData.amount || '0') * 
                    (1 + parseFloat(formData.interestRate || '0') / 100 * parseInt(formData.duration || '0') / 365)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="preview-item">
                <span>Profit:</span>
                <span className="profit">
                  $
                  {(parseFloat(formData.amount || '0') * 
                    parseFloat(formData.interestRate || '0') / 100 * parseInt(formData.duration || '0') / 365
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLend}
          disabled={!isValidForm() || isProcessing}
          className={`action-button ${isProcessing ? 'loading' : ''}`}
        >
          {isProcessing ? (
            <>
              <div className="loading-spinner"></div>
              Processing Loan...
            </>
          ) : (
            'Create Loan'
          )}
        </button>

        {showSuccess && (
          <div className="success-animation">
            <div className="success-icon">✓</div>
            <span>Loan created successfully!</span>
          </div>
        )}
      </div>

      {activeLentLoans.length > 0 && (
        <div className="active-loans card">
          <h3>Your Active Loans</h3>
          <div className="loans-list">
            {activeLentLoans.map((loan, index) => (
              <div key={loan.id} className="loan-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="loan-info">
                  <div className="loan-amount">${loan.amount.toFixed(2)}</div>
                  <div className="loan-details">
                    <span>{loan.interestRate}% APR</span>
                    <span>{loan.duration} days</span>
                    <span className="loan-status">Active</span>
                  </div>
                </div>
                <div className="loan-actions">
                  <div className="expected-return">
                    Expected: $
                    {(loan.amount * (1 + loan.interestRate / 100 * loan.duration / 365)).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .lending-overview {
          margin-bottom: 30px;
        }

        .overview-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(255, 193, 7, 0.2);
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          color: #FFC107;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .form-group select {
          padding: 12px 16px;
          border: 2px solid #333;
          border-radius: 8px;
          background: #2A2A2A;
          color: white;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-group select:focus {
          outline: none;
          border-color: #FFC107;
          box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
        }

        .loan-preview {
          margin: 24px 0;
          padding: 20px;
          background: rgba(255, 193, 7, 0.05);
          border: 1px solid rgba(255, 193, 7, 0.2);
          border-radius: 12px;
          animation: slideInUp 0.5s ease-out;
        }

        .loan-preview h4 {
          margin-bottom: 16px;
          color: #FFC107;
        }

        .preview-details {
          display: grid;
          gap: 12px;
        }

        .preview-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.95rem;
        }

        .preview-item .profit {
          color: #4CAF50;
          font-weight: 600;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .active-loans {
          margin-top: 30px;
        }

        .active-loans h3 {
          margin-bottom: 20px;
          color: #FFC107;
        }

        .loans-list {
          display: grid;
          gap: 16px;
        }

        .loan-item {
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
          animation: slideInLeft 0.5s ease-out;
        }

        .loan-item:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 193, 7, 0.3);
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .loan-info .loan-amount {
          font-size: 1.3rem;
          font-weight: 700;
          color: #FFC107;
          margin-bottom: 8px;
        }

        .loan-details {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .loan-details span {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .loan-status {
          background: rgba(76, 175, 80, 0.2) !important;
          color: #4CAF50 !important;
        }

        .expected-return {
          font-size: 0.95rem;
          color: #4CAF50;
          font-weight: 600;
        }

        .error-message {
          color: #f44336;
          font-size: 0.85rem;
          margin-top: 4px;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .overview-stats {
            grid-template-columns: 1fr;
          }
          
          .loan-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .loan-details {
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default LendSection;