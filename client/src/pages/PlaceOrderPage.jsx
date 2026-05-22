import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PlaceOrderPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));
    const paymentMethod = localStorage.getItem('paymentMethod');

    // Calculate prices
    // Calculate prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const itemsPrice = addDecimals(cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1), 0));
    const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    useEffect(() => {
        if (!shippingAddress) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const placeOrderHandler = async () => {
        try {
            const { data } = await api.post('/orders', {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod: paymentMethod || 'Stripe',
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            });
            // Clear cart logic here or after payment
            // localStorage.removeItem('cartItems'); 
            navigate(`/order/${data._id}`);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || error.message || 'Order placement failed');
        }
    };

    return (
        <div className="container fade-in" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</div>
                    <div style={{ height: '2px', width: '30px', background: 'var(--primary)' }}></div>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</div>
                    <div style={{ height: '2px', width: '30px', background: 'var(--primary)' }}></div>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                </div>
            </div>

            <h1 className="gradient-text" style={{ marginBottom: '2rem', textAlign: 'center' }}>Review Order</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card">
                        <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>Shipping</h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '0.25rem' }}>Address:</strong>
                            {shippingAddress?.address}, {shippingAddress?.city}, {shippingAddress?.postalCode}, {shippingAddress?.country}
                        </p>
                        <button onClick={() => navigate('/shipping')} className="btn" style={{ padding: '0', color: 'var(--primary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Edit</button>
                    </div>

                    <div className="card">
                        <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>Payment Method</h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '0.25rem' }}>Method:</strong>
                            {paymentMethod}
                        </p>
                        <button onClick={() => navigate('/payment')} className="btn" style={{ padding: '0', color: 'var(--primary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Edit</button>
                    </div>

                    <div className="card">
                        <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>Order Items</h2>
                        {cartItems.length === 0 ? <p>Your cart is empty</p> : (
                            <div style={{ marginTop: '0.5rem' }}>
                                {cartItems.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', borderBottom: index !== cartItems.length - 1 ? '1px solid var(--border)' : 'none', padding: '1rem 0' }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ marginLeft: '1rem', flex: 1 }}>
                                            <Link to={`/product/${item.product}`} style={{ fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }}>{item.name}</Link>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                                {item.qty} x ₹{item.price}
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 600 }}>₹{(item.qty * item.price).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="card" style={{ position: 'sticky', top: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Order Summary</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                            <span>Items</span>
                            <span>₹{itemsPrice}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                            <span>Shipping</span>
                            <span>₹{shippingPrice}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                            <span>Tax</span>
                            <span>₹{taxPrice}</span>
                        </div>
                        <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.4rem' }}>
                            <span>Total</span>
                            <span>₹{totalPrice}</span>
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                            onClick={placeOrderHandler}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderPage;
