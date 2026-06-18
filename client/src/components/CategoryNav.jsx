import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const categories = [
    {
        name: 'Electronics',
        label: 'Electronics',
        emoji: '⚡',
        gradient: 'from-blue-500 to-cyan-400',
        bg: 'rgba(59,130,246,0.1)',
        color: '#3b82f6',
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=120&q=80',
    },
    {
        name: 'Mobiles',
        label: 'Mobiles',
        emoji: '📱',
        gradient: 'from-purple-500 to-pink-500',
        bg: 'rgba(168,85,247,0.1)',
        color: '#a855f7',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=120&q=80',
    },
    {
        name: 'TVs',
        label: 'TVs',
        emoji: '📺',
        gradient: 'from-indigo-500 to-blue-600',
        bg: 'rgba(99,102,241,0.1)',
        color: '#6366f1',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=120&q=80',
    },
    {
        name: 'Fashion',
        label: 'Fashion',
        emoji: '👗',
        gradient: 'from-pink-500 to-rose-400',
        bg: 'rgba(236,72,153,0.1)',
        color: '#ec4899',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=120&q=80',
    },
    {
        name: 'Beauty',
        label: 'Beauty',
        emoji: '💄',
        gradient: 'from-rose-400 to-orange-400',
        bg: 'rgba(251,113,133,0.1)',
        color: '#fb7185',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=120&q=80',
    },
    {
        name: 'Home',
        label: 'Home',
        emoji: '🏠',
        gradient: 'from-emerald-500 to-teal-400',
        bg: 'rgba(16,185,129,0.1)',
        color: '#10b981',
        image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=120&q=80',
    },
    {
        name: 'Grocery',
        label: 'Grocery',
        emoji: '🛒',
        gradient: 'from-amber-500 to-yellow-400',
        bg: 'rgba(245,158,11,0.1)',
        color: '#f59e0b',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80',
    },
];

const CategoryNav = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const containerRef = useRef(null);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const activeCategory = searchParams.get('category') || 'All';

    useGSAP(() => {
        // Animate the entire bar in
        gsap.fromTo('.cat-bar',
            { y: -80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
        );

        // Stagger each category item
        gsap.fromTo('.cat-item',
            { y: 30, opacity: 0, scale: 0.7 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: {
                    amount: 0.5,
                    ease: 'power2.out'
                },
                ease: 'back.out(1.4)',
                delay: 0.2
            }
        );
    }, { scope: containerRef });

    const handleClick = (cat) => {
        navigate(`/?category=${cat.name}`);
    };

    return (
        <div ref={containerRef} style={{ position: 'sticky', top: 0, zIndex: 50, marginBottom: '2rem' }}>
            {/* Main bar */}
            <div
                className="cat-bar"
                style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(99,102,241,0.1)',
                    boxShadow: '0 4px 30px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.5) inset',
                    padding: '0.75rem 1.5rem',
                }}
            >
                <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        overflowX: 'auto',
                        paddingBottom: '2px',
                    }}>
                        {/* All Categories button */}
                        <button
                            className="cat-item"
                            onClick={() => navigate('/')}
                            style={{
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '999px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                transition: 'all 0.3s',
                                background: activeCategory === 'All'
                                    ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                                    : 'rgba(99,102,241,0.08)',
                                color: activeCategory === 'All' ? 'white' : '#6366f1',
                                boxShadow: activeCategory === 'All' ? '0 4px 15px rgba(99,102,241,0.4)' : 'none',
                            }}
                            onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })}
                            onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
                        >
                            🏪 All
                        </button>

                        {/* Divider */}
                        <div style={{ width: '1px', height: '30px', background: 'rgba(0,0,0,0.08)', flexShrink: 0 }} />

                        {categories.map((cat, idx) => {
                            const isActive = activeCategory === cat.name;
                            return (
                                <button
                                    key={cat.name}
                                    className="cat-item"
                                    onClick={() => handleClick(cat)}
                                    onMouseEnter={(e) => {
                                        setHoveredIdx(idx);
                                        gsap.to(e.currentTarget, { scale: 1.06, y: -2, duration: 0.25, ease: 'power2.out' });
                                        gsap.to(e.currentTarget.querySelector('.cat-img'), {
                                            scale: 1.15,
                                            duration: 0.3,
                                            ease: 'power2.out'
                                        });
                                    }}
                                    onMouseLeave={(e) => {
                                        setHoveredIdx(null);
                                        gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.25, ease: 'power2.out' });
                                        gsap.to(e.currentTarget.querySelector('.cat-img'), {
                                            scale: 1,
                                            duration: 0.3,
                                            ease: 'power2.out'
                                        });
                                    }}
                                    style={{
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.6rem',
                                        padding: '0.4rem 1rem',
                                        borderRadius: '999px',
                                        border: isActive ? `2px solid ${cat.color}` : '2px solid transparent',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontSize: '0.85rem',
                                        transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
                                        background: isActive
                                            ? cat.bg
                                            : hoveredIdx === idx ? cat.bg : 'transparent',
                                        color: isActive ? cat.color : '#374151',
                                        boxShadow: isActive ? `0 0 0 3px ${cat.color}22` : 'none',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Category image */}
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        boxShadow: `0 2px 8px ${cat.color}44`,
                                        border: `2px solid ${cat.color}33`,
                                    }}>
                                        <img
                                            src={cat.image}
                                            alt={cat.label}
                                            className="cat-img"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = `<span style="font-size:18px;line-height:32px;text-align:center;display:block">${cat.emoji}</span>`;
                                            }}
                                        />
                                    </div>

                                    {/* Label */}
                                    <span style={{ whiteSpace: 'nowrap' }}>{cat.emoji} {cat.label}</span>

                                    {/* Active indicator dot */}
                                    {isActive && (
                                        <span style={{
                                            position: 'absolute',
                                            bottom: '-8px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: cat.color,
                                        }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom glow line */}
            {activeCategory !== 'All' && (() => {
                const activeCat = categories.find(c => c.name === activeCategory);
                return activeCat ? (
                    <div style={{
                        height: '3px',
                        background: `linear-gradient(90deg, transparent, ${activeCat.color}, transparent)`,
                        opacity: 0.6,
                    }} />
                ) : null;
            })()}
        </div>
    );
};

export default CategoryNav;
