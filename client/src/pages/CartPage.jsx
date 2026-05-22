import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(items);
    }, []);

    const removeFromCartHandler = (id) => {
        const newCart = cartItems.filter(x => x.product !== id);
        setCartItems(newCart);
        localStorage.setItem('cartItems', JSON.stringify(newCart));
    };

    const updateQtyHandler = (id, qty) => {
        const item = cartItems.find(x => x.product === id);
        const newItem = { ...item, qty: Number(qty) };
        const newCart = cartItems.map(x => x.product === id ? newItem : x);
        setCartItems(newCart);
        localStorage.setItem('cartItems', JSON.stringify(newCart));
    }

    const checkoutHandler = () => {
        if (user) {
            navigate('/shipping');
        } else {
            navigate('/login?redirect=/shipping');
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '1.5rem' }}>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div>
                    Your cart is empty <Link to="/" style={{ color: 'var(--primary)' }}>Go Back</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div className="card">
                        {cartItems.map(item => (
                            <div key={item.product} style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
                                <div style={{ marginLeft: '1rem', flex: 1 }}>
                                    <Link to={`/product/${item.product}`} style={{ fontWeight: 'bold' }}>{item.name}</Link>
                                    <div>₹{item.price}</div>
                                </div>
                                <select
                                    className="form-control"
                                    style={{ width: 'auto', marginRight: '1rem' }}
                                    value={item.qty}
                                    onChange={(e) => updateQtyHandler(item.product, e.target.value)}
                                >
                                    {[...Array(item.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className="btn btn-outline"
                                    style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                                    onClick={() => removeFromCartHandler(item.product)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="card">
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                            Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                        </h2>
                        <div style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                            ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
