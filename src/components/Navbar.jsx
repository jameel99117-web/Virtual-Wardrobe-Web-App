import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  LayoutDashboard, 
  Shirt, 
  Palette, 
  FolderHeart, 
  PlusCircle, 
  LogOut,
  Menu,
  X
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <Sparkles size={16} /> },
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} />, auth: true },
    { to: "/outfits", label: "Lookbook", icon: <FolderHeart size={16} />, auth: true },
    { to: "/create-outfit", label: "Studio", icon: <Palette size={16} />, auth: true },
    { to: "/add-item", label: "Add Piece", icon: <PlusCircle size={16} />, auth: true },
  ];

  return (
    <header className="site-navbar-wrapper">
      <nav className="site-navbar glass-panel">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon-wrapper">
            <Sparkles size={20} className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-name font-display">VÉSTIR</span>
            <span className="brand-sub">Digital Wardrobe</span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <div className="nav-menu desktop-only">
          {navLinks.map((link) => {
            if (link.auth && !token) return null;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                <span className="nav-icon">{link.icon}</span>
                <span>{link.label}</span>
                {isActive && <div className="active-pill" />}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="nav-actions desktop-only">
          {token ? (
            <div className="user-section">
              <button onClick={handleLogout} className="btn-logout" title="Log Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary" style={{ padding: "8px 18px", fontSize: "13px" }}>
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="mobile-toggle-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu glass-panel animate-fade-in">
          {navLinks.map((link) => {
            if (link.auth && !token) return null;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`mobile-nav-link ${isActive ? "active" : ""}`}
              >
                <span className="nav-icon">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
          {token ? (
            <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn-danger mobile-logout">
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          ) : (
            <div className="mobile-auth-stack">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary">
                Sign In
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        .site-navbar-wrapper {
          position: fixed;
          top: 16px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          padding: 0 24px;
          z-index: 1000;
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
        }

        .site-navbar {
          width: 100%;
          max-width: 1200px;
          height: 64px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 999px;
          background: rgba(14, 16, 22, 0.82);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5), 0 0 1px 1px rgba(255,255,255,0.05);
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #fff;
        }

        .brand-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--accent-gold-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #09090b;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 2px;
          background: linear-gradient(135deg, #ffffff 0%, #e4e4e7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-sub {
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--accent-gold);
          font-weight: 600;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .nav-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .nav-link.active {
          color: #0c0d10;
          background: var(--accent-gold-gradient);
          box-shadow: 0 4px 14px rgba(212, 175, 55, 0.35);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          color: #ffffff;
        }

        .auth-buttons {
          display: flex;
          gap: 8px;
        }

        .mobile-only {
          display: none;
        }

        .mobile-toggle-btn {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 8px;
        }

        .mobile-menu {
          position: fixed;
          top: 90px;
          left: 24px;
          right: 24px;
          padding: 20px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 999;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 600;
        }

        .mobile-nav-link.active {
          color: #0c0d10;
          background: var(--accent-gold-gradient);
        }

        .mobile-logout {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
        }

        .mobile-auth-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
        }

        @media (max-width: 900px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
