import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EnterpriseDashboard from './pages/EnterpriseDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enterprise-dashboard" element={<EnterpriseDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
