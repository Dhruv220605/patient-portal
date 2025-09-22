import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="page-container" style={{ textAlign: 'center' }}>
      <h2>Welcome to the Patient Health Portal</h2>
      <p>Your centralized and secure solution for health record management.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/login-patient" className="btn btn-primary">Patient Login</Link>
        <Link to="/login-doctor" className="btn btn-secondary">Doctor Login</Link>
      </div>
    </div>
  );
};
export default HomePage;