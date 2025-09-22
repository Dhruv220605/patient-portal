import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api'; // Changed import
import { jwtDecode } from 'jwt-decode';

const PublicPatientProfilePage = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedUser = jwtDecode(token);
                    if (decodedUser.exp * 1000 > Date.now() && decodedUser.user.role === 'doctor') {
                        setIsAuthorized(true);
                        const config = { headers: { 'x-auth-token': token } };
                        // Changed call from axios to api
                        const res = await api.get(`/patients/${id}`, config);
                        setPatient(res.data);
                    }
                } catch (error) { console.error("Auth check or data fetch failed", error); }
            }
            setLoading(false);
        };
        checkAuthAndFetchData();
    }, [id]);

    useEffect(() => {
        if (!loading && !isAuthorized) {
            navigate('/login-doctor', { state: { from: location.pathname } });
        }
    }, [loading, isAuthorized, navigate, location]);

    if (loading || !isAuthorized) {
        return <div className="page-container"><p>Verifying access...</p></div>;
    }
    if (!patient) {
        return <div className="page-container"><h2>Error</h2><p>Could not retrieve patient data.</p></div>;
    }

    return (
        <div className="page-container">
            <h2>Patient Profile: {patient.name} {patient.surname}</h2>
            <div className="patient-info">
                <p><strong>Email:</strong> {patient.email}</p>
                <p><strong>Phone:</strong> {patient.phoneNumber}</p>
                <p><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
                <p><strong>Diabetic:</strong> {patient.isDiabetic ? 'Yes' : 'No'}</p>
                <p><strong>Thyroid Condition:</strong> {patient.hasThyroid ? 'Yes' : 'No'}</p>
            </div>
            <hr />
            <h3>Uploaded Files (View-Only)</h3>
            <div className="file-list">
                {patient.files && patient.files.length > 0 ? (
                    patient.files.map(f => {
                        const isPdf = f.fileName.toLowerCase().endsWith('.pdf');
                        const fileUrl = isPdf ? `https://docs.google.com/gview?url=${f.url}&embedded=true` : f.url;
                        return ( <div key={f._id} className="file-item"><a href={fileUrl} target="_blank" rel="noopener noreferrer">{f.fileName}</a><span>Uploaded on: {new Date(f.uploadedAt).toLocaleDateString()}</span></div> );
                    })
                ) : ( <p>No files uploaded for this patient.</p> )}
            </div>
        </div>
    );
};
export default PublicPatientProfilePage;