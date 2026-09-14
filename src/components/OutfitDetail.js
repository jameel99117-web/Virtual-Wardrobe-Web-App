import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { 
  ArrowLeft, 
  Sparkles, 
  Tag, 
  Clock, 
  Layers, 
  Check, 
  Calendar,
  Share2
} from "lucide-react";

const BACKEND_URL = "https://ilham7898.vercel.app";

function OutfitDetail() {
  const { state: outfit } = useLocation();
  const navigate = useNavigate();

  if (!outfit) {
    return (
      <div className="detail-page-container">
        <Navbar />
        <div className="not-found-box glass-panel">
          <h3>Outfit Not Found</h3>
          <p>Please select an ensemble from the Lookbook collection.</p>
          <button className="btn-primary" onClick={() => navigate("/outfits")}>
            Back to Lookbook
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page-container">
      <div className="ambient-bg" />
      <Navbar />

      <main className="detail-main animate-fade-in-up">
        {/* Back Link */}
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={16} />
          <span>Back to Collection</span>
        </button>

        <div className="detail-layout">
          {/* Left Column: Garment Pieces Gallery */}
          <div className="garments-showcase-column">
            <div className="column-header">
              <h2 className="section-label font-serif">Ensemble Components</h2>
              <span className="badge badge-gold">{outfit.items?.length || 0} Pieces</span>
            </div>

            <div className="garments-grid">
              {outfit.items?.map((item, index) => (
                <div key={item._id || index} className="garment-card glass-panel">
                  <div className="garment-img-wrap">
                    <img 
                      src={`${BACKEND_URL}${item.imageURL}`}
                      alt={item.name}
                      className="garment-img"
                    />
                    <span className="garment-type-pill">{item.type || "Garment"}</span>
                  </div>
                  <div className="garment-info">
                    <h4 className="garment-name">{item.name}</h4>
                    <div className="garment-chips">
                      <span className="garment-chip">{item.color}</span>
                      {item.season && <span className="garment-chip">{item.season}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Lookbook Editorial Card */}
          <div className="editorial-info-column">
            <div className="editorial-card glass-panel">
              <div className="badge badge-rose" style={{ marginBottom: "14px" }}>
                <Sparkles size={12} />
                <span>Curated Look Breakdown</span>
              </div>

              <h1 className="editorial-title font-serif">{outfit.name}</h1>
              
              <div className="editorial-tags-row">
                {outfit.occasion && (
                  <span className="tag-box"><Tag size={13} /> {outfit.occasion}</span>
                )}
                {outfit.season && (
                  <span className="tag-box"><Clock size={13} /> {outfit.season}</span>
                )}
                <span className="tag-box"><Layers size={13} /> {outfit.items?.length || 0} Articles</span>
              </div>

              <hr className="divider-line" />

              <div className="styling-notes">
                <h4>✨ Styling & Harmony Notes</h4>
                <p>
                  This outfit blends contrasting textures and balanced silhouettes for an effortless, 
                  fashion-forward look. Suitable for both day-to-evening transitions and curated occasions.
                </p>
              </div>

              <div className="action-button-stack">
                <button 
                  className="btn-primary full-width"
                  onClick={() => navigate("/dashboard")}
                >
                  <Calendar size={16} />
                  <span>Schedule in Calendar</span>
                </button>
                <button 
                  className="btn-secondary full-width"
                  onClick={() => navigate("/create-outfit")}
                >
                  <Sparkles size={16} />
                  <span>Build Variant in Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .detail-page-container {
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 80px;
          position: relative;
        }

        .detail-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 28px;
          transition: all 0.2s ease;
        }

        .btn-back:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(-3px);
        }

        .detail-layout {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 40px;
          align-items: start;
        }

        .column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-label {
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
        }

        .garments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .garment-card {
          padding: 16px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
        }

        .garment-img-wrap {
          position: relative;
          width: 100%;
          height: 220px;
          border-radius: 14px;
          overflow: hidden;
          background: #161824;
          margin-bottom: 14px;
        }

        .garment-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .garment-card:hover .garment-img {
          transform: scale(1.06);
        }

        .garment-type-pill {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(12, 14, 20, 0.85);
          backdrop-filter: blur(8px);
          font-size: 10.5px;
          padding: 3px 9px;
          border-radius: 6px;
          font-weight: 700;
          color: var(--accent-gold-light);
          text-transform: uppercase;
        }

        .garment-name {
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .garment-chips {
          display: flex;
          gap: 6px;
        }

        .garment-chip {
          font-size: 11px;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 8px;
          border-radius: 6px;
        }

        /* Right Column */
        .editorial-card {
          padding: 36px 30px;
          border-radius: 28px;
          position: sticky;
          top: 100px;
          background: rgba(20, 23, 33, 0.85);
        }

        .editorial-title {
          font-size: 34px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .editorial-tags-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .tag-box {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.06);
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 12.5px;
          color: var(--text-secondary);
        }

        .divider-line {
          border: none;
          height: 1px;
          background: var(--border-subtle);
          margin-bottom: 24px;
        }

        .styling-notes {
          margin-bottom: 32px;
        }

        .styling-notes h4 {
          font-size: 14px;
          color: var(--accent-gold-light);
          margin-bottom: 8px;
          font-weight: 600;
        }

        .styling-notes p {
          font-size: 14px;
          line-height: 1.65;
          color: var(--text-secondary);
        }

        .action-button-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .full-width {
          width: 100%;
          padding: 14px;
          font-size: 14.5px;
        }

        .not-found-box {
          max-width: 500px;
          margin: 60px auto;
          padding: 40px;
          text-align: center;
          border-radius: 24px;
        }

        @media (max-width: 900px) {
          .detail-layout {
            grid-template-columns: 1fr;
          }
          .editorial-card {
            position: relative;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default OutfitDetail;
