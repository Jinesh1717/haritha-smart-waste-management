import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLang } from '../context/LanguageContext.jsx';
import { AREAS, validateScheduleForm, getToday, getMaxDate } from '../utils/scheduleValidation.js';
import './ScheduleForm.css';

function showToast(msg, type = 'success') {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3300);
}

export default function EditSchedule({ schedules, onUpdate }) {
    const { t } = useLang();
    const navigate = useNavigate();
    const { id } = useParams();
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [notFound, setNotFound] = useState(false);

    const [form, setForm] = useState({
        area: '', date: '', time: '', wasteType: '', notes: ''
    });

    // Load existing data
    useEffect(() => {
        const schedule = schedules.find(s => s.id === id);
        if (!schedule) { setNotFound(true); return; }
        setForm({
            area: schedule.area,
            date: schedule.date,
            time: schedule.time,
            wasteType: schedule.wasteType,
            notes: schedule.notes || '',
        });
    }, [id, schedules]);

    const handleChange = (field, value) => {
        setForm(f => ({ ...f, [field]: value }));
        setErrors(e => ({ ...e, [field]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { valid, errors: errs } = validateScheduleForm(form, t);
        if (!valid) { setErrors(errs); return; }

        setSaving(true);
        await new Promise(r => setTimeout(r, 700));
        onUpdate(id, form);
        setSaving(false);
        showToast(t('successUpdate'));
        navigate('/collector/schedules');
    };

    if (notFound) {
        return (
            <div className="page-wrapper">
                <div className="empty-state" style={{ marginTop: 80 }}>
                    <div className="empty-icon">❌</div>
                    <p>Schedule not found</p>
                    <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/collector/schedules')}>
                        Back to Schedules
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="form-page-header">
                <div>
                    <h1 className="form-page-title">✏️ {t('editScheduleTitle')}</h1>
                    <p className="form-page-sub">{t('scheduleInfo')}</p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
                    ← {t('cancel')}
                </button>
            </div>

            <div className="form-card card">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-grid">
                        {/* Area */}
                        <div className="form-group">
                            <label className="form-label">📍 {t('area')}</label>
                            <select
                                className={`form-control ${errors.area ? 'error' : ''}`}
                                value={form.area}
                                onChange={e => handleChange('area', e.target.value)}
                            >
                                <option value="">{t('selectArea')}</option>
                                {AREAS.map(a => <option key={a} value={a}>{t(a)}</option>)}
                            </select>
                            {errors.area && <div className="form-error">⚠️ {errors.area}</div>}
                        </div>

                        {/* Date */}
                        <div className="form-group">
                            <label className="form-label">📅 {t('date')}</label>
                            <input
                                type="date"
                                className={`form-control ${errors.date ? 'error' : ''}`}
                                value={form.date}
                                min={getToday()}
                                max={getMaxDate()}
                                onChange={e => handleChange('date', e.target.value)}
                            />
                            {errors.date && <div className="form-error">⚠️ {errors.date}</div>}
                        </div>

                        {/* Time */}
                        <div className="form-group">
                            <label className="form-label">🕐 {t('time')}</label>
                            <input
                                type="time"
                                className={`form-control ${errors.time ? 'error' : ''}`}
                                value={form.time}
                                onChange={e => handleChange('time', e.target.value)}
                            />
                            {errors.time && <div className="form-error">⚠️ {errors.time}</div>}
                        </div>
                    </div>

                    {/* Waste Type */}
                    <div className="form-group">
                        <label className="form-label">🗑️ {t('wasteType')}</label>
                        <div className="waste-type-grid">
                            <label className={`waste-type-card ${form.wasteType === 'biological' ? 'selected bio' : ''}`}>
                                <input type="radio" name="wasteType" value="biological"
                                    checked={form.wasteType === 'biological'}
                                    onChange={e => handleChange('wasteType', e.target.value)}
                                />
                                <div className="wt-icon">🌱</div>
                                <div className="wt-label">{t('biological')}</div>
                                <div className="wt-desc">{t('biologicalDesc')}</div>
                            </label>
                            <label className={`waste-type-card ${form.wasteType === 'plastic' ? 'selected plastic' : ''}`}>
                                <input type="radio" name="wasteType" value="plastic"
                                    checked={form.wasteType === 'plastic'}
                                    onChange={e => handleChange('wasteType', e.target.value)}
                                />
                                <div className="wt-icon">♻️</div>
                                <div className="wt-label">{t('plastic')}</div>
                                <div className="wt-desc">{t('plasticDesc')}</div>
                            </label>
                        </div>
                        {errors.wasteType && <div className="form-error">⚠️ {errors.wasteType}</div>}
                    </div>

                    {/* Notes */}
                    <div className="form-group">
                        <label className="form-label">📝 {t('notes')}</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            placeholder={t('notesPlaceholder')}
                            value={form.notes}
                            onChange={e => handleChange('notes', e.target.value)}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                            {t('cancel')}
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? <><span className="spinner" /> {t('saving')}</> : <>💾 {t('updateSchedule')}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
