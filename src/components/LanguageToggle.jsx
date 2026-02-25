import { useLang } from '../context/LanguageContext.jsx';
import './LanguageToggle.css';

export default function LanguageToggle() {
    const { lang, toggleLang } = useLang();
    return (
        <button
            className="lang-toggle"
            onClick={toggleLang}
            title="Switch Language / ഭാഷ മാറ്റുക"
            aria-label="Toggle Language"
        >
            <span className={lang === 'en' ? 'active' : ''}>EN</span>
            <span className="divider">|</span>
            <span className={lang === 'ml' ? 'active' : ''}>മല</span>
        </button>
    );
}
