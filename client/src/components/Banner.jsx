import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=2070&q=80',
        title: 'End of Season Sale',
        subtitle: 'Up to 80% OFF — Shop Now',
        badge: '🔥 HOT DEALS',
        cta: 'Shop Sale'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=2070&q=80',
        title: 'New Electronics',
        subtitle: 'Latest Gadgets & Gizmos',
        badge: '⚡ NEW ARRIVALS',
        cta: 'Shop Electronics'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2070&q=80',
        title: 'Fashion Week',
        subtitle: 'Trendy Collections 2025',
        badge: '👗 FASHION',
        cta: 'Shop Fashion'
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=2070&q=80',
        title: 'Home Makeover',
        subtitle: 'Premium Furniture & Decor',
        badge: '🏠 HOME',
        cta: 'Shop Home'
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=2070&q=80',
        title: 'Top Mobiles',
        subtitle: 'iPhone 15, Samsung S24 & More',
        badge: '📱 MOBILES',
        cta: 'Shop Mobiles'
    },
];

const Banner = () => {
    const [current, setCurrent] = useState(0);
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo('.slide-badge',
            { opacity: 0, scale: 0.7, y: -20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
        );
        gsap.fromTo('.slide-title',
            { opacity: 0, x: -60 },
            { opacity: 1, x: 0, duration: 0.7, delay: 0.2, ease: 'power3.out' }
        );
        gsap.fromTo('.slide-sub',
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 0.6, delay: 0.35, ease: 'power3.out' }
        );
        gsap.fromTo('.slide-cta',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, delay: 0.5, ease: 'power2.out' }
        );
    }, { dependencies: [current], scope: containerRef });

    const nextSlide = () => {
        setCurrent(current === slides.length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? slides.length - 1 : current - 1);
    };

    // Auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [current]);

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '400px', overflow: 'hidden', borderRadius: '1.5rem', boxShadow: 'var(--shadow-lg)', marginBottom: '3rem' }}>
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    transform: `translateX(-${current * 100}%)`,
                    transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
            >
                {slides.map((slide) => (
                    <div key={slide.id} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
                        <img
                            src={slide.image}
                            alt={slide.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: '3rem'
                        }}>
                            <div className="slide-badge" style={{
                                display: 'inline-block',
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '0.3rem 1rem',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                                marginBottom: '1rem',
                                width: 'fit-content'
                            }}>
                                {slide.badge}
                            </div>
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '0.5rem', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.4)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }} className="slide-title">
                                {slide.title}
                            </h2>
                            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: 'rgba(255,255,255,0.9)', fontWeight: 500, marginBottom: '1.5rem' }} className="slide-sub">
                                {slide.subtitle}
                            </p>
                            <button className="slide-cta" style={{
                                background: 'white',
                                color: 'var(--primary)',
                                border: 'none',
                                padding: '0.75rem 2rem',
                                borderRadius: '999px',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                width: 'fit-content',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'; }}
                            >
                                {slide.cta} →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={prevSlide}
                className="glass-panel"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '1.5rem',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
            >
                <ChevronLeft size={24} color="var(--primary)" />
            </button>

            <button
                onClick={nextSlide}
                className="glass-panel"
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '1.5rem',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
            >
                <ChevronRight size={24} color="var(--primary)" />
            </button>

            <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.75rem' }}>
                {slides.map((_, index) => (
                    <div
                        key={index}
                        style={{
                            width: index === current ? '24px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: index === current ? 'white' : 'rgba(255, 255, 255, 0.4)',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onClick={() => setCurrent(index)}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Banner;
