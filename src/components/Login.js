import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const BACKEND_URL = "https://ilham7898.vercel.app";

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const fillQuickCredentials = () => {
    setFormData({
      email: 'jameel99117@gmail.com',
      password: 'Password123'
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        { email: email.toLowerCase().trim(), password }
      );

      if (res?.data?.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="ambient-bg" />

      <div className="auth-split-wrapper">
        {/* Left Editorial Visual Side */}
        <div className="auth-visual-side glass-panel">
          <div className="visual-top-brand">
            <div className="brand-icon-wrapper">
              <Sparkles size={18} />
            </div>
            <span className="brand-name font-display">VÉSTIR</span>
          </div>

          <div className="visual-quote-box">
            <span className="badge badge-gold">Haute Couture Vault</span>
            <h2 className="quote-text font-serif">
              “Style is a way to say who you are without having to speak.”
            </h2>
            <p className="quote-author">— Rachel Zoe</p>
          </div>

          <div className="visual-footer-info">
            <div className="stat-pill">✨ 30+ Garment Pieces</div>
            <div className="stat-pill">👗 7 Styled Looks</div>
            <div className="stat-pill">📅 Calendar Ready</div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="auth-form-side">
          <div className="auth-card glass-panel animate-fade-in-up">
            <div className="auth-card-header">
              <span className="badge badge-gold" style={{ marginBottom: "10px" }}>
                <ShieldCheck size={12} />
                <span>Secure Access</span>
              </span>
              <h1 className="auth-card-title font-serif">Welcome Back</h1>
              <p className="auth-card-subtitle">
                Sign in to manage your digital closet and planned looks.
              </p>
            </div>

            {/* Quick autofill helper */}
            <div className="quick-login-chip" onClick={fillQuickCredentials} title="Click to fill your reset password">
              <Sparkles size={13} className="chip-sparkle" />
              <span>Click to Autofill Active Account: <strong>jameel99117@gmail.com</strong></span>
            </div>

            <form onSubmit={onSubmit} className="auth-form">
              {/* Email */}
              <div className="input-field-group">
                <label className="input-label">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={onChange}
                    required
                    className="auth-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="input-field-group">
                <label className="input-label">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={onChange}
                    required
                    className="auth-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn-toggle-eye"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="auth-error-box animate-fade-in">
                  <span>{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                className="btn-primary auth-submit-btn"
                disabled={loading}
              >
                <span>{loading ? "Authenticating..." : "Sign In to Wardrobe"}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="auth-footer-text">
              <p>
                Don’t have a wardrobe account?{' '}
                <Link to="/signup" className="auth-link">
                  Create Account
                </Link>
              </p>
              <Link to="/" className="back-home-link">
                ← Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          position: relative;
        }

        .auth-split-wrapper {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          max-width: 1050px;
          width: 100%;
          border-radius: 32px;
          overflow: hidden;
          background: rgba(18, 20, 29, 0.85);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-lg);
        }

        /* Visual Left */
        .auth-visual-side {
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 0;
          border: none;
          border-right: 1px solid var(--border-subtle);
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(20, 23, 34, 0.95) 70%);
          position: relative;
        }

        .visual-top-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-icon-wrapper {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-gold-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0c0d10;
        }

        .brand-name {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #fff;
        }

        .visual-quote-box {
          margin: 40px 0;
        }

        .quote-text {
          font-size: 26px;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.4;
          margin: 16px 0 10px 0;
        }

        .quote-author {
          font-size: 14px;
          color: var(--accent-gold-light);
          font-weight: 500;
        }

        .visual-footer-info {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .stat-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 11.5px;
          color: var(--text-secondary);
        }

        /* Form Right */
        .auth-form-side {
          padding: 48px 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: transparent;
          border: none;
          box-shadow: none;
        }

        .auth-card-title {
          font-size: 34px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }

        .auth-card-subtitle {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 24px;
        }

        .quick-login-chip {
          background: rgba(212, 175, 55, 0.12);
          border: 1px solid rgba(212, 175, 55, 0.35);
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 12px;
          color: var(--accent-gold-light);
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          margin-bottom: 24px;
          transition: all 0.2s ease;
        }

        .quick-login-chip:hover {
          background: rgba(212, 175, 55, 0.2);
          transform: translateY(-1px);
        }

        .chip-sparkle {
          color: var(--accent-gold);
        }

        .input-field-group {
          margin-bottom: 20px;
        }

        .input-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }

        .auth-input {
          width: 100%;
          padding: 13px 14px 13px 44px;
          background: rgba(10, 12, 18, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: all 0.25s ease;
        }

        .auth-input:focus {
          border-color: var(--accent-gold);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.25);
        }

        .btn-toggle-eye {
          position: absolute;
          right: 14px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .btn-toggle-eye:hover {
          color: #fff;
        }

        .auth-error-box {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 18px;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 14px;
          font-size: 15px;
          border-radius: 14px;
          margin-top: 8px;
        }

        .auth-footer-text {
          margin-top: 24px;
          text-align: center;
          font-size: 13.5px;
          color: var(--text-secondary);
        }

        .auth-link {
          color: var(--accent-gold);
          font-weight: 700;
          text-decoration: none;
        }

        .auth-link:hover {
          text-decoration: underline;
        }

        .back-home-link {
          display: inline-block;
          margin-top: 14px;
          font-size: 12.5px;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .back-home-link:hover {
          color: #fff;
        }

        @media (max-width: 860px) {
          .auth-split-wrapper { grid-template-columns: 1fr; }
          .auth-visual-side { display: none; }
          .auth-form-side { padding: 36px 24px; }
        }
      `}</style>
    </div>
  );
};

export default Login;
