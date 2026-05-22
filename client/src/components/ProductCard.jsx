import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
    const { user, loginWithData } = useAuth(); // loginWithData helper or just manual update? AuthContext has setUser?
    // AuthContext.jsx: const loginWithData = (userData) => { ... } is defined and exported in Provider value.
    // I need to check if useAuth exposes it. 
    // Yes: <AuthContext.Provider value={{ user, login, register, logout, loginWithData, loading }}>

    const isWishlisted = user?.wishlist?.some(item => (typeof item === 'string' ? item : item._id) === product._id);

    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            alert('Please login to modify wishlist');
            return;
        }

        try {
            const { data } = await api.post(`/users/wishlist/${product._id}`);
            // data is the new wishlist array

            // Construct new user object
            const updatedUser = { ...user, wishlist: data };

            // Update Context and LocalStorage
            loginWithData(updatedUser);

        } catch (error) {
            console.error('Failed to toggle wishlist', error);
        }
    };

    return (
        <motion.div
            className="glass-card"
            style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0', overflow: 'hidden', border: 'none', position: 'relative' }}
            whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            transition={{ duration: 0.3 }}
        >
            <motion.button
                onClick={toggleWishlist}
                whileTap={{ scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 10,
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '50%',
                    padding: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                className="wishlist-btn"
            >
                <Heart size={20} fill={isWishlisted ? "var(--error)" : "none"} color={isWishlisted ? "var(--error)" : "#64748b"} />
            </motion.button>

            <Link to={`/product/${product._id}`} style={{ position: 'relative', overflow: 'hidden', display: 'block' }}>
                <motion.img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                />
            </Link>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <Link to={`/product/${product._id}`} style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                        {product.name}
                    </Link>
                    <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary)' }}>₹{product.price}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
                    <span style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                fill={i < product.rating ? "#fbbf24" : "none"}
                                stroke={i < product.rating ? "none" : "#94a3b8"}
                            />
                        ))}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        ({product.numReviews} reviews)
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                        className="btn btn-outline"
                        style={{ flex: 1, justifyContent: 'center', fontSize: '0.9rem', padding: '0.5rem' }}
                        onClick={(e) => {
                            // prevent bubble
                            // logic usually navigated via Link
                        }}
                    >
                        <Link to={`/product/${product._id}`} style={{ color: 'inherit', textDecoration: 'none', width: '100%', display: 'block' }}>
                            Details
                        </Link>
                    </button>
                    {/* Could add Quick Cart button here */}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
