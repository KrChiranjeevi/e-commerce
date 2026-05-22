import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SellerDashboardPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]); // Seller's products
    // Note: In a real app, we would fetch *only* this seller's products from a specific endpoint
    // For now, filtering the main product list on the client side or backend
    const [orders, setOrders] = useState([]); // Orders with seller's products
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!user || (!user.isSeller && !user.isAdmin)) {
            navigate('/');
        } else {
            fetchSellerData();
        }
    }, [user, navigate, activeTab, authLoading]);

    const fetchSellerData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'products') {
                const { data } = await api.get('/products');
                // Filter where seller match 
                const myProducts = data.filter(p => p.seller === user._id);
                setProducts(myProducts);
            } else if (activeTab === 'orders') {
                const { data } = await api.get('/orders/seller');
                setOrders(data);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    const deliverHandler = async (id) => {
        try {
            await api.put(`/orders/${id}/deliver`);
            fetchSellerData(); // Refresh
            alert('Order marked as delivered');
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating order');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchSellerData(); // Refresh
            } catch (err) {
                alert('Error deleting product');
            }
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 className="gradient-text" style={{ marginBottom: '2rem' }}>Seller Dashboard</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                <button
                    onClick={() => setActiveTab('products')}
                    style={{
                        padding: '1rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'products' ? '3px solid var(--primary)' : '3px solid transparent',
                        color: activeTab === 'products' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: 600,
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                    }}
                >
                    My Products
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                        padding: '1rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : '3px solid transparent',
                        color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: 600,
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                    }}
                >
                    Customer Orders
                </button>
            </div>

            {activeTab === 'products' && (
                <div className="fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2>Product Listings</h2>
                        <button onClick={() => navigate('/product/create')} className="btn btn-primary">
                            <Plus size={18} /> Add New Product
                        </button>
                    </div>

                    {loading ? <div className="loader">Loading...</div> : (
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%' }}>
                                    <thead style={{ backgroundColor: 'var(--background)' }}>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Category</th>
                                            <th>Rating</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product._id} style={{ transition: 'background-color 0.1s' }} className="hover:bg-slate-50">
                                                <td style={{ fontWeight: 500 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                                            <img src={product.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                                        </div>
                                                        {product.name}
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>${product.price}</td>
                                                <td><span className="badge badge-warning" style={{ background: '#f1f5f9', color: '#475569' }}>{product.category}</span></td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <span style={{ fontWeight: 600 }}>{product.rating}</span>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 5</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={() => navigate(`/product/${product._id}/edit`)}
                                                            className="btn btn-outline"
                                                            style={{ padding: '0.4rem', borderRadius: '0.5rem' }}
                                                            title="Edit"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteHandler(product._id)}
                                                            className="btn btn-danger"
                                                            style={{ padding: '0.4rem', borderRadius: '0.5rem', background: '#fee2e2', border: 'none', color: '#ef4444' }}
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="fade-in">
                    <h2 style={{ marginBottom: '1.5rem' }}>Incoming Orders</h2>
                    {loading ? <div className="loader">Loading...</div> : (
                        orders.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                                <p style={{ color: 'var(--text-muted)' }}>No orders received yet.</p>
                            </div>
                        ) :
                            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%' }}>
                                        <thead style={{ backgroundColor: 'var(--background)' }}>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Date</th>
                                                <th>Total</th>
                                                <th>Payment</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order._id}>
                                                    <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>#{order._id.substring(0, 8)}</td>
                                                    <td>{order.createdAt.substring(0, 10)}</td>
                                                    <td style={{ fontWeight: 600 }}>${order.totalPrice}</td>
                                                    <td>
                                                        <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-danger'}`}>
                                                            {order.isPaid ? 'Paid' : 'Unpaid'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-warning'}`}>
                                                            {order.isDelivered ? 'Delivered' : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {!order.isDelivered && (
                                                            <button
                                                                onClick={() => deliverHandler(order._id)}
                                                                className="btn btn-primary"
                                                                style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}
                                                            >
                                                                Mark Delivered
                                                            </button>
                                                        )}
                                                        {order.isDelivered && (
                                                            <span style={{ color: 'var(--success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                                ✓ Completed
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SellerDashboardPage;
