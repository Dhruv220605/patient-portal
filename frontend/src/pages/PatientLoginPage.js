import React, { useState } from 'react';
import api from '../api'; // Changed import
import { useNavigate } from 'react-router-dom';

const PatientLoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            // Changed call from axios to api
            const res = await api.post('/auth/login/patient', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard-patient');
        } catch (err) {
            if (err.response) { alert(err.response.data.msg); }
            else { alert('Could not connect to server.'); }
        }
    };

    return (
        <div className="form-container">
            <h2>Patient Login</h2>
            <form onSubmit={onSubmit}>
                <input type="email" placeholder="Email Address" name="email" onChange={onChange} required />
                <input type="password" placeholder="Password" name="password" onChange={onChange} required />
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};
export default PatientLoginPage;