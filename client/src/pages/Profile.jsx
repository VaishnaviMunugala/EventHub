import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return <div className="text-center py-20">Please login to view profile.</div>;

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">My Profile</h1>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                {/* Donut-like User Icon */}
                <div className="w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center bg-gray-50 dark:bg-gray-700 mb-6 relative">
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-5xl font-bold text-white uppercase shadow-inner">
                        {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium uppercase tracking-wide mb-8">
                    {user.role}
                </span>

                <div className="w-full space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="p-3 bg-white dark:bg-gray-600 rounded-full shadow-sm mr-4">
                            <FiMail className="text-xl text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Email Address</p>
                            <p className="text-gray-800 dark:text-gray-200 font-medium">{user.email}</p>
                        </div>
                    </div>

                    {/* Mobile is stored in registrations, theoretically user object might not have it unless updated. 
                         For now, we just show what's likely available or static placeholders if mock.
                         In real app, we'd fetch profile details. 
                     */}
                </div>
            </div>
        </div>
    );
};

export default Profile;
