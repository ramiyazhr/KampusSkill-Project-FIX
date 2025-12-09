
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, PasswordResetRequest } from '../types';
import { getInitialData, saveData } from '../services/dataService';

type RegisterDetails = Omit<User, 'id' | 'isVerified' | 'passwordHash' | 'role' | 'status'> & { password: string };
interface AuthContextType {
    user: User | null;
    users: User[];
    login: (email: string, password: string) => { success: boolean; message: string; user?: User };
    logout: () => void;
    register: (details: RegisterDetails) => { success: boolean, message: string };
    banUser: (userId: string) => void;
    passwordResetRequests: PasswordResetRequest[];
    requestPasswordReset: (email: string) => { success: boolean, message: string };
    resolvePasswordReset: (requestId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [passwordResetRequests, setPasswordResetRequests] = useState<PasswordResetRequest[]>([]);

    useEffect(() => {
        const { users: initialUsers } = getInitialData();
        setUsers(initialUsers);
        
        const storedRequests = localStorage.getItem('passwordResetRequests');
        if (storedRequests) {
            setPasswordResetRequests(JSON.parse(storedRequests));
        }

        const loggedInUser = sessionStorage.getItem('loggedInUser');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);
    
    const updateAndSaveUsers = useCallback((newUsers: User[]) => {
        setUsers(newUsers);
        saveData('users', newUsers);
    }, []);
    
    const updateAndSaveRequests = useCallback((newRequests: PasswordResetRequest[]) => {
        setPasswordResetRequests(newRequests);
        localStorage.setItem('passwordResetRequests', JSON.stringify(newRequests));
    }, []);

    const login = useCallback((email: string, password: string) => {
        const userToLogin = users.find(u => u.email === email);
        if (userToLogin && userToLogin.passwordHash === password) {
            if (userToLogin.status === 'banned') {
                return { success: false, message: "Akun Anda telah dibanned." };
            }
            setUser(userToLogin);
            sessionStorage.setItem('loggedInUser', JSON.stringify(userToLogin));
            return { success: true, message: "Login berhasil!", user: userToLogin };
        }
        return { success: false, message: "Email atau password salah." };
    }, [users]);

    const logout = useCallback(() => {
        setUser(null);
        sessionStorage.removeItem('loggedInUser');
    }, []);

    const register = useCallback((details: RegisterDetails) => {
        if (users.some(u => u.email === details.email)) {
            return { success: false, message: "Email sudah terdaftar." };
        }
        if (details.nim && users.some(u => u.nim === details.nim)) {
            return { success: false, message: "NIM sudah terdaftar." };
        }
         if (details.nik && users.some(u => u.nik === details.nik)) {
            return { success: false, message: "NIK sudah terdaftar." };
        }

        const newUser: User = {
            id: `user_${Date.now()}`,
            name: details.name,
            email: details.email,
            passwordHash: details.password, // Plain text for prototype
            isVerified: true,
            role: 'user',
            status: 'active',
            userType: details.userType,
            nim: details.nim,
            faculty: details.faculty,
            nik: details.nik,
            occupation: details.occupation,
        };

        updateAndSaveUsers([...users, newUser]);
        return { success: true, message: "Pendaftaran berhasil! Silakan login." };
    }, [users, updateAndSaveUsers]);

    const banUser = useCallback((userId: string) => {
        const newUsers = users.map(u => u.id === userId ? { ...u, status: 'banned' as 'banned' } : u);
        updateAndSaveUsers(newUsers);
    }, [users, updateAndSaveUsers]);
    
    const requestPasswordReset = useCallback((email: string) => {
        const userExists = users.find(u => u.email === email);
        if (!userExists) {
            return { success: false, message: "Email tidak ditemukan." };
        }
        
        const newRequest: PasswordResetRequest = {
            id: `req_${Date.now()}`,
            userEmail: userExists.email,
            userName: userExists.name,
            requestedAt: new Date().toISOString(),
        };
        
        updateAndSaveRequests([...passwordResetRequests, newRequest]);
        return { success: true, message: "Permintaan reset password terkirim." };
    }, [users, passwordResetRequests, updateAndSaveRequests]);
    
    const resolvePasswordReset = useCallback((requestId: string) => {
        const newRequests = passwordResetRequests.filter(req => req.id !== requestId);
        updateAndSaveRequests(newRequests);
    }, [passwordResetRequests, updateAndSaveRequests]);


    return (
        <AuthContext.Provider value={{ user, users, login, logout, register, banUser, passwordResetRequests, requestPasswordReset, resolvePasswordReset }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
