import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';

// Removed static loading of stripePromise

const CheckoutForm = ({ orderId, amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + `/order/${orderId}`,
            },
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setMessage('Payment Succeeded!');
            // Handle success logic, e.g. update backend
            const paymentResult = {
                id: paymentIntent.id,
                status: paymentIntent.status,
                update_time: new Date().toISOString(),
                payer: { email_address: 'test@example.com' } // Simplified
            };
            await api.put(`/orders/${orderId}/pay`, paymentResult);
            setIsProcessing(false);
            window.location.reload();
        } else {
            setMessage('Unexpected state');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button disabled={isProcessing || !stripe || !elements} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
            {message && <div style={{ color: 'var(--error)', marginTop: '0.5rem' }}>{message}</div>}
        </form>
    );
};

const OrderPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [stripePromise, setStripePromise] = useState(null);

    useEffect(() => {
        const fetchStripeConfig = async () => {
            const { data } = await api.get('/payment/config');
            setStripePromise(loadStripe(data.publishableKey));
        };
        fetchStripeConfig();
    }, []);

    useEffect(() => {
        const fetchOrder = async () => {
            const { data } = await api.get(`/orders/${id}`);
            setOrder(data);
        };
        fetchOrder();
    }, [id]);

    useEffect(() => {
        if (order && !order.isPaid) {
            const fetchClientSecret = async () => {
                const { data } = await api.post('/payment/create-payment-intent', {
                    amount: order.totalPrice,
                    currency: 'inr'
                });
                setClientSecret(data.clientSecret);
            };
            fetchClientSecret();
        }
    }, [order]);

    if (!order) return (
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Loading Order Details...</div>
            <p>Please wait while we fetch your order information.</p>
        </div>
    );

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 className="gradient-text" style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Order Details</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Order ID: #{order._id}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Shipping Information</h2>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            <p><strong style={{ fontWeight: 600 }}>Name:</strong> {order.user?.name || 'N/A'}</p>
                            <p><strong style={{ fontWeight: 600 }}>Email:</strong> {order.user?.email || 'N/A'}</p>
                            <p>
                                <strong style={{ fontWeight: 600 }}>Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                            </p>
                        </div>
                        <div style={{ marginTop: '1.5rem' }}>
                            {order.isDelivered ? (
                                <div className="badge badge-success" style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}>✓ Order Successfully Delivered</div>
                            ) : (
                                <div className="badge badge-warning" style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}>Pending Delivery</div>
                            )}
                        </div>
                    </div>

                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Payment Status</h2>
                        <p style={{ marginBottom: '1rem' }}><strong style={{ fontWeight: 600 }}>Method:</strong> {order.paymentMethod}</p>

                        {!order.isPaid && (
                            <div style={{ margin: '1rem 0', padding: '1.5rem', backgroundColor: '#f0f9ff', color: '#0369a1', borderRadius: 'var(--radius)', border: '1px solid #0ea5e9', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ fontSize: '2rem' }}>💳</div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Awaiting Payment</h3>
                                <p style={{ margin: 0 }}>Please complete payment to process your order.</p>
                            </div>
                        )}

                        {order.isPaid && (
                            <div className="badge badge-success" style={{ fontSize: '1rem', padding: '1rem', width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                <span>🎉</span> Paid on {order.paidAt?.substring(0, 10)}
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Order Items</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {order.orderItems?.map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--background)' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '0.5rem', overflow: 'hidden', marginRight: '1rem', border: '1px solid var(--border)' }}>
                                        <div style={{ width: '100%', height: '100%', background: '#eee' }}>
                                            {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                        </div>
                                    </div>
                                    <Link to={`/product/${item.product}`} style={{ flex: 1, fontWeight: 600, color: 'var(--text-main)', fontSize: '1.05rem' }}>{item.name}</Link>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.qty} x ₹{item.price}</div>
                                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>₹{(item.qty * item.price).toFixed(2)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="card sticky" style={{ top: '6rem' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Order Summary</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                            <span>Items</span>
                            <span>₹{order.itemsPrice}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                            <span>Shipping</span>
                            <span>₹{order.shippingPrice}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                            <span>Tax</span>
                            <span>₹{order.taxPrice}</span>
                        </div>
                        <div style={{ borderTop: '2px solid var(--border)', margin: '1rem 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.5rem', color: 'var(--text-main)' }}>
                            <span>Total</span>
                            <span>₹{order.totalPrice}</span>
                        </div>

                        {!order.isPaid && (
                            <div style={{ marginTop: '1rem' }}>
                                {clientSecret && stripePromise ? (
                                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                                        <CheckoutForm orderId={order._id} amount={order.totalPrice} />
                                    </Elements>
                                ) : (
                                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading payment secure...</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default OrderPage;
