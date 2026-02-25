import { NavLink, useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext.jsx';
import LanguageToggle from './LanguageToggle.jsx';
import './Navbar.css';

export default function Navbar() {
    const { t } = useLang();
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="nav-brand" onClick={() => navigate('/collector/dashboard')}>
                <div className="nav-logo">🌿</div>
                <div className="nav-title">
                    <span className="nav-name">{t('appName')}</span>
                    <span className="nav-sub">{t('appSubtitle')}</span>
                </div>
            </div>

            <div className="nav-links">
                <NavLink to="/collector/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span>🏠</span>{t('dashboard')}
                </NavLink>
                <NavLink to="/collector/add-schedule" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span>➕</span>{t('addSchedule')}
                </NavLink>
                <NavLink to="/collector/schedules" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span>📋</span>{t('viewCalendar')}
                </NavLink>
            </div>

            <div className="nav-right">
                <LanguageToggle />
                <div className="nav-user">
                    <div className="user-avatar">GC</div>
                </div>
            </div>
        </nav>
    );
}
