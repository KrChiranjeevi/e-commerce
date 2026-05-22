import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=2070&q=80',
        title: 'End of Season Sale',
        subtitle: 'Up to 80% OFF'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=2070&q=80',
        title: 'New Electronics',
        subtitle: 'Latest Gadgets & Gizmos'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2070&q=80',
        title: 'Fashion Week',
        subtitle: 'Trendy Collections'
    }
];

const Banner = () => {
    const [current, setCurrent] = useState(0);
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo('.slide-text', 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
        );
    }, { dependencies: [current], scope: containerRef }); // Re-run animation when slide changes

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
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: '3rem'
                        }}>
                            <h2 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)', fontWeight: 800, letterSpacing: '-0.03em' }} className="slide-text">
                                {slide.title}
                            </h2>
                            <p style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }} className="slide-text">
                                {slide.subtitle}
                            </p>
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
