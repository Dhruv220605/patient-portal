import React, { useState } from 'react';
import api from '../api'; // Changed import
import { useNavigate } from 'react-router-dom';

const PatientRegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '', surname: '', email: '', phoneNumber: '', password: '', dateOfBirth: '',
        sex: 'Male', allergies: '', bloodGroup: 'A+', isDiabetic: false, hasThyroid: false
    });
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            // Changed call from axios to api
            const res = await api.post('/auth/register/patient', formData);
            localStorage.setItem('token', res.data.token);
            alert('Registration Successful!');
            navigate('/dashboard-patient');
        } catch (err) {
            if (err.response) {
                alert(err.response.data.msg);
            } else if (err.request) {
                alert('Network Error: Cannot connect to the server. Please make sure your backend is running.');
            } else {
                alert('An error occurred: ' + err.message);
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Patient Registration</h2>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="First Name" name="name" onChange={onChange} required />
                <input type="text" placeholder="Surname" name="surname" onChange={onChange} required />
                <input type="email" placeholder="Email" name="email" onChange={onChange} required />
                <input type="tel" placeholder="Phone Number" name="phoneNumber" onChange={onChange} required />
                <input type="password" placeholder="Password (min 6 characters)" name="password" minLength="6" onChange={onChange} required />
                <label>Date of Birth</label>
                <input type="date" name="dateOfBirth" onChange={onChange} required />
                <label>Sex</label>
                <select name="sex" onChange={onChange}><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select>
                <label>Blood Group</label>
                <select name="bloodGroup" onChange={onChange}><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option></select>
                <label>Are you diabetic?</label>
                <select name="isDiabetic" onChange={onChange}><option value={false}>No</option><option value={true}>Yes</option></select>
                <label>Do you have a thyroid condition?</label>
                <select name="hasThyroid" onChange={onChange}><option value={false}>No</option><option value={true}>Yes</option></select>
                <textarea placeholder="Known Allergies (optional, e.g., Penicillin, Peanuts)" name="allergies" onChange={onChange}></textarea>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};
export default PatientRegisterPage;