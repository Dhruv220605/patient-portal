import React, { useState, useEffect } from 'react';
import api from '../api'; // Changed import

const PatientDashboard = () => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchPatientData = async () => {
            const token = localStorage.getItem('token');
            if (!token) { setLoading(false); return; }
            try {
                const config = { headers: { 'x-auth-token': token } };
                // Changed call from axios to api
                const res = await api.get('/patients/me', config);
                setPatient(res.data);
            } catch (error) {
                console.error("Could not fetch patient data", error);
                localStorage.removeItem('token');
            }
            setLoading(false);
        };
        fetchPatientData();
    }, []);

    if (loading) return <div className="page-container"><p>Loading...</p></div>;
    if (!patient) return <div className="page-container"><p>Please log in to view your dashboard.</p></div>;

    return (
        <div className="page-container">
            <h2>Welcome, {patient.name} {patient.surname}</h2>
            <div className="dashboard-content">
                <div className="patient-info">
                    <h3>Your Details</h3>
                    <p><strong>Name:</strong> {patient.name} {patient.surname}</p>
                    <p><strong>Email:</strong> {patient.email}</p>
                    <p><strong>Phone:</strong> {patient.phoneNumber}</p>
                    <p><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                    <p><strong>Sex:</strong> {patient.sex}</p>
                    <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
                    <p><strong>Diabetic:</strong> {patient.isDiabetic ? 'Yes' : 'No'}</p>
                    <p><strong>Thyroid Condition:</strong> {patient.hasThyroid ? 'Yes' : 'No'}</p>
                    <p><strong>Allergies:</strong> {patient.allergies || 'None specified'}</p>
                </div>
                <div className="qr-code">
                    <h3>Your Unique QR Code</h3>
                    <p>A doctor can scan this to access your records.</p>
                    {patient.qrCode && <img src={patient.qrCode} alt="Patient QR Code" />}
                </div>
            </div>
            <div className="patient-files">
                <h3>Your Reports and Files</h3>
                {patient.files && patient.files.length > 0 ? (
                    patient.files.map(f => {
                        const isPdf = f.fileName.toLowerCase().endsWith('.pdf');
                        const fileUrl = isPdf ? `https://docs.google.com/gview?url=${f.url}&embedded=true` : f.url;
                        return ( <div key={f._id} className="file-item"><a href={fileUrl} target="_blank" rel="noopener noreferrer">{f.fileName}</a><span>Uploaded on: {new Date(f.uploadedAt).toLocaleDateString()}</span></div> );
                    })
                ) : ( <p>You have no files uploaded.</p> )}
            </div>
        </div>
    );
};
export default PatientDashboard;