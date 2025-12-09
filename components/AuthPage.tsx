import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="min-h-screen bg-dark flex flex-col justify-center items-center p-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        KampusSkill
                    </span>
                </h1>
                <p className="text-slate-400 mt-2">Marketplace Jasa Mahasiswa & Umum</p>
            </div>
            <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl shadow-black/30 border border-slate-700">
                {isLoginView ? (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login Akun</h2>
                        <LoginForm onSwitchToRegister={() => setIsLoginView(false)} />
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Daftar Akun Baru</h2>
                        <RegisterForm onSwitchToLogin={() => setIsLoginView(true)} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthPage;