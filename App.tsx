
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ServicesProvider } from './contexts/ServicesContext';
import Header from './components/Header';
import ServiceList from './components/ServiceList';
import ProfilePage from './components/ProfilePage';
import AdminPanel from './components/AdminPanel';
import ToastContainer from './components/ToastContainer';
import { ToastProvider } from './contexts/ToastContext';
import { Service } from './types';
import ServiceDetail from './components/ServiceDetail';
import AuthPage from './components/AuthPage';

type Page = 'home' | 'profile' | 'admin';

const AppContent: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <AuthPage />;
    }

    const [currentPage, setCurrentPage] = useState<Page>(user.role === 'admin' ? 'admin' : 'home');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    
    useEffect(() => {
        if (user?.role === 'admin' && currentPage !== 'admin') {
            setCurrentPage('admin');
        } else if (user?.role !== 'admin' && currentPage === 'admin') {
            setCurrentPage('home');
        }
    }, [user, currentPage]);

    const handleViewDetail = (service: Service) => {
        setSelectedService(service);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'profile':
                return <ProfilePage onViewDetail={handleViewDetail} />;
            case 'admin':
                return <AdminPanel />;
            case 'home':
            default:
                return <ServiceList onViewDetail={handleViewDetail} />;
        }
    };

    return (
        <div className="min-h-screen bg-dark">
            <Header setCurrentPage={setCurrentPage} currentPage={currentPage} />
            <main className="container mx-auto px-4 py-8">
                {renderPage()}
            </main>
            <ToastContainer />

            {selectedService && (
                <ServiceDetail 
                    service={selectedService} 
                    onClose={() => setSelectedService(null)} 
                />
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ToastProvider>
            <AuthProvider>
                <ServicesProvider>
                    <AppContent />
                </ServicesProvider>
            </AuthProvider>
        </ToastProvider>
    );
};

export default App;