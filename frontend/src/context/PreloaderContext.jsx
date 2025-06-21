import React, { createContext, useContext, useState } from 'react';
import Preloader from '../components/Preloader';

const PreloaderContext = createContext();

export const usePreloader = () => useContext(PreloaderContext);

export const PreloaderProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <PreloaderContext.Provider value={{ setIsLoading }}>
            {isLoading && <Preloader />}
            {children}
        </PreloaderContext.Provider>
    );
}; 