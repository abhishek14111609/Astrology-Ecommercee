import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        zodiac_sign: 'Aries'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const zodiacs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Connection error. Is the backend running?');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-auric-blush py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-serif font-bold text-auric-rose">Create Account</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join Auric Krystal for celestial guidance
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-center text-sm">{error}</div>}
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-auric-gold focus:border-auric-gold focus:z-10 sm:text-sm"
                                placeholder="John Doe"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-auric-gold focus:border-auric-gold focus:z-10 sm:text-sm"
                                placeholder="john@example.com"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Zodiac Sign</label>
                            <select
                                name="zodiac_sign"
                                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-auric-gold focus:border-auric-gold focus:z-10 sm:text-sm"
                                onChange={handleChange}
                                value={formData.zodiac_sign}
                            >
                                {zodiacs.map(sign => <option key={sign} value={sign}>{sign}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-auric-gold focus:border-auric-gold focus:z-10 sm:text-sm"
                                placeholder="••••••••"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <Button type="submit" variant="primary" className="w-full">
                            Register Now
                        </Button>
                    </div>
                </form>
                <div className="text-center">
                    <Link to="/login" className="text-sm text-auric-gold hover:text-auric-rose font-medium">
                        Already have an account? Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
