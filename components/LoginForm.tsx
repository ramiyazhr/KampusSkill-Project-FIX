import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface LoginFormProps {
    onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, requestPasswordReset } = useAuth();
    const { addToast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const result = login(email, password);
        if (result.success) {
            addToast(`Selamat datang, ${result.user?.name}!`, 'success');
            // No onSuccess call needed, context will trigger re-render
        } else {
            setError(result.message);
        }
    };
    
    const handleForgotPassword = () => {
        if (!email) {
            addToast("Silakan masukkan email Anda terlebih dahulu.", 'error');
            return;
        }
        const result = requestPasswordReset(email);
        if (result.success) {
            addToast("Permintaan reset password telah dikirim ke admin.", 'success');
        } else {
            addToast(result.message, 'error');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            {error && <p className="text-red-400 text-sm bg-red-900/50 p-3 rounded-lg text-center">{error}</p>}
            <div>
                <label className="block text-sm font-medium text-slate-300">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary"
                />
            </div>
            <div>
                <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-slate-300">Password</label>
                    <button type="button" onClick={handleForgotPassword} className="text-xs text-primary hover:text-sky-400">Lupa Sandi?</button>
                </div>
                 <div className="relative mt-1">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary pr-10"
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200"
                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074L3.707 2.293zM10 12a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" />
                                <path d="M10 17a7 7 0 01-7-7c0-1.551.46-3.016 1.257-4.233l-1.414-1.414A9 9 0 00.458 10c1.274 4.057 5.022 7 9.542 7 .848 0 1.67-.11 2.457-.314l-1.522-1.522A7.003 7.003 0 0110 17z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary"
            >
                Login
            </button>
             <p className="text-sm text-center text-slate-400">
                Belum punya akun?{' '}
                <button type="button" onClick={onSwitchToRegister} className="font-medium text-primary hover:text-sky-400">
                    Daftar di sini
                </button>
            </p>
        </form>
    );
};

export default LoginForm;