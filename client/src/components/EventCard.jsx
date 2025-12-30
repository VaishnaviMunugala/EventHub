import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { FiCalendar, FiMapPin, FiArrowRight } from 'react-icons/fi';

const EventCard = ({ event }) => {
    const isUpcoming = event.status === 'upcoming';
    const isFull = event.registeredCount >= event.maxParticipants;

    return (
        <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
            {/* Image Placeholder / Gradient Header */}
            <div className={`h-48 overflow-hidden relative ${isUpcoming ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'}`}>
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow-lg z-10">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{dayjs(event.date).format('MMM')}</p>
                    <p className="text-xl font-extrabold text-gray-800 dark:text-white leading-none">{dayjs(event.date).format('DD')}</p>
                </div>

                {isFull && isUpcoming && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        SOLD OUT
                    </div>
                )}

                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex items-center text-white/90 text-sm">
                        <FiMapPin className="mr-1" />
                        <span className="truncate">{event.venue}</span>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                        {event.description}
                    </p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {event.time}
                    </div>

                    <Link
                        to={`/event/${event._id || event.id}`}
                        className="inline-flex items-center text-sm font-bold text-primary hover:text-indigo-600 transition-colors group/link"
                    >
                        View Details <FiArrowRight className="ml-1 transform group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Status Indicator Bar */}
            <div className={`h-1.5 w-full ${isUpcoming ? 'bg-primary' : 'bg-gray-400'}`}></div>
        </div>
    );
};

export default EventCard;
