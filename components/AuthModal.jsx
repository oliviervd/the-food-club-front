'use client';

import { useState } from 'react';
import { useUser } from '../contexts/UserContext.jsx';

const AuthModal = ({ onClose, onSuccess }) => {
    const { login, register, error, setError } = useUser();
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: '',
        password: '',
        firstName: '',
    });

    const handleChange = (e) => {
        setError(null);
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let success;
        if (mode === 'login') {
            success = await login(form.email, form.password);
        } else {
            if (!form.firstName.trim()) {
                setError('Please enter your first name.');
                setLoading(false);
                return;
            }
            success = await register(form.email, form.password, form.firstName);
        }

        setLoading(false);
        if (success) onSuccess?.();
    };

    const switchMode = () => {
        setError(null);
        setForm({ email: '', password: '', firstName: '' });
        setMode(mode === 'login' ? 'register' : 'login');
    };

    return (
        <div className="auth-modal__overlay" onClick={onClose}>
            <div
                className="auth-modal__container"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="auth-modal__close" onClick={onClose}>✕</button>

                <h2 className="auth-modal__title">
                    {mode === 'login' ? 'welcome back.' : 'join the club.'}
                </h2>

                <p className="auth-modal__subtitle">
                    {mode === 'login'
                        ? 'log in to save your favourite spots.'
                        : 'create an account to save your favourite spots.'}
                </p>

                <form className="auth-modal__form" onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <input
                            className="auth-modal__input"
                            type="text"
                            name="firstName"
                            placeholder="first name"
                            value={form.firstName}
                            onChange={handleChange}
                            autoComplete="given-name"
                            required
                        />
                    )}

                    <input
                        className="auth-modal__input"
                        type="email"
                        name="email"
                        placeholder="email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />

                    <input
                        className="auth-modal__input"
                        type="password"
                        name="password"
                        placeholder="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        required
                        minLength={8}
                    />

                    {error && (
                        <p className="auth-modal__error">{error}</p>
                    )}

                    <button
                        className="auth-modal__submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? '...'
                            : mode === 'login' ? 'log in' : 'create account'}
                    </button>
                </form>

                <p className="auth-modal__switch">
                    {mode === 'login' ? "don't have an account? " : 'already have an account? '}
                    <span onClick={switchMode}>
                        {mode === 'login' ? 'join the club' : 'log in'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default AuthModal;