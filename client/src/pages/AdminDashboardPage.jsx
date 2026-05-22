import { Package, ShoppingBag, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');

    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/');
        } else {
            fetchData();
        }
    }, [user, navigate, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'users') {
                const { data } = await api.get('/users');
                setUsers(data);
            } else if (activeTab === 'products') {
                const { data } = await api.get('/products');
                setProducts(data);
            } else if (activeTab === 'orders') {
                const { data } = await api.get('/orders');
                setOrders(data);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const deleteUserHandler = async (id) => {
        if (window.confirm('Delete user?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchData();
            } catch (err) { alert('Error deleting user'); }
        }
    };

    const deleteProductHandler = async (id) => {
        if (window.confirm('Delete product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchData();
            } catch (err) { alert('Error deleting product'); }
        }
    };

    const createProductHandler = async () => {
        try {
            await api.post('/products'); // Admin creates product (user field will be admin's ID)
            alert('Product created');
            fetchData();
        } catch (err) {
            alert('Error creating product');
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 className="gradient-text" style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                <button
                    onClick={() => setActiveTab('users')}
                    style={{
                        padding: '1rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'users' ? '3px solid var(--primary)' : '3px solid transparent',
                        color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: 600,
                        display: 'flex', gap: '0.5rem', alignItems: 'center',
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                    }}
                >
                    <Users size={20} /> Users
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    style={{
                        padding: '1rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'products' ? '3px solid var(--primary)' : '3px solid transparent',
                        color: activeTab === 'products' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: 600,
                        display: 'flex', gap: '0.5rem', alignItems: 'center',
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                    }}
                >
                    <ShoppingBag size={20} /> Products
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                        padding: '1rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : '3px solid transparent',
                        color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: 600,
                        display: 'flex', gap: '0.5rem', alignItems: 'center',
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                    }}
                >
                    <Package size={20} /> Orders
                </button>
            </div>

            {loading ? <div className="loader">Loading...</div> : (
                <div className="fade-in">
                    {activeTab === 'users' && (
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%' }}>
                                    <thead style={{ backgroundColor: 'var(--background)' }}>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user._id}>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>#{user._id.substring(0, 8)}</td>
                                                <td style={{ fontWeight: 500 }}>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        {user.isAdmin && <span className="badge badge-primary">Admin</span>}
                                                        {user.isSeller && <span className="badge badge-warning">Seller</span>}
                                                        {!user.isAdmin && !user.isSeller && <span className="badge" style={{ background: '#f1f5f9', color: '#64748b' }}>User</span>}
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => deleteUserHandler(user._id)}
                                                        className="btn btn-danger"
                                                        style={{ padding: '0.4rem', borderRadius: '0.5rem', background: '#fee2e2', border: 'none', color: '#ef4444' }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                                <button onClick={() => navigate('/product/create')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    + Add New Product
                                </button>
                            </div>
                            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%' }}>
                                        <thead style={{ backgroundColor: 'var(--background)' }}>
                                            <tr>
                                                <th>Product</th>
                                                <th>Price</th>
                                                <th>Category</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(product => (
                                                <tr key={product._id} className="hover:bg-slate-50">
                                                    <td style={{ fontWeight: 500 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                            {/* Placeholder or actual image */}
                                                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f1f5f9' }}>
                                                                <img src={product.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                                            </div>
                                                            <div>
                                                                <div>{product.name}</div>
                                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>#{product._id.substring(0, 8)}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ fontWeight: 600 }}>${product.price}</td>
                                                    <td><span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>{product.category}</span></td>
                                                    <td>
                                                        <button
                                                            onClick={() => deleteProductHandler(product._id)}
                                                            className="btn btn-danger"
                                                            style={{ padding: '0.4rem', borderRadius: '0.5rem', background: '#fee2e2', border: 'none', color: '#ef4444' }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%' }}>
                                    <thead style={{ backgroundColor: 'var(--background)' }}>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>User</th>
                                            <th>Date</th>
                                            <th>Total</th>
                                            <th>Payment</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id}>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>#{order._id.substring(0, 8)}</td>
                                                <td style={{ fontWeight: 500 }}>{order.user && order.user.name}</td>
                                                <td>{order.createdAt?.substring(0, 10)}</td>
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

export default AdminDashboardPage;
