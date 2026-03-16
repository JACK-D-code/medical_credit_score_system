import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (token) {
        // Provide a default fallback if `from` doesn't exist.
        const from = location.state?.from?.pathname || '/medical-credit-dashboard';
        return <Navigate to={from} replace />;
    }

    return children;
};

export default PublicRoute;
