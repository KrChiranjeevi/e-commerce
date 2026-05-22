import { LogOut, ShoppingCart, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.03em' }} className="gradient-text">
                    ShopWave
                </Link>

                <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {/* Admin Dashboard */}
                    {user && user.isAdmin && (
                        <Link to="/admin/dashboard" style={{ fontWeight: 600, color: 'var(--text-main)', transition: 'color 0.2s' }}>
                            Admin
                        </Link>
                    )}

                    {/* Seller Dashboard */}
                    {user && user.isSeller && !user.isAdmin && (
                        <Link to="/dashboard" style={{ fontWeight: 600, color: 'var(--text-main)', transition: 'color 0.2s' }}>
                            Dashboard
                        </Link>
                    )}

                    {/* Become a Seller */}
                    {(!user || (!user.isSeller && !user.isAdmin)) && (
                        <Link to="/seller-register" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                            Become a Seller
                        </Link>
                    )}

                    {user && (
                        <Link to="/myorders" style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                            My Orders
                        </Link>
                    )}

                    <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                        <div style={{ background: 'var(--surface)', padding: '0.5rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
                            <ShoppingCart size={20} color="var(--primary)" />
                        </div>
                        <span style={{ fontWeight: 600 }}>Cart</span>
                    </Link>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link to="/profile" style={{ fontWeight: 600, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                                ) : (
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span>{user.name.split(' ')[0]}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline"
                                style={{ fontSize: '0.875rem', padding: '0.4rem 1rem' }}
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            <User size={18} /> Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
