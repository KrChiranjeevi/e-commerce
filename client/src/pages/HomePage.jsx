import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Banner from '../components/Banner';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const containerRef = useRef(null);
    const headingRef = useRef(null);

    const selectedCategory = searchParams.get('category') || 'All';

    // Animate heading on mount
    useGSAP(() => {
        if (headingRef.current) {
            gsap.fromTo(headingRef.current,
                { opacity: 0, x: -40 },
                { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }
            );
        }
    }, { dependencies: [selectedCategory], scope: containerRef });

    // Animate product cards when they appear
    useGSAP(() => {
        if (!loading && products.length > 0) {
            const cards = gsap.utils.toArray('.product-card-wrapper');
            
            // Initial entrance animation
            gsap.fromTo(cards,
                { opacity: 0, y: 60, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    stagger: {
                        amount: 0.8,
                        from: 'start',
                        ease: 'power1.inOut'
                    },
                    ease: 'power3.out'
                }
            );

            // ScrollTrigger for cards below the fold
            cards.forEach((card) => {
                ScrollTrigger.create({
                    trigger: card,
                    start: 'top 90%',
                    onEnter: () => {
                        gsap.to(card, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.5,
                            ease: 'power2.out'
                        });
                    }
                });
            });
        }
    }, { dependencies: [loading, products], scope: containerRef });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (allProducts.length > 0) {
                    if (selectedCategory === 'All') {
                        setProducts(allProducts);
                    } else {
                        const filtered = allProducts.filter(p =>
                            p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                            selectedCategory.toLowerCase().includes(p.category.toLowerCase())
                        );
                        setProducts(filtered);
                    }
                    setLoading(false);
                    return;
                }

                const { data } = await api.get('/products');
                setAllProducts(data);

                if (selectedCategory === 'All') {
                    setProducts(data);
                } else {
                    const filtered = data.filter(p =>
                        p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                        selectedCategory.toLowerCase().includes(p.category.toLowerCase())
                    );
                    setProducts(filtered);
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategory, allProducts.length]);

    return (
        <div style={{ paddingBottom: '4rem' }} ref={containerRef}>
            <CategoryNav />

            <div className="container">
                {selectedCategory === 'All' && <Banner />}

                {/* Featured Stats Bar */}
                {selectedCategory === 'All' && (
                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        marginBottom: '3rem',
                        flexWrap: 'wrap'
                    }}>
                        {[
                            { icon: '🚀', label: 'Free Delivery', sub: 'On orders above ₹999' },
                            { icon: '🔒', label: 'Secure Payment', sub: '100% safe checkout' },
                            { icon: '↩️', label: 'Easy Returns', sub: '30-day hassle free' },
                            { icon: '🎁', label: 'Daily Deals', sub: 'New offers every day' },
                        ].map((item, i) => (
                            <div key={i} className="glass-card" style={{
                                flex: '1',
                                minWidth: '160px',
                                padding: '1rem 1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                borderRadius: '1rem',
                                transition: 'transform 0.2s',
                                cursor: 'default',
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <span style={{ fontSize: '1.75rem' }}>{item.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{item.label}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '2rem',
                    marginTop: selectedCategory !== 'All' ? '2rem' : '0'
                }}>
                    <h1 ref={headingRef} className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: 0 }}>
                        {selectedCategory === 'All' ? '✨ Latest Drops' : `${selectedCategory} Collection`}
                    </h1>
                    <div style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        padding: '0.4rem 1rem',
                        borderRadius: '999px',
                        color: 'var(--text-muted)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        backdropFilter: 'blur(8px)'
                    }}>
                        {products.length} Products
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                        <div style={{
                            display: 'inline-block',
                            width: '50px',
                            height: '50px',
                            border: '4px solid var(--glass-border)',
                            borderTopColor: 'var(--primary)',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            marginBottom: '1rem'
                        }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1rem' }}>Loading amazing products...</p>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : error ? (
                    <div className="card" style={{ textAlign: 'center', color: 'var(--error)', maxWidth: '500px', margin: '2rem auto', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                        <h3>Error Loading Products</h3>
                        <p>{error}</p>
                        <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>
                            Try Again
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛍️</div>
                        <h3>No products in this category yet</h3>
                        <p>Check back soon for new arrivals!</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                        gap: '2rem'
                    }}>
                        {products.map((product) => (
                            <div key={product._id} className="product-card-wrapper" style={{ opacity: 0, transform: 'translateY(40px)' }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
