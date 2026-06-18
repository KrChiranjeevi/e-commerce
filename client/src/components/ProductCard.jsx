import { useRef, useState } from 'react';
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ratingColor = (rating) => {
    if (rating >= 4.5) return '#22c55e';
    if (rating >= 4.0) return '#f59e0b';
    return '#ef4444';
};

const getCategoryBadge = (category) => {
    const map = {
        Electronics: { color: '#3b82f6', bg: '#eff6ff', emoji: '⚡' },
        Mobiles: { color: '#a855f7', bg: '#faf5ff', emoji: '📱' },
        TVs: { color: '#6366f1', bg: '#eef2ff', emoji: '📺' },
        Fashion: { color: '#ec4899', bg: '#fdf2f8', emoji: '👗' },
        Beauty: { color: '#fb7185', bg: '#fff1f2', emoji: '💄' },
        Home: { color: '#10b981', bg: '#f0fdf4', emoji: '🏠' },
        Grocery: { color: '#f59e0b', bg: '#fffbeb', emoji: '🛒' },
    };
    return map[category] || { color: '#6366f1', bg: '#eef2ff', emoji: '🏷️' };
};

const ProductCard = ({ product }) => {
    const { user, loginWithData } = useAuth();
    const cardRef = useRef(null);
    const imgRef = useRef(null);
    const overlayRef = useRef(null);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);

    const isWishlisted = user?.wishlist?.some(item =>
        (typeof item === 'string' ? item : item._id) === product._id
    );

    const badge = getCategoryBadge(product.category);

    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            alert('Please login to use wishlist');
            return;
        }
        try {
            // Heart bounce animation
            gsap.timeline()
                .to(e.currentTarget, { scale: 0.7, duration: 0.1 })
                .to(e.currentTarget, { scale: 1.3, duration: 0.2, ease: 'back.out(3)' })
                .to(e.currentTarget, { scale: 1, duration: 0.15 });

            const { data } = await api.post(`/users/wishlist/${product._id}`);
            loginWithData({ ...user, wishlist: data });
        } catch (error) {
            console.error('Failed to toggle wishlist', error);
        }
    };

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
            y: -10,
            boxShadow: '0 25px 50px -12px rgba(99,102,241,0.25)',
            duration: 0.35,
            ease: 'power2.out'
        });
        gsap.to(imgRef.current, {
            scale: 1.08,
            duration: 0.5,
            ease: 'power2.out'
        });
        gsap.to(overlayRef.current, {
            opacity: 1,
            duration: 0.3,
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            y: 0,
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
            duration: 0.35,
            ease: 'power2.out'
        });
        gsap.to(imgRef.current, {
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
        });
        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.3,
        });
    };

    const fallbackImg = `https://placehold.co/600x400/f3f4f6/9ca3af?text=${encodeURIComponent(product.name.slice(0, 20))}`;

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                background: 'white',
                borderRadius: '1.25rem',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
                border: '1px solid rgba(0,0,0,0.06)',
                transition: 'border-color 0.3s',
            }}
        >
            {/* Wishlist Button */}
            <button
                onClick={toggleWishlist}
                style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 20,
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '50%',
                    padding: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                }}
            >
                <Heart
                    size={18}
                    fill={isWishlisted ? '#f43f5e' : 'none'}
                    color={isWishlisted ? '#f43f5e' : '#94a3b8'}
                    strokeWidth={2}
                />
            </button>

            {/* Category Badge */}
            <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 20,
                background: badge.bg,
                color: badge.color,
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.03em',
                border: `1px solid ${badge.color}33`,
                backdropFilter: 'blur(4px)',
            }}>
                {badge.emoji} {product.category}
            </div>

            {/* Image Area */}
            <div style={{ position: 'relative', overflow: 'hidden', height: '230px', background: '#f8fafc' }}>
                {/* Image skeleton */}
                {!imgLoaded && !imgError && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                    }} />
                )}

                <Link to={`/product/${product._id}`}>
                    <img
                        ref={imgRef}
                        src={imgError ? fallbackImg : product.image}
                        alt={product.name}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => { setImgError(true); setImgLoaded(true); }}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            opacity: imgLoaded ? 1 : 0,
                            transition: 'opacity 0.3s',
                        }}
                    />
                </Link>

                {/* Hover Overlay with Quick Actions */}
                <div
                    ref={overlayRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 60%)',
                        opacity: 0,
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        padding: '1rem',
                        gap: '0.75rem',
                        pointerEvents: 'none',
                    }}
                >
                    <Link
                        to={`/product/${product._id}`}
                        style={{
                            pointerEvents: 'all',
                            background: 'white',
                            color: '#1e293b',
                            padding: '0.5rem 1.25rem',
                            borderRadius: '999px',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Eye size={14} /> View Details
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
                {/* Brand */}
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {product.brand}
                </div>

                {/* Name */}
                <Link
                    to={`/product/${product._id}`}
                    style={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: '#1e293b',
                        lineHeight: '1.4',
                        textDecoration: 'none',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {product.name}
                </Link>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                    <div style={{ display: 'flex', gap: '1px' }}>
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={13}
                                fill={i < Math.round(product.rating) ? '#fbbf24' : 'none'}
                                color={i < Math.round(product.rating) ? '#fbbf24' : '#cbd5e1'}
                                strokeWidth={1.5}
                            />
                        ))}
                    </div>
                    <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: ratingColor(product.rating),
                    }}>
                        {product.rating}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({product.numReviews})</span>
                </div>

                {/* Price + CTA */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #f1f5f9',
                }}>
                    <div>
                        <span style={{
                            fontSize: '1.3rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            ₹{product.price.toFixed(2)}
                        </span>
                        {product.countInStock <= 5 && product.countInStock > 0 && (
                            <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600 }}>
                                Only {product.countInStock} left!
                            </div>
                        )}
                        {product.countInStock === 0 && (
                            <div style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 }}>
                                Out of Stock
                            </div>
                        )}
                    </div>

                    <Link
                        to={`/product/${product._id}`}
                        style={{
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            padding: '0.5rem 1rem',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            textDecoration: 'none',
                            boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)';
                        }}
                    >
                        <ShoppingCart size={14} /> Buy
                    </Link>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    );
};

export default ProductCard;
