import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { 
  Upload, 
  Sparkles, 
  Shirt, 
  Palette, 
  Tag, 
  Clock, 
  Check, 
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  X
} from "lucide-react";

const BACKEND_URL = "https://wardrobe-j46j-vert.vercel.app";

const AddItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "Dress",
    color: "Black",
    season: "All",
    occasion: "Casual",
    imageFile: null
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    { label: "Dress", icon: "👗" },
    { label: "Shoes", icon: "👠" },
    { label: "Accessories", icon: "👜" },
    { label: "Top", icon: "👚" },
    { label: "Bottom", icon: "👖" },
    { label: "Outerwear", icon: "🧥" }
  ];

  const popularColors = [
    { name: "Black", hex: "#18181b" },
    { name: "White", hex: "#ffffff" },
    { name: "Navy", hex: "#1e3a8a" },
    { name: "Beige", hex: "#d4b996" },
    { name: "Emerald", hex: "#065f46" },
    { name: "Burgundy", hex: "#881337" },
    { name: "Red", hex: "#dc2626" },
    { name: "Pink", hex: "#f472b6" },
    { name: "Gold", hex: "#d4af37" }
  ];

  const seasons = ["All", "Spring", "Summer", "Autumn", "Winter"];
  const occasions = ["Casual", "Smart Casual", "Formal", "Party", "Work", "Vacation"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, imageFile: null });
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Please enter a garment name");
    if (!formData.imageFile) return alert("Please select or drop a photo of the piece");

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("color", formData.color);
      data.append("season", formData.season);
      data.append("occasion", formData.occasion);
      data.append("imageFile", formData.imageFile);

      const token = localStorage.getItem("token");

      await axios.post(
        `${BACKEND_URL}/api/clothes/add`,
        data,
        { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
    } catch (err) {
      console.error("Error adding item:", err.response?.data || err);
      alert(err.response?.data?.message || "Error adding item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="additem-page-container">
      <div className="ambient-bg" />
      <Navbar />

      <main className="additem-main animate-fade-in-up">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="additem-header">
          <div className="badge badge-gold" style={{ marginBottom: "10px" }}>
            <Sparkles size={12} />
            <span>Digital Catalog Studio</span>
          </div>
          <h1 className="additem-title font-serif">Add Wardrobe Piece</h1>
          <p className="additem-subtitle">
            Upload high-resolution photography and catalog garment attributes.
          </p>
        </div>

        {success ? (
          <div className="success-card glass-panel animate-fade-in">
            <div className="success-icon-circle">
              <Check size={36} className="success-check" />
            </div>
            <h2 className="font-serif">Piece Digitized!</h2>
            <p>"{formData.name}" has been added to your wardrobe vault.</p>
            <div className="success-btn-row">
              <button 
                className="btn-secondary" 
                onClick={() => { 
                  setSuccess(false); 
                  setFormData({ name: "", type: "Top", color: "Black", season: "All", occasion: "Casual", imageFile: null }); 
                  setPreview(null); 
                }}
              >
                Add Another Piece
              </button>
              <button className="btn-primary" onClick={() => navigate("/dashboard")}>
                Return to Dashboard <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="additem-grid-form">
            {/* Left: Image Dropzone */}
            <div className="upload-dropzone-column">
              <div className="dropzone-card glass-panel">
                <label className="form-section-title">Garment Image</label>
                
                {preview ? (
                  <div className="preview-container">
                    <img src={preview} alt="Preview" className="preview-image" />
                    <button type="button" onClick={removeImage} className="btn-remove-photo" title="Change Photo">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="dropzone-area">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden-file-input"
                      required
                    />
                    <div className="dropzone-inner">
                      <div className="upload-icon-circle">
                        <Upload size={28} />
                      </div>
                      <h4>Drag & drop or click to upload</h4>
                      <p>Supports High-Res JPG, PNG, WEBP</p>
                      <span className="btn-secondary" style={{ marginTop: "12px", pointerEvents: "none" }}>
                        Browse Files
                      </span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Right: Attributes Form */}
            <div className="attributes-form-column">
              <div className="attributes-card glass-panel">
                {/* Name */}
                <div className="field-group">
                  <label className="field-label">Garment Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Silk Emerald Blouse, Tailored Chinos..."
                    value={formData.name}
                    onChange={handleChange}
                    className="luxe-input"
                    required
                  />
                </div>

                {/* Category Pills */}
                <div className="field-group">
                  <label className="field-label">Category</label>
                  <div className="category-pill-selector">
                    {categories.map((cat) => (
                      <button
                        type="button"
                        key={cat.label}
                        className={`cat-select-btn ${formData.type === cat.label ? "active" : ""}`}
                        onClick={() => setFormData({ ...formData, type: cat.label })}
                      >
                        <span className="cat-icon">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="field-group">
                  <label className="field-label">Primary Color ({formData.color})</label>
                  <div className="color-swatch-row">
                    {popularColors.map((col) => (
                      <button
                        type="button"
                        key={col.name}
                        className={`swatch-btn ${formData.color === col.name ? "active" : ""}`}
                        style={{ backgroundColor: col.hex }}
                        onClick={() => setFormData({ ...formData, color: col.name })}
                        title={col.name}
                      >
                        {formData.color === col.name && (
                          <Check size={12} color={col.name === "White" ? "#000" : "#fff"} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Season and Occasion */}
                <div className="field-row-two">
                  <div className="field-group">
                    <label className="field-label"><Clock size={12} /> Season</label>
                    <select
                      name="season"
                      value={formData.season}
                      onChange={handleChange}
                      className="luxe-select"
                    >
                      {seasons.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <label className="field-label"><Tag size={12} /> Occasion</label>
                    <select
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleChange}
                      className="luxe-select"
                    >
                      {occasions.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary btn-submit-item"
                >
                  <Sparkles size={16} />
                  <span>{loading ? "Digitizing Piece..." : "Save Piece to Wardrobe"}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      <style>{`
        .additem-page-container {
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 80px;
          position: relative;
        }

        .additem-main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .additem-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .additem-title {
          font-size: 42px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }

        .additem-subtitle {
          color: var(--text-secondary);
          font-size: 15px;
        }

        .additem-grid-form {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 36px;
          align-items: start;
        }

        .form-section-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-secondary);
          display: block;
          margin-bottom: 14px;
        }

        /* Dropzone */
        .dropzone-card {
          padding: 28px;
          border-radius: 28px;
          background: rgba(20, 23, 33, 0.85);
        }

        .dropzone-area {
          border: 2px dashed rgba(212, 175, 55, 0.35);
          border-radius: 20px;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          position: relative;
          background: rgba(10, 12, 18, 0.4);
          transition: all 0.3s ease;
        }

        .dropzone-area:hover {
          border-color: var(--accent-gold);
          background: rgba(212, 175, 55, 0.05);
        }

        .hidden-file-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
        }

        .upload-icon-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.12);
          color: var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }

        .dropzone-inner h4 {
          font-size: 16px;
          color: #fff;
          margin-bottom: 6px;
        }

        .dropzone-inner p {
          font-size: 12px;
          color: var(--text-muted);
        }

        .preview-container {
          position: relative;
          height: 380px;
          border-radius: 20px;
          overflow: hidden;
          background: #10121a;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .btn-remove-photo {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-remove-photo:hover {
          background: #ef4444;
          border-color: #ef4444;
        }

        /* Attributes Card */
        .attributes-card {
          padding: 32px;
          border-radius: 28px;
          background: rgba(20, 23, 33, 0.85);
        }

        .field-group {
          margin-bottom: 22px;
        }

        .field-row-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .field-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .luxe-input, .luxe-select {
          width: 100%;
          padding: 12px 16px;
          background: rgba(10, 12, 18, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
        }

        .luxe-input:focus, .luxe-select:focus {
          border-color: var(--accent-gold);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.25);
        }

        .category-pill-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .cat-select-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cat-select-btn.active, .cat-select-btn:hover {
          background: var(--accent-gold-gradient);
          color: #0c0d10;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(212, 175, 55, 0.3);
        }

        .color-swatch-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .swatch-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.15);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .swatch-btn.active {
          transform: scale(1.18);
          border-color: var(--accent-gold);
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.5);
        }

        .btn-submit-item {
          width: 100%;
          padding: 15px;
          font-size: 15px;
          border-radius: 14px;
          margin-top: 10px;
        }

        /* Success Card */
        .success-card {
          max-width: 500px;
          margin: 40px auto;
          padding: 48px 36px;
          text-align: center;
          border-radius: 32px;
          background: rgba(20, 23, 33, 0.95);
        }

        .success-icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px auto;
        }

        .success-check {
          color: var(--accent-gold);
        }

        .success-card h2 {
          font-size: 28px;
          color: #fff;
          margin-bottom: 10px;
        }

        .success-card p {
          color: var(--text-secondary);
          font-size: 15px;
          margin-bottom: 32px;
        }

        .success-btn-row {
          display: flex;
          gap: 14px;
        }

        .success-btn-row button {
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

        @media (max-width: 868px) {
          .additem-grid-form { grid-template-columns: 1fr; }
          .category-pill-selector { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default AddItem;
