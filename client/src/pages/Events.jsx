import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import { FiSearch, FiList } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth(); // Get user to conditionally show button if needed, or just show for all (redirects to login if protected)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/events');
                setEvents(data);
                setFilteredEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        if (searchTerm.length >= 2 || searchTerm.length === 0) {
            const lowerTerm = searchTerm.toLowerCase();
            const filtered = events.filter(e =>
                e.title.toLowerCase().includes(lowerTerm)
            );
            setFilteredEvents(filtered);
        }
    }, [searchTerm, events]);

    const upcomingEvents = filteredEvents.filter(e => e.status === 'upcoming');
    const completedEvents = filteredEvents.filter(e => e.status === 'completed');

    if (loading) {
        return <div className="text-center py-20 text-gray-500">Loading events...</div>;
    }

    return (
        <div className="space-y-12 relative animate-fade-in">
            {/* Header Section with Search and "My Registrations" Button */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                {/* Search Bar */}
                <div className="relative w-full max-w-xl">
                    <input
                        type="text"
                        placeholder="Search events by name..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FiSearch className="absolute left-4 top-3.5 text-gray-400 text-xl" />
                </div>

                {/* My Registrations Button - "Right side of the page" */}
                {user && (
                    <Link
                        to="/dashboard"
                        className="flex items-center px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-teal-600 transition shadow-md whitespace-nowrap"
                    >
                        <FiList className="mr-2" /> My Registrations
                    </Link>
                )}
            </div>

            {filteredEvents.length === 0 ? (
                <div className="text-center py-20">
                    <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">No events found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
                </div>
            ) : (
                <>
                    {/* Upcoming Events */}
                    {upcomingEvents.length > 0 && (
                        <section>
                            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-l-4 border-primary pl-4">
                                Upcoming Events
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {upcomingEvents.map((event) => (
                                    <EventCard key={event._id} event={event} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Completed Events */}
                    {completedEvents.length > 0 && (
                        <section>
                            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-l-4 border-gray-400 pl-4">
                                Completed Events
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-80 hover:opacity-100 transition-opacity">
                                {completedEvents.map((event) => (
                                    <EventCard key={event._id} event={event} />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
};

export default Events;
