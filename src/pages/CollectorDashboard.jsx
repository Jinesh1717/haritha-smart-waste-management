import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext.jsx';
import { formatTime } from '../utils/scheduleValidation.js';
import './CollectorDashboard.css';

export default function CollectorDashboard({ schedules }) {
    const { t } = useLang();
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];
    const weekEnd = new Date(); weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    const stats = useMemo(() => {
        const todaySchedules = schedules.filter(s => s.date === today);
        const weekSchedules = schedules.filter(s => s.date >= today && s.date <= weekEndStr);
        const completedToday = todaySchedules.filter(s => s.status === 'completed');
        return {
            total: schedules.length,
            today: todaySchedules.length,
            week: weekSchedules.length,
            completed: completedToday.length,
        };
    }, [schedules, today, weekEndStr]);

    const upcoming = useMemo(() =>
        schedules
            .filter(s => s.date >= today)
            .slice(0, 5),
        [schedules, today]
    );

    const getAreaShort = (area) => {
        const map = {
            area_colombo_01: 'CMB 01', area_colombo_02: 'CMB 02', area_colombo_03: 'CMB 03',
            area_colombo_04: 'CMB 04', area_colombo_05: 'CMB 05', area_colombo_06: 'CMB 06',
            area_colombo_07: 'CMB 07', area_colombo_08: 'CMB 08', area_colombo_09: 'CMB 09',
            area_colombo_10: 'CMB 10',
        };
        return map[area] || area;
    };

    const getDateLabel = (dateStr) => {
        if (dateStr === today) return t('today');
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        if (dateStr === tomorrow.toISOString().split('T')[0]) return t('tomorrow');
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-LK', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="page-wrapper">
            {/* Hero Header */}
            <div className="dash-hero">
                <div className="dash-hero-icon">🚛</div>
                <div>
                    <h1 className="dash-title">{t('welcome')}</h1>
                    <p className="dash-sub">{t('collectorPortal')}</p>
                </div>
                <div className="dash-date-badge">
                    {new Date().toLocaleDateString('en-LK', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stat Cards */}
            <div className="stats-grid">
                <div className="stat-card stat-total">
                    <div className="stat-icon">📊</div>
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">{t('totalSchedules')}</div>
                </div>
                <div className="stat-card stat-today">
                    <div className="stat-icon">📅</div>
                    <div className="stat-value">{stats.today}</div>
                    <div className="stat-label">{t('todayCollections')}</div>
                </div>
                <div className="stat-card stat-week">
                    <div className="stat-icon">🗓️</div>
                    <div className="stat-value">{stats.week}</div>
                    <div className="stat-label">{t('weekSchedules')}</div>
                </div>
                <div className="stat-card stat-done">
                    <div className="stat-icon">✅</div>
                    <div className="stat-value">{stats.completed}</div>
                    <div className="stat-label">{t('completedToday')}</div>
                </div>
            </div>

            <div className="dash-bottom">
                {/* Upcoming Schedules */}
                <div className="dash-panel">
                    <div className="panel-header">
                        <h2 className="panel-title">🗓️ {t('upcomingSchedules')}</h2>
                    </div>
                    <div className="panel-body">
                        {upcoming.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📭</div>
                                <p>{t('noSchedules')}</p>
                                <small>{t('noSchedulesDesc')}</small>
                            </div>
                        ) : (
                            <ul className="upcoming-list">
                                {upcoming.map(s => (
                                    <li key={s.id} className={`upcoming-item ${s.status}`}>
                                        <div className="upcoming-left">
                                            <div className="waste-dot"
                                                style={{ background: s.wasteType === 'biological' ? '#40916c' : '#0077b6' }}
                                            />
                                            <div>
                                                <div className="upcoming-area">{t(s.area)}</div>
                                                <div className="upcoming-meta">
                                                    {getDateLabel(s.date)} • {formatTime(s.time)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="upcoming-right">
                                            <span className={`badge ${s.wasteType === 'biological' ? 'badge-bio' : 'badge-plastic'}`}>
                                                {s.wasteType === 'biological' ? '🌱' : '♻️'} {t(s.wasteType)}
                                            </span>
                                            {s.status === 'completed' && (
                                                <span className="badge badge-completed">✓ {t('completed')}</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dash-panel quick-panel">
                    <div className="panel-header">
                        <h2 className="panel-title">⚡ {t('quickActions')}</h2>
                    </div>
                    <div className="panel-body">
                        <div className="quick-actions">
                            <button
                                className="quick-btn quick-add"
                                onClick={() => navigate('/collector/add-schedule')}
                            >
                                <span className="quick-btn-icon">➕</span>
                                <div>
                                    <div className="quick-btn-label">{t('addNewSchedule')}</div>
                                    <div className="quick-btn-sub">{t('scheduleInfo')}</div>
                                </div>
                            </button>
                            <button
                                className="quick-btn quick-view"
                                onClick={() => navigate('/collector/schedules')}
                            >
                                <span className="quick-btn-icon">📋</span>
                                <div>
                                    <div className="quick-btn-label">{t('viewAllSchedules')}</div>
                                    <div className="quick-btn-sub">{t('filterByArea')}</div>
                                </div>
                            </button>
                        </div>

                        {/* Waste type legend */}
                        <div className="legend">
                            <div className="legend-item">
                                <div className="legend-dot" style={{ background: '#40916c' }} />
                                <span>🌱 {t('biological')}</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-dot" style={{ background: '#0077b6' }} />
                                <span>♻️ {t('plastic')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
