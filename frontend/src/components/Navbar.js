import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                if (decodedUser.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    setUser(decodedUser.user);
                }
            } catch (error) {
                localStorage.removeItem('token');
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [location]);

    const onLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login-patient');
    };

    const guestLinks = (
        <ul>
            <li><Link to="/register-patient">Patient Register</Link></li>
            <li><Link to="/login-patient">Patient Login</Link></li>
            <li><Link to="/login-doctor">Doctor Login</Link></li>
        </ul>
    );

    const userLinks = (
        <ul>
            {user && user.role === 'patient' && (<li><Link to="/dashboard-patient">My Dashboard</Link></li>)}
            {user && user.role === 'doctor' && (<li><Link to="/dashboard-doctor">Doctor Dashboard</Link></li>)}
            <li><a onClick={onLogout} href="#!">Logout</a></li>
        </ul>
    );

    return (
        <nav className="navbar">
            <h1><Link to="/">Health Portal</Link></h1>
            <ul>{user ? userLinks : guestLinks}</ul>
        </nav>
    );
};

export default Navbar;