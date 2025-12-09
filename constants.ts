
import { ServiceCategory, UnsriFaculty } from './types';

export const CATEGORIES = Object.values(ServiceCategory);
export const UNSRI_FACULTIES = Object.values(UnsriFaculty);

export const SORT_OPTIONS = {
    newest: "Terbaru",
    rating: "Rating Tertinggi",
    price_asc: "Harga Terendah"
};

export const MAX_REPORTS_BEFORE_FLAG = 3;
export const MAX_POSTS_PER_DAY = 5;