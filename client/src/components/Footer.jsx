import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 py-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="container mx-auto px-4 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                    © {new Date().getFullYear()} EventHub. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
