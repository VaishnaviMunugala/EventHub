import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiArrowLeft, FiUser, FiShield } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();

    const role = searchParams.get('role') || 'user'; // Default to user

    useEffect(() => {
        // Pre-fill for convenience in Demo mode based on role
        if (role === 'admin') {
            setEmail('admin@eventhub.com');
            setPassword('admin123');
        } else {
            setEmail('test@example.com');
            setPassword('password123');
        }
    }, [role]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success(`Welcome back, ${role === 'admin' ? 'Admin' : 'User'}!`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden p-4">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-400"></div>
            </div>

            <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in z-10 m-4">

                {/* Left Side: Visuals */}
                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                    <div className="relative z-10">
                        <Link to="/" className="flex items-center text-white/80 hover:text-white transition gap-2 mb-8">
                            <FiArrowLeft /> Back to Home
                        </Link>
                        <h2 className="text-4xl font-bold font-heading leading-tight mb-4">
                            Welcome Back to <br />EventHub
                        </h2>
                        <p className="text-blue-100 text-lg">
                            {role === 'admin'
                                ? 'Manage your events and track success effortlessly.'
                                : 'Join thousands of others in discovering the best events around you.'}
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                            <div className="text-3xl">
                                {role === 'admin' ? '🛡️' : '🚀'}
                            </div>
                            <div>
                                <p className="font-bold text-lg">Secure Access</p>
                                <p className="text-sm text-blue-200">End-to-end encrypted connection</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 bg-white dark:bg-gray-800 flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left">
                        <span className="inline-block p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary mb-4">
                            {role === 'admin' ? <FiShield className="text-2xl" /> : <FiUser className="text-2xl" />}
                        </span>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                            {role === 'admin' ? 'Admin Portal' : 'Member Login'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">Please enter your details to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-4 text-gray-400 text-lg" />
                                <input
                                    type="email"
                                    required
                                    className="input-field pl-12"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-4 text-gray-400 text-lg" />
                                <input
                                    type="password"
                                    required
                                    className="input-field pl-12"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary font-bold hover:underline transition">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
