import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const MyOrdersPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    return (
        <div className="container fade-in" style={{ padding: '2rem 1rem' }}>
            <h1 className="gradient-text" style={{ marginBottom: '2rem' }}>My Order History</h1>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading orders...</div>
            ) : error ? (
                <div className="badge badge-danger">{error}</div>
            ) : orders.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>No orders found</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Looks like you haven't made any purchases yet.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>Start Shopping</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {orders.map((order) => (
                        <div key={order._id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'all 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Order ID</span>
                                    <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>#{order._id.substring(0, 8)}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Date</span>
                                    <span style={{ fontWeight: 500 }}>{order.createdAt.substring(0, 10)}</span>
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Total Amount</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>₹{order.totalPrice}</span>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-danger'}`} style={{ flex: 1, textAlign: 'center', padding: '0.5rem' }}>
                                    {order.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                                <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-warning'}`} style={{ flex: 1, textAlign: 'center', padding: '0.5rem' }}>
                                    {order.isDelivered ? 'Delivered' : 'Pending'}
                                </span>
                            </div>

                            <button
                                className="btn btn-outline"
                                onClick={() => navigate(`/order/${order._id}`)}
                                style={{ marginTop: 'auto', width: '100%' }}
                            >
                                View Order Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;
