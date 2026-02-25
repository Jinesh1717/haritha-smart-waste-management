import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.jsx';
import Navbar from './components/Navbar.jsx';
import CollectorDashboard from './pages/CollectorDashboard.jsx';
import AddSchedule from './pages/AddSchedule.jsx';
import EditSchedule from './pages/EditSchedule.jsx';
import ScheduleList from './pages/ScheduleList.jsx';
import { useState } from 'react';
import { generateId, sortSchedules } from './utils/scheduleValidation.js';

// ── Seed data: realistic mock schedules ──────────────────────────────────────
const seedSchedules = () => {
    const today = new Date();
    const fmt = (d) => d.toISOString().split('T')[0];
    const addDays = (n) => { const d = new Date(today); d.setDate(today.getDate() + n); return d; };

    return [
        { id: generateId(), area: 'area_colombo_01', date: fmt(today), time: '08:00', wasteType: 'biological', notes: 'Start from main road', status: 'completed' },
        { id: generateId(), area: 'area_colombo_03', date: fmt(today), time: '10:30', wasteType: 'plastic', notes: '', status: 'pending' },
        { id: generateId(), area: 'area_colombo_05', date: fmt(addDays(1)), time: '07:00', wasteType: 'biological', notes: 'Near the school', status: 'pending' },
        { id: generateId(), area: 'area_colombo_07', date: fmt(addDays(2)), time: '09:00', wasteType: 'plastic', notes: '', status: 'pending' },
        { id: generateId(), area: 'area_colombo_02', date: fmt(addDays(3)), time: '08:30', wasteType: 'biological', notes: 'Check market area', status: 'pending' },
    ];
};

function App() {
    const [schedules, setSchedules] = useState(seedSchedules);

    const addSchedule = (data) => {
        const newItem = { ...data, id: generateId(), status: 'pending' };
        setSchedules(prev => sortSchedules([...prev, newItem]));
    };

    const updateSchedule = (id, data) => {
        setSchedules(prev =>
            sortSchedules(prev.map(s => s.id === id ? { ...s, ...data } : s))
        );
    };

    const deleteSchedule = (id) => {
        setSchedules(prev => prev.filter(s => s.id !== id));
    };

    const toggleStatus = (id) => {
        setSchedules(prev =>
            prev.map(s => s.id === id
                ? { ...s, status: s.status === 'completed' ? 'pending' : 'completed' }
                : s
            )
        );
    };

    return (
        <LanguageProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/collector/dashboard" replace />} />
                    <Route
                        path="/collector/dashboard"
                        element={<CollectorDashboard schedules={schedules} />}
                    />
                    <Route
                        path="/collector/add-schedule"
                        element={<AddSchedule schedules={schedules} onAdd={addSchedule} />}
                    />
                    <Route
                        path="/collector/schedules"
                        element={
                            <ScheduleList
                                schedules={schedules}
                                onDelete={deleteSchedule}
                                onToggleStatus={toggleStatus}
                            />
                        }
                    />
                    <Route
                        path="/collector/edit-schedule/:id"
                        element={
                            <EditSchedule
                                schedules={schedules}
                                onUpdate={updateSchedule}
                            />
                        }
                    />
                    <Route path="*" element={<Navigate to="/collector/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </LanguageProvider>
    );
}

export default App;
