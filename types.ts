
export enum ServiceCategory {
    PRINT = "Print",
    DESIGN = "Desain",
    VIDEO_EDITING = "Edit Video",
    TUTORING = "Les Privat",
    PHOTOGRAPHY = "Fotografi",
    IT = "IT",
    OTHER = "Lainnya"
}

export enum UserType {
    MAHASISWA = "Mahasiswa",
    UMUM = "Umum",
}

export enum UnsriFaculty {
    ILMU_KOMPUTER = "Fakultas Ilmu Komputer",
    PERTANIAN = "Fakultas Pertanian",
    KEGURUAN_DAN_ILMU_PENDIDIKAN = "Fakultas Keguruan dan Ilmu Pendidikan",
    EKONOMI = "Fakultas Ekonomi",
    HUKUM = "Fakultas Hukum",
    TEKNIK = "Fakultas Teknik",
    KESEHATAN_MASYARAKAT = "Fakultas Kesehatan Masyarakat",
}


export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string; // In a real app, this would be a hash
    isVerified: boolean;
    role: 'user' | 'admin';
    userType: UserType;
    status: 'active' | 'banned';

    // Mahasiswa fields
    nim?: string;
    faculty?: UnsriFaculty;

    // Umum fields
    nik?: string;
    occupation?: string;
}


export interface Rating {
    userId: string;
    rating: number; // 1-5
    comment: string;
    date: string;
}

export interface Visit {
    userId: string;
    timestamp: number;
}

export interface Service {
    id: string;
    providerId: string;
    providerName: string;
    title: string;
    category: ServiceCategory;
    description: string;
    price: number;
    contact: string;
    photo?: string; // base64 data URL
    gallery?: string[]; // array of base64 data URLs
    gmapsUrl?: string; // Google Maps share URL
    ratings: Rating[];
    reports: string[]; // array of user IDs who reported
    createdAt: string;
    status: 'active' | 'flagged' | 'deleted' | 'pending';
    visits: Visit[];
}

export type NewServiceData = Omit<Service, 'id' | 'providerName' | 'ratings' | 'reports' | 'createdAt' | 'status' | 'visits'>;

export interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface PasswordResetRequest {
    id: string;
    userEmail: string;
    userName: string;
    requestedAt: string;
}