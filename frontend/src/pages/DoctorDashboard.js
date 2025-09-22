import React, { useState, useEffect } from 'react';
import api from '../api'; // Changed import
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        const fetchPatients = async () => {
            const token = localStorage.getItem('token');
            if (!token) { setLoading(false); return; }
            try {
                const config = { headers: { 'x-auth-token': token } };
                // Changed call from axios to api
                const res = await api.get('/patients', config);
                setPatients(res.data);
            } catch (error) { console.error("Could not fetch patients", error); }
            setLoading(false);
        };
        fetchPatients();
    }, []);
    
    const filteredPatients = patients.filter(patient => {
        const fullName = `${patient.name} ${patient.surname}`.toLowerCase();
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || (patient.phoneNumber && patient.phoneNumber.includes(searchTerm));
    });

    if (loading) return <p>Loading patients...</p>;

    return (
        <div className="page-container">
            <h2>Doctor Dashboard</h2>
            <div className="search-bar"><input type="text" placeholder="Search by name, surname, or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <h3>Patient List</h3>
            {filteredPatients.length > 0 ? (
                <ul className="patient-list">
                    {filteredPatients.map(patient => (
                        <li key={patient._id}>
                            <Link to={`/patient/${patient._id}`} className="patient-link">
                                <span>{patient.name} {patient.surname}</span> 
                                <span>{patient.email}</span>
                                <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : ( <p>No patients found. Please ensure patients have been registered.</p> )}
        </div>
    );
};
export default DoctorDashboard;