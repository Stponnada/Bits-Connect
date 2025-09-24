
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { loginUser } from '../../supa/supabaseHelpers';


export const LoginForm: React.FC = () => {
    const { users, setCurrentUser } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data, error } = await loginUser(email, password);

        if (error) {
            setError(error.message);
        } else {
            setError('');
            console.log('Logged in user:', data.user);
            // If you want, store data.user in context here
        }
    };


    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-bits-text mb-6">Welcome Back!</h2>
            {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-md mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-bits-text-muted">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="mt-1 block w-full bg-bits-medium-dark border-bits-medium-dark rounded-md shadow-sm py-2 px-3 text-bits-text focus:outline-none focus:ring-bits-red focus:border-bits-red sm:text-sm"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="password" className="block text-sm font-medium text-bits-text-muted">Password</label>
                    <input 
                        type="password" 
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="mt-1 block w-full bg-bits-medium-dark border-bits-medium-dark rounded-md shadow-sm py-2 px-3 text-bits-text focus:outline-none focus:ring-bits-red focus:border-bits-red sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-bits-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bits-red transition-colors duration-200">
                        Log In
                    </button>
                </div>
            </form>
        </div>
    );
};
