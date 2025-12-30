import React, { useEffect, useState, useRef } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { FiPlus, FiTrash2, FiEdit2, FiUsers, FiBarChart2, FiLayers, FiCalendar, FiX, FiRefreshCcw } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Safety ref for unmounting
    const isMounted = useRef(true);

    // Form State
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', time: '', venue: '', maxParticipants: ''
    });

    const navigate = useNavigate();
    const isFetching = useRef(false);

    const fetchData = async (background = false) => {
        if (isFetching.current) return;
        isFetching.current = true;
        if (!background) setIsLoading(true);

        try {
            // Fetch Stats
            try {
                const statsRes = await api.get('/admin/analytics/overview');
                if (isMounted.current) setStats(statsRes.data);
            } catch (err) {
                console.error("Stats fetch failed", err);
            }

            // Fetch Events
            try {
                const eventsRes = await api.get('/events');
                if (isMounted.current) setEvents(eventsRes.data || []);
            } catch (err) {
                console.error("Events fetch failed", err);
                if (!background) toast.error('Failed to load events');
            }

        } finally {
            isFetching.current = false;
            if (isMounted.current) setIsLoading(false);
        }
    };

    useEffect(() => {
        isMounted.current = true;
        fetchData();
        const interval = setInterval(() => fetchData(true), 10000);
        return () => {
            isMounted.current = false;
            clearInterval(interval);
        };
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsersList(data);
            setShowUserModal(true);
        } catch (error) {
            toast.error('Failed to load users');
        }
    };

    const handleCreate = () => {
        setEditingEvent(null);
        setFormData({ title: '', description: '', date: '', time: '', venue: '', maxParticipants: '' });
        setShowModal(true);
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            date: dayjs(event.date).format('YYYY-MM-DD'),
            time: event.time,
            venue: event.venue,
            maxParticipants: event.maxParticipants
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/admin/events/${id}`);
            toast.success('Event deleted');
            fetchData();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await api.put(`/admin/events/${editingEvent._id}`, formData);
                toast.success('Event updated');
            } else {
                await api.post('/admin/events', formData);
                toast.success('Event created');
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleViewRegistrations = async (eventId) => {
        try {
            const { data } = await api.get(`/admin/events/${eventId}/registrations`);
            setRegistrations(data);
            setSelectedEventId(eventId);
            setActiveTab('registrations');
        } catch (error) {
            toast.error('Failed to load registrations');
        }
    };

    const upcomingEventsCount = events ? events.filter(e => e.status === 'upcoming').length : 0;

    const handleTotalEventsClick = () => navigate('/events');
    const handleUpcomingEventsClick = () => navigate('/events');
    const handleTotalRegistrationsClick = () => navigate('/dashboard');
    const handleTotalUsersClick = () => fetchUsers();

    if (isLoading && !stats && events.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            </div>
        );
    }

    const renderOverview = () => (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div onClick={handleTotalEventsClick} className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-transform hover:-translate-y-1 group">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm uppercase font-semibold">Total Events</p>
                            <h3 className="text-3xl font-bold mt-1 text-gray-800 dark:text-white group-hover:text-primary transition-colors">
                                {stats?.totalEvents ?? '-'}
                            </h3>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/30">
                            <FiLayers className="text-2xl text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div onClick={handleUpcomingEventsClick} className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition-transform hover:-translate-y-1 group">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm uppercase font-semibold">Upcoming Events</p>
                            <h3 className="text-3xl font-bold mt-1 text-gray-800 dark:text-white group-hover:text-indigo-500 transition-colors">
                                {upcomingEventsCount}
                            </h3>
                        </div>
                        <div className="p-3 bg-indigo-100 rounded-full dark:bg-indigo-900/30">
                            <FiCalendar className="text-2xl text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                </div>

                <div onClick={handleTotalRegistrationsClick} className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-transform hover:-translate-y-1 group">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm uppercase font-semibold">Total Registrations</p>
                            <h3 className="text-3xl font-bold mt-1 text-gray-800 dark:text-white group-hover:text-green-500 transition-colors">
                                {stats?.totalRegistrations ?? '-'}
                            </h3>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full dark:bg-green-900/30">
                            <FiBarChart2 className="text-2xl text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div onClick={handleTotalUsersClick} className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-transform hover:-translate-y-1 group">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm uppercase font-semibold">Total Users</p>
                            <h3 className="text-3xl font-bold mt-1 text-gray-800 dark:text-white group-hover:text-purple-500 transition-colors">
                                {stats?.totalUsers ?? '-'}
                            </h3>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full dark:bg-purple-900/30">
                            <FiUsers className="text-2xl text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Registration Trends</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats?.registrationTrends || []}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="_id" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', color: '#fff', borderRadius: '8px', border: 'none' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="count" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const renderEvents = () => (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Events</h2>
                <button onClick={handleCreate} className="flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <FiPlus className="mr-2 text-xl" /> Create New Event
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Event Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Slots</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {events && events.length > 0 ? (
                                events.map(event => (
                                    <tr key={event._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{event.title}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-xs">{event.description}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                            {dayjs(event.date).format('MMM D, YYYY')}
                                            <div className="text-xs text-gray-400">{event.time}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.registeredCount >= event.maxParticipants
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {event.registeredCount} / {event.maxParticipants}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${event.status === 'upcoming'
                                                ? 'text-green-600 bg-green-50 border border-green-200'
                                                : 'text-gray-500 bg-gray-100 border border-gray-200'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => handleViewRegistrations(event._id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Registrations">
                                                <FiUsers className="text-lg" />
                                            </button>
                                            <button onClick={() => handleEdit(event)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition" title="Edit">
                                                <FiEdit2 className="text-lg" />
                                            </button>
                                            <button onClick={() => handleDelete(event._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                                                <FiTrash2 className="text-lg" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                        No events found. Create one to get started!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderRegistrations = () => (
        <div className="animate-fade-in">
            <button onClick={() => setActiveTab('events')} className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-primary transition">
                ← Back to Events Management
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Registered Users</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mobile</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Reg Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {registrations.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <FiUsers className="text-4xl text-gray-300 mb-2" />
                                        <p>No registrations found for this event.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            registrations.map(reg => (
                                <tr key={reg._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{reg.name || reg.userId?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-gray-500">{reg.userId?.email || 'N/A'}</td>
                                    <td className="px-6 py-4 font-mono text-sm text-gray-600 dark:text-gray-400">{reg.mobile || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {dayjs(reg.registeredAt).format('MMM D, YYYY h:mm A')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex gap-4">
                    <button
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'events' || activeTab === 'registrations' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        onClick={() => setActiveTab('events')}
                    >
                        Events
                    </button>
                </div>
                <button
                    onClick={() => fetchData()}
                    disabled={isFetching.current}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
                    title="Refresh Data"
                >
                    <FiRefreshCcw className={`text-xl ${isFetching.current ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="min-h-[60vh]">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'events' && renderEvents()}
                {activeTab === 'registrations' && renderRegistrations()}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl animate-scale-in">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                {editingEvent ? 'Edit Event' : 'Create New Event'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Event Title</label>
                                        <input className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none" required placeholder="Enter event name" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date</label>
                                            <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Time</label>
                                            <input type="text" placeholder="e.g. 10:00 AM" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none" required value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Max Participants</label>
                                        <input type="number" placeholder="e.g. 100" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none" required value={formData.maxParticipants} onChange={e => setFormData({ ...formData, maxParticipants: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Venue</label>
                                        <input className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none" required placeholder="Event location" value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                        <textarea className="w-full px-4 py-3 h-[180px] rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none resize-none" required placeholder="Detailed description of the event..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3 rounded-xl font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition">Cancel</button>
                                <button type="submit" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-blue-600 hover:shadow-xl transform hover:-translate-y-0.5 transition-all">{editingEvent ? 'Save Changes' : 'Create Event'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in-up">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                                <FiUsers className="mr-2" /> All Users
                            </h3>
                            <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600">
                                <FiX className="text-2xl" />
                            </button>
                        </div>
                        <div className="p-0 max-h-[60vh] overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {usersList.map((usr, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-3 font-medium">{usr.name || 'N/A'}</td>
                                            <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{usr.email}</td>
                                            <td className="px-6 py-3">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full uppercase font-bold">{usr.role}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {usersList.length === 0 && <p className="text-center py-6 text-gray-500">No users found.</p>}
                        </div>
                        <div className="p-4 border-t border-gray-100 dark:border-gray-700 text-right">
                            <button onClick={() => setShowUserModal(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg transition">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
