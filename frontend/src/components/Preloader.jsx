import React from 'react';

const Preloader = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-primary"></div>
    </div>
);

export default Preloader; 