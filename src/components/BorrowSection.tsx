import React, { useState } from 'react';
import { AppState, Loan } from '../App';

interface BorrowSectionProps {
  appState: AppState;
  setAppState: (state: AppState | ((prev: AppState) => AppState)) => void;
  addTransaction: (type: 'stake' | 'lend' | 'borrow' | 'circle', amount: number) => void;
}

const BorrowSection: React.FC<BorrowSectionProps> = ({ appState, setAppState, addTransaction }) => {
  const [formData, setFormData] = useState({
    amount: '',
    collateral: '',
    purpose: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBorrow = async () => {
    const amount = parseFloat(formData.amount);
    const collateral = parseFloat(formData.collateral);

    if (amount <= 0 || collateral <= 0 || collateral < amount * 1.5) return;

    setIsProcessing(true);

    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    const newLoan: Loan = {
      id: Date.now().toString(),
      amount,
      interestRate: 6.5, // Fixed rate for borrowing
      duration: 30,
      status: 'active',
      type: 'borrowed'
    };

    setAppState(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount - collateral, // Add borrowed amount, subtract collateral
      loans: [...prev.loans, newLoan]
    }));

    addTransaction('borrow', amount);
    setFormData({ amount: '', collateral: '', purpose: '' });
    setIsProcessing(false);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isValidForm = () => {
    const amount = parseFloat(formData.amount);
    const collateral = parseFloat(formData.collateral);
    
    return amount > 0 && collateral > 0 && collateral >= amount * 1.5 && formData.purpose.trim().length > 0;
  };

  const activeBorrowedLoans = appState.loans.filter(loan => loan.type === 'borrowed' && loan.status === 'active');
  const totalBorrowed = activeBorrowedLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalCollateral = activeBorrowedLoans.length * 1500; // Simplified calculation

  // Mock available loans from other users
  const availableLoans = [
    { id: '1', amount: 500, interestRate: 5.5, duration: 30, lender: 'Alice', reputation: 4.8 },
    { id: '2', amount: 1000, interestRate: 6.0, duration: 45, lender: 'Bob', reputation: 4.9 },
    { id: '3', amount: 750, interestRate: 5.8, duration: 60, lender: 'Charlie', reputation: 4.7 },
    { id: '4', amount: 2000, interestRate: 6.2, duration: 90, lender: 'Diana', reputation: 5.0 },
  ];

  return (
    <div className="section">
      <h2 className="section-title">Borrow from Peers</h2>
      
      <div className="borrow-overview">
        <div className="overview-stats">
          <div className="stat-card">
            <span className="stat-number">{activeBorrowedLoans.length}</span>
            <span className="stat-label">Active Loans</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">${totalBorrowed.toFixed(2)}</span>
            <span className="stat-label">Total Borrowed</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">${totalCollateral.toFixed(2)}</span>
            <span className="stat-label">Collateral Locked</span>
          </div>
        </div>
      </div>

      <div className="section-tabs">
        <div className="tab-content">
          <div className="card">
            <h3>Request a Loan</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="borrowAmount">Loan Amount (USD)</label>
                <input
                  id="borrowAmount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="Enter amount needed..."
                  min="0"
                  disabled={isProcessing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="collateralAmount">Collateral (USD)</label>
                <input
                  id="collateralAmount"
                  type="number"
                  value={formData.collateral}
                  onChange={(e) => handleInputChange('collateral', e.target.value)}
                  placeholder="Minimum 150% of loan amount"
                  min="0"
                  disabled={isProcessing}
                />
                {formData.amount && formData.collateral && 
                 parseFloat(formData.collateral) < parseFloat(formData.amount) * 1.5 && (
                  <span className="error-message">
                    Collateral must be at least 150% of loan amount (${(parseFloat(formData.amount) * 1.5).toFixed(2)})
                  </span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="purpose">Loan Purpose</label>
                <textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  placeholder="Briefly describe what you'll use the loan for..."
                  disabled={isProcessing}
                  rows={3}
                />
              </div>
            </div>

            {formData.amount && formData.collateral && parseFloat(formData.collateral) >= parseFloat(formData.amount) * 1.5 && (
              <div className="loan-preview">
                <h4>Loan Terms</h4>
                <div className="preview-details">
                  <div className="preview-item">
                    <span>Loan Amount:</span>
                    <span>${parseFloat(formData.amount).toFixed(2)}</span>
                  </div>
                  <div className="preview-item">
                    <span>Collateral Required:</span>
                    <span>${parseFloat(formData.collateral).toFixed(2)}</span>
                  </div>
                  <div className="preview-item">
                    <span>Interest Rate:</span>
                    <span>6.5% APR</span>
                  </div>
                  <div className="preview-item">
                    <span>Total Repayment:</span>
                    <span className="repayment">
                      ${(parseFloat(formData.amount) * 1.065).toFixed(2)}
                    </span>
                  </div>
                  <div className="preview-item">
                    <span>Loan-to-Value Ratio:</span>
                    <span>
                      {((parseFloat(formData.amount) / parseFloat(formData.collateral)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleBorrow}
              disabled={!isValidForm() || isProcessing}
              className={`action-button ${isProcessing ? 'loading' : ''}`}
            >
              {isProcessing ? (
                <>
                  <div className="loading-spinner"></div>
                  Processing Request...
                </>
              ) : (
                'Request Loan'
              )}
            </button>

            {showSuccess && (
              <div className="success-animation">
                <div className="success-icon">✓</div>
                <span>Loan request submitted successfully!</span>
              </div>
            )}
          </div>
        </div>

        <div className="available-loans card">
          <h3>Available Loans</h3>
          <div className="loans-marketplace">
            {availableLoans.map((loan, index) => (
              <div key={loan.id} className="loan-offer" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="loan-header">
                  <div className="lender-info">
                    <span className="lender-name">{loan.lender}</span>
                    <div className="reputation">
                      <span className="stars">{'★'.repeat(Math.floor(loan.reputation))}</span>
                      <span className="rating">{loan.reputation}</span>
                    </div>
                  </div>
                  <div className="loan-amount-offer">${loan.amount.toFixed(0)}</div>
                </div>
                
                <div className="loan-terms">
                  <div className="term">
                    <span className="term-label">Interest Rate</span>
                    <span className="term-value">{loan.interestRate}% APR</span>
                  </div>
                  <div className="term">
                    <span className="term-label">Duration</span>
                    <span className="term-value">{loan.duration} days</span>
                  </div>
                  <div className="term">
                    <span className="term-label">Total Return</span>
                    <span className="term-value">
                      ${(loan.amount * (1 + loan.interestRate / 100 * loan.duration / 365)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button className="accept-loan-btn" disabled>
                  Accept Offer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .borrow-overview {
          margin-bottom: 30px;
        }

        .overview-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: rgba(255, 87, 51, 0.1);
          border: 1px solid rgba(255, 87, 51, 0.3);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(255, 87, 51, 0.2);
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          color: #FF5733;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group textarea {
          padding: 12px 16px;
          border: 2px solid #333;
          border-radius: 8px;
          background: #2A2A2A;
          color: white;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          transition: all 0.3s ease;
        }

        .form-group textarea:focus {
          outline: none;
          border-color: #FFC107;
          box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
        }

        .loan-preview {
          margin: 24px 0;
          padding: 20px;
          background: rgba(255, 87, 51, 0.05);
          border: 1px solid rgba(255, 87, 51, 0.2);
          border-radius: 12px;
          animation: slideInUp 0.5s ease-out;
        }

        .loan-preview h4 {
          margin-bottom: 16px;
          color: #FF5733;
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

        .preview-item .repayment {
          color: #FF5733;
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

        .available-loans h3 {
          margin-bottom: 20px;
          color: #FFC107;
        }

        .loans-marketplace {
          display: grid;
          gap: 16px;
        }

        .loan-offer {
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
          animation: slideInRight 0.5s ease-out;
        }

        .loan-offer:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 193, 7, 0.3);
          transform: translateY(-2px);
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .loan-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .lender-info .lender-name {
          display: block;
          font-weight: 600;
          color: white;
          margin-bottom: 4px;
        }

        .reputation {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stars {
          color: #FFC107;
          font-size: 0.9rem;
        }

        .rating {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .loan-amount-offer {
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFC107;
        }

        .loan-terms {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .term {
          text-align: center;
        }

        .term-label {
          display: block;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .term-value {
          display: block;
          font-size: 0.95rem;
          font-weight: 600;
          color: white;
        }

        .accept-loan-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #4CAF50, #45a049);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0.6;
        }

        .accept-loan-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
        }

        .error-message {
          color: #f44336;
          font-size: 0.85rem;
          margin-top: 4px;
        }

        @media (max-width: 1024px) {
          .section-tabs {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .overview-stats {
            grid-template-columns: 1fr;
          }
          
          .loan-terms {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default BorrowSection;