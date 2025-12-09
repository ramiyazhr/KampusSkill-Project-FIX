import { User, Service, UserType, UnsriFaculty, ServiceCategory } from '../types';

const DUMMY_USERS: User[] = [
    {
        id: 'admin_1',
        name: 'Admin KampusSkill',
        email: 'balakosong@admin.com',
        nim: '00000000',
        passwordHash: '000000',
        isVerified: true,
        role: 'admin',
        userType: UserType.UMUM,
        status: 'active'
    },
    {
        id: 'user_mahasiswa_1',
        name: 'Budi Sanjaya',
        email: 'budi.sanjaya@email.com',
        passwordHash: 'password123',
        isVerified: true,
        role: 'user',
        userType: UserType.MAHASISWA,
        nim: '09021282126040',
        faculty: UnsriFaculty.ILMU_KOMPUTER,
        status: 'active'
    },
    {
        id: 'user_umum_1',
        name: 'Citra Lestari',
        email: 'citra.lestari@email.com',
        passwordHash: 'password123',
        isVerified: true,
        role: 'user',
        userType: UserType.UMUM,
        nik: '1671012345678901',
        occupation: 'Desainer Grafis',
        status: 'active'
    }
];

const DUMMY_SERVICES: Service[] = [
    {
        id: 'service_1',
        providerId: 'user_umum_1',
        providerName: 'Citra Lestari',
        title: 'Jasa Desain Grafis Profesional',
        category: ServiceCategory.DESIGN,
        description: 'Menerima jasa desain logo, poster, spanduk, dan media promosi lainnya. Kualitas profesional dengan harga terjangkau. Revisi hingga 3 kali.',
        price: 150000,
        contact: '081234567890',
        photo: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1152',
        gallery: [],
        gmapsUrl: 'https://maps.app.goo.gl/Hy2emvLMfbkq8AFq8',
        ratings: [
            { userId: 'admin_1', rating: 5, comment: 'Desainnya keren banget!', date: '2023-10-26T10:00:00Z' }
        ],
        reports: [],
        createdAt: '2023-10-26T09:00:00Z',
        status: 'active',
        visits: [
            { userId: 'admin_1', timestamp: Date.now() }
        ]
    },
    {
        id: 'service_2',
        providerId: 'user_mahasiswa_1',
        providerName: 'Budi Sanjaya',
        title: 'Jasa Print & Jilid Cepat',
        category: ServiceCategory.PRINT,
        description: 'Jasa print dokumen (hitam putih/warna) dan jilid skripsi/makalah. Bisa antar jemput di area kampus Bukit. Cepat dan rapi.',
        price: 500,
        contact: '082345678901',
        photo: 'https://lh3.googleusercontent.com/-Rf9_rcnAE8w/YySSo2GHyvI/AAAAAAAAAJg/It56t2C2EXs98ahF-5oND_CMRo6utP4eACNcBGAsYHQ/w1200-h630-p-k-no-nu/1663341216324033-0.png',
        gallery: [],
        gmapsUrl: 'https://maps.app.goo.gl/GyLC9HU8FzrWStaE7',
        ratings: [
             { userId: 'admin_1', rating: 4, comment: 'Pengerjaan cepat, mantap.', date: '2023-10-25T14:00:00Z' }
        ],
        reports: [],
        createdAt: '2023-10-25T11:00:00Z',
        status: 'active',
        visits: [
             { userId: 'admin_1', timestamp: Date.now() - 100000 }
        ]
    },
    {
        id: 'service_3',
        providerId: 'user_mahasiswa_1',
        providerName: 'Budi Sanjaya',
        title: 'Les Privat Matematika & Fisika',
        category: ServiceCategory.TUTORING,
        description: 'Bimbingan belajar privat untuk mata pelajaran Matematika dan Fisika tingkat SMA. Dibimbing oleh mahasiswa Fasilkom Unsri. Waktu fleksibel.',
        price: 75000,
        contact: '082345678901',
        photo: 'https://images.pexels.com/photos/6929193/pexels-photo-6929193.jpeg',
        gallery: [],
        gmapsUrl: 'https://maps.app.goo.gl/Vg6XWceyqQ8yyR7f7',
        ratings: [],
        reports: [],
        createdAt: '2023-10-24T18:00:00Z',
        status: 'active',
        visits: []
    },
    {
        id: 'service_4',
        providerId: 'user_umum_1',
        providerName: 'Citra Lestari',
        title: 'Jasa Video Editing Reels/TikTok',
        category: ServiceCategory.VIDEO_EDITING,
        description: 'Edit video pendek untuk kebutuhan Instagram Reels, TikTok, atau Shorts. Termasuk color grading, transisi, dan penambahan musik. Dapatkan video yang estetik dan menarik!',
        price: 200000,
        contact: '081234567890',
        photo: 'https://media.istockphoto.com/id/2215445144/id/foto/kantor-kreatif-kosong-untuk-videografer-dan-editor-yang-menampilkan-pengaturan-kerja-modern.jpg?s=1024x1024&w=is&k=20&c=lI-x5Rxlh2QBZn_jdAAgDWVSn_AQqYwSgdBen4YU8-4=',
        gallery: [],
        gmapsUrl: 'https://maps.app.goo.gl/gCcWd2oUa7QM3n6X7',
        ratings: [
             { userId: 'admin_1', rating: 5, comment: '', date: '2023-10-26T11:00:00Z' }
        ],
        reports: [],
        createdAt: '2023-10-26T10:30:00Z',
        status: 'active',
        visits: [
            { userId: 'admin_1', timestamp: Date.now() },
            { userId: 'user_mahasiswa_1', timestamp: Date.now() }
        ]
    },
    {
        id: 'service_5',
        providerId: 'user_mahasiswa_1',
        providerName: 'Budi Sanjaya',
        title: 'Jasa Fotografi Wisuda & Event',
        category: ServiceCategory.PHOTOGRAPHY,
        description: 'Abadikan momen spesial wisuda atau event kampusmu. Paket termasuk sesi foto 2 jam, 25 foto editan terbaik, dan semua file asli. Gear profesional.',
        price: 500000,
        contact: '082345678901',
        photo: 'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg',
        gallery: [],
        gmapsUrl: 'https://maps.app.goo.gl/KQC5RpM5JAYpuVey6',
        ratings: [],
        reports: [],
        createdAt: '2023-10-23T12:00:00Z',
        status: 'active',
        visits: [
            { userId: 'admin_1', timestamp: Date.now() - 200000 }
        ]
    }
];

export const getInitialData = () => {
    try {
        // --- User Data Handling ---
        const usersData = localStorage.getItem('users');
        let initialUsers = DUMMY_USERS;
        if (!usersData) {
            localStorage.setItem('users', JSON.stringify(DUMMY_USERS));
        } else {
            const storedUsers = JSON.parse(usersData);
            // Simple check to see if it's the very first default data
            if (storedUsers.length === 1 && storedUsers[0].id === 'admin_1') {
                 localStorage.setItem('users', JSON.stringify(DUMMY_USERS));
                 initialUsers = DUMMY_USERS;
            } else {
                initialUsers = storedUsers;
            }
        }

        // --- Service Data Handling ---
        const servicesData = localStorage.getItem('services');
        let initialServices: Service[] = DUMMY_SERVICES;

        if (!servicesData || JSON.parse(servicesData).length === 0) {
            localStorage.setItem('services', JSON.stringify(DUMMY_SERVICES));
        } else {
            const storedServices: Service[] = JSON.parse(servicesData);
            initialServices = storedServices.map(s => ({ ...s, visits: s.visits || [] }));
        }
        
        return { users: initialUsers, services: initialServices };

    } catch (error) {
        console.error("Gagal memproses data localStorage, mereset ke default.", error);
        localStorage.setItem('users', JSON.stringify(DUMMY_USERS));
        localStorage.setItem('services', JSON.stringify(DUMMY_SERVICES));
        return { users: DUMMY_USERS, services: DUMMY_SERVICES };
    }
};


export const saveData = (key: 'users' | 'services', data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Failed to save data for key: ${key}`, error);
    }
};