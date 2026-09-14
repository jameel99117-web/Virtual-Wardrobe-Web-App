import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { 
  Heart, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Plus, 
  Sparkles, 
  Search, 
  Eye, 
  Tag, 
  Clock,
  Layers,
  ArrowLeft
} from "lucide-react";

const BACKEND_URL = "https://ilham7898.vercel.app";

function MyOutfits() {
  const [outfits, setOutfits] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'favorites', or category
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("vestir_favorites");
    return saved ? JSON.parse(saved) : [];
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchOutfits();
  }, []);

  useEffect(() => {
    localStorage.setItem("vestir_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const fetchOutfits = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await axios.get(`${BACKEND_URL}/api/outfits/my-outfits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutfits(res.data.outfits || []);
    } catch (err) {
      console.error("Failed to fetch outfits:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this outfit?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BACKEND_URL}/api/outfits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutfits(outfits.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Failed to delete outfit:", err);
    }
  };

  const handleSaveName = async (id) => {
    if (!newName.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BACKEND_URL}/api/outfits/${id}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOutfits(outfits.map((o) => (o._id === id ? { ...o, name: newName } : o)));
      setEditingId(null);
      setNewName("");
    } catch (err) {
      console.error("Failed to update outfit name:", err);
    }
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filterTabs = [
    { id: "all", label: "All Looks" },
    { id: "favorites", label: "Favorites ♥" },
    { id: "Casual", label: "Casual" },
    { id: "Formal", label: "Formal" },
    { id: "Party", label: "Party" },
    { id: "Smart Casual", label: "Smart Casual" },
  ];

  const filteredOutfits = outfits.filter(outfit => {
    const isFav = favorites.includes(outfit._id);
    const matchesFilter = filter === "all" 
      ? true 
      : filter === "favorites" 
        ? isFav 
        : (outfit.occasion && outfit.occasion.toLowerCase().includes(filter.toLowerCase())) || 
          outfit.name.toLowerCase().includes(filter.toLowerCase());

    const matchesSearch = searchQuery === "" 
      || outfit.name.toLowerCase().includes(searchQuery.toLowerCase())
      || (outfit.items && outfit.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="lookbook-page-container">
      <div className="ambient-bg" />
      <Navbar />

      <main className="lookbook-main animate-fade-in">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* Header Bar */}
        <section className="lookbook-header">
          <div>
            <div className="badge badge-gold" style={{ marginBottom: "10px" }}>
              <Sparkles size={12} />
              <span>Curated Haute Ensembles</span>
            </div>
            <h1 className="lookbook-title font-serif">The Lookbook Collection</h1>
            <p className="lookbook-subtitle">
              Browse, rename, favorite, and inspect all your styled fashion ensembles.
            </p>
          </div>

          <button 
            className="btn-primary create-new-btn"
            onClick={() => navigate("/create-outfit")}
          >
            <Plus size={16} />
            <span>Create New Look in Studio</span>
          </button>
        </section>

        {/* Search & Filter Controls */}
        <section className="lookbook-controls-bar animate-fade-in-up">
          {/* Search Box */}
          <div className="search-box glass-panel">
            <Search size={18} className="search-icon" />
            <input 
              type="text"
              placeholder="Search by outfit title, garment, or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="clear-search-btn">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="filter-pill-row">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                className={`lookbook-pill ${filter === tab.id ? "active" : ""}`}
                onClick={() => setFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Gallery Grid */}
        {filteredOutfits.length === 0 ? (
          <div className="empty-lookbook glass-panel animate-fade-in">
            <Layers size={48} className="empty-icon-gold" />
            <h3>No Outfits Match Your Filter</h3>
            <p>Try selecting "All Looks" or create a fresh ensemble in the studio.</p>
            <button className="btn-primary" onClick={() => navigate("/create-outfit")}>
              Launch Outfit Studio
            </button>
          </div>
        ) : (
          <div className="grid-responsive-outfits animate-fade-in-up">
            {filteredOutfits.map((outfit) => {
              const isFav = favorites.includes(outfit._id);
              const isEditing = editingId === outfit._id;

              return (
                <div key={outfit._id} className="lookbook-card glass-panel">
                  {/* Top Bar: Title / Rename & Favorite */}
                  <div className="card-header-bar">
                    {isEditing ? (
                      <div className="inline-edit-box">
                        <input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="inline-input"
                          autoFocus
                        />
                        <button onClick={() => handleSaveName(outfit._id)} className="btn-icon-save" title="Save">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="btn-icon-cancel" title="Cancel">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="title-with-actions">
                        <h3 className="card-outfit-title font-display">{outfit.name}</h3>
                        <div className="header-actions">
                          <button 
                            onClick={() => {
                              setEditingId(outfit._id);
                              setNewName(outfit.name);
                            }}
                            className="btn-card-action"
                            title="Rename Outfit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            onClick={() => toggleFavorite(outfit._id)}
                            className={`btn-card-action fav ${isFav ? "active" : ""}`}
                            title="Toggle Favorite"
                          >
                            <Heart size={16} fill={isFav ? "#e07a86" : "none"} color={isFav ? "#e07a86" : "#ffffff"} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4-Item Grid Presentation */}
                  <div 
                    className="card-image-collage"
                    onClick={() => navigate(`/outfits/${outfit._id}`, { state: outfit })}
                  >
                    {outfit.items?.slice(0, 4).map((item) => (
                      <div key={item._id} className="item-cell">
                        <img 
                          src={`${BACKEND_URL}${item.imageURL}`}
                          alt={item.name}
                          className="item-cell-img"
                        />
                        <span className="item-tooltip">{item.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Badges & Meta */}
                  <div className="card-badges-row">
                    <div className="badge-group">
                      {outfit.occasion && (
                        <span className="badge badge-gold"><Tag size={10} /> {outfit.occasion}</span>
                      )}
                      {outfit.season && (
                        <span className="badge badge-muted"><Clock size={10} /> {outfit.season}</span>
                      )}
                    </div>
                    <span className="item-count-text">{outfit.items?.length || 0} pieces</span>
                  </div>

                  {/* Card Bottom Buttons */}
                  <div className="card-footer-buttons">
                    <button 
                      className="btn-view-details"
                      onClick={() => navigate(`/outfits/${outfit._id}`, { state: outfit })}
                    >
                      <Eye size={15} />
                      <span>Inspect Look</span>
                    </button>
                    <button 
                      className="btn-delete-card"
                      onClick={() => handleDelete(outfit._id)}
                      title="Delete Ensemble"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style>{`
        .lookbook-page-container {
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 80px;
          position: relative;
        }

        .lookbook-main {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .lookbook-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 36px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .lookbook-title {
          font-size: 40px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }

        .lookbook-subtitle {
          color: var(--text-secondary);
          font-size: 15px;
        }

        .create-new-btn {
          padding: 12px 22px;
          border-radius: 14px;
        }

        /* Controls */
        .lookbook-controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          border-radius: 999px;
          min-width: 320px;
          flex: 1;
          max-width: 480px;
        }

        .search-icon {
          color: var(--text-muted);
        }

        .search-input {
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 14px;
          width: 100%;
        }

        .clear-search-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
        }

        .filter-pill-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .lookbook-pill {
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .lookbook-pill.active, .lookbook-pill:hover {
          background: var(--accent-gold-gradient);
          color: #0c0d10;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(212, 175, 55, 0.3);
        }

        /* Lookbook Card */
        .lookbook-card {
          padding: 22px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: rgba(20, 23, 33, 0.85);
        }

        .card-header-bar {
          margin-bottom: 14px;
          min-height: 36px;
          display: flex;
          align-items: center;
        }

        .title-with-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .card-outfit-title {
          font-size: 16.5px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 180px;
        }

        .header-actions {
          display: flex;
          gap: 6px;
        }

        .btn-card-action {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-card-action:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        .btn-card-action.fav.active {
          background: rgba(224, 122, 134, 0.15);
          border-color: rgba(224, 122, 134, 0.35);
        }

        .inline-edit-box {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
        }

        .inline-input {
          flex: 1;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--accent-gold);
          border-radius: 8px;
          padding: 6px 10px;
          color: #fff;
          font-size: 13.5px;
          outline: none;
        }

        .btn-icon-save {
          background: var(--accent-gold-gradient);
          border: none;
          color: #0c0d10;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .btn-icon-cancel {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #fff;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* Collage */
        .card-image-collage {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 16px;
          cursor: pointer;
        }

        .item-cell {
          position: relative;
          height: 110px;
          border-radius: 10px;
          overflow: hidden;
          background: #161822;
        }

        .item-cell-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .item-cell:hover .item-cell-img {
          transform: scale(1.08);
        }

        .item-tooltip {
          position: absolute;
          bottom: 4px;
          left: 4px;
          right: 4px;
          font-size: 9.5px;
          background: rgba(0, 0, 0, 0.75);
          color: #fff;
          padding: 2px 4px;
          border-radius: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .item-cell:hover .item-tooltip {
          opacity: 1;
        }

        /* Badges row */
        .card-badges-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .badge-group {
          display: flex;
          gap: 6px;
        }

        .item-count-text {
          font-size: 11.5px;
          color: var(--text-muted);
        }

        /* Footer buttons */
        .card-footer-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-view-details {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          font-weight: 600;
          font-size: 13px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-view-details:hover {
          background: var(--accent-gold-gradient);
          color: #0c0d10;
          border-color: transparent;
          transform: translateY(-1px);
        }

        .btn-delete-card {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-delete-card:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ffffff;
          border-color: #ef4444;
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

        .empty-lookbook {
          padding: 80px 20px;
          text-align: center;
          border-radius: 28px;
          max-width: 600px;
          margin: 0 auto;
        }

        .empty-icon-gold {
          color: var(--accent-gold);
          margin-bottom: 20px;
          opacity: 0.75;
        }
      `}</style>
    </div>
  );
}

export default MyOutfits;
