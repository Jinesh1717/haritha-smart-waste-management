// ============================================
// Schedule Validation & Utility Functions
// ============================================

export const AREAS = [
    'area_colombo_01',
    'area_colombo_02',
    'area_colombo_03',
    'area_colombo_04',
    'area_colombo_05',
    'area_colombo_06',
    'area_colombo_07',
    'area_colombo_08',
    'area_colombo_09',
    'area_colombo_10',
];

export const WASTE_TYPES = ['biological', 'plastic'];

/**
 * Validate the schedule form
 * @param {object} form - { area, date, time, wasteType }
 * @param {function} t - translation function
 * @returns {{ valid: boolean, errors: object }}
 */
export function validateScheduleForm(form, t) {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7);

    if (!form.area) {
        errors.area = t('errorArea');
    }

    if (!form.date) {
        errors.date = t('errorDate');
    } else {
        const selected = new Date(form.date);
        selected.setHours(0, 0, 0, 0);
        if (selected < today) {
            errors.date = t('errorDatePast');
        } else if (selected > maxDate) {
            errors.date = t('errorDateFuture');
        }
    }

    if (!form.time) {
        errors.time = t('errorTime');
    }

    if (!form.wasteType) {
        errors.wasteType = t('errorWasteType');
    }

    return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Check if a schedule conflicts with existing ones
 */
export function checkDuplicateSchedule(schedules, form, excludeId = null) {
    return schedules.some(s =>
        s.id !== excludeId &&
        s.area === form.area &&
        s.date === form.date &&
        s.time === form.time
    );
}

/**
 * Format a date string to a readable label
 */
export function formatDateLabel(dateStr, t) {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

    if (date.getTime() === today.getTime()) return t('today');
    if (date.getTime() === tomorrow.getTime()) return t('tomorrow');

    return date.toLocaleDateString('en-LK', {
        weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
    });
}

/**
 * Format time string (HH:MM) to 12-hour format
 */
export function formatTime(time) {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getToday() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Get max date (today + 7 days) in YYYY-MM-DD format
 */
export function getMaxDate() {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
}

/**
 * Generate a unique ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Sort schedules by date then time
 */
export function sortSchedules(schedules) {
    return [...schedules].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
    });
}

/**
 * Get next 7 days from today as array of { value: 'YYYY-MM-DD', label: 'Mon, Jan 1' }
 */
export function getNext7Days() {
    const days = [];
    const today = new Date();
    for (let i = 0; i <= 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const value = d.toISOString().split('T')[0];
        const label = d.toLocaleDateString('en-LK', { weekday: 'short', month: 'short', day: 'numeric' });
        days.push({ value, label });
    }
    return days;
}
