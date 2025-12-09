
import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="relative w-16 h-16">
            <div className="absolute border-4 border-slate-700 rounded-full w-full h-full"></div>
            <div className="absolute border-4 border-t-secondary border-r-secondary rounded-full w-full h-full animate-spin-slow"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary font-bold text-xs">KS</div>
        </div>
    );
};

export default Spinner;
