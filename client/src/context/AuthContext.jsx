import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
            api.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            navigate(data.role === 'admin' ? '/admin' : '/events');
        } catch (error) {
            throw error; // Let component handle toast
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            navigate('/events'); // Redirect to events after registration as per flow (Main interface)
            // User requested: "Then the main interface of the project should be displayed"
        } catch (error) {
            // If server returns error message, show it.
            const msg = error.response?.data?.message || 'Registration failed';
            toast.error(msg);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        delete api.defaults.headers.common['Authorization'];
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
