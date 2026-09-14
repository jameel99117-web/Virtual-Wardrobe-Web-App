import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Layers, 
  Wand2, 
  ShieldCheck,
  CheckCircle2,
  RotateCcw
} from "lucide-react";

// A set of mock wardrobe pieces used purely for the interactive teaser.
// No network/image dependency -> never renders broken/empty.
const BUILDER_ITEMS = [
  { id: "top-1", type: "top", icon: "👔", label: "Ivory Blazer" },
  { id: "top-2", type: "top", icon: "👗", label: "Silk Gown" },
  { id: "bottom-1", type: "bottom", icon: "👖", label: "Tailored Trousers" },
  { id: "bottom-2", type: "bottom", icon: "🩱", label: "Pleated Skirt" },
  { id: "shoes-1", type: "shoes", icon: "👠", label: "Satin Heels" },
  { id: "shoes-2", type: "shoes", icon: "👞", label: "Leather Oxfords" },
];

const SLOT_META = {
  top: { label: "Top", placeholder: "👕" },
  bottom: { label: "Bottom", placeholder: "🧵" },
  shoes: { label: "Shoes", placeholder: "👟" },
};

const OutfitBuilderTeaser = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState({ top: null, bottom: null, shoes: null });
  const [dragOverSlot, setDragOverSlot] = useState(null);

  const placedIds = Object.values(slots).filter(Boolean).map((i) => i.id);
  const trayItems = BUILDER_ITEMS.filter((i) => !placedIds.includes(i.id));
  const isComplete = slots.top && slots.bottom && slots.shoes;

  const placeItem = (item) => {
    setSlots((prev) => ({ ...prev, [item.type]: item }));
  };

  const clearSlot = (type) => {
    setSlots((prev) => ({ ...prev, [type]: null }));
  };

  const resetBuilder = () => setSlots({ top: null, bottom: null, shoes: null });

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("text/plain", item.id);
  };

  const handleDrop = (e, slotType) => {
    e.preventDefault();
    setDragOverSlot(null);
    const itemId = e.dataTransfer.getData("text/plain");
    const item = BUILDER_ITEMS.find((i) => i.id === itemId);
    if (item && item.type === slotType) {
      placeItem(item);
    }
  };

  const handleTapChip = (item) => {
    if (!slots[item.type]) placeItem(item);
  };

  return (
    <div className="builder-card glass-panel">
      <div className="card-header-badge">
        <span className="badge badge-gold">
          <Sparkles size={12} />
          <span style={{ marginLeft: 6 }}>Try It Live</span>
        </span>
        {isComplete ? (
          <button className="builder-reset" onClick={resetBuilder} title="Start over">
            <RotateCcw size={14} />
          </button>
        ) : (
          <span className="outfit-tag">Drag or tap to build</span>
        )}
      </div>

      <div className="mannequin">
        {["top", "bottom", "shoes"].map((slotType) => {
          const filled = slots[slotType];
          return (
            <div
              key={slotType}
              className={`builder-slot ${filled ? "filled" : ""} ${
                dragOverSlot === slotType ? "drag-over" : ""
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverSlot(slotType);
              }}
              onDragLeave={() => setDragOverSlot(null)}
              onDrop={(e) => handleDrop(e, slotType)}
              onClick={() => filled && clearSlot(slotType)}
              title={filled ? "Tap to remove" : `Drop a ${SLOT_META[slotType].label} here`}
            >
              <span className="slot-icon">
                {filled ? filled.icon : SLOT_META[slotType].placeholder}
              </span>
              <div className="slot-text">
                <strong>{SLOT_META[slotType].label}</strong>
                <p>{filled ? filled.label : "Empty slot"}</p>
              </div>
              {filled && <CheckCircle2 size={16} className="slot-check" />}
            </div>
          );
        })}
      </div>

      <div className="builder-tray">
        {trayItems.map((item) => (
          <div
            key={item.id}
            className="builder-chip"
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onClick={() => handleTapChip(item)}
          >
            <span>{item.icon}</span>
            <span className="chip-label">{item.label}</span>
          </div>
        ))}
        {trayItems.length === 0 && !isComplete && (
          <span className="tray-empty">All pieces placed</span>
        )}
      </div>

      <div className={`card-footer-info ${isComplete ? "complete" : ""}`}>
        {isComplete ? (
          <>
            <div className="info-text">
              <h4>✨ Look Complete</h4>
              <p>Sign up to save and style this for real</p>
            </div>
            <button
              className="btn-primary builder-cta"
              onClick={() => navigate("/signup")}
            >
              <span>Save Look</span>
              <ArrowRight size={14} />
            </button>
          </>
        ) : (
          <>
            <div className="info-text">
              <h4>Build a Look</h4>
              <p>{3 - Object.values(slots).filter(Boolean).length} pieces left</p>
            </div>
            <span className="curated-pill">Interactive</span>
          </>
        )}
      </div>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div className="home-page-container">
      <div className="ambient-bg" />
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge badge-gold animate-fade-in-up" style={{ marginBottom: "20px" }}>
            <Sparkles size={14} />
            <span>Next-Gen Virtual Wardrobe & Styling</span>
          </div>

          <h1 className="hero-title font-serif animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Curate Your <br />
            <span className="gradient-text-gold">Signature Style</span>
          </h1>

          <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Transform your physical closet into an intelligent digital wardrobe. Effortlessly organize 
            garments, assemble haute couture outfits, and schedule your daily looks with calendar precision.
          </p>

          <div className="hero-cta-group animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <button 
              className="btn-primary hero-btn"
              onClick={() => navigate(token ? "/dashboard" : "/login")}
            >
              <span>{token ? "Enter Studio & Wardrobe" : "Start Styling Now"}</span>
              <ArrowRight size={18} />
            </button>

            <button 
              className="btn-secondary hero-btn"
              onClick={() => navigate(token ? "/create-outfit" : "/signup")}
            >
              <Wand2 size={16} />
              <span>Create New Ensemble</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="hero-metrics animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="metric-item">
              <span className="metric-number font-display">30+</span>
              <span className="metric-label">Garments Ready</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number font-display">7</span>
              <span className="metric-label">Curated Looks</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number font-display">100%</span>
              <span className="metric-label">Cloud Synced</span>
            </div>
          </div>
        </div>

        {/* Hero Visual: Interactive Outfit Builder Teaser */}
        <div className="hero-visual animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="animate-float">
            <OutfitBuilderTeaser />
          </div>

          {/* Floating Accents */}
          <div className="floating-badge badge-1 glass-panel">
            <Calendar size={18} className="badge-icon" />
            <div>
              <strong>Daily Schedule</strong>
              <p>Assigned for Today</p>
            </div>
          </div>

          <div className="floating-badge badge-2 glass-panel">
            <Layers size={18} className="badge-icon-gold" />
            <div>
              <strong>Capsule Closet</strong>
              <p>Instant Mix & Match</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <span className="badge badge-rose">Modern Capabilities</span>
          <h2 className="section-title font-serif">Designed for the Discerning Wardrobe</h2>
          <p className="section-desc">Experience seamless wardrobe orchestration with our editorial tools.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon-box gold">
              <Wand2 size={24} />
            </div>
            <h3 className="feature-title">Intuitive Outfit Studio</h3>
            <p className="feature-text">
              Visually assemble tops, bottoms, outerwear, shoes, and jewelry on an interactive canvas to test aesthetics before dressing.
            </p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-box rose">
              <Calendar size={24} />
            </div>
            <h3 className="feature-title">Style Calendar & Planner</h3>
            <p className="feature-text">
              Assign outfits to upcoming days, work meetings, flights, or weekend getaways so you never waste time deciding what to wear.
            </p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-box cyan">
              <Layers size={24} />
            </div>
            <h3 className="feature-title">Digitized Capsule Closet</h3>
            <p className="feature-text">
              High-resolution cataloging of all your wardrobe pieces with categorization by season, occasion, color, and fit.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner glass-panel">
          <div className="cta-content">
            <h2 className="cta-title font-serif">Elevate Your Daily Routine</h2>
            <p className="cta-desc">
              Log in to access your complete digitized collection of 30 garments and ready-to-wear ensembles.
            </p>
            <button 
              className="btn-primary" 
              style={{ padding: "14px 32px", fontSize: "15px" }}
              onClick={() => navigate(token ? "/dashboard" : "/login")}
            >
              <span>{token ? "Open Dashboard" : "Sign In to Your Closet"}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .home-page-container {
          min-height: 100vh;
          position: relative;
          padding-top: 100px;
          padding-bottom: 80px;
          overflow-x: hidden;
        }

        .hero-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 24px;
          position: relative;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 620px;
        }

        .hero-title {
          font-size: 58px;
          line-height: 1.12;
          font-weight: 700;
          margin-bottom: 24px;
          letter-spacing: -0.5px;
        }

        .hero-subtitle {
          font-size: 17px;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 36px;
          max-width: 540px;
        }

        .hero-cta-group {
          display: flex;
          gap: 16px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }

        .hero-btn {
          padding: 14px 28px;
          font-size: 15px;
          border-radius: 14px;
        }

        .hero-metrics {
          display: flex;
          align-items: center;
          gap: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--border-subtle);
          width: 100%;
          max-width: 500px;
        }

        .metric-item {
          display: flex;
          flex-direction: column;
        }

        .metric-number {
          font-size: 26px;
          font-weight: 800;
          color: #ffffff;
        }

        .metric-label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-divider {
          width: 1px;
          height: 32px;
          background: var(--border-subtle);
        }

        /* Hero Visual */
        .hero-visual {
          position: absolute;
          top: 8px;
          right: 24px;
          width: 380px;
          display: flex;
          justify-content: center;
        }

        .visual-card-main {
          width: 100%;
          max-width: 380px;
          padding: 24px;
          border-radius: 28px;
          background: rgba(22, 25, 36, 0.85);
        }

        .card-header-badge {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .outfit-tag {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* Interactive Outfit Builder Teaser */
        .builder-card {
          width: 100%;
          max-width: 380px;
          padding: 24px;
          border-radius: 28px;
          background: rgba(22, 25, 36, 0.85);
        }

        .builder-reset {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .builder-reset:hover {
          background: rgba(212, 175, 55, 0.15);
          color: var(--accent-gold-light);
        }

        .mannequin {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 18px;
        }

        .builder-slot {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 16px;
          border: 1.5px dashed rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
        }

        .builder-slot .slot-icon {
          font-size: 22px;
          width: 34px;
          text-align: center;
          flex-shrink: 0;
        }

        .slot-text {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .slot-text strong {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
        }

        .slot-text p {
          font-size: 13.5px;
          color: #fff;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .builder-slot.drag-over {
          border-color: var(--accent-gold);
          background: rgba(212, 175, 55, 0.08);
        }

        .builder-slot.filled {
          border-style: solid;
          border-color: rgba(212, 175, 55, 0.35);
          background: rgba(212, 175, 55, 0.06);
        }

        .slot-check {
          color: var(--accent-gold);
          flex-shrink: 0;
        }

        .builder-tray {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
          min-height: 34px;
        }

        .builder-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          font-size: 12.5px;
          color: var(--text-secondary);
          cursor: grab;
          transition: all 0.2s ease;
          user-select: none;
        }

        .builder-chip:hover {
          border-color: var(--accent-gold);
          color: #fff;
          transform: translateY(-2px);
        }

        .builder-chip:active {
          cursor: grabbing;
        }

        .chip-label {
          white-space: nowrap;
        }

        .tray-empty {
          font-size: 12.5px;
          color: var(--text-muted);
          font-style: italic;
          padding: 6px 0;
        }

        .card-footer-info.complete {
          border-top-color: rgba(212, 175, 55, 0.3);
        }

        .builder-cta {
          padding: 10px 16px !important;
          font-size: 13px !important;
        }

        .card-footer-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }

        .card-footer-info h4 {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 2px;
        }

        .card-footer-info p {
          font-size: 12px;
          color: var(--text-muted);
        }

        .curated-pill {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          background: rgba(212, 175, 55, 0.15);
          color: var(--accent-gold-light);
          font-weight: 600;
        }

        .floating-badge {
          position: absolute;
          padding: 12px 18px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: var(--shadow-lg);
          animation: floatGentle 4s ease-in-out infinite;
        }

        .floating-badge strong {
          display: block;
          font-size: 13px;
          color: #fff;
        }

        .floating-badge p {
          font-size: 11px;
          color: var(--text-muted);
          margin: 0;
        }

        .badge-1 {
          top: -20px;
          right: -20px;
          animation-delay: -1s;
        }

        .badge-2 {
          bottom: -25px;
          left: -20px;
          animation-delay: -2.5s;
        }

        .badge-icon {
          color: var(--accent-rose);
        }

        .badge-icon-gold {
          color: var(--accent-gold);
        }

        /* Features */
        .features-section {
          max-width: 1200px;
          margin: 60px auto;
          padding: 0 24px;
        }

        .section-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 50px auto;
        }

        .section-title {
          font-size: 38px;
          margin: 16px 0 12px 0;
          color: #ffffff;
        }

        .section-desc {
          color: var(--text-secondary);
          font-size: 16px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 28px;
        }

        .feature-card {
          padding: 36px 28px;
          border-radius: 24px;
        }

        .feature-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .feature-icon-box.gold {
          background: rgba(212, 175, 55, 0.15);
          color: var(--accent-gold);
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .feature-icon-box.rose {
          background: rgba(224, 122, 134, 0.15);
          color: var(--accent-rose);
          border: 1px solid rgba(224, 122, 134, 0.3);
        }

        .feature-icon-box.cyan {
          background: rgba(78, 205, 196, 0.15);
          color: var(--accent-cyan);
          border: 1px solid rgba(78, 205, 196, 0.3);
        }

        .feature-title {
          font-size: 19px;
          font-weight: 700;
          margin-bottom: 12px;
          color: #fff;
        }

        .feature-text {
          font-size: 14.5px;
          line-height: 1.65;
          color: var(--text-secondary);
        }

        /* CTA Banner */
        .cta-banner-section {
          max-width: 1200px;
          margin: 80px auto 0 auto;
          padding: 0 24px;
        }

        .cta-banner {
          padding: 60px 40px;
          border-radius: 32px;
          text-align: center;
          background: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.12) 0%, rgba(20, 22, 32, 0.9) 70%);
          border: 1px solid rgba(212, 175, 55, 0.25);
        }

        .cta-content {
          max-width: 650px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 40px;
          margin-bottom: 16px;
        }

        .cta-desc {
          color: var(--text-secondary);
          font-size: 16px;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        @media (max-width: 968px) {
          .hero-content {
            align-items: center;
            max-width: 100%;
            text-align: center;
            margin: 0 auto;
          }
          .hero-title { font-size: 42px; }
          .hero-metrics { justify-content: center; }
          .floating-badge { display: none; }
          .hero-visual {
            position: static;
            width: 100%;
            margin-top: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
