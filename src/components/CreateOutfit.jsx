import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { 
  Sparkles, 
  Check, 
  Plus, 
  Trash2, 
  Palette, 
  Layers, 
  Tag, 
  Clock,
  ArrowRight,
  ArrowLeft,
  Search,
  CheckCircle2,
  X
} from "lucide-react";

const BACKEND_URL = "https://ilham7898.vercel.app";

function CreateOutfit() {
  const [clothes, setClothes] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [outfitName, setOutfitName] = useState("");
  const [occasion, setOccasion] = useState("Casual");
  const [season, setSeason] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchClothes();
  }, []);

  const fetchClothes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await axios.get(`${BACKEND_URL}/api/clothes/my-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClothes(res.data.items || []);
    } catch (err) {
      console.error("Error fetching clothes:", err);
    }
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const removeItem = (id) => {
    setSelectedItems((prev) => prev.filter((i) => i !== id));
  };

  const deleteWardrobeItem = async (e, id) => {
    e.stopPropagation(); // don't trigger the card's onClick (toggleSelect)
    if (!window.confirm("Permanently delete this item from your wardrobe?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BACKEND_URL}/api/clothes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClothes((prev) => prev.filter((item) => item._id !== id));
      setSelectedItems((prev) => prev.filter((i) => i !== id));
    } catch (err) {
      console.error("Error deleting wardrobe item:", err);
      alert(err.response?.data?.message || "Error deleting item");
    }
  };

  const saveOutfit = async (e) => {
    if (e) e.preventDefault();
    if (!outfitName.trim()) return alert("Please provide a name for this outfit");
    if (selectedItems.length === 0) return alert("Select at least one garment for your outfit");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        name: outfitName,
        items: selectedItems,
        occasion,
        season
      };

      await axios.post(`${BACKEND_URL}/api/outfits/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessModal(true);
    } catch (err) {
      console.error("Error saving outfit:", err);
      alert(err.response?.data?.message || "Error saving outfit");
    } finally {
      setLoading(false);
    }
  };

  const selectedClothesObjects = clothes.filter((item) => selectedItems.includes(item._id));

  const categories = ["All", "Dress", "Shoes", "Accessories", "Top", "Bottom"];
  const filteredClothes = clothes.filter((item) => {
    const matchesCat = categoryFilter === "All" || (item.type && item.type.toLowerCase() === categoryFilter.toLowerCase());
    const matchesSearch = searchQuery === "" 
      || item.name.toLowerCase().includes(searchQuery.toLowerCase())
      || item.color.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="studio-page-container">
      <div className="ambient-bg" />
      <Navbar />

      {/* Success Modal */}
      {successModal && (
        <div className="modal-backdrop animate-fade-in">
          <div className="modal-content glass-panel animate-fade-in-up">
            <div className="modal-icon-circle">
              <CheckCircle2 size={40} className="modal-icon-check" />
            </div>
            <h3 className="font-serif">Ensemble Created!</h3>
            <p>"{outfitName}" has been successfully crafted and saved to your Lookbook.</p>
            <div className="modal-btn-row">
              <button className="btn-secondary" onClick={() => { setSuccessModal(false); setOutfitName(""); setSelectedItems([]); }}>
                Create Another
              </button>
              <button className="btn-primary" onClick={() => navigate("/outfits")}>
                View in Lookbook <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="studio-main animate-fade-in">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* Header */}
        <section className="studio-header">
          <div>
            <div className="badge badge-gold" style={{ marginBottom: "10px" }}>
              <Palette size={12} />
              <span>Interactive Fashion Canvas</span>
            </div>
            <h1 className="studio-title font-serif">Outfit Styling Studio</h1>
            <p className="studio-subtitle">
              Assemble, pair, and harmonize pieces from your wardrobe into complete couture looks.
            </p>
          </div>
        </section>

        {/* 2-Column Fashion Studio */}
        <div className="studio-layout">
          {/* LEFT: Outfit Board (The Look) */}
          <div className="studio-board-column">
            <div className="board-card glass-panel">
              <div className="board-top">
                <div className="board-title-row">
                  <h3 className="board-title font-display">Your Ensemble</h3>
                  <span className="badge badge-gold">{selectedItems.length} Selected</span>
                </div>

                {/* Outfit Details Form Inputs */}
                <div className="form-group">
                  <label className="form-label">Outfit Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Parisian Sunset Blazer, Rooftop Gala..."
                    value={outfitName}
                    onChange={(e) => setOutfitName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label className="form-label"><Tag size={12} /> Occasion</label>
                    <select 
                      value={occasion} 
                      onChange={(e) => setOccasion(e.target.value)}
                      className="form-select"
                    >
                      <option value="Casual">Casual</option>
                      <option value="Smart Casual">Smart Casual</option>
                      <option value="Formal">Formal</option>
                      <option value="Party">Party</option>
                      <option value="Vacation">Vacation</option>
                      <option value="Work">Work</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label"><Clock size={12} /> Season</label>
                    <select 
                      value={season} 
                      onChange={(e) => setSeason(e.target.value)}
                      className="form-select"
                    >
                      <option value="All">All Seasons</option>
                      <option value="Summer">Summer</option>
                      <option value="Winter">Winter</option>
                      <option value="Autumn">Autumn</option>
                      <option value="Spring">Spring</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Live Canvas Pieces */}
              <div className="board-canvas-area">
                <label className="form-label">Assembled Components</label>
                {selectedClothesObjects.length === 0 ? (
                  <div className="empty-board-placeholder">
                    <Sparkles size={28} className="empty-sparkle" />
                    <p>Click any clothing item on the right to add it to this outfit.</p>
                  </div>
                ) : (
                  <div className="selected-items-grid">
                    {selectedClothesObjects.map((item) => (
                      <div key={item._id} className="selected-item-pill glass-panel">
                        <img 
                          src={`${BACKEND_URL}${item.imageURL}`} 
                          alt={item.name} 
                          className="selected-item-thumb"
                        />
                        <div className="selected-item-meta">
                          <span className="selected-item-name">{item.name}</span>
                          <span className="selected-item-type">{item.type} • {item.color}</span>
                        </div>
                        <button 
                          onClick={() => removeItem(item._id)} 
                          className="btn-remove-selected"
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <button 
                className="btn-primary btn-save-outfit"
                onClick={saveOutfit}
                disabled={loading || selectedItems.length === 0}
              >
                <Sparkles size={16} />
                <span>{loading ? "Saving Ensemble..." : "Save Ensemble to Lookbook"}</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Digital Closet Picker */}
          <div className="studio-closet-column">
            <div className="closet-card glass-panel">
              {/* Filter and Search Bar */}
              <div className="closet-controls">
                <div className="closet-search-box">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Filter garments by name or color..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="closet-search-input"
                  />
                </div>

                <div className="closet-category-pills">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`cat-pill ${categoryFilter === cat ? "active" : ""}`}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Garments Selectable Grid */}
              <div className="selectable-garments-grid">
                {filteredClothes.length === 0 ? (
                  <div className="empty-closet-msg">
                    <p>No wardrobe items match your filter.</p>
                  </div>
                ) : (
                  filteredClothes.map((item) => {
                    const isSelected = selectedItems.includes(item._id);
                    return (
                      <div
                        key={item._id}
                        onClick={() => toggleSelect(item._id)}
                        className={`selectable-item-card ${isSelected ? "selected" : ""}`}
                      >
                        <div className="selectable-img-wrap">
                          <img
                            src={`${BACKEND_URL}${item.imageURL}`}
                            alt={item.name}
                            className="selectable-img"
                          />
                          {isSelected && (
                            <div className="selection-badge">
                              <Check size={14} />
                            </div>
                          )}
                          <span className="item-tag-type">{item.type}</span>
                          <button
                            className="btn-delete-garment"
                            onClick={(e) => deleteWardrobeItem(e, item._id)}
                            title="Delete from wardrobe"
                          >
                            <X size={13} />
                          </button>
                        </div>
                        <div className="selectable-info">
                          <span className="selectable-name">{item.name}</span>
                          <span className="selectable-color">{item.color}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .studio-page-container {
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 80px;
          position: relative;
        }

        .studio-main {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .studio-header {
          margin-bottom: 32px;
        }

        .studio-title {
          font-size: 40px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }

        .studio-subtitle {
          color: var(--text-secondary);
          font-size: 15px;
        }

        /* Layout */
        .studio-layout {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 32px;
          align-items: start;
        }

        /* Board */
        .board-card {
          padding: 28px;
          border-radius: 28px;
          background: rgba(20, 23, 33, 0.85);
          position: sticky;
          top: 100px;
        }

        .board-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .board-title {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-row-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 10px 14px;
          background: rgba(10, 12, 18, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
        }

        .form-input:focus, .form-select:focus {
          border-color: var(--accent-gold);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.25);
        }

        .board-canvas-area {
          margin: 20px 0;
          padding: 18px;
          border-radius: 16px;
          background: rgba(10, 12, 18, 0.5);
          border: 1px dashed var(--border-subtle);
          min-height: 160px;
        }

        .empty-board-placeholder {
          text-align: center;
          padding: 30px 10px;
        }

        .empty-sparkle {
          color: var(--accent-gold);
          margin-bottom: 8px;
          opacity: 0.7;
        }

        .empty-board-placeholder p {
          font-size: 13px;
          color: var(--text-muted);
        }

        .selected-items-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .selected-item-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 12px;
          background: rgba(28, 31, 45, 0.7);
        }

        .selected-item-thumb {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: 8px;
        }

        .selected-item-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .selected-item-name {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
        }

        .selected-item-type {
          font-size: 11px;
          color: var(--text-muted);
        }

        .btn-remove-selected {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-remove-selected:hover {
          background: rgba(239, 68, 68, 0.25);
          color: #ffffff;
        }

        .btn-save-outfit {
          width: 100%;
          padding: 14px;
          font-size: 15px;
          border-radius: 14px;
        }

        .btn-save-outfit:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          filter: grayscale(1);
        }

        /* Closet */
        .closet-card {
          padding: 28px;
          border-radius: 28px;
          background: rgba(20, 23, 33, 0.85);
        }

        .closet-controls {
          margin-bottom: 24px;
        }

        .closet-search-box {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(10, 12, 18, 0.6);
          border: 1px solid var(--border-subtle);
          padding: 8px 14px;
          border-radius: 12px;
          margin-bottom: 14px;
        }

        .closet-search-input {
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 13.5px;
          width: 100%;
        }

        .closet-category-pills {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .cat-pill {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .cat-pill.active, .cat-pill:hover {
          background: var(--accent-gold-gradient);
          color: #0c0d10;
          border-color: transparent;
        }

        /* Selectable items grid */
        .selectable-garments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
          max-height: 650px;
          overflow-y: auto;
          padding-right: 6px;
        }

        .selectable-item-card {
          border-radius: 16px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all 0.25s var(--ease-smooth);
        }

        .selectable-item-card:hover {
          transform: translateY(-3px);
          border-color: rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.06);
        }

        .selectable-item-card.selected {
          border-color: var(--accent-gold);
          background: rgba(212, 175, 55, 0.1);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.25);
          transform: scale(1.02);
        }

        .selectable-img-wrap {
          position: relative;
          width: 100%;
          height: 140px;
          border-radius: 12px;
          overflow: hidden;
          background: #141722;
          margin-bottom: 8px;
        }

        .selectable-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .selectable-item-card:hover .selectable-img {
          transform: scale(1.06);
        }

        .selection-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--accent-gold-gradient);
          color: #0c0d10;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }

        .btn-delete-garment {
          position: absolute;
          top: 6px;
          left: 6px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(10, 12, 18, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: all 0.2s ease;
          z-index: 2;
        }

        .selectable-item-card:hover .btn-delete-garment {
          opacity: 1;
        }

        .btn-delete-garment:hover {
          background: rgba(239, 68, 68, 0.85);
          border-color: #ef4444;
          color: #ffffff;
        }

        .item-tag-type {
          position: absolute;
          bottom: 6px;
          left: 6px;
          background: rgba(10, 12, 18, 0.8);
          font-size: 9.5px;
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .selectable-info {
          display: flex;
          flex-direction: column;
        }

        .selectable-name {
          font-size: 12.5px;
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .selectable-color {
          font-size: 11px;
          color: var(--text-muted);
        }

        /* Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
          padding: 20px;
        }

        .modal-content {
          padding: 40px;
          border-radius: 28px;
          text-align: center;
          max-width: 440px;
          width: 100%;
          background: rgba(22, 25, 36, 0.95);
        }

        .modal-icon-circle {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
        }

        .modal-icon-check {
          color: var(--accent-gold);
        }

        .modal-content h3 {
          font-size: 24px;
          color: #fff;
          margin-bottom: 10px;
        }

        .modal-content p {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 28px;
          line-height: 1.6;
        }

        .modal-btn-row {
          display: flex;
          gap: 12px;
        }

        .modal-btn-row button {
          flex: 1;
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
          margin-bottom: 24px;
          transition: all 0.2s ease;
        }

        .btn-back:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(-3px);
        }

        @media (max-width: 900px) {
          .studio-layout { grid-template-columns: 1fr; }
          .board-card { position: relative; top: 0; }
        }
      `}</style>
    </div>
  );
}

export default CreateOutfit;
