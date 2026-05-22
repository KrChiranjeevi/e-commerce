import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Heart, Key, LogOut, Package, RefreshCw, Save, Settings, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('settings');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [orders, setOrders] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setName(user.name);
            setEmail(user.email);
            setAvatar(user.avatar || '');
            setWishlist(user.wishlist || []);

            if (activeTab === 'orders') {
                const fetchOrders = async () => {
                    try {
                        const { data } = await api.get('/orders/myorders');
                        setOrders(data);
                    } catch (err) {
                        console.error(err);
                    }
                };
                fetchOrders();
            }
        }
    }, [user, navigate, activeTab]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const { data } = await api.put('/users/profile', {
                name,
                email,
                password,
                avatar
            });
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const updatedInfo = { ...userInfo, ...data };
            localStorage.setItem('userInfo', JSON.stringify(updatedInfo));

            setLoading(false);
            setMessage('Profile Updated Successfully');
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
        window.location.reload();
    };

    const generateRandomAvatar = () => {
        const randomSeed = Math.random().toString(36).substring(7);
        setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`);
    };

    const sidebarVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    const contentVariants = {
        hidden: { x: 20, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
        exit: { x: -20, opacity: 0, transition: { duration: 0.3 } }
    };

    return (
        <div className="container" style={{ padding: '3rem 1rem', minHeight: '85vh' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 320px)) 1fr', gap: '2.5rem', alignItems: 'start' }}>

                {/* Sidebar */}
                <motion.div
                    className="card glass-card"
                    style={{ padding: '0', overflow: 'hidden', border: 'none' }}
                    initial="hidden"
                    animate="visible"
                    variants={sidebarVariants}
                >
                    <div style={{ padding: '2.5rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white', position: 'relative' }}>
                        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1rem' }}>
                            <motion.img
                                src={avatar || `https://ui-avatars.com/api/?name=${name}&background=random`}
                                alt={name}
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(255,255,255,0.3)', background: 'white', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />
                            <div style={{ position: 'absolute', bottom: '0', right: '0', background: 'white', borderRadius: '50%', padding: '0.4rem', color: 'var(--primary)', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                                <Camera size={16} />
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1.4rem', margin: '0 0 0.2rem', fontWeight: 700 }}>{name}</h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0 }}>{email}</p>
                    </div>

                    <div style={{ padding: '1.5rem' }}>
                        {[
                            { id: 'settings', icon: Settings, label: 'Settings' },
                            { id: 'orders', icon: Package, label: 'My Orders' },
                            { id: 'wishlist', icon: Heart, label: 'Wishlist' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`btn`}
                                style={{
                                    width: '100%',
                                    marginBottom: '0.75rem',
                                    justifyContent: 'flex-start',
                                    background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: activeTab === tab.id ? 700 : 500
                                }}
                            >
                                <tab.icon size={18} style={{ marginRight: '0.75rem' }} /> {tab.label}
                            </button>
                        ))}

                        <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />

                        <button
                            onClick={logoutHandler}
                            className="btn btn-outline"
                            style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        >
                            <LogOut size={18} style={{ marginRight: '0.75rem' }} /> Sign Out
                        </button>
                    </div>
                </motion.div>

                {/* Content Area */}
                <div style={{ minWidth: 0 }}>
                    <AnimatePresence mode='wait'>
                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                className="card glass-card"
                                initial="hidden" animate="visible" exit="exit" variants={contentVariants}
                            >
                                <h2 style={{ marginBottom: '2rem', fontSize: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>Profile Settings</h2>
                                {message && <div className="badge badge-success" style={{ marginBottom: '1.5rem', width: '100%', padding: '1rem', fontSize: '1rem' }}>{message}</div>}
                                {error && <div className="badge badge-danger" style={{ marginBottom: '1.5rem', width: '100%', padding: '1rem', fontSize: '1rem' }}>{error}</div>}

                                <form onSubmit={submitHandler}>
                                    <div style={{ marginBottom: '2rem', background: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <label style={{ fontWeight: 600, fontSize: '1.1rem' }}>Profile Picture</label>
                                            <button
                                                type="button"
                                                onClick={generateRandomAvatar}
                                                className="btn btn-outline"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                            >
                                                <RefreshCw size={14} style={{ marginRight: '0.4rem' }} /> Generate Random
                                            </button>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {/* File Upload */}
                                            <div style={{ position: 'relative', overflow: 'hidden' }}>
                                                <button type="button" className="btn btn-outline" style={{ width: '100%', position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
                                                    <Camera size={18} style={{ marginRight: '0.5rem' }} /> Upload from Device
                                                </button>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const formData = new FormData();
                                                            formData.append('image', file);
                                                            try {
                                                                const { data } = await api.post('/upload', formData);
                                                                // Handle localhost vs relative
                                                                // If dev, use full URL if proxy not catering to uploads, but usually proxy only does /api
                                                                // Static folder is at /uploads on 5000.
                                                                // Vite proxy config usually proxies /api.
                                                                // We added /uploads static serve. We need to access http://localhost:5000/uploads/...
                                                                // For now, hardcode localhost:5000 for uploads if logic needs it, 
                                                                // or ensure proxy covers /uploads in vite.config.
                                                                // Let's assume absolute URL for safety here.
                                                                setAvatar(`http://localhost:5000${data.image}`);
                                                            } catch (err) {
                                                                console.error(err);
                                                                setError('Image upload failed');
                                                            }
                                                        }
                                                    }}
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                                                />
                                            </div>

                                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>OR</div>

                                            <div className="input-glow" style={{ position: 'relative' }}>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Image URL directly..."
                                                    value={avatar}
                                                    onChange={(e) => setAvatar(e.target.value)}
                                                    style={{ paddingLeft: '2.5rem' }}
                                                />
                                                <Camera size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            </div>
                                        </div>

                                        <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                                            Upload an image from your device or paste a URL.
                                        </small>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
                                            <div className="input-glow" style={{ position: 'relative' }}>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    style={{ paddingLeft: '2.5rem' }}
                                                />
                                                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Change Password (Optional)</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                            <div className="input-glow" style={{ position: 'relative' }}>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="New Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    style={{ paddingLeft: '2.5rem' }}
                                                />
                                                <Key size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            </div>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-glow" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
                                        {loading ? 'Saving Changes...' : <><Save size={18} style={{ marginRight: '0.5rem' }} /> Save Profile</>}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'orders' && (
                            <motion.div
                                key="orders"
                                initial="hidden" animate="visible" exit="exit" variants={contentVariants}
                            >
                                <h2 className="gradient-text" style={{ marginBottom: '2rem', fontSize: '2rem' }}>My Orders</h2>
                                {orders.length === 0 ? (
                                    <div className="card glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
                                        <Package size={64} style={{ color: 'var(--border)', marginBottom: '1.5rem' }} />
                                        <h3 style={{ marginBottom: '1rem' }}>No orders yet</h3>
                                        <button className="btn btn-primary" onClick={() => navigate('/')}>Start Shopping</button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                                        {orders.map((order, i) => (
                                            <motion.div
                                                key={order._id}
                                                className="card"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>Order #{order._id.substring(0, 8)}</div>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                                        {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Amount</div>
                                                        <div style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary)' }}>₹{order.totalPrice}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`badge ${order.isPaid ? 'badge-success' : 'badge-warning'}`} style={{ display: 'block', textAlign: 'center', marginBottom: '0.25rem' }}>
                                                            {order.isPaid ? 'Paid' : 'Unpaid'}
                                                        </div>
                                                        <div className={`badge ${order.isDelivered ? 'badge-success' : 'badge-warning'}`} style={{ display: 'block', textAlign: 'center' }}>
                                                            {order.isDelivered ? 'Delivered' : 'Processing'}
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="btn btn-outline"
                                                        onClick={() => navigate(`/order/${order._id}`)}
                                                    >
                                                        Details
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'wishlist' && (
                            <motion.div
                                key="wishlist"
                                initial="hidden" animate="visible" exit="exit" variants={contentVariants}
                            >
                                <h2 className="gradient-text" style={{ marginBottom: '2rem', fontSize: '2rem' }}>My Wishlist</h2>
                                {(!wishlist || wishlist.length === 0) ? (
                                    <div className="card glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
                                        <Heart size={64} style={{ color: 'var(--border)', marginBottom: '1.5rem' }} />
                                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>Your wishlist is looking a bit empty.</p>
                                        <button className="btn btn-primary btn-glow" onClick={() => navigate('/')}>
                                            Explore Our Collection
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
                                        {wishlist.map((product, i) => (
                                            typeof product === 'object' && product !== null ? (
                                                <motion.div
                                                    key={product._id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                >
                                                    <ProductCard product={product} />
                                                </motion.div>
                                            ) : null
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
