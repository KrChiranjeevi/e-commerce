import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Banner from '../components/Banner';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const containerRef = useRef(null);

    useGSAP(() => {
        if (!loading && products.length > 0) {
            gsap.fromTo('.product-card-wrapper', 
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
            );
        }
    }, { dependencies: [loading, products], scope: containerRef });

    const selectedCategory = searchParams.get('category') || 'All';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // If we already have products, just filter
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
    }, [selectedCategory, allProducts.length]); // Re-run when category changes

    return (
        <div style={{ paddingBottom: '3rem' }} ref={containerRef}>
            <CategoryNav />

            <div className="container">
                {selectedCategory === 'All' && <Banner />}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', marginTop: selectedCategory !== 'All' ? '2rem' : '0' }}>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: 0 }}>
                        {selectedCategory === 'All' ? 'Latest Drops' : `${selectedCategory} Collection`}
                    </h1>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                        {products.length} Products Found
                    </span>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <div className="loader" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Loading...</div>
                        {/* Add a spinner here if we had one in CSS */}
                    </div>
                ) : error ? (
                    <div className="card" style={{ textAlign: 'center', color: 'var(--error)', maxWidth: '500px', margin: '2rem auto' }}>
                        <h3>Error Loading Products</h3>
                        <p>{error}</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {products.map((product) => (
                            <div key={product._id} className="product-card-wrapper">
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
