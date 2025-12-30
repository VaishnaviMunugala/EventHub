import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiXCircle, FiAlertCircle } from 'react-icons/fi';

dayjs.extend(relativeTime);

const Dashboard = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const { data } = await api.get('/register/user'); // Ensure this route matches backend
                setRegistrations(data);
            } catch (error) {
                console.error('Error fetching registrations');
                // toast.error('Failed to load registrations'); 
            } finally {
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, []);

    const handleCancel = async (registrationId) => {
        if (window.confirm('Are you sure you want to cancel this registration?')) {
            try {
                await api.delete(`/register/${registrationId}`); // Updated route path if needed, check backend
                setRegistrations(prev => prev.filter(req => req._id !== registrationId));
                toast.success('Registration cancelled');
            } catch (error) {
                toast.error('Failed to cancel registration');
            }
        }
    };

    if (loading) return <div className="text-center py-20 animate-pulse">Loading your dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">My Dashboard</h1>

            {/* Alerts Section */}
            {registrations.some(reg => {
                if (!reg.eventId) return false;
                const eventDate = dayjs(reg.eventId.date);
                const diff = eventDate.diff(dayjs(), 'day');
                return diff >= 0 && diff <= 1 && reg.attendanceStatus === 'registered';
            }) && (
                    <div className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FiAlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Upcoming Events Alert</h3>
                                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                    <ul className="list-disc pl-5 space-y-1">
                                        {registrations.map(reg => {
                                            if (!reg.eventId) return null;
                                            const eventDate = dayjs(reg.eventId.date);
                                            const diff = eventDate.diff(dayjs(), 'day');
                                            if (diff >= 0 && diff <= 1 && reg.attendanceStatus === 'registered') {
                                                return (
                                                    <li key={reg._id}>
                                                        Reminder: <strong>{reg.eventId.title}</strong> is {diff === 0 ? 'today!' : 'tomorrow!'}
                                                    </li>
                                                );
                                            }
                                            return null;
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2 dark:border-gray-700">
                    My Registered Events
                </h2>

                {registrations.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg mb-4">You haven't registered for any events yet.</p>
                        <Link to="/events" className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition">
                            Browse Events
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {registrations.map((reg) => {
                            if (!reg.eventId) return null; // Safety check
                            return (
                                <div key={reg._id} className="group border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-xl transition-all duration-300 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800">
                                    <Link to={`/event/${reg.eventId._id || reg.eventId.id}`} className="block">
                                        <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors line-clamp-1">
                                            {reg.eventId.title}
                                        </h3>
                                    </Link>

                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                                        <div className="flex items-center">
                                            <FiCalendar className="mr-3 text-primary" />
                                            {dayjs(reg.eventId.date).format('MMM D, YYYY')}
                                        </div>
                                        <div className="flex items-center">
                                            <FiClock className="mr-3 text-primary" />
                                            {reg.eventId.time}
                                        </div>
                                        <div className="flex items-center">
                                            <FiMapPin className="mr-3 text-primary" />
                                            <span className="truncate">{reg.eventId.venue}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wide ${reg.attendanceStatus === 'attended' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                reg.attendanceStatus === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                            }`}>
                                            {reg.attendanceStatus}
                                        </span>

                                        {reg.attendanceStatus === 'registered' && (
                                            <button
                                                onClick={() => handleCancel(reg._id)}
                                                className="text-red-500 hover:text-red-600 text-sm flex items-center font-medium transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                                title="Cancel Registration"
                                            >
                                                <FiXCircle className="mr-1.5" /> Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
