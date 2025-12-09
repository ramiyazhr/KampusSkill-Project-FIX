
import React, { useState } from 'react';
import { useServices } from '../contexts/ServicesContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface RatingFormProps {
    serviceId: string;
    onSuccess: () => void;
}

const Star: React.FC<{
    filled: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}> = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={`w-8 h-8 cursor-pointer transition-colors ${filled ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-300'}`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" />
    </svg>
);


const RatingForm: React.FC<RatingFormProps> = ({ serviceId, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const { addRating } = useServices();
    const { user } = useAuth();
    const { addToast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            addToast("Anda harus login untuk memberi rating.", 'error');
            return;
        }
        if (rating === 0) {
            addToast("Silakan pilih rating bintang.", 'error');
            return;
        }
        addRating(serviceId, {
            userId: user.id,
            rating,
            comment,
            date: new Date().toISOString()
        });
        addToast("Rating berhasil dikirim!", 'success');
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Rating Anda</label>
                <div className="flex" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map(star => (
                        <Star
                            key={star}
                            filled={star <= (hoverRating || rating)}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => {}}
                        />
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300">Komentar (Opsional)</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary"
                />
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-sky-600">
                Kirim Rating
            </button>
        </form>
    );
};

export default RatingForm;
