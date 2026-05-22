import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('Stripe');

    const storedAddress = localStorage.getItem('shippingAddress');
    if (!storedAddress) {
        navigate('/shipping');
    }

    const submitHandler = (e) => {
        e.preventDefault();
        localStorage.setItem('paymentMethod', paymentMethod);
        navigate('/placeorder');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem', minHeight: '80vh', alignItems: 'center' }}>
            <div className="card fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</div>
                        <div style={{ height: '2px', width: '30px', background: 'var(--primary)' }}></div>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                        <div style={{ height: '2px', width: '30px', background: 'var(--border)' }}></div>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                    </div>
                </div>

                <h1 className="gradient-text" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Payment Method</h1>
                <form onSubmit={submitHandler}>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>Select Method</label>
                        <div
                            style={{
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                border: paymentMethod === 'Stripe' ? '2px solid var(--primary)' : '1px solid var(--border)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: paymentMethod === 'Stripe' ? 'rgba(79, 70, 229, 0.05)' : 'transparent'
                            }}
                            onClick={() => setPaymentMethod('Stripe')}
                        >
                            <input
                                type="radio"
                                id="Stripe"
                                name="paymentMethod"
                                value="Stripe"
                                checked={paymentMethod === 'Stripe'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                style={{ accentColor: 'var(--primary)', width: '1.2rem', height: '1.2rem' }}
                            />
                            <div style={{ flex: 1 }}>
                                <label htmlFor="Stripe" style={{ cursor: 'pointer', fontWeight: 600, display: 'block' }}>Credit / Debit Card</label>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Secure payment via Stripe</span>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                        Continue to Review
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline"
                        style={{ width: '100%', marginTop: '1rem', border: 'none' }}
                        onClick={() => navigate('/shipping')}
                    >
                        Back to Shipping
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentPage;
