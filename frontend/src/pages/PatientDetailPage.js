import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api'; // Changed import

const PatientDetailPage = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [file, setFile] = useState('');
    const [loading, setLoading] = useState(true);
    const fetchPatient = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        try {
            // Changed call from axios to api
            const res = await api.get(`/patients/${id}`, config);
            setPatient(res.data);
        } catch (error) { console.error(error); }
        setLoading(false);
    };
    useEffect(() => { fetchPatient(); }, [id]);
    const onFileChange = e => { setFile(e.target.files[0]); };
    const onUploadSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token } };
            // Changed call from axios to api
            await api.post(`/patients/${id}/upload`, formData, config);
            fetchPatient();
        } catch (error) { console.error('File upload failed', error); alert('File upload failed.'); }
    };
    const onDeleteFile = async (fileId) => {
        if (!window.confirm('Are you sure you want to delete this file? This cannot be undone.')) { return; }
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            // Changed call from axios to api
            const res = await api.delete(`/patients/${id}/files/${fileId}`, config);
            setPatient({ ...patient, files: res.data });
        } catch (error) { console.error('File deletion failed', error); alert('File deletion failed.'); }
    };

    if (loading) return <div className="page-container"><p>Loading patient details...</p></div>;
    if (!patient) return <div className="page-container"><p>Could not load patient details.</p></div>;

    return (
        <div className="page-container">
            <h2>Patient: {patient.name} {patient.surname}</h2>
            <div className="patient-info">
                <p><strong>Email:</strong> {patient.email}</p>
                <p><strong>Phone:</strong> {patient.phoneNumber}</p>
                <p><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                <p><strong>Sex:</strong> {patient.sex}</p>
                <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
                <p><strong>Diabetic:</strong> {patient.isDiabetic ? 'Yes' : 'No'}</p>
                <p><strong>Thyroid Condition:</strong> {patient.hasThyroid ? 'Yes' : 'No'}</p>
                <p><strong>Allergies:</strong> {patient.allergies || 'None specified'}</p>
            </div>
            <hr />
            <h3>Upload New Report/Image</h3>
            <form onSubmit={onUploadSubmit} className="form-container"><input type="file" onChange={onFileChange} required /><button type="submit" className="btn btn-primary">Upload</button></form>
            <hr />
            <h3>Uploaded Files</h3>
            <div className="file-list">
                {patient.files && patient.files.length > 0 ? (
                    patient.files.map(f => {
                        const isPdf = f.fileName.toLowerCase().endsWith('.pdf');
                        const fileUrl = isPdf ? `https://docs.google.com/gview?url=${f.url}&embedded=true` : f.url;
                        return ( <div key={f._id} className="file-item"><a href={fileUrl} target="_blank" rel="noopener noreferrer">{f.fileName}</a><div><span>Uploaded: {new Date(f.uploadedAt).toLocaleDateString()}</span><button onClick={() => onDeleteFile(f._id)} className="btn btn-danger">Delete</button></div></div> );
                    })
                ) : ( <p>No files uploaded yet.</p> )}
            </div>
        </div>
    );
};
export default PatientDetailPage;