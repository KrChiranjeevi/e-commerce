import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SellerRegisterPage = () => {
    const [isLogin, setIsLogin] = useState(false); // Toggle between Login and Register
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { loginWithData } = useAuth();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (isLogin) {
                // Login Logic (Sellers)
                const { data } = await api.post('/sellers/login', { email, password });
                loginWithData(data);
                navigate('/dashboard');
            } else {
                // Register Logic (Sellers)
                // Using name as storeName for simplicity
                const { data } = await api.post('/sellers', { name, storeName: name, email, password });
                loginWithData(data);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem' }}>
            <div className="card fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                    <button
                        onClick={() => setIsLogin(false)}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: !isLogin ? '3px solid var(--primary)' : '3px solid transparent',
                            color: !isLogin ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '1rem'
                        }}
                    >
                        Register
                    </button>
                    <button
                        onClick={() => setIsLogin(true)}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: isLogin ? '3px solid var(--primary)' : '3px solid transparent',
                            color: isLogin ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '1rem'
                        }}
                    >
                        Login
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                        {isLogin ? 'Seller Portal' : 'Start Selling'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your business on ShopWave</p>
                </div>

                {error && <div className="badge badge-danger" style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={submitHandler}>
                    {!isLogin && (
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Store / User Name</label>
                            <input
                                type="text"
                                required
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="My Awesome Store"
                            />
                        </div>
                    )}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Email Address</label>
                        <input
                            type="email"
                            required
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seller@example.com"
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Password</label>
                        <input
                            type="password"
                            required
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
                        {isLogin ? 'Login to Dashboard' : 'Register Now'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SellerRegisterPage;
