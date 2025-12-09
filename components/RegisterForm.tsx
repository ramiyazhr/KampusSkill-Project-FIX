import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { UserType, UnsriFaculty } from '../types';
import { UNSRI_FACULTIES } from '../constants';

interface RegisterFormProps {
    onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState<UserType>(UserType.MAHASISWA);
    
    // Mahasiswa fields
    const [nim, setNim] = useState('');
    const [faculty, setFaculty] = useState<UnsriFaculty>(UNSRI_FACULTIES[0]);
    
    // Umum fields
    const [nik, setNik] = useState('');
    const [occupation, setOccupation] = useState('');

    const [error, setError] = useState('');
    const { register } = useAuth();
    const { addToast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const commonDetails = { name, email, password, userType };
        let registrationData;

        if (userType === UserType.MAHASISWA) {
            if (!nim || !faculty) {
                setError("NIM dan Fakultas wajib diisi untuk mahasiswa.");
                return;
            }
            if (nim.length < 8 || !/^\d+$/.test(nim)) {
                setError("NIM harus berupa angka dan minimal 8 digit.");
                return;
            }
            registrationData = { ...commonDetails, nim, faculty };
        } else { // Umum
            if (!nik || !occupation) {
                setError("NIK dan Pekerjaan wajib diisi untuk umum.");
                return;
            }
             if (nik.length !== 16 || !/^\d+$/.test(nik)) {
                setError("NIK harus berupa 16 digit angka.");
                return;
            }
            registrationData = { ...commonDetails, nik, occupation };
        }

        const result = register(registrationData);
        if (result.success) {
            addToast('Pendaftaran berhasil! Silakan login.', 'success');
            onSwitchToLogin();
        } else {
            setError(result.message);
        }
    };
    
    const UserTypeSelector = () => (
        <div>
            <label className="block text-sm font-medium text-slate-300">Saya adalah</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setUserType(UserType.MAHASISWA)} className={`px-4 py-2 text-sm rounded-md border ${userType === UserType.MAHASISWA ? 'bg-primary border-primary text-white' : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'}`}>
                    Mahasiswa
                </button>
                <button type="button" onClick={() => setUserType(UserType.UMUM)} className={`px-4 py-2 text-sm rounded-md border ${userType === UserType.UMUM ? 'bg-primary border-primary text-white' : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'}`}>
                    Umum
                </button>
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            {error && <p className="text-red-400 text-sm bg-red-900/50 p-3 rounded-lg text-center">{error}</p>}

            <UserTypeSelector />

            <div>
                <label className="block text-sm font-medium text-slate-300">Nama Lengkap</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" />
            </div>
            
            {userType === UserType.MAHASISWA ? (
                <>
                    <div>
                        <label className="block text-sm font-medium text-slate-300">NIM (Nomor Induk Mahasiswa)</label>
                        <input type="text" value={nim} onChange={(e) => setNim(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300">Fakultas (Universitas Sriwijaya)</label>
                         <select value={faculty} onChange={e => setFaculty(e.target.value as UnsriFaculty)} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary">
                            {UNSRI_FACULTIES.map(fac => <option key={fac} value={fac}>{fac}</option>)}
                        </select>
                    </div>
                </>
            ) : (
                 <>
                    <div>
                        <label className="block text-sm font-medium text-slate-300">NIK (Nomor Induk Kependudukan)</label>
                        <input type="text" value={nik} onChange={(e) => setNik(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300">Pekerjaan</label>
                        <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" />
                    </div>
                </>
            )}

            <div>
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <div className="relative mt-1">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required minLength={6} 
                        className="block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary pr-10" 
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
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-secondary">
                Daftar
            </button>
            <p className="text-sm text-center text-slate-400">
                Sudah punya akun?{' '}
                <button type="button" onClick={onSwitchToLogin} className="font-medium text-primary hover:text-sky-400">
                    Login di sini
                </button>
            </p>
        </form>
    );
};

export default RegisterForm;