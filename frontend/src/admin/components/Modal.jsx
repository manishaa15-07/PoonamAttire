import React from 'react';

const Modal = ({ open, onClose, title, children, actions }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl">&times;</button>
                {title && <h2 className="text-xl font-bold mb-4 text-[#DA6220]">{title}</h2>}
                <div>{children}</div>
                {actions && <div className="mt-6 flex justify-end gap-2">{actions}</div>}
            </div>
        </div>
    );
};

export default Modal; 