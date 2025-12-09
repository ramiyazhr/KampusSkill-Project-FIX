import React, { useState, useEffect } from 'react';
import { useServices } from '../contexts/ServicesContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { NewServiceData, Service, ServiceCategory } from '../types';
import { CATEGORIES, MAX_POSTS_PER_DAY } from '../constants';

interface PostServiceFormProps {
    onSuccess: () => void;
    existingService?: Service;
}

const PostServiceForm: React.FC<PostServiceFormProps> = ({ onSuccess, existingService }) => {
    const { addService, updateService, getTodaysPostsCount } = useServices();
    const { user } = useAuth();
    const { addToast } = useToast();
    
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<ServiceCategory>(CATEGORIES[0]);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [contact, setContact] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [gmapsUrl, setGmapsUrl] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingService) {
            setTitle(existingService.title);
            setCategory(existingService.category);
            setDescription(existingService.description);
            setPrice(String(existingService.price));
            setContact(existingService.contact);
            setGmapsUrl(existingService.gmapsUrl || '');
            const allImages = [existingService.photo, ...(existingService.gallery || [])].filter(Boolean) as string[];
            setImages(allImages);
        }
    }, [existingService]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = e.target.files;
            if (images.length + files.length > 5) {
                addToast("Anda hanya dapat mengunggah maksimal 5 gambar.", 'error');
                return;
            }

            // FIX: The original 'for...of' loop with `Array.from` was causing a type inference issue in some environments.
            // This has been replaced with a standard `for` loop that is more robust for iterating over a FileList.
            for (let i = 0; i < files.length; i++) {
                const file = files.item(i);
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (typeof reader.result === 'string') {
                            setImages(prevImages => [...prevImages, reader.result]);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    };
    
    const handleRemoveImage = (indexToRemove: number) => {
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError("Anda harus login untuk memposting jasa.");
            return;
        }
        
        if (!existingService && getTodaysPostsCount(user.id) >= MAX_POSTS_PER_DAY) {
            setError(`Anda telah mencapai batas posting harian (${MAX_POSTS_PER_DAY} jasa).`);
            addToast(`Anda telah mencapai batas posting harian.`, 'error');
            return;
        }

        if (!title || !description || !price || !contact) {
            setError("Semua field kecuali foto wajib diisi.");
            return;
        }

        const serviceData: NewServiceData = {
            providerId: user.id,
            title,
            category,
            description,
            price: Number(price),
            contact,
            photo: images.length > 0 ? images[0] : undefined,
            gallery: images.length > 1 ? images.slice(1) : [],
            gmapsUrl: gmapsUrl.trim() || undefined,
        };

        if (existingService) {
            updateService(existingService.id, { 
                ...existingService, 
                ...serviceData,
                photo: images.length > 0 ? images[0] : undefined,
                gallery: images.length > 1 ? images.slice(1) : [],
            });
            addToast('Jasa berhasil diperbarui!', 'success');
        } else {
            // FIX: The `addService` function expects `NewServiceData`, which does not include `visits`.
            // The `visits` array is added within the `addService` implementation in the context.
            // The previous implementation passed an extra property and used a type cast to bypass this.
            addService(serviceData);
            addToast('Jasa baru berhasil diposting!', 'success');
        }
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 text-sm bg-red-900/50 p-2 rounded">{error}</p>}
            
            <div>
                <label className="block text-sm font-medium text-slate-300">Judul Jasa</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-300">Kategori</label>
                <select value={category} onChange={e => setCategory(e.target.value as ServiceCategory)} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary">
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300">Deskripsi</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300">Harga (Rp)</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300">Kontak (WA/Email)</label>
                    <input type="text" value={contact} onChange={e => setContact(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" />
                </div>
            </div>
            
             <div>
                <label className="block text-sm font-medium text-slate-300">URL Google Maps (Opsional)</label>
                <input 
                  type="url" 
                  value={gmapsUrl} 
                  onChange={e => setGmapsUrl(e.target.value)} 
                  placeholder="https://maps.app.goo.gl/..."
                  className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" 
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300">Foto Jasa (Maks. 5, foto pertama akan menjadi utama)</label>
                <input type="file" onChange={handlePhotoUpload} accept="image/*" multiple className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-secondary hover:file:bg-violet-100"/>
                 {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {images.map((imgSrc, index) => (
                            <div key={index} className="relative group aspect-square">
                                <img src={imgSrc} alt={`Preview ${index + 1}`} className="rounded-lg object-cover h-full w-full" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Hapus gambar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </button>
                                {index === 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-0.5 rounded-b-lg">Utama</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-sky-600">
                {existingService ? 'Simpan Perubahan' : 'Posting Jasa'}
            </button>
        </form>
    );
};

export default PostServiceForm;