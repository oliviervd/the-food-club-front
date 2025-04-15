'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const AuthGuard = ({ children }) => {
    const { authenticated, login } = useAuth();
    const [input, setInput] = useState('');
    const devPassword = process.env.NEXT_PUBLIC_FC_DEV_PASSWORD;
    console.log(input, devPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(input);
        if (!success) alert('Wrong password');
    };

    if (!authenticated) {
        return (
            <div className="login__container flex flex-col items-center justify-center h-screen">
                <p className="mb-4 text-lg">HANG ON. FOOD CLUB IS COMING SOON.</p>
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="border p-2 mb-4"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
                </form>
            </div>
        );
    }

    return children;
};

export default AuthGuard;