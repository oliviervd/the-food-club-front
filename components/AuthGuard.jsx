'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import Marquee from "react-fast-marquee";

const AuthGuard = ({ children }) => {
    const { authenticated, login } = useAuth();
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(input);
        if (!success) alert('Wrong password');
    };

    if (!authenticated) {
        return (
            <div className="login__container flex flex-col items-center justify-center h-screen">
                <Marquee className={"banner"} speed={30} pauseOnHover={false} gradient={false} autoFill={true}>
                    <h3>#1 Don't talk about foodclub - but psssst…. please spread the word! — #2 The foodclub is
                        a curated space focused on quality, featuring only restaurants we've personally visited.
                        — #3 The foodclub is, and will always be, a positive space celebrating local culinary
                        excellence. There is no place for negativity. —</h3>
                </Marquee>
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