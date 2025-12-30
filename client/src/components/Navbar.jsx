import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut, FiLayout, FiChevronDown } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
    };

    const navLinks = [];
    if (user) {
        navLinks.push({ name: 'Events', path: '/events' });
        if (user.role === 'admin') {
            navLinks.push({ name: 'Admin Dashboard', path: '/admin' });
        }
    }

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}>
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                            EH
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight text-gray-800 dark:text-white group-hover:text-primary transition-colors">
                            EventHub
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-semibold tracking-wide transition-all duration-300 hover:text-primary relative py-2 ${isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {link.name}
                                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                                    </>
                                )}
                            </NavLink>
                        ))}

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-4"></div>

                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group relative"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <FiSun className="text-yellow-400 text-xl group-hover:rotate-90 transition-transform duration-500" /> : <FiMoon className="text-gray-600 text-xl group-hover:-rotate-12 transition-transform" />}
                        </button>

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-3 focus:outline-none group bg-gray-50 dark:bg-gray-800 rounded-full pl-1 pr-4 py-1 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white flex items-center justify-center font-bold text-sm uppercase shadow-md">
                                        {user.name ? user.name.charAt(0) : 'U'}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                                    <FiChevronDown className={`text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-4 w-60 glass-card p-2 animate-scale-in origin-top-right z-50">
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>

                                        <Link
                                            to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-primary rounded-lg transition-colors mb-1"
                                        >
                                            <FiLayout className="mr-3 text-lg" /> Dashboard
                                        </Link>

                                        <Link
                                            to="/profile"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-primary rounded-lg transition-colors mb-2"
                                        >
                                            <FiUser className="mr-3 text-lg" /> Profile
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <FiLogOut className="mr-3 text-lg" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    to="/login"
                                    className="px-6 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {theme === 'dark' ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
                        </button>
                        <button
                            onClick={toggleMenu}
                            className="p-2 text-gray-800 dark:text-white"
                        >
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-xl animate-fade-in-down">
                        <div className="flex flex-col p-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user ? (
                                <>
                                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium flex items-center"
                                    >
                                        <FiUser className="mr-3" /> Profile
                                    </Link>
                                    <Link
                                        to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium flex items-center"
                                    >
                                        <FiLayout className="mr-3" /> Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                        }}
                                        className="px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 font-medium flex items-center w-full text-left"
                                    >
                                        <FiLogOut className="mr-3" /> Logout
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-3 rounded-lg border border-gray-200 dark:border-gray-700">Login</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="text-center py-3 rounded-lg bg-primary text-white font-bold">Register</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
