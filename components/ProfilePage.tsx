import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../contexts/ServicesContext';
import { Service, UserType } from '../types';
import PostServiceForm from './PostServiceForm';
import Modal from './Modal';
import ServiceCard from './ServiceCard';

interface ProfilePageProps {
    onViewDetail: (service: Service) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onViewDetail }) => {
    const { user } = useAuth();
    const { services, deleteService, isFavorite } = useServices();
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [activeTab, setActiveTab] = useState<'myServices' | 'favorites'>('myServices');

    if (!user) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-slate-400">Silakan login untuk melihat profil Anda.</h2>
            </div>
        );
    }
    
    const myServices = services.filter(s => s.providerId === user.id && s.status !== 'deleted');
    const favoriteServices = services.filter(s => isFavorite(s.id));

    const handleDelete = (serviceId: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus jasa ini?")) {
            deleteService(serviceId);
        }
    };
    
    const renderServices = (serviceList: Service[]) => {
      if (serviceList.length === 0) {
        return <p className="text-slate-400 mt-4">{activeTab === 'myServices' ? "Anda belum memposting jasa apapun." : "Anda belum memiliki jasa favorit."}</p>;
      }
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {serviceList.map(service => (
                 <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onViewDetail={() => onViewDetail(service)}
                    onEdit={activeTab === 'myServices' ? () => setEditingService(service) : undefined}
                    onDelete={activeTab === 'myServices' ? () => handleDelete(service.id) : undefined}
                />
            ))}
        </div>
      );
    };

    return (
        <div className="bg-slate-900/50 p-6 rounded-lg shadow-xl animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Profil Saya</h1>
            <p className="text-slate-400">Nama: {user.name}</p>
            <p className="text-slate-400">Email: {user.email}</p>
            {user.userType === UserType.MAHASISWA && (
                <>
                    <p className="text-slate-400">NIM: {user.nim}</p>
                    <p className="text-slate-400">Fakultas: {user.faculty}</p>
                </>
            )}
            {user.userType === UserType.UMUM && (
                 <>
                    <p className="text-slate-400">NIK: {user.nik}</p>
                    <p className="text-slate-400">Pekerjaan: {user.occupation}</p>
                </>
            )}

            <div className="mt-8">
                <div className="border-b border-slate-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('myServices')}
                            className={`${activeTab === 'myServices' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Jasa Saya ({myServices.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`${activeTab === 'favorites' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Favorit ({favoriteServices.length})
                        </button>
                    </nav>
                </div>
                
                <div className="mt-6">
                  {activeTab === 'myServices' && renderServices(myServices)}
                  {activeTab === 'favorites' && renderServices(favoriteServices)}
                </div>
            </div>

            <Modal isOpen={!!editingService} onClose={() => setEditingService(null)} title="Edit Jasa">
                {editingService && (
                    <PostServiceForm
                        onSuccess={() => setEditingService(null)}
                        existingService={editingService}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ProfilePage;