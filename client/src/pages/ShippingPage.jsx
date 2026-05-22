import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShippingPage = () => {
    const navigate = useNavigate();
    const storedShippingAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};

    const [address, setAddress] = useState(storedShippingAddress.address || '');
    const [city, setCity] = useState(storedShippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(storedShippingAddress.postalCode || '');
    const [country, setCountry] = useState(storedShippingAddress.country || '');

    const submitHandler = (e) => {
        e.preventDefault();
        localStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode, country }));
        navigate('/payment');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem', minHeight: '80vh', alignItems: 'center' }}>
            <div className="card fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                        <div style={{ height: '2px', width: '30px', background: 'var(--border)' }}></div>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                        <div style={{ height: '2px', width: '30px', background: 'var(--border)' }}></div>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                    </div>
                </div>

                <h1 className="gradient-text" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Shipping Address</h1>
                <form onSubmit={submitHandler}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Address</label>
                        <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="Street address, P.O. box, etc."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>City</label>
                        <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Postal Code</label>
                        <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="Zip / Postal Code"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Country</label>
                        <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                        Continue to Payment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShippingPage;
