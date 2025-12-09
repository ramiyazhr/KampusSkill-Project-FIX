
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import PostServiceForm from './PostServiceForm';

interface HeaderProps {
    setCurrentPage: (page: 'home' | 'profile' | 'admin') => void;
    currentPage: string;
}

const NavLink: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    isMobile?: boolean;
}> = ({ onClick, isActive, children, isMobile = false }) => (
    <button
        onClick={onClick}
        className={`font-medium transition-all duration-200 ${
            isMobile
                ? `block w-full text-left px-4 py-3 text-lg mb-1 rounded-r-lg ${
                    isActive 
                    ? 'bg-gradient-to-r from-sky-600/30 to-transparent text-sky-400 border-l-4 border-sky-500 pl-4 shadow-[0_0_15px_rgba(14,165,233,0.2)] backdrop-brightness-125' 
                    : 'text-slate-300 hover:bg-slate-700/50 border-l-4 border-transparent'
                  }`
                : `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-sky-500/20 text-sky-400' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`
        }`}
    >
        {children}
    </button>
);

const MobileTab: React.FC<{
    onClick: () => void;
    isActive: boolean;
    label: string;
    icon?: React.ReactNode;
}> = ({ onClick, isActive, label, icon }) => (
    <button
        onClick={onClick}
        className={`flex-1 relative py-3 text-sm font-medium transition-all duration-300 flex flex-col items-center justify-center ${
            isActive ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
        }`}
    >
        {/* Background Glow for Active State */}
        {isActive && (
            <div className="absolute inset-0 bg-gradient-to-t from-sky-500/10 to-transparent"></div>
        )}
        
        <span className="relative z-10 flex items-center gap-1">
            {icon}
            {label}
        </span>

        {/* Bottom Highlight Line with Shadow */}
        {isActive && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-sky-500 shadow-[0_-2px_10px_rgba(14,165,233,0.8)] rounded-t-full"></div>
        )}
    </button>
);

const Header: React.FC<HeaderProps> = ({ setCurrentPage, currentPage }) => {
    const { user, logout } = useAuth();
    const [showPostServiceModal, setShowPostServiceModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = (page: 'home' | 'profile' | 'admin') => {
        setCurrentPage(page);
        setIsMobileMenuOpen(false);
    };

    if (!user) return null;

    return (
        <>
            <header className="bg-slate-800/90 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-black/20 border-b border-slate-700/50">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left Side: Logo & Desktop Nav */}
                        <div className="flex items-center">
                            <div
                                className="flex-shrink-0 text-white text-xl font-bold cursor-pointer"
                                onClick={() => navigate('home')}
                            >
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    KampusSkill
                                </span>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <NavLink onClick={() => navigate('home')} isActive={currentPage === 'home'}>
                                        Home
                                    </NavLink>
                                    <NavLink onClick={() => navigate('profile')} isActive={currentPage === 'profile'}>
                                        Profil Saya
                                    </NavLink>
                                    {user.role === 'admin' && (
                                        <NavLink onClick={() => navigate('admin')} isActive={currentPage === 'admin'}>
                                            Panel Admin
                                        </NavLink>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Actions & Hamburger */}
                        <div className="flex items-center">
                             <button
                                onClick={() => setShowPostServiceModal(true)}
                                className="mr-4 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg shadow-md hover:scale-105 transform transition-transform duration-200 whitespace-nowrap"
                            >
                                + Jasa
                            </button>
                            <div className="hidden md:block">
                                <div className="flex items-center">
                                    <span className="text-slate-300 mr-4 hidden sm:block">Hai, {user.name}</span>
                                    <button
                                        onClick={logout}
                                        className="px-3 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                            <div className="md:hidden">
                                <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-300 hover:text-white p-2" aria-label="Buka menu">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* NEW: Mobile Navigation Tabs (Visible on Dashboard) */}
                <div className="md:hidden flex w-full border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                    <MobileTab 
                        label="Home" 
                        isActive={currentPage === 'home'} 
                        onClick={() => navigate('home')} 
                    />
                    <MobileTab 
                        label="Profil Saya" 
                        isActive={currentPage === 'profile'} 
                        onClick={() => navigate('profile')} 
                    />
                    {user.role === 'admin' && (
                        <MobileTab 
                            label="Admin" 
                            isActive={currentPage === 'admin'} 
                            onClick={() => navigate('admin')} 
                        />
                    )}
                </div>
            </header>

            {/* Mobile Menu Overlay (Mainly for Logout/Identity now) */}
            <div className={`fixed inset-0 z-50 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                <div className="relative bg-slate-800 w-72 h-full ml-auto p-4 flex flex-col shadow-2xl">
                    <button onClick={() => setIsMobileMenuOpen(false)} className="self-end p-2 text-slate-400 hover:text-white mb-4" aria-label="Tutup menu">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    {/* User Info Section */}
                    <div className="mb-6 pb-6 border-b border-slate-700">
                         <p className="text-slate-400 text-sm mb-1">Login sebagai</p>
                         <p className="font-semibold text-white text-lg truncate">{user.name}</p>
                         <p className="text-sky-500 text-sm">{user.email}</p>
                    </div>

                    <nav className="flex-grow space-y-2">
                        {/* Redundant links kept for completeness, but Tabs are primary now */}
                        <NavLink onClick={() => navigate('home')} isActive={currentPage === 'home'} isMobile>Home</NavLink>
                        <NavLink onClick={() => navigate('profile')} isActive={currentPage === 'profile'} isMobile>Profil Saya</NavLink>
                        {user.role === 'admin' && (
                             <NavLink onClick={() => navigate('admin')} isActive={currentPage === 'admin'} isMobile>Panel Admin</NavLink>
                        )}
                    </nav>

                    <div className="py-6 mt-auto">
                        <button
                            onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                            className="w-full text-left px-4 py-3 text-lg font-medium text-red-400 bg-slate-700/30 hover:bg-red-500/10 rounded-lg transition-colors flex items-center border border-red-500/20"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={showPostServiceModal} onClose={() => setShowPostServiceModal(false)} title="Posting Jasa Baru">
                <PostServiceForm onSuccess={() => setShowPostServiceModal(false)} />
            </Modal>
        </>
    );
};

export default Header;
