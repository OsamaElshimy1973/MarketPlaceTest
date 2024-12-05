import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import ServiceListPage from './pages/ServiceListPage';
import MapPage from './pages/MapPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/services" element={<ServiceListPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;