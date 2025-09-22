import React, { useState } from 'react';
import api from '../api'; // Changed import
import { useNavigate, useLocation } from 'react-router-dom';

const DoctorLoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/dashboard-doctor';

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            // Changed call from axios to api
            const res = await api.post('/auth/login/doctor', formData);
            localStorage.setItem('token', res.data.token);
            navigate(from, { replace: true });
        } catch (err) {
            if (err.response) { alert(err.response.data.msg); } 
            else { alert('Network Error or server is down.'); }
        }
    };
    
    return (
        <div className="form-container">
            <h2>Doctor Login</h2>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Username" name="username" onChange={onChange} required />
                <input type="password" placeholder="Password" name="password" onChange={onChange} required />
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};
export default DoctorLoginPage;