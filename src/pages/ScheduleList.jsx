import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext.jsx';
import { AREAS, formatDateLabel, formatTime } from '../utils/scheduleValidation.js';
import './ScheduleList.css';

function showToast(msg, type = 'success') {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3300);
}

export default function ScheduleList({ schedules, onDelete, onToggleStatus }) {
    const { t } = useLang();
    const navigate = useNavigate();

    const [filterArea, setFilterArea] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterWaste, setFilterWaste] = useState('all');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [completing, setCompleting] = useState(null);

    // ── Filter schedules ─────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        return schedules.filter(s => {
            if (filterArea !== 'all' && s.area !== filterArea) return false;
            if (filterStatus !== 'all' && s.status !== filterStatus) return false;
            if (filterWaste !== 'all' && s.wasteType !== filterWaste) return false;
            return true;
        });
    }, [schedules, filterArea, filterStatus, filterWaste]);

    // ── Group by date ────────────────────────────────────────────────────────
    const grouped = useMemo(() => {
        const map = {};
        filtered.forEach(s => {
            if (!map[s.date]) map[s.date] = [];
            map[s.date].push(s);
        });
        return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
    }, [filtered]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleToggleStatus = async (id, currentStatus) => {
        setCompleting(id);
        await new Promise(r => setTimeout(r, 400));
        onToggleStatus(id);
        setCompleting(null);
        const msg = currentStatus === 'completed' ? t('successPending') : t('successComplete');
        showToast(msg);
    };

    const handleDelete = () => {
        onDelete(deleteTarget);
        setDeleteTarget(null);
        showToast(t('successDelete'));
    };

    const total = schedules.length;
    const completedCount = schedules.filter(s => s.status === 'completed').length;
    const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    return (
        <div className="page-wrapper">
            {/* Header */}
            <div className="list-header">
                <div>
                    <h1 className="list-title">📋 {t('scheduleList')}</h1>
                    <p className="list-sub">{filtered.length} of {total} schedules shown</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/collector/add-schedule')}>
                    ➕ {t('addNewSchedule')}
                </button>
            </div>

            {/* Progress bar */}
            <div className="progress-card">
                <div className="progress-info">
                    <span>🎯 Overall Progress</span>
                    <span className="progress-pct">{completedCount} / {total} completed ({progress}%)</span>
                </div>
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* Filters */}
            <div className="filters-row">
                <div className="filter-group">
                    <label>📍 {t('filterByArea')}</label>
                    <select className="filter-select" value={filterArea} onChange={e => setFilterArea(e.target.value)}>
                        <option value="all">{t('allAreas')}</option>
                        {AREAS.map(a => <option key={a} value={a}>{t(a)}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label>📊 {t('filterByStatus')}</label>
                    <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="all">{t('allStatus')}</option>
                        <option value="pending">{t('pending')}</option>
                        <option value="completed">{t('completed')}</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>🗑️ {t('wasteType')}</label>
                    <select className="filter-select" value={filterWaste} onChange={e => setFilterWaste(e.target.value)}>
                        <option value="all">All Types</option>
                        <option value="biological">🌱 {t('biological')}</option>
                        <option value="plastic">♻️ {t('plastic')}</option>
                    </select>
                </div>
            </div>

            {/* Schedule groups */}
            {grouped.length === 0 ? (
                <div className="empty-state" style={{ marginTop: 60 }}>
                    <div className="empty-icon">📭</div>
                    <p>{t('noSchedules')}</p>
                    <small>{t('noSchedulesDesc')}</small>
                    <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/collector/add-schedule')}>
                        ➕ {t('addNewSchedule')}
                    </button>
                </div>
            ) : (
                grouped.map(([date, daySchedules]) => (
                    <div key={date} className="date-group">
                        <div className="date-header">
                            <div className="date-pill">
                                {formatDateLabel(date, t)}
                            </div>
                            <div className="date-stats">
                                <span className="badge badge-completed">{daySchedules.filter(s => s.status === 'completed').length} done</span>
                                <span className="badge badge-pending">{daySchedules.filter(s => s.status === 'pending').length} pending</span>
                            </div>
                        </div>

                        <div className="schedule-cards">
                            {daySchedules.map(s => (
                                <div key={s.id} className={`schedule-card ${s.status}`}>
                                    {/* Left color stripe */}
                                    <div
                                        className="card-stripe"
                                        style={{ background: s.wasteType === 'biological' ? 'var(--bio-green)' : 'var(--plastic-blue)' }}
                                    />

                                    <div className="card-body">
                                        <div className="card-top">
                                            <div className="card-area">
                                                <span className="area-icon">📍</span>
                                                <span>{t(s.area)}</span>
                                            </div>
                                            <div className="card-badges">
                                                <span className={`badge ${s.wasteType === 'biological' ? 'badge-bio' : 'badge-plastic'}`}>
                                                    {s.wasteType === 'biological' ? '🌱' : '♻️'} {t(s.wasteType)}
                                                </span>
                                                <span className={`badge ${s.status === 'completed' ? 'badge-completed' : 'badge-pending'}`}>
                                                    {s.status === 'completed' ? '✅' : '⏳'} {t(s.status)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="card-time">
                                            🕐 {formatTime(s.time)}
                                            {s.notes && <span className="card-notes"> · 📝 {s.notes}</span>}
                                        </div>

                                        <div className="card-actions">
                                            {/* Mark Complete / Pending */}
                                            <button
                                                className={`btn btn-sm ${s.status === 'completed' ? 'btn-secondary' : 'btn-primary'}`}
                                                onClick={() => handleToggleStatus(s.id, s.status)}
                                                disabled={completing === s.id}
                                                style={{ minWidth: 150 }}
                                            >
                                                {completing === s.id
                                                    ? <><span className="spinner" style={{ border: '2px solid rgba(0,0,0,0.2)', borderTopColor: 'currentColor' }} /> Processing...</>
                                                    : s.status === 'completed'
                                                        ? `↩️ ${t('markPending')}`
                                                        : `✅ ${t('markComplete')}`
                                                }
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => navigate(`/collector/edit-schedule/${s.id}`)}
                                            >
                                                ✏️ {t('edit')}
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => setDeleteTarget(s.id)}
                                            >
                                                🗑️ {t('delete')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-icon">🗑️</div>
                        <h3 className="modal-title">{t('confirmDelete')}</h3>
                        <p className="modal-msg">{t('confirmDeleteMsg')}</p>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
                                {t('deleteCancel')}
                            </button>
                            <button className="btn btn-danger" onClick={handleDelete}>
                                {t('deleteConfirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
