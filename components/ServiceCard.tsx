
import React, { useState } from 'react';
import { Service, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../contexts/ServicesContext';
import { useToast } from '../contexts/ToastContext';
import { MAX_REPORTS_BEFORE_FLAG } from '../constants';
import Modal from './Modal';
import RatingForm from './RatingForm';

interface ServiceCardProps {
    service: Service;
    onViewDetail: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const StarIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className} ${filled ? 'text-yellow-400' : 'text-slate-600'}`}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" />
    </svg>
);

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onViewDetail, onEdit, onDelete }) => {
    const { user } = useAuth();
    const { reportService, toggleFavorite, isFavorite } = useServices();
    const { addToast } = useToast();
    const [showContact, setShowContact] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);

    const avgRating = service.ratings.length > 0
        ? service.ratings.reduce((acc, r) => acc + r.rating, 0) / service.ratings.length
        : 0;

    const handleReport = () => {
        if (!user) {
            addToast("Anda harus login untuk melaporkan jasa.", 'error');
            return;
        }
        reportService(service.id, user.id);
        addToast("Jasa berhasil dilaporkan. Terima kasih atas masukan Anda.", 'success');
    };
    
    const handleFavoriteToggle = () => {
        if (!user) {
            addToast("Anda harus login untuk menambahkan ke favorit.", 'error');
            return;
        }
        toggleFavorite(service.id);
        addToast(isFavorite(service.id) ? "Dihapus dari favorit." : "Ditambahkan ke favorit.", 'info');
    };

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const StatusBadge = () => {
        if (!onEdit || service.status === 'active') return null;

        const statusMap = {
            pending: { text: 'Menunggu Persetujuan', color: 'bg-yellow-500/80' },
            flagged: { text: 'Dilaporkan', color: 'bg-red-600/80' },
        };
        
        const statusInfo = statusMap[service.status as keyof typeof statusMap];

        if (!statusInfo) return null;

        return (
             <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full text-white ${statusInfo.color} backdrop-blur-sm`}>
                {statusInfo.text}
            </div>
        )
    }

    return (
        <>
            <div 
                className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 flex flex-col cursor-pointer group hover:-translate-y-1"
                onClick={onViewDetail}
            >
                {service.photo && (
                    <div className="overflow-hidden h-48 relative">
                         <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={service.photo} alt={service.title} />
                         <StatusBadge />
                    </div>
                )}
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start text-xs">
                         <span className="font-semibold bg-secondary/20 text-secondary px-2 py-1 rounded-full">{service.category}</span>
                         <div className="flex items-center space-x-3">
                            <div className="flex items-center" title="Rating">
                                <StarIcon filled={true} className="w-4 h-4" />
                                <span className="text-white font-bold ml-1">{avgRating.toFixed(1)}</span>
                                <span className="text-slate-400 ml-1">({service.ratings.length})</span>
                            </div>
                             <div className="flex items-center text-slate-400" title="Dilihat">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                                <span className="ml-1 font-medium">{service.visits.length}</span>
                            </div>
                         </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-3 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">oleh {service.providerName}</p>
                    <p className="text-slate-300 mt-3 text-sm flex-grow">{service.description.substring(0, 100)}{service.description.length > 100 && '...'}</p>
                    <p className="text-2xl font-bold text-primary mt-4">
                        Rp {service.price.toLocaleString('id-ID')}
                    </p>
                    <div className="mt-5 pt-4 border-t border-slate-700 flex justify-between items-center" onClick={stopPropagation}>
                        <button
                            onClick={() => setShowContact(!showContact)}
                            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-sky-400 transition-colors"
                        >
                            {showContact ? service.contact : 'Lihat Kontak'}
                        </button>
                        <div className="flex items-center space-x-2">
                             {onEdit && onDelete ? (
                                <>
                                    <button onClick={onEdit} className="text-slate-400 hover:text-sky-400 transition-colors p-1" title="Edit Jasa">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                    </button>
                                    <button onClick={onDelete} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Hapus Jasa">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                    </button>
                                </>
                             ) : (
                                <>
                                    <button onClick={handleFavoriteToggle} className="text-slate-400 hover:text-red-500 transition-colors" title={isFavorite(service.id) ? "Hapus dari Favorit" : "Tambah ke Favorit"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite(service.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} className="w-6 h-6 text-red-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => user ? setShowRatingModal(true) : addToast("Anda harus login untuk memberi rating.", 'error')}
                                        className="text-slate-400 hover:text-yellow-400 transition-colors"
                                        title="Beri Rating"
                                    >
                                        <StarIcon filled={false} className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={handleReport}
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                        title="Laporkan"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                                        </svg>
                                    </button>
                                </>
                             )}
                        </div>
                    </div>
                </div>
            </div>
            
            {user && (
                 <Modal isOpen={showRatingModal} onClose={() => setShowRatingModal(false)} title={`Beri Rating untuk "${service.title}"`}>
                    <RatingForm serviceId={service.id} onSuccess={() => setShowRatingModal(false)} />
                 </Modal>
            )}
        </>
    );
};

export default ServiceCard;