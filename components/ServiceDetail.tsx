
import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import RatingForm from './RatingForm';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useServices } from '../contexts/ServicesContext';

interface ServiceDetailProps {
    service: Service;
    onClose: () => void;
}

const StarIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className} ${filled ? 'text-yellow-400' : 'text-slate-600'}`}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" />
    </svg>
);

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onClose }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const { recordVisit } = useServices();
    const [mainImage, setMainImage] = useState(service.photo);
    const [showRatingForm, setShowRatingForm] = useState(false);

    useEffect(() => {
        recordVisit(service.id);
    }, [service.id, recordVisit]);

    const avgRating = service.ratings.length > 0
        ? service.ratings.reduce((acc, r) => acc + r.rating, 0) / service.ratings.length
        : 0;

    const allImages = [service.photo, ...(service.gallery || [])].filter(Boolean) as string[];

    const handleRatingClick = () => {
        if (!user) {
            addToast("Anda harus login untuk memberi rating.", 'error');
            return;
        }
        setShowRatingForm(!showRatingForm);
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div
                className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">{service.title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Tutup detail">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        {/* Image Gallery */}
                        <div>
                           {mainImage && (
                             <div className="rounded-lg overflow-hidden mb-4">
                                <img src={mainImage} alt={service.title} className="w-full h-80 object-cover" />
                            </div>
                           )}
                            {allImages.length > 1 && (
                                <div className="flex space-x-2">
                                    {allImages.map((img, index) => (
                                        <button key={index} onClick={() => setMainImage(img)} className={`w-16 h-16 rounded-md overflow-hidden ring-2 ${mainImage === img ? 'ring-primary' : 'ring-transparent hover:ring-sky-600'}`}>
                                            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Service Info */}
                        <div>
                            <span className="text-sm font-semibold bg-secondary/20 text-secondary px-3 py-1 rounded-full">{service.category}</span>
                            <p className="text-sm text-slate-400 mt-3">oleh {service.providerName}</p>
                            <p className="text-3xl font-bold text-primary mt-4">
                                Rp {service.price.toLocaleString('id-ID')}
                            </p>
                            <div className="flex items-center mt-3">
                                <StarIcon filled={true} className="text-yellow-400" />
                                <span className="text-white font-bold ml-1">{avgRating.toFixed(1)}</span>
                                <span className="text-slate-400 text-sm ml-1">({service.ratings.length} penilaian)</span>
                            </div>
                            <p className="text-slate-300 mt-4 whitespace-pre-wrap">{service.description}</p>
                            
                            <div className="mt-6 space-y-3">
                                <a 
                                    href={`https://wa.me/${service.contact.replace(/\D/g, '')}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-green-500 hover:bg-green-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M10.23,1.36c-4.88,0-8.85,3.96-8.85,8.85c0,2.6,1.14,4.95,2.99,6.59L3,20l3.25-1.38c1.55,0.86,3.33,1.36,5.16,1.36 c4.88,0,8.85-3.96,8.85-8.85S15.11,1.36,10.23,1.36z M7.06,14.23c-0.12,0-0.24-0.01-0.36-0.04c-0.49-0.12-0.96-0.3-1.38-0.54 c-0.5-0.29-0.96-0.66-1.38-1.08s-0.79-0.88-1.08-1.38c-0.24-0.42-0.42-0.89-0.54-1.38c-0.03-0.12-0.04-0.24-0.04-0.36 c0-0.12,0.01-0.23,0.02-0.35l0.04-0.27l-0.12-0.29c-0.2-0.49-0.3-1.01-0.3-1.54c0-2.93,2.38-5.31,5.31-5.31 c1.4,0,2.71,0.55,3.69,1.53s1.53,2.29,1.53,3.69c0,2.93-2.38,5.31-5.31,5.31c-0.53,0-1.05-0.1-1.54-0.3l-0.29-0.12l-0.27,0.04 C7.29,14.22,7.18,14.23,7.06,14.23z M12.98,11.23c-0.21-0.11-1.27-0.63-1.47-0.7c-0.2-0.07-0.34-0.11-0.49,0.11 c-0.15,0.21-0.56,0.7-0.68,0.84c-0.13,0.15-0.26,0.17-0.49,0.06c-0.23-0.11-0.96-0.35-1.83-1.13c-0.68-0.6-1.13-1.34-1.27-1.57 c-0.13-0.23-0.01-0.36,0.1-0.46c0.09-0.09,0.21-0.23,0.31-0.34c0.1-0.11,0.13-0.19,0.2-0.31c0.07-0.13,0.03-0.24-0.01-0.36 c-0.05-0.11-0.49-1.17-0.67-1.6c-0.18-0.42-0.36-0.36-0.49-0.36c-0.12,0-0.26-0.01-0.4-0.01s-0.37,0.05-0.56,0.26 c-0.19,0.21-0.73,0.72-0.73,1.75c0,1.03,0.75,2.03,0.85,2.17c0.1,0.15,1.49,2.29,3.61,3.2c0.51,0.22,0.9,0.35,1.21,0.45 c0.54,0.16,1.04,0.14,1.43,0.09c0.43-0.06,1.27-0.52,1.45-1.01c0.18-0.5,0.18-0.92,0.13-1.01 C13.33,11.39,13.19,11.33,12.98,11.23z" />
                                    </svg>
                                    Hubungi via WhatsApp
                                </a>
                                {service.gmapsUrl && (
                                    <a 
                                        href={service.gmapsUrl}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-blue-500 hover:bg-blue-600"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        Lihat Lokasi di Peta
                                    </a>
                                )}
                                <button
                                    onClick={handleRatingClick}
                                    className="w-full flex justify-center py-2.5 px-4 border border-primary rounded-md shadow-sm text-md font-medium text-primary bg-primary/10 hover:bg-primary/20"
                                >
                                    Beri Penilaian
                                </button>
                            </div>
                        </div>
                    </div>

                    {showRatingForm && user && (
                       <div className="p-6 bg-slate-900/50">
                            <h3 className="text-lg font-semibold text-white mb-4">Form Penilaian</h3>
                            <RatingForm serviceId={service.id} onSuccess={() => setShowRatingForm(false)} />
                       </div>
                    )}
                    
                    {/* Ratings & Reviews */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Penilaian & Ulasan ({service.ratings.length})</h3>
                        {service.ratings.length > 0 ? (
                            <div className="space-y-4">
                                {service.ratings.slice(0).reverse().map((rating, index) => (
                                    <div key={index} className="bg-slate-700/50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-slate-300">Pengguna #{rating.userId.slice(-4)}</p>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < rating.rating} />)}
                                            </div>
                                        </div>
                                        {rating.comment && <p className="text-slate-300 mt-2">"{rating.comment}"</p>}
                                        <p className="text-xs text-slate-500 mt-2 text-right">{new Date(rating.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400">Belum ada penilaian untuk jasa ini.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;