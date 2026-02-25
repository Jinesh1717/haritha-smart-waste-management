import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../i18n/translations.js';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('haritham_lang') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('haritham_lang', lang);
        document.documentElement.lang = lang === 'ml' ? 'ml' : 'en';
    }, [lang]);

    const t = (key) => translations[lang]?.[key] || key;
    const toggleLang = () => setLang(l => l === 'en' ? 'ml' : 'en');

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLang() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLang must be used within LanguageProvider');
    return ctx;
}
