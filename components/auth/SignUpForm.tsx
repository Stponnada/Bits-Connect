import React, { useState } from 'react';
import { VALID_EMAIL_DOMAINS } from '../../constants';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';

export const SignUpForm: React.FC = () => {
    const { users, setUsers, setCurrentUser } = useApp();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email: string) => {
        const domain = email.split('@')[1];
        return VALID_EMAIL_DOMAINS.includes(domain);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!validateEmail(email)) {
            setError('Please use a valid BITS Pilani email address.');
            return;
        }
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            setError('An account with this email already exists.');
            return;
        }
        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            setError('This username is already taken.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        // In a real app, this would trigger an API call and email confirmation.
        const newUserId = `u${Date.now()}`;
        const newUser: User = {
            id: newUserId,
            username,
            email,
            profile: {
                name: '', // Will be set in profile setup
                admissionYear: 0, // Will be set in profile setup
                avatar: `https://picsum.photos/seed/${newUserId}/200`,
                banner: `https://picsum.photos/seed/${newUserId}/1000/200`,
            }
        };

        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-bits-text mb-6">Create Account</h2>
             {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-md mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-bits-text-muted">BITS Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full bg-bits-medium-dark border-bits-medium-dark rounded-md shadow-sm py-2 px-3 text-bits-text focus:outline-none focus:ring-bits-red focus:border-bits-red sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-bits-text-muted">Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="mt-1 block w-full bg-bits-medium-dark border-bits-medium-dark rounded-md shadow-sm py-2 px-3 text-bits-text focus:outline-none focus:ring-bits-red focus:border-bits-red sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-bits-text-muted">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full bg-bits-medium-dark border-bits-medium-dark rounded-md shadow-sm py-2 px-3 text-bits-text focus:outline-none focus:ring-bits-red focus:border-bits-red sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-bits-text-muted">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full bg-bits-medium-dark border-bits-medium-dark rounded-md shadow-sm py-2 px-3 text-bits-text focus:outline-none focus:ring-bits-red focus:border-bits-red sm:text-sm" />
                </div>
                <div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-bits-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bits-red transition-colors duration-200">
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
};