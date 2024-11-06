import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/authPage';
import HomePage from './pages/homePage';
import Dashboard from './pages/Dashboard'



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/DB" element={<Dashboard />} />
        
      </Routes>
    </Router>
  );
};

export default App;
