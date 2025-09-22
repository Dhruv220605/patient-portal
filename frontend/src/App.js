import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PatientRegisterPage from './pages/PatientRegisterPage';
import PatientLoginPage from './pages/PatientLoginPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorLoginPage from './pages/DoctorLoginPage';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDetailPage from './pages/PatientDetailPage';
import PublicPatientProfilePage from './pages/PublicPatientProfilePage';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register-patient" element={<PatientRegisterPage />} />
          <Route path="/login-patient" element={<PatientLoginPage />} />
          <Route path="/login-doctor" element={<DoctorLoginPage />} />
          <Route path="/dashboard-patient" element={<PatientDashboard />} />
          <Route path="/dashboard-doctor" element={<DoctorDashboard />} />
          <Route path="/patient/:id" element={<PatientDetailPage />} />
          <Route path="/patient-profile/:id" element={<PublicPatientProfilePage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;