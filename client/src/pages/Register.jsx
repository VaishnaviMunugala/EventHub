import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(name, email, password);
            toast.success('Account created successfully!');
        } catch (error) {
            console.error("Register Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden p-4">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-purple-400/20 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[35%] bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-200"></div>
            </div>

            <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse animate-scale-in z-10 m-4 relative">

                {/* Right Side: Visuals for Register */}
                <div className="hidden md:flex w-1/2 bg-gradient-to-bl from-purple-600 to-pink-600 p-12 text-white flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                    <div className="relative z-10">
                        <div className="flex justify-end mb-8">
                            <Link to="/" className="flex items-center text-white/80 hover:text-white transition gap-2">
                                <FiArrowLeft /> Back to Home
                            </Link>
                        </div>
                        <h2 className="text-4xl font-bold font-heading leading-tight mb-4">
                            Join the <br />Community
                        </h2>
                        <p className="text-purple-100 text-lg">
                            Create an account to unlock exclusive events, manage your bookings, and stay connected.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                            <FiCheckCircle className="text-2xl text-green-300" />
                            <div>
                                <p className="font-bold">Instant Access</p>
                                <p className="text-sm text-purple-200">Start browsing events immediately</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Left Side: Register Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 bg-white dark:bg-gray-800 flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left">
                        <span className="inline-block p-3 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 mb-4">
                            <FiUser className="text-2xl" />
                        </span>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                            Create Account
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">Please provide your details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-4 text-gray-400 text-lg" />
                                <input
                                    type="text"
                                    required
                                    className="input-field pl-12"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-4 text-gray-400 text-lg" />
                                <input
                                    type="email"
                                    required
                                    className="input-field pl-12"
                                    placeholder="john@example.com"
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
                            disabled={isLoading}
                            className="w-full btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-bold hover:underline transition">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
