import React, { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
    // Placeholder: Replace with real admin auth logic
    const [admin, setAdmin] = useState({ name: 'Admin User', email: 'admin@example.com' });

    const login = (email, password) => {
        // Implement real login
        setAdmin({ name: 'Admin User', email });
    };

    const logout = () => {
        setAdmin(null);
    };

    return (
        <AdminAuthContext.Provider value={{ admin, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}; 