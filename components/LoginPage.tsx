
import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button, Input, Card } from './common/ui';
import { ICONS } from '../constants';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('admin@saif.cafe');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, user } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
      if (user) {
        navigate('/dashboard');
      }
    }, [user, navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4 bg-grid-pattern">
             <style>{`
                .bg-grid-pattern {
                    background-image:
                        linear-gradient(to right, #1a1a1a 1px, transparent 1px),
                        linear-gradient(to bottom, #1a1a1a 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}</style>
            <Card className="w-full max-w-md shadow-neon-violet border-violet-500/30">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-widest">SAIF CAFE</h1>
                    <p className="text-violet-400">Point of Sale System</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        id="email"
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@saif.cafe"
                        required
                    />
                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                     {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                        <ICONS.Login className="w-5 h-5"/>
                    </Button>
                    <p className="text-xs text-gray-500 text-center">Use 'cashier@saif.cafe' for cashier access.</p>
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;
