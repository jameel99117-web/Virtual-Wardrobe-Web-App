import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, User, Mail, Lock, MapPin, CloudSun, Upload, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";

const BACKEND_URL = "https://wardrobe-j46j-vert.vercel.app";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    location: "",
    preferences: "clear",
    imageFile: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { username, email, password, location, preferences } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileChange = (e) =>
    setFormData({ ...formData, imageFile: e.target.files[0] });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/signup`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="ambient-bg" />

      <div className="auth-split-wrapper">
        {/* Left Visual Side */}
        <div className="auth-visual-side glass-panel">
          <div className="visual-top-brand">
            <div className="brand-icon-wrapper">
              <Sparkles size={18} />
            </div>
            <span className="brand-name font-display">VÉSTIR</span>
          </div>

          <div className="visual-quote-box">
            <span className="badge badge-gold">Join the Styling Collective</span>
            <h2 className="quote-text font-serif">
              “Elegance is not standing out, but being remembered.”
            </h2>
            <p className="quote-author">— Giorgio Armani</p>
          </div>

          <div className="visual-footer-info">
            <div className="stat-pill">✨ Instant Digitization</div>
            <div className="stat-pill">👗 Smart Outfits</div>
            <div className="stat-pill">📅 Daily Planning</div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="auth-form-side">
          <div className="auth-card glass-panel animate-fade-in-up">
            <div className="auth-card-header">
              <span className="badge badge-rose" style={{ marginBottom: "10px" }}>
                <ShieldCheck size={12} />
                <span>New Membership</span>
              </span>
              <h1 className="auth-card-title font-serif">Create Account</h1>
              <p className="auth-card-subtitle">
                Begin digitizing and styling your dream virtual closet.
              </p>
            </div>

            <form onSubmit={onSubmit} className="auth-form">
              {/* Username */}
              <div className="input-field-group">
                <label className="input-label">Username</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    name="username"
                    placeholder="e.g. style_maven"
                    value={username}
                    onChange={onChange}
                    required
                    className="auth-input"
                  />
                </div>
              </div>

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

              {/* Location & Preferences */}
              <div className="form-row-two">
                <div className="input-field-group">
                  <label className="input-label"><MapPin size={12} /> Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. London, NYC"
                    value={location}
                    onChange={onChange}
                    required
                    className="auth-input no-pad-left"
                  />
                </div>

                <div className="input-field-group">
                  <label className="input-label"><CloudSun size={12} /> Climate</label>
                  <select
                    name="preferences"
                    value={preferences}
                    onChange={onChange}
                    className="auth-input no-pad-left"
                  >
                    <option value="clear">Sunny / Clear</option>
                    <option value="clouds">Mild / Overcast</option>
                    <option value="rain">Rainy / Wet</option>
                    <option value="snow">Cold / Winter</option>
                    <option value="fog">Foggy / Cool</option>
                  </select>
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
                <span>{loading ? "Creating Account..." : "Create Wardrobe Profile"}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="auth-footer-text">
              <p>
                Already registered?{' '}
                <Link to="/login" className="auth-link">
                  Sign In
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

        .auth-visual-side {
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 0;
          border: none;
          border-right: 1px solid var(--border-subtle);
          background: linear-gradient(135deg, rgba(224, 122, 134, 0.08) 0%, rgba(20, 23, 34, 0.95) 70%);
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
          background: var(--accent-rose-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
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
          color: #ff9ea9;
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

        .auth-form-side {
          padding: 40px 44px;
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
          font-size: 32px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }

        .auth-card-subtitle {
          color: var(--text-secondary);
          font-size: 13.5px;
          margin-bottom: 20px;
        }

        .input-field-group {
          margin-bottom: 16px;
        }

        .form-row-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .input-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-secondary);
          margin-bottom: 6px;
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
          padding: 11px 14px 11px 42px;
          background: rgba(10, 12, 18, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          color: #fff;
          font-size: 13.5px;
          outline: none;
          transition: all 0.25s ease;
        }

        .auth-input.no-pad-left {
          padding-left: 14px;
        }

        .auth-input:focus {
          border-color: var(--accent-rose);
          box-shadow: 0 0 15px rgba(224, 122, 134, 0.25);
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
          margin-bottom: 16px;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 13px;
          font-size: 14.5px;
          border-radius: 12px;
          margin-top: 6px;
        }

        .auth-footer-text {
          margin-top: 20px;
          text-align: center;
          font-size: 13px;
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
          margin-top: 12px;
          font-size: 12px;
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
          .auth-form-side { padding: 32px 20px; }
        }
      `}</style>
    </div>
  );
};

export default Signup;
