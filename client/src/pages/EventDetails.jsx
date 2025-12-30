import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiInfo, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    // Registration Form State
    const [regName, setRegName] = useState('');
    const [regMobile, setRegMobile] = useState('');
    const [regLoading, setRegLoading] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (error) {
                toast.error('Event not found');
                navigate('/events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, navigate]);

    // Prefill name if user exists
    useEffect(() => {
        if (user) setRegName(user.name);
    }, [user]);

    const handleRegisterClick = () => {
        if (!user) {
            toast.info('Please login to register');
            navigate('/login');
            return;
        }
        setShowModal(true);
    };

    const handleConfirmRegister = async (e) => {
        e.preventDefault();
        const mobileRegex = /^[0-9]{10}$/;
        if (!regMobile || !mobileRegex.test(regMobile)) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        setRegLoading(true);
        try {
            await api.post(`/register/${id}`, { name: regName, mobile: regMobile });
            toast.success('Registration successful!');
            setShowModal(false);

            // Update local state (optimistic or refetch)
            setEvent(prev => ({
                ...prev,
                registeredCount: prev.registeredCount + 1
                // We can't easily know if the user is in the list without refetching registrations logic, 
                // but for the view details page, updating count is good sufficient feedback.
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setRegLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading details...</div>;
    if (!event) return null;

    const isUpcoming = event.status === 'upcoming';
    const isFull = event.registeredCount >= event.maxParticipants;

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mt-8">
            {/* Header Banner (Color based on status) */}
            <div className={`h-32 ${isUpcoming ? 'bg-primary' : 'bg-gray-500'} flex items-center justify-center`}>
                <h1 className="text-4xl font-bold text-white px-4 text-center">{event.title}</h1>
            </div>

            <div className="p-8">
                <div className="flex flex-wrap gap-4 mb-6">
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold capitalize ${isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                        {event.status}
                    </span>
                    {isFull && isUpcoming && (
                        <span className="px-4 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                            Sold Out
                        </span>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <FiCalendar className="mr-3 text-primary text-xl" />
                            <span>{dayjs(event.date).format('MMMM D, YYYY')}</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <FiClock className="mr-3 text-primary text-xl" />
                            <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <FiMapPin className="mr-3 text-primary text-xl" />
                            <span>{event.venue}</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400 flex items-center">
                                <FiUsers className="mr-2" /> Total Slots
                            </span>
                            <span className="font-bold text-lg">{event.maxParticipants}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400 flex items-center">
                                <FiCheckCircle className="mr-2" /> Available
                            </span>
                            <span className="font-bold text-lg text-primary">
                                {Math.max(0, event.maxParticipants - event.registeredCount)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                        <FiInfo className="mr-2" /> About Event
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                        {event.description}
                    </p>
                </div>

                {/* Action Button */}
                {isUpcoming && !isFull ? (
                    <button
                        onClick={handleRegisterClick}
                        className="w-full py-4 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        Register Now
                    </button>
                ) : (
                    <button
                        disabled
                        className="w-full py-4 bg-gray-300 dark:bg-gray-700 text-gray-500 rounded-xl font-bold text-lg cursor-not-allowed"
                    >
                        {isUpcoming ? 'Registration Full' : 'Event Completed'}
                    </button>
                )}
            </div>

            {/* Registration Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold">Confirm Registration</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <FiXCircle className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleConfirmRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mobile Number</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 9876543210"
                                    value={regMobile}
                                    maxLength="10"
                                    pattern="\d{10}"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        setRegMobile(value);
                                    }}
                                    className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={regLoading}
                                    className="flex-1 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-semibold shadow-md transition"
                                >
                                    {regLoading ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetails;
