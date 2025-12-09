
import React, { useState, useMemo } from 'react';
import { useServices } from '../contexts/ServicesContext';
import { useAuth } from '../contexts/AuthContext';
import { Service, User, UserType } from '../types';
import ServiceDetail from './ServiceDetail';

// PieChart component defined locally
const PieChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
    const colors = ['#38bdf8', '#818cf8', '#f472b6', '#fbbf24', '#4ade80', '#2dd4bf', '#a78bfa', '#f87171'];
    const total = data.reduce((acc, entry) => acc + entry.value, 0);
    if (total === 0) return <p className="text-slate-400">No data available for chart.</p>;

    let accumulated = 0;
    const segments = data.map((entry, index) => {
        const percentage = (entry.value / total) * 100;
        const segment = `${colors[index % colors.length]} ${accumulated}% ${accumulated + percentage}%`;
        accumulated += percentage;
        return segment;
    });

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-40 h-40 rounded-full" style={{ background: `conic-gradient(${segments.join(', ')})` }}></div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {data.map((entry, index) => (
                    <div key={entry.name} className="flex items-center">
                        <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: colors[index % colors.length] }}></div>
                        <span className="text-sm text-slate-300">{entry.name} ({entry.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// BarChart component defined locally
const BarChart: React.FC<{ data: { name: string; value: number, rating: number }[] }> = ({ data }) => {
     if (data.length === 0) return <p className="text-slate-400">No data available for chart.</p>;
     const maxValue = Math.max(...data.map(d => d.value), 1);

     return (
        <div className="space-y-4 pr-4">
            {data.map(item => (
                <div key={item.name} className="flex items-center gap-4">
                    <div className="w-1/3 text-sm text-slate-300 truncate" title={item.name}>{item.name}</div>
                    <div className="w-2/3 bg-slate-700 rounded-full h-6 flex items-center">
                        <div 
                            className="bg-gradient-to-r from-sky-500 to-cyan-400 h-6 rounded-full flex items-center justify-between px-2"
                            style={{ width: `${(item.value / maxValue) * 100}%`}}
                        >
                           <span className="text-xs font-bold text-white">{item.value} views</span>
                           <span className="text-xs font-bold text-yellow-300">★{item.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
     )
}


type AdminTab = 'users' | 'services' | 'help';

const AdminPanel: React.FC = () => {
    const { services, approvePendingService, approveFlaggedService, deleteService } = useServices();
    const { users, banUser, passwordResetRequests, resolvePasswordReset } = useAuth();
    const [reviewingService, setReviewingService] = useState<Service | null>(null);
    const [activeTab, setActiveTab] = useState<AdminTab>('users');

    const pendingServices = services.filter(s => s.status === 'pending');
    const reportedServices = services.filter(s => s.status === 'flagged');
    const allActiveServices = services.filter(s => s.status === 'active');

    const userChartData = useMemo(() => {
        const counts: Record<string, number> = {};
        users.filter(u => u.role !== 'admin').forEach(user => {
            const key = user.userType === UserType.MAHASISWA ? user.faculty || 'Lainnya' : 'Umum';
            counts[key] = (counts[key] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [users]);
    
    const serviceVisitData = useMemo(() => {
        return services
            .filter(s => s.visits.length > 0)
            .sort((a,b) => b.visits.length - a.visits.length)
            .slice(0, 10) // Top 10
            .map(s => ({
                name: s.title,
                value: s.visits.length,
                rating: s.ratings.length > 0 ? s.ratings.reduce((acc, r) => acc + r.rating, 0) / s.ratings.length : 0
            }));
    }, [services]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'users':
                return (
                    <div>
                         <h2 className="text-xl font-semibold text-sky-400 mb-4">Analitik Pengguna</h2>
                         <div className="bg-slate-800 p-4 rounded-lg mb-8">
                            <PieChart data={userChartData} />
                         </div>

                        <h2 className="text-xl font-semibold text-sky-400 mb-4">Manajemen Pengguna ({users.filter(u => u.role !== 'admin').length})</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-slate-800 rounded-lg">
                               <thead className="bg-slate-700">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-slate-300 font-semibold text-sm">Nama</th>
                                        <th className="text-left py-3 px-4 text-slate-300 font-semibold text-sm">Email</th>
                                        <th className="text-left py-3 px-4 text-slate-300 font-semibold text-sm">Tipe</th>
                                        <th className="text-left py-3 px-4 text-slate-300 font-semibold text-sm">Detail</th>
                                        <th className="text-left py-3 px-4 text-slate-300 font-semibold text-sm">Status</th>
                                        <th className="text-left py-3 px-4 text-slate-300 font-semibold text-sm">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.filter(u => u.role !== 'admin').map(user => (
                                        <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                            <td className="py-3 px-4 text-white">{user.name}</td>
                                            <td className="py-3 px-4 text-slate-300">{user.email}</td>
                                            <td className="py-3 px-4 text-slate-300">{user.userType}</td>
                                            <td className="py-3 px-4 text-slate-300 text-xs">
                                                {user.userType === UserType.MAHASISWA ? `NIM: ${user.nim}` : `NIK: ${user.nik}`}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{user.status}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button 
                                                    onClick={() => banUser(user.id)}
                                                    disabled={user.status === 'banned'}
                                                    className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Ban
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'services':
                return (
                    <div>
                        {/* Pending Services Section */}
                        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Jasa Baru (Menunggu Persetujuan) ({pendingServices.length})</h2>
                        {pendingServices.length > 0 ? (
                            <div className="overflow-x-auto mb-8">
                                <table className="min-w-full bg-slate-800 rounded-lg">
                                    {/* ... thead ... */}
                                    <tbody>
                                        {pendingServices.map(service => (
                                            <tr key={service.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                                <td className="py-3 px-4 text-white">{service.title}</td>
                                                <td className="py-3 px-4 text-slate-300">{service.providerName}</td>
                                                <td className="py-3 px-4 flex space-x-2">
                                                    <button onClick={() => setReviewingService(service)} className="bg-sky-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-sky-500">Tinjau</button>
                                                    <button onClick={() => approvePendingService(service.id)} className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-green-500">Setujui</button>
                                                    <button onClick={() => deleteService(service.id)} className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-red-500">Tolak</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : <p className="text-slate-400 mb-8">Tidak ada jasa yang menunggu persetujuan.</p>}
                        
                        {/* Reported Services Section */}
                        <h2 className="text-xl font-semibold text-orange-400 mb-4">Jasa yang Dilaporkan ({reportedServices.length})</h2>
                        {reportedServices.length > 0 ? (
                             <div className="overflow-x-auto mb-8">
                                <table className="min-w-full bg-slate-800 rounded-lg">
                                   {/* ... thead ... */}
                                    <tbody>
                                        {reportedServices.map(service => (
                                            <tr key={service.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                                <td className="py-3 px-4 text-white">{service.title}</td>
                                                <td className="py-3 px-4 text-slate-300">{service.providerName}</td>
                                                <td className="py-3 px-4 text-red-400">{service.reports.length} laporan</td>
                                                <td className="py-3 px-4 flex space-x-2">
                                                    <button onClick={() => setReviewingService(service)} className="bg-sky-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-sky-500">Tinjau</button>
                                                    <button onClick={() => approveFlaggedService(service.id)} className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-green-500">Aktifkan Kembali</button>
                                                    <button onClick={() => deleteService(service.id)} className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-red-500">Hapus</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : <p className="text-slate-400 mb-8">Tidak ada jasa yang dilaporkan saat ini.</p>}
                        
                        <h2 className="text-xl font-semibold text-green-400 mb-4">Jasa Paling Populer</h2>
                        <div className="bg-slate-800 p-4 rounded-lg mb-8">
                            <BarChart data={serviceVisitData} />
                        </div>
                    </div>
                );
            case 'help':
                return (
                     <div>
                        <h2 className="text-xl font-semibold text-indigo-400 mb-4">Permintaan Reset Password ({passwordResetRequests.length})</h2>
                        {passwordResetRequests.length > 0 ? (
                             <div className="overflow-x-auto">
                                <table className="min-w-full bg-slate-800 rounded-lg">
                                    <thead className="bg-slate-700">
                                        <tr>
                                            <th className="text-left py-3 px-4 text-slate-300 font-semibold text-sm">Nama</th>
                                            <th className="text-left py-3 px-4 text-slate-300 font-semibold text-sm">Email</th>
                                            <th className="text-left py-3 px-4 text-slate-300 font-semibold text-sm">Waktu</th>
                                            <th className="text-left py-3 px-4 text-slate-300 font-semibold text-sm">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {passwordResetRequests.map(req => (
                                            <tr key={req.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                                <td className="py-3 px-4 text-white">{req.userName}</td>
                                                <td className="py-3 px-4 text-slate-300">{req.userEmail}</td>
                                                <td className="py-3 px-4 text-slate-300 text-xs">{new Date(req.requestedAt).toLocaleString('id-ID')}</td>
                                                <td className="py-3 px-4">
                                                    <button onClick={() => resolvePasswordReset(req.id)} className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-green-500">Tandai Selesai</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : <p className="text-slate-400">Tidak ada permintaan bantuan saat ini.</p>}
                    </div>
                );
        }
    };

    const TabButton: React.FC<{ tab: AdminTab; label: string; count: number; }> = ({ tab, label, count }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
        >
            {label} <span className="bg-slate-700 text-xs font-bold text-white rounded-full px-2 py-0.5">{count}</span>
        </button>
    );

    return (
        <div className="bg-slate-900/50 p-6 rounded-lg shadow-xl animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-6">Panel Admin</h1>

            <div className="border-b border-slate-700 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <TabButton tab="users" label="Data Pengguna" count={users.length - 1} />
                    <TabButton tab="services" label="Informasi Jasa" count={pendingServices.length + reportedServices.length} />
                    <TabButton tab="help" label="Pusat Bantuan" count={passwordResetRequests.length} />
                </nav>
            </div>
            
            <div>
                {renderTabContent()}
            </div>

            {reviewingService && (
                <ServiceDetail
                    service={reviewingService}
                    onClose={() => setReviewingService(null)}
                />
            )}
        </div>
    );
};

export default AdminPanel;
