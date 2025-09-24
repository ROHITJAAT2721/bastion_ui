import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import './App.css';

export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  duration: number;
  status: 'active' | 'completed';
  type: 'lent' | 'borrowed';
}

export interface Circle {
  id: string;
  name: string;
  monthlyAmount: number;
  memberCount: number;
  currentMembers: number;
  status: 'active' | 'bidding' | 'distributing';
  userRole?: 'creator' | 'member';
}

export interface AppState {
  walletBalance: number;
  stakedAmount: number;
  loans: Loan[];
  circles: Circle[];
  transactions: Array<{
    id: string;
    type: 'stake' | 'lend' | 'borrow' | 'circle';
    amount: number;
    timestamp: Date;
  }>;
}

function App() {
  const [appState, setAppState] = useState<AppState>({
    walletBalance: 1000,
    stakedAmount: 0,
    loans: [],
    circles: [],
    transactions: []
  });

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route 
            path="/dashboard" 
            element={<Dashboard appState={appState} setAppState={setAppState} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;