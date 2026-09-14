import {footerCompanyLinks} from "../../Static/Data.jsx";
import {Link} from "react-router-dom";
import {useState} from "react";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 4000);
        }
    };

    return (
        <footer style={{background: '#0a0a0a', color: '#a0a0a0'}}>

            {/* Newsletter Band */}
            <div style={{borderBottom: '1px solid rgba(255,255,255,0.08)'}} className="py-12 px-4">
                <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 style={{fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', marginBottom: 4}}>
                            Join the Community
                        </h3>
                        <p style={{fontSize: 14, color: '#808080'}}>Get early access to new products, exclusive deals &amp; artisan stories.</p>
                    </div>
                    <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            style={{
                                flex: 1,
                                minWidth: 220,
                                padding: '12px 16px',
                                background: 'rgba(255,255,255,0.07)',
                                border: '1.5px solid rgba(255,255,255,0.12)',
                                borderRadius: 4,
                                color: 'white',
                                fontSize: 14,
                                outline: 'none',
                            }}
                            onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.7)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '12px 24px',
                                background: subscribed ? '#16a34a' : '#7c3aed',
                                color: 'white',
                                border: 'none',
                                borderRadius: 4,
                                fontSize: 13,
                                fontWeight: 600,
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'background 0.3s ease',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {subscribed ? '✓ Subscribed!' : 'Subscribe'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Footer Grid */}
            <div className="max-w-screen-xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8" style={{borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
                {/* Brand */}
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm">D</div>
                        <span style={{fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'white'}}>DivineSoul</span>
                    </div>
                    <p style={{fontSize: 13, lineHeight: 1.7, color: '#707070'}}>
                        Discover handmade treasures from skilled creators. Every piece tells a story of craft, care, and tradition.
                    </p>
                    {/* Social icons */}
                    <div className="flex gap-3 mt-5">
                        {["instagram", "twitter", "facebook", "pinterest"].map(s => (
                            <a key={s} href="#" aria-label={s}
                               className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                               style={{background: 'rgba(255,255,255,0.07)', color: '#808080'}}
                               onMouseEnter={e => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.color = 'white'; }}
                               onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#808080'; }}>
                                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                    {s === "instagram" && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>}
                                    {s === "twitter" && <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>}
                                    {s === "facebook" && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>}
                                    {s === "pinterest" && <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.029 12.017.029z"/>}
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Shop Links */}
                <div>
                    <h4 style={{color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16}}>Shop</h4>
                    <ul className="space-y-3">
                        {[{label: "All Products", to: "/products"}, {label: "Best Selling", to: "/best-selling"}, {label: "Events", to: "/events"}, {label: "New Arrivals", to: "/products"}].map((l, i) => (
                            <li key={i}>
                                <Link to={l.to} style={{fontSize: 13, color: '#707070', transition: 'color 0.2s'}}
                                      onMouseEnter={e => e.target.style.color = 'white'}
                                      onMouseLeave={e => e.target.style.color = '#707070'}>
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h4 style={{color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16}}>Support</h4>
                    <ul className="space-y-3">
                        {footerCompanyLinks.map((link, i) => (
                            <li key={i}>
                                <Link to={link.link} style={{fontSize: 13, color: '#707070', transition: 'color 0.2s'}}
                                      onMouseEnter={e => e.target.style.color = 'white'}
                                      onMouseLeave={e => e.target.style.color = '#707070'}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 style={{color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16}}>Contact</h4>
                    <ul className="space-y-3">
                        <li style={{fontSize: 13, color: '#707070'}}>📧 hello@divinesoul.in</li>
                        <li style={{fontSize: 13, color: '#707070'}}>📞 +91 98765 43210</li>
                        <li style={{fontSize: 13, color: '#707070'}}>🕐 Mon–Sat, 10am – 7pm IST</li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-screen-xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
                <p style={{fontSize: 12, color: '#505050'}}>
                    © {new Date().getFullYear()} DivineSoul™. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    {["Privacy", "Terms", "Cookies"].map(l => (
                        <a key={l} href="#" style={{fontSize: 12, color: '#505050', transition: 'color 0.2s'}}
                           onMouseEnter={e => e.target.style.color = 'white'}
                           onMouseLeave={e => e.target.style.color = '#505050'}>
                            {l}
                        </a>
                    ))}
                    {/* Payment icons */}
                    <div className="flex gap-1.5 ml-2">
                        {["Visa", "MC", "UPI", "Pay"].map(p => (
                            <span key={p} style={{background: 'rgba(255,255,255,0.08)', color: '#606060', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 3, letterSpacing: '0.04em'}}>
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
