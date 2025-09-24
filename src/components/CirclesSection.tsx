import React, { useState } from 'react';
import { AppState, Circle } from '../App';

interface CirclesSectionProps {
  appState: AppState;
  setAppState: (state: AppState | ((prev: AppState) => AppState)) => void;
  addTransaction: (type: 'stake' | 'lend' | 'borrow' | 'circle', amount: number) => void;
}

type CircleView = 'overview' | 'create' | 'join' | 'bid' | 'distribute';

const CirclesSection: React.FC<CirclesSectionProps> = ({ appState, setAppState, addTransaction }) => {
  const [activeView, setActiveView] = useState<CircleView>('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [createForm, setCreateForm] = useState({
    name: '',
    monthlyAmount: '',
    memberCount: '5'
  });
  
  const [joinForm, setJoinForm] = useState({
    circleId: '',
    stakeAmount: ''
  });
  
  const [bidForm, setBidForm] = useState({
    circleId: '',
    bidAmount: ''
  });

  // Mock available circles
  const availableCircles = [
    { id: 'circle-1', name: 'Startup Entrepreneurs', monthlyAmount: 200, memberCount: 8, currentMembers: 6, status: 'active' as const },
    { id: 'circle-2', name: 'Tech Workers Savings', monthlyAmount: 500, memberCount: 10, currentMembers: 8, status: 'bidding' as const },
    { id: 'circle-3', name: 'Small Business Fund', monthlyAmount: 300, memberCount: 6, currentMembers: 4, status: 'active' as const },
    { id: 'circle-4', name: 'Student Emergency Fund', monthlyAmount: 100, memberCount: 12, currentMembers: 10, status: 'distributing' as const },
  ];

  const handleCreateCircle = async () => {
    const monthlyAmount = parseFloat(createForm.monthlyAmount);
    const memberCount = parseInt(createForm.memberCount);
    
    if (!createForm.name || monthlyAmount <= 0 || memberCount < 3) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCircle: Circle = {
      id: `circle-${Date.now()}`,
      name: createForm.name,
      monthlyAmount,
      memberCount,
      currentMembers: 1,
      status: 'active',
      userRole: 'creator'
    };
    
    setAppState(prev => ({
      ...prev,
      circles: [...prev.circles, newCircle]
    }));
    
    addTransaction('circle', monthlyAmount);
    setCreateForm({ name: '', monthlyAmount: '', memberCount: '5' });
    setIsProcessing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleJoinCircle = async () => {
    const stakeAmount = parseFloat(joinForm.stakeAmount);
    
    if (!joinForm.circleId || stakeAmount <= 0 || stakeAmount > appState.walletBalance) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const targetCircle = availableCircles.find(c => c.id === joinForm.circleId);
    if (targetCircle) {
      const newCircle: Circle = {
        ...targetCircle,
        currentMembers: targetCircle.currentMembers + 1,
        userRole: 'member'
      };
      
      setAppState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - stakeAmount,
        circles: [...prev.circles, newCircle]
      }));
      
      addTransaction('circle', stakeAmount);
    }
    
    setJoinForm({ circleId: '', stakeAmount: '' });
    setIsProcessing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleBid = async () => {
    const bidAmount = parseFloat(bidForm.bidAmount);
    
    if (!bidForm.circleId || bidAmount <= 0) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAppState(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - bidAmount * 0.1 // Bid fee
    }));
    
    setBidForm({ circleId: '', bidAmount: '' });
    setIsProcessing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDistribute = async (circleId: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const circle = appState.circles.find(c => c.id === circleId);
    if (circle) {
      const totalPayout = circle.monthlyAmount * circle.currentMembers;
      setAppState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance + totalPayout
      }));
      addTransaction('circle', totalPayout);
    }
    
    setIsProcessing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const renderOverview = () => (
    <div className="circles-overview">
      <div className="overview-stats">
        <div className="stat-card">
          <span className="stat-number">{appState.circles.length}</span>
          <span className="stat-label">Active Circles</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            ${appState.circles.reduce((sum, c) => sum + c.monthlyAmount, 0).toFixed(0)}
          </span>
          <span className="stat-label">Monthly Commitment</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {appState.circles.filter(c => c.userRole === 'creator').length}
          </span>
          <span className="stat-label">Circles Created</span>
        </div>
      </div>

      {appState.circles.length > 0 && (
        <div className="user-circles card">
          <h3>Your Circles</h3>
          <div className="circles-list">
            {appState.circles.map((circle, index) => (
              <div key={circle.id} className="circle-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="circle-info">
                  <div className="circle-name">{circle.name}</div>
                  <div className="circle-details">
                    <span>${circle.monthlyAmount}/month</span>
                    <span>{circle.currentMembers}/{circle.memberCount} members</span>
                    <span className={`circle-status ${circle.status}`}>
                      {circle.status.charAt(0).toUpperCase() + circle.status.slice(1)}
                    </span>
                    {circle.userRole === 'creator' && (
                      <span className="role-badge">Creator</span>
                    )}
                  </div>
                </div>
                <div className="circle-actions">
                  {circle.status === 'distributing' && (
                    <button
                      onClick={() => handleDistribute(circle.id)}
                      disabled={isProcessing}
                      className="distribute-btn"
                    >
                      Collect Payout
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="available-circles card">
        <h3>Join a Circle</h3>
        <div className="circles-grid">
          {availableCircles
            .filter(circle => !appState.circles.some(userCircle => userCircle.id === circle.id))
            .map((circle, index) => (
            <div key={circle.id} className="circle-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="circle-header">
                <h4>{circle.name}</h4>
                <div className="monthly-amount">${circle.monthlyAmount}/month</div>
              </div>
              <div className="circle-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(circle.currentMembers / circle.memberCount) * 100}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {circle.currentMembers}/{circle.memberCount} members
                </span>
              </div>
              <div className="circle-status-info">
                <span className={`status-badge ${circle.status}`}>
                  {circle.status.charAt(0).toUpperCase() + circle.status.slice(1)}
                </span>
              </div>
              <button
                className="join-circle-btn"
                onClick={() => {
                  setJoinForm({ circleId: circle.id, stakeAmount: circle.monthlyAmount.toString() });
                  setActiveView('join');
                }}
                disabled={circle.currentMembers >= circle.memberCount}
              >
                {circle.currentMembers >= circle.memberCount ? 'Full' : 'Join Circle'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCreateForm = () => (
    <div className="card">
      <h3>Create New Circle</h3>
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="circleName">Circle Name</label>
          <input
            id="circleName"
            type="text"
            value={createForm.name}
            onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Startup Entrepreneurs"
            disabled={isProcessing}
          />
        </div>
        <div className="form-group">
          <label htmlFor="monthlyAmount">Monthly Amount (USD)</label>
          <input
            id="monthlyAmount"
            type="number"
            value={createForm.monthlyAmount}
            onChange={(e) => setCreateForm(prev => ({ ...prev, monthlyAmount: e.target.value }))}
            placeholder="100"
            min="0"
            disabled={isProcessing}
          />
        </div>
        <div className="form-group">
          <label htmlFor="memberCount">Total Members</label>
          <select
            id="memberCount"
            value={createForm.memberCount}
            onChange={(e) => setCreateForm(prev => ({ ...prev, memberCount: e.target.value }))}
            disabled={isProcessing}
          >
            {[3, 4, 5, 6, 8, 10, 12].map(num => (
              <option key={num} value={num}>{num} members</option>
            ))}
          </select>
        </div>
      </div>

      {createForm.name && createForm.monthlyAmount && (
        <div className="circle-preview">
          <h4>Circle Preview</h4>
          <div className="preview-details">
            <div className="preview-item">
              <span>Circle Name:</span>
              <span>{createForm.name}</span>
            </div>
            <div className="preview-item">
              <span>Monthly Contribution:</span>
              <span>${parseFloat(createForm.monthlyAmount || '0').toFixed(2)}</span>
            </div>
            <div className="preview-item">
              <span>Total Members:</span>
              <span>{createForm.memberCount}</span>
            </div>
            <div className="preview-item">
              <span>Pool Size:</span>
              <span>
                ${(parseFloat(createForm.monthlyAmount || '0') * parseInt(createForm.memberCount)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleCreateCircle}
        disabled={!createForm.name || !createForm.monthlyAmount || parseFloat(createForm.monthlyAmount) <= 0 || isProcessing}
        className={`action-button ${isProcessing ? 'loading' : ''}`}
      >
        {isProcessing ? (
          <>
            <div className="loading-spinner"></div>
            Creating Circle...
          </>
        ) : (
          'Create Circle'
        )}
      </button>

      {showSuccess && (
        <div className="success-animation">
          <div className="success-icon">🎉</div>
          <span>Circle created successfully!</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="section">
      <h2 className="section-title">ROSCAs & Circles</h2>
      
      <nav className="circles-nav">
        {(['overview', 'create', 'join', 'bid', 'distribute'] as CircleView[]).map(view => (
          <button
            key={view}
            className={`nav-button ${activeView === view ? 'active' : ''}`}
            onClick={() => setActiveView(view)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </nav>

      <div className="circles-content">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'create' && renderCreateForm()}
        {/* Add other views as needed */}
      </div>

      <style jsx>{`
        .circles-nav {
          display: flex;
          gap: 4px;
          margin-bottom: 30px;
          background: rgba(42, 42, 42, 0.5);
          padding: 6px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-button {
          flex: 1;
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: capitalize;
          font-size: 0.9rem;
        }

        .nav-button:hover {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.9);
          transform: none;
        }

        .nav-button.active {
          background: linear-gradient(135deg, #9C27B0, #673AB7);
          color: white;
          font-weight: 600;
          transform: none;
          box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3);
        }

        .circles-overview {
          animation: fadeInUp 0.6s ease-out;
        }

        .overview-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: rgba(156, 39, 176, 0.1);
          border: 1px solid rgba(156, 39, 176, 0.3);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(156, 39, 176, 0.2);
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          color: #9C27B0;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .user-circles,
        .available-circles {
          margin-bottom: 30px;
        }

        .user-circles h3,
        .available-circles h3 {
          margin-bottom: 20px;
          color: #9C27B0;
        }

        .circles-list {
          display: grid;
          gap: 16px;
        }

        .circle-item {
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

        .circle-item:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(156, 39, 176, 0.3);
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

        .circle-info .circle-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: white;
          margin-bottom: 8px;
        }

        .circle-details {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .circle-details span {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .circle-status.active {
          background: rgba(76, 175, 80, 0.2) !important;
          color: #4CAF50 !important;
        }

        .circle-status.bidding {
          background: rgba(255, 193, 7, 0.2) !important;
          color: #FFC107 !important;
        }

        .circle-status.distributing {
          background: rgba(156, 39, 176, 0.2) !important;
          color: #9C27B0 !important;
        }

        .role-badge {
          background: rgba(156, 39, 176, 0.3) !important;
          color: #9C27B0 !important;
          font-weight: 600 !important;
        }

        .distribute-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #9C27B0, #673AB7);
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .distribute-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(156, 39, 176, 0.4);
        }

        .circles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .circle-card {
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
          animation: scaleIn 0.5s ease-out;
        }

        .circle-card:hover {
          transform: translateY(-4px);
          border-color: rgba(156, 39, 176, 0.3);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }

        .circle-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .circle-header h4 {
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          margin: 0;
        }

        .monthly-amount {
          font-size: 1.2rem;
          font-weight: 700;
          color: #9C27B0;
        }

        .circle-progress {
          margin-bottom: 16px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #9C27B0, #673AB7);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .progress-text {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .circle-status-info {
          margin-bottom: 16px;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.active {
          background: rgba(76, 175, 80, 0.2);
          color: #4CAF50;
        }

        .status-badge.bidding {
          background: rgba(255, 193, 7, 0.2);
          color: #FFC107;
        }

        .status-badge.distributing {
          background: rgba(156, 39, 176, 0.2);
          color: #9C27B0;
        }

        .join-circle-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #9C27B0, #673AB7);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .join-circle-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(156, 39, 176, 0.4);
        }

        .join-circle-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
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
          border-color: #9C27B0;
          box-shadow: 0 0 0 3px rgba(156, 39, 176, 0.1);
        }

        .circle-preview {
          margin: 24px 0;
          padding: 20px;
          background: rgba(156, 39, 176, 0.05);
          border: 1px solid rgba(156, 39, 176, 0.2);
          border-radius: 12px;
          animation: slideInUp 0.5s ease-out;
        }

        .circle-preview h4 {
          margin-bottom: 16px;
          color: #9C27B0;
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
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
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
          font-size: 1.2rem;
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

        @media (max-width: 768px) {
          .circles-nav {
            flex-wrap: wrap;
          }
          
          .nav-button {
            min-width: 100px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .overview-stats {
            grid-template-columns: 1fr;
          }
          
          .circles-grid {
            grid-template-columns: 1fr;
          }
          
          .circle-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .circle-details {
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default CirclesSection;