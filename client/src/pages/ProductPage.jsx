import { ArrowLeft, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);

                // Fetch related products
                const { data: allProducts } = await api.get('/products');
                const related = allProducts.filter(p => p.category === data.category && p._id !== data._id);
                setRelatedProducts(related.slice(0, 4));

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0); // Scroll to top on id change
    }, [id]);

    const addToCartHandler = () => {
        // Implement add to cart logic (context or local storage)
        const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
        const item = {
            product: product._id,
            name: product.name,
            image: product.image,
            price: Number(product.price),
            countInStock: product.countInStock,
            qty
        };

        // Check if item exists
        const existItem = existingCart.find(x => x.product === item.product);
        if (existItem) {
            // Update
            const newCart = existingCart.map(x => x.product === existItem.product ? item : x);
            localStorage.setItem('cartItems', JSON.stringify(newCart));
        } else {
            existingCart.push(item);
            localStorage.setItem('cartItems', JSON.stringify(existingCart));
        }
        navigate('/cart');
    };

    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState(null);

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        setReviewError(null);
        try {
            await api.post(`/products/${id}/reviews`, { rating, comment });
            setReviewLoading(false);
            setRating(0);
            setComment('');
            // Refresh product to see new review
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);
        } catch (err) {
            setReviewError(err.response?.data?.message || err.message);
            setReviewLoading(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;
    if (error) return (
        <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text)' }}>Product Not Found</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                The product you are looking for might have been removed or the link is invalid.
                <br />(If you just reset the database, please go back to Home to see the new products)
            </p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
                Return to Home
            </button>
        </div>
    );

    return (
        <div className="container fade-in" style={{ padding: '2rem 1rem' }}>
            <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '1.5rem' }}>
                <ArrowLeft size={16} /> Back
            </button>

            {product && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
                        <div>
                            <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)' }} />
                        </div>
                        <div>
                            <h1 className="gradient-text" style={{ marginBottom: '1rem' }}>{product.name}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.5rem' }}>
                                <span style={{ display: 'flex', color: '#fbbf24' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            fill={i < product.rating ? "#fbbf24" : "none"}
                                            stroke={i < product.rating ? "none" : "#cbd5e1"}
                                        />
                                    ))}
                                </span>
                                <span style={{ color: 'var(--text-muted)' }}>
                                    {product.numReviews} reviews
                                </span>
                            </div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>₹{product.price}</h2>
                            <p style={{ lineHeight: '1.8', marginBottom: '2.5rem', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                                {product.description}
                            </p>

                            <div className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span>Price:</span>
                                    <strong>₹{product.price}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span>Status:</span>
                                    <span style={{ color: product.countInStock > 0 ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>

                                {product.countInStock > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                                        <span>Quantity:</span>
                                        <select
                                            className="form-control"
                                            style={{ width: '80px' }}
                                            value={qty}
                                            onChange={(e) => setQty(Number(e.target.value))}
                                        >
                                            {[...Array(product.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <button
                                    onClick={addToCartHandler}
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '0.8rem' }}
                                    disabled={product.countInStock === 0}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginTop: '4rem' }}>
                        <div>
                            <h2 className="gradient-text" style={{ marginBottom: '2rem', fontSize: '2rem' }}>Customer Reviews</h2>
                            {product.reviews.length === 0 && (
                                <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderRadius: 'var(--radius)', textAlign: 'center', color: '#0369a1' }}>
                                    <h3>No reviews yet</h3>
                                    <p>Be the first to share your thoughts!</p>
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {product.reviews.map((review) => (
                                    <div key={review._id} className="card glass-effect" style={{ padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.5)', background: 'linear-gradient(to right bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.4))' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${review.name}&background=random&color=fff&rounded=true`}
                                                alt={review.name}
                                                style={{ width: '50px', height: '50px', borderRadius: '50%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                    <strong style={{ fontSize: '1.1rem' }}>{review.name}</strong>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                                    <span style={{ display: 'flex', gap: '2px' }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={16}
                                                                fill={i < review.rating ? "#fbbf24" : "none"}
                                                                stroke={i < review.rating ? "none" : "#cbd5e1"}
                                                            />
                                                        ))}
                                                    </span>
                                                    <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: '#dcfce7', color: '#166534', borderRadius: '1rem', fontWeight: 600 }}>
                                                        Verified Purchase
                                                    </span>
                                                </div>
                                                <p style={{ lineHeight: '1.6', color: 'var(--text-main)', fontSize: '1rem' }}>{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="card">
                                <h3 style={{ marginBottom: '1.5rem' }}>Write a Customer Review</h3>
                                {reviewError && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{reviewError}</div>}
                                {user ? (
                                    <form onSubmit={submitReviewHandler}>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Rating</label>
                                            <select
                                                className="form-control"
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                                required
                                            >
                                                <option value="">Select...</option>
                                                <option value="1">1 - Poor</option>
                                                <option value="2">2 - Fair</option>
                                                <option value="3">3 - Good</option>
                                                <option value="4">4 - Very Good</option>
                                                <option value="5">5 - Excellent</option>
                                            </select>
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Comment</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary" disabled={reviewLoading} style={{ width: '100%' }}>
                                            {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="alert alert-warning">
                                        Please <button className="btn btn-link" onClick={() => navigate('/login')} style={{ padding: 0, color: 'var(--primary)', textDecoration: 'underline' }}>sign in</button> to write a review
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {relatedProducts.length > 0 && (
                <div style={{ marginTop: '5rem' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Related Products</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
                        {relatedProducts.map(product => (
                            <div key={product._id} className="card" onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }}>
                                <img src={product.image} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                                <div style={{ padding: '1rem' }}>
                                    <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem' }}>{product.name}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>₹{product.price}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#fbbf24' }}>★ {product.rating}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductPage;
