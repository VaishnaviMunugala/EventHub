import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiShield, FiArrowRight, FiCalendar, FiUsers } from 'react-icons/fi';

const Landing = () => {
    return (
        <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-200"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-400"></div>

            <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center gap-12">

                {/* Hero Text */}
                <div className="w-full md:w-1/2 space-y-8 z-10 animate-fade-in-up">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                        <span className="animate-pulse w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-300 tracking-wide uppercase">The Future of Event Management</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        Discover <span className="text-gradient">Extraordinary</span> Events
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
                        Seamlessly organize, discover, and attend events that matter. Your gateway to unforgettable experiences starts here.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link to="/login?role=user" className="group btn-primary flex items-center justify-center">
                            <FiUser className="mr-2 text-xl" />
                            <span>User Login</span>
                            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link to="/login?role=admin" className="px-8 py-3 rounded-xl font-bold border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-all duration-300 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                            <FiShield className="mr-2 text-xl" /> Admin Access
                        </Link>
                    </div>

                    <div className="flex items-center gap-8 pt-8 text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FiCalendar className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="font-semibold">500+ Events</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <FiUsers className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="font-semibold">10k+ Users</span>
                        </div>
                    </div>
                </div>

                {/* Hero Graphic / Interactive Cards */}
                <div className="w-full md:w-1/2 relative h-[500px] hidden md:block">
                    {/* Floating Card 1 */}
                    <div className="absolute top-10 right-10 w-72 glass-card p-6 animate-float z-20 transform rotate-3 hover:rotate-0 transition-transform duration-500 cursor-default">
                        <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-4 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            <div className="absolute bottom-4 left-4 text-white font-bold text-lg">Tech Summit 2024</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                                        U{i}
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs font-bold text-green-500 bg-green-100 px-2 py-1 rounded-full">Live Now</span>
                        </div>
                    </div>

                    {/* Floating Card 2 */}
                    <div className="absolute bottom-20 left-10 w-64 glass-card p-5 animate-float-delayed z-10 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-2xl">🎵</div>
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-white">Music Fest</h4>
                                <p className="text-xs text-gray-500">Tomorrow, 6 PM</p>
                            </div>
                        </div>
                        <button className="w-full py-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300">View Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
