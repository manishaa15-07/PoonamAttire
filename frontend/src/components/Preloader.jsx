import React from 'react';

const Preloader = () => {
    return (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
                <p className="text-lg text-primary font-semibold">Loading...</p>
            </div>
        </div>
    );
};

export default Preloader; 