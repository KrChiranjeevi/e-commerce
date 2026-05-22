import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{ background: 'white', marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
            <div className="container" style={{ padding: '4rem 1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>

                    {/* Brand Section */}
                    <div>
                        <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '1rem', display: 'inline-block' }}>ShopWave</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            Your one-stop destination for premium products. Experience quality, speed, and exceptional customer service with every order.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}><Facebook size={20} /></a>
                            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}><Twitter size={20} /></a>
                            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}><Instagram size={20} /></a>
                            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 700 }}>Quick Links</h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li><Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link></li>
                            <li><Link to="/products" style={{ color: 'var(--text-muted)' }}>Shop All</Link></li>
                            <li><Link to="/cart" style={{ color: 'var(--text-muted)' }}>My Cart</Link></li>
                            <li><Link to="/myorders" style={{ color: 'var(--text-muted)' }}>Order History</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 700 }}>Contact Us</h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
                                <MapPin size={20} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                                <span>123 Commerce Blvd, Tech City, TC 90210</span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: 'var(--text-muted)' }}>
                                <Phone size={20} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: 'var(--text-muted)' }}>
                                <Mail size={20} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                                <span>support@shopwave.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 700 }}>Stay Updated</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Subscribe to get latest updates and offers.</p>
                        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="form-control"
                                style={{ borderRadius: 'var(--radius)' }}
                            />
                            <button className="btn btn-primary" style={{ padding: '0.75rem' }}>
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', padding: '1.5rem 0', textAlign: 'center', background: '#f8fafc' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} ShopWave. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link to="/privacy" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Privacy Policy</Link>
                        <Link to="/terms" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
