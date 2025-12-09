import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Service, NewServiceData, Rating } from '../types';
import { getInitialData, saveData } from '../services/dataService';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { MAX_REPORTS_BEFORE_FLAG } from '../constants';

interface ServicesContextType {
    services: Service[];
    loading: boolean;
    addService: (serviceData: NewServiceData) => void;
    updateService: (serviceId: string, updatedData: Service) => void;
    deleteService: (serviceId: string) => void;
    addRating: (serviceId: string, rating: Rating) => void;
    reportService: (serviceId: string, userId: string) => void;
    approveFlaggedService: (serviceId: string) => void;
    approvePendingService: (serviceId: string) => void;
    getTodaysPostsCount: (userId: string) => number;
    toggleFavorite: (serviceId: string) => void;
    isFavorite: (serviceId: string) => boolean;
    recordVisit: (serviceId: string) => void;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);
    const { addToast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        setLoading(true);
        // This effect now re-syncs data from localStorage whenever the user logs in or out.
        // This ensures data consistency across different user sessions on the same browser.
        setTimeout(() => {
            const { services: initialServices } = getInitialData();
            setServices(initialServices);
            
            // Favorites are now stored per-user to prevent conflicts.
            if (user) {
                const storedFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
                setFavorites(storedFavorites);
            } else {
                setFavorites([]); // Clear favorites when logged out
            }
            setLoading(false);
        }, 500);
    }, [user]); // Re-run effect when user changes


    const updateAndSaveServices = useCallback((newServices: Service[]) => {
        setServices(newServices);
        saveData('services', newServices);
    }, []);

    const addService = useCallback((serviceData: NewServiceData) => {
        if (!user) return;
        const newService: Service = {
            id: `service_${Date.now()}`,
            ...serviceData,
            providerName: user.name,
            ratings: [],
            reports: [],
            createdAt: new Date().toISOString(),
            status: 'pending',
            visits: [],
        };
        updateAndSaveServices([...services, newService]);
        addToast('Jasa Anda telah dikirim dan menunggu persetujuan admin.', 'info');
    }, [services, user, updateAndSaveServices, addToast]);

    const updateService = useCallback((serviceId: string, updatedData: Service) => {
        const newServices = services.map(s => s.id === serviceId ? updatedData : s);
        updateAndSaveServices(newServices);
    }, [services, updateAndSaveServices]);

    const deleteService = useCallback((serviceId: string) => {
        const newServices = services.map(s => s.id === serviceId ? { ...s, status: 'deleted' as Service['status'] } : s);
        updateAndSaveServices(newServices);
        addToast("Jasa berhasil dihapus.", 'info');
    }, [services, addToast, updateAndSaveServices]);

    const addRating = useCallback((serviceId: string, rating: Rating) => {
        const newServices = services.map(s => {
            if (s.id === serviceId) {
                if (s.providerId === rating.userId) {
                    addToast("Anda tidak dapat memberi rating pada jasa sendiri.", "error");
                    return s;
                }
                if (s.ratings.some(r => r.userId === rating.userId)) {
                    addToast("Anda sudah pernah memberi rating pada jasa ini.", "error");
                    return s;
                }
                return { ...s, ratings: [...s.ratings, rating] };
            }
            return s;
        });
        updateAndSaveServices(newServices);
    }, [services, addToast, updateAndSaveServices]);
    
    const reportService = useCallback((serviceId: string, userId: string) => {
        const newServices = services.map(s => {
            if (s.id === serviceId) {
                 if (s.providerId === userId) {
                    addToast("Anda tidak dapat melaporkan jasa sendiri.", "error");
                    return s;
                }
                if (s.reports.includes(userId)) {
                    addToast("Anda sudah pernah melaporkan jasa ini.", "error");
                    return s;
                }
                const newReports = [...s.reports, userId];
                const newStatus = newReports.length >= MAX_REPORTS_BEFORE_FLAG ? 'flagged' : s.status;
                if(newStatus === 'flagged') {
                    addToast(`Jasa "${s.title}" telah ditandai untuk ditinjau admin.`, "info");
                }
                return { ...s, reports: newReports, status: newStatus };
            }
            return s;
        });
        updateAndSaveServices(newServices);
    }, [services, addToast, updateAndSaveServices]);
    
    const approveFlaggedService = useCallback((serviceId: string) => {
        const newServices = services.map(s => {
            if (s.id === serviceId) {
                return { ...s, status: 'active' as Service['status'], reports: [] };
            }
            return s;
        });
        updateAndSaveServices(newServices);
        addToast("Jasa berhasil disetujui kembali.", "success");
    }, [services, addToast, updateAndSaveServices]);

    const approvePendingService = useCallback((serviceId: string) => {
        const newServices = services.map(s => {
            if (s.id === serviceId) {
                return { ...s, status: 'active' as Service['status'] };
            }
            return s;
        });
        updateAndSaveServices(newServices);
        addToast("Jasa berhasil disetujui dan dipublikasikan.", "success");
    }, [services, addToast, updateAndSaveServices]);

    const getTodaysPostsCount = useCallback((userId: string) => {
        const today = new Date().toISOString().split('T')[0];
        return services.filter(s => s.providerId === userId && s.createdAt.startsWith(today)).length;
    }, [services]);
    
    const toggleFavorite = useCallback((serviceId: string) => {
        if (!user) {
            addToast("Anda harus login untuk mengelola favorit.", "error");
            return;
        }
        const newFavorites = favorites.includes(serviceId)
            ? favorites.filter(id => id !== serviceId)
            : [...favorites, serviceId];
        setFavorites(newFavorites);
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    }, [favorites, user, addToast]);

    const isFavorite = useCallback((serviceId: string) => {
        return favorites.includes(serviceId);
    }, [favorites]);

    const recordVisit = useCallback((serviceId: string) => {
        if (!user) return;

        setServices(prevServices => {
            const serviceToUpdate = prevServices.find(s => s.id === serviceId);
            if (!serviceToUpdate) return prevServices;

            const now = Date.now();
            const oneDayAgo = now - 24 * 60 * 60 * 1000;

            const recentUserVisits = serviceToUpdate.visits.filter(
                visit => visit.userId === user.id && visit.timestamp > oneDayAgo
            );

            if (recentUserVisits.length < 2) {
                const newVisit = { userId: user.id, timestamp: now };
                const updatedService = { ...serviceToUpdate, visits: [...serviceToUpdate.visits, newVisit] };
                
                const newServices = prevServices.map(s => s.id === serviceId ? updatedService : s);
                saveData('services', newServices); // Persist change
                return newServices;
            }
            
            return prevServices; // No change needed
        });
    }, [user]);


    return (
        <ServicesContext.Provider value={{ services, loading, addService, updateService, deleteService, addRating, reportService, approveFlaggedService, approvePendingService, getTodaysPostsCount, toggleFavorite, isFavorite, recordVisit }}>
            {children}
        </ServicesContext.Provider>
    );
};

export const useServices = () => {
    const context = useContext(ServicesContext);
    if (context === undefined) {
        throw new Error('useServices must be used within a ServicesProvider');
    }
    return context;
};