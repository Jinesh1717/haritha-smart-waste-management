import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext.jsx';
import {
    AREAS, validateScheduleForm, checkDuplicateSchedule,
    getToday, getMaxDate
} from '../utils/scheduleValidation.js';
import './ScheduleForm.css';

// ── Toast helper ─────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3300);
}

export default function AddSchedule({ schedules, onAdd }) {
    const { t } = useLang();
    const navigate = useNavigate();
    const [mode, setMode] = useState('single'); // 'single' | 'weekly'
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    // Single day form
    const [form, setForm] = useState({
        area: '', date: '', time: '', wasteType: '', notes: ''
    });

    // Weekly plan state: selectedDays set + per-day time overrides
    const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const [weeklyDays, setWeeklyDays] = useState(new Set());
    const [weeklyArea, setWeeklyArea] = useState('');
    const [weeklyWasteType, setWeeklyWasteType] = useState('');
    const [weeklyTime, setWeeklyTime] = useState('08:00');
    const [weeklyErrors, setWeeklyErrors] = useState({});

    // ── Handlers: single mode ────────────────────────────────────────────────
    const handleChange = (field, value) => {
        setForm(f => ({ ...f, [field]: value }));
        setErrors(e => ({ ...e, [field]: '' }));
    };

    const handleSubmitSingle = async (e) => {
        e.preventDefault();
        const { valid, errors: errs } = validateScheduleForm(form, t);
        if (!valid) { setErrors(errs); return; }

        if (checkDuplicateSchedule(schedules, form)) {
            setErrors({ date: 'A schedule already exists for this area, date and time.' });
            return;
        }

        setSaving(true);
        await new Promise(r => setTimeout(r, 700));
        onAdd(form);
        setSaving(false);
        showToast(t('successAdd'));
        navigate('/collector/schedules');
    };

    // ── Handlers: weekly mode ─────────────────────────────────────────────────
    const toggleDay = (day) => {
        setWeeklyDays(prev => {
            const next = new Set(prev);
            next.has(day) ? next.delete(day) : next.add(day);
            return next;
        });
    };

    // Get next occurrence of a weekday from today
    const getNextOccurrence = (dayName) => {
        const dayMap = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
        const target = dayMap[dayName];
        const today = new Date();
        const currentDay = today.getDay();
        let daysAhead = target - currentDay;
        if (daysAhead <= 0) daysAhead += 7;
        const result = new Date(today);
        result.setDate(today.getDate() + daysAhead);
        return result.toISOString().split('T')[0];
    };

    const handleSubmitWeekly = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!weeklyArea) errs.area = t('errorArea');
        if (weeklyDays.size === 0) errs.days = 'Please select at least one day';
        if (!weeklyWasteType) errs.wasteType = t('errorWasteType');
        if (!weeklyTime) errs.time = t('errorTime');
        if (Object.keys(errs).length) { setWeeklyErrors(errs); return; }

        setSaving(true);
        await new Promise(r => setTimeout(r, 800));

        weeklyDays.forEach(day => {
            const dateStr = getNextOccurrence(day);
            onAdd({ area: weeklyArea, date: dateStr, time: weeklyTime, wasteType: weeklyWasteType, notes: `Weekly plan - ${day}` });
        });

        setSaving(false);
        showToast(`${weeklyDays.size} ${t('successAdd')}`);
        navigate('/collector/schedules');
    };

    return (
        <div className="page-wrapper">
            <div className="form-page-header">
                <div>
                    <h1 className="form-page-title">📝 {t('addScheduleTitle')}</h1>
                    <p className="form-page-sub">{t('scheduleInfo')}</p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
                    ← {t('cancel')}
                </button>
            </div>

            {/* Mode Tabs */}
            <div className="mode-tabs">
                <button
                    className={`mode-tab ${mode === 'single' ? 'active' : ''}`}
                    onClick={() => setMode('single')}
                >
                    📅 Single Day
                </button>
                <button
                    className={`mode-tab ${mode === 'weekly' ? 'active' : ''}`}
                    onClick={() => setMode('weekly')}
                >
                    🗓️ {t('weeklyPlan')}
                </button>
            </div>

            <div className="form-card card">
                {/* ── SINGLE DAY FORM ──────────────────────────────────────────────── */}
                {mode === 'single' && (
                    <form onSubmit={handleSubmitSingle} noValidate>
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
                                    {AREAS.map(a => (
                                        <option key={a} value={a}>{t(a)}</option>
                                    ))}
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
                                <div className="field-hint">📌 You can schedule up to 7 days in advance</div>
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
                                    <input
                                        type="radio"
                                        name="wasteType"
                                        value="biological"
                                        checked={form.wasteType === 'biological'}
                                        onChange={e => handleChange('wasteType', e.target.value)}
                                    />
                                    <div className="wt-icon">🌱</div>
                                    <div className="wt-label">{t('biological')}</div>
                                    <div className="wt-desc">{t('biologicalDesc')}</div>
                                </label>
                                <label className={`waste-type-card ${form.wasteType === 'plastic' ? 'selected plastic' : ''}`}>
                                    <input
                                        type="radio"
                                        name="wasteType"
                                        value="plastic"
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
                                {saving ? <><span className="spinner" /> {t('saving')}</> : <>💾 {t('saveSchedule')}</>}
                            </button>
                        </div>
                    </form>
                )}

                {/* ── WEEKLY PLAN FORM ──────────────────────────────────────────────── */}
                {mode === 'weekly' && (
                    <form onSubmit={handleSubmitWeekly} noValidate>
                        <div className="weekly-desc-banner">
                            🗓️ <strong>{t('weeklyPlanDesc')}</strong> — each selected day will create one schedule for next week.
                        </div>

                        {/* Day selector */}
                        <div className="form-group">
                            <label className="form-label">📅 {t('selectDays')}</label>
                            <div className="day-selector">
                                {DAYS_OF_WEEK.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        className={`day-btn ${weeklyDays.has(day) ? 'selected' : ''}`}
                                        onClick={() => toggleDay(day)}
                                    >
                                        <span>{t(day).substring(0, 3)}</span>
                                    </button>
                                ))}
                            </div>
                            {weeklyErrors.days && <div className="form-error">⚠️ {weeklyErrors.days}</div>}
                        </div>

                        <div className="form-grid">
                            {/* Area */}
                            <div className="form-group">
                                <label className="form-label">📍 {t('area')}</label>
                                <select
                                    className={`form-control ${weeklyErrors.area ? 'error' : ''}`}
                                    value={weeklyArea}
                                    onChange={e => { setWeeklyArea(e.target.value); setWeeklyErrors(er => ({ ...er, area: '' })); }}
                                >
                                    <option value="">{t('selectArea')}</option>
                                    {AREAS.map(a => <option key={a} value={a}>{t(a)}</option>)}
                                </select>
                                {weeklyErrors.area && <div className="form-error">⚠️ {weeklyErrors.area}</div>}
                            </div>

                            {/* Time */}
                            <div className="form-group">
                                <label className="form-label">🕐 {t('time')}</label>
                                <input
                                    type="time"
                                    className={`form-control ${weeklyErrors.time ? 'error' : ''}`}
                                    value={weeklyTime}
                                    onChange={e => { setWeeklyTime(e.target.value); setWeeklyErrors(er => ({ ...er, time: '' })); }}
                                />
                                {weeklyErrors.time && <div className="form-error">⚠️ {weeklyErrors.time}</div>}
                            </div>
                        </div>

                        {/* Waste Type */}
                        <div className="form-group">
                            <label className="form-label">🗑️ {t('wasteType')}</label>
                            <div className="waste-type-grid">
                                <label className={`waste-type-card ${weeklyWasteType === 'biological' ? 'selected bio' : ''}`}>
                                    <input type="radio" name="weeklyWasteType" value="biological"
                                        checked={weeklyWasteType === 'biological'}
                                        onChange={e => { setWeeklyWasteType(e.target.value); setWeeklyErrors(er => ({ ...er, wasteType: '' })); }}
                                    />
                                    <div className="wt-icon">🌱</div>
                                    <div className="wt-label">{t('biological')}</div>
                                    <div className="wt-desc">{t('biologicalDesc')}</div>
                                </label>
                                <label className={`waste-type-card ${weeklyWasteType === 'plastic' ? 'selected plastic' : ''}`}>
                                    <input type="radio" name="weeklyWasteType" value="plastic"
                                        checked={weeklyWasteType === 'plastic'}
                                        onChange={e => { setWeeklyWasteType(e.target.value); setWeeklyErrors(er => ({ ...er, wasteType: '' })); }}
                                    />
                                    <div className="wt-icon">♻️</div>
                                    <div className="wt-label">{t('plastic')}</div>
                                    <div className="wt-desc">{t('plasticDesc')}</div>
                                </label>
                            </div>
                            {weeklyErrors.wasteType && <div className="form-error">⚠️ {weeklyErrors.wasteType}</div>}
                        </div>

                        {/* Summary */}
                        {weeklyDays.size > 0 && (
                            <div className="weekly-summary">
                                <strong>📋 Preview:</strong> Creating {weeklyDays.size} schedule{weeklyDays.size > 1 ? 's' : ''} for{' '}
                                {[...weeklyDays].map(d => t(d)).join(', ')}
                            </div>
                        )}

                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                                {t('cancel')}
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? <><span className="spinner" /> {t('saving')}</> : <>🗓️ {t('saveSchedule')} ({weeklyDays.size} days)</>}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
