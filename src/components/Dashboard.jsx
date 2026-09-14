import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  Shirt, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Plus, 
  Layers, 
  Clock, 
  Tag, 
  Palette,
  Trash2,
  CloudSun,
  CloudRain,
  Sun,
  Snowflake,
  Wind,
  MapPin,
  RefreshCw,
  Search,
  Compass
} from "lucide-react";

const BACKEND_URL = "https://wardrobe-j46j-vert.vercel.app";

function Dashboard() {
  const [outfits, setOutfits] = useState([]);
  const [clothes, setClothes] = useState([]);
  const [calendar, setCalendar] = useState(() => {
    const saved = localStorage.getItem("vestir_calendar");
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [toastMessage, setToastMessage] = useState("");
  const [activeTab, setActiveTab] = useState("outfits"); // 'outfits' or 'closet'
  const [closetFilter, setClosetFilter] = useState("All");

  // Weather States
  const [weatherCity, setWeatherCity] = useState(() => {
    return localStorage.getItem("vestir_city") || "London";
  });
  const [cityInput, setCityInput] = useState("");
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchOutfits();
    fetchClothes();
    fetchWeather(weatherCity);
  }, []);

  useEffect(() => {
    localStorage.setItem("vestir_calendar", JSON.stringify(calendar));
  }, [calendar]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchOutfits = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await axios.get(`${BACKEND_URL}/api/outfits/my-outfits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutfits(res.data.outfits || []);
    } catch (err) {
      console.error("Error fetching outfits:", err);
    }
  };

  const fetchClothes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${BACKEND_URL}/api/clothes/my-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClothes(res.data.items || []);
    } catch (err) {
      console.error("Error fetching clothes:", err);
    }
  };

  const handleDeleteItem = async (itemId, itemName) => {
    if (!window.confirm(`Are you sure you want to remove "${itemName}" from your wardrobe?`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BACKEND_URL}/api/clothes/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClothes(prev => prev.filter(item => item._id !== itemId));
      showToast(`🗑️ Removed "${itemName}" from wardrobe.`);
    } catch (err) {
      console.error("Error deleting item:", err);
      alert(err.response?.data?.message || "Failed to delete item");
    }
  };

  // Weather Fetching via Open-Meteo (No API Key Required)
  const fetchWeather = async (cityName) => {
    try {
      setWeatherLoading(true);
      // 1. Geocode city name to lat/lon
      const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
      if (!geoRes.data.results || geoRes.data.results.length === 0) {
        showToast(`Could not locate weather for "${cityName}"`);
        setWeatherLoading(false);
        return;
      }

      const location = geoRes.data.results[0];
      const { latitude, longitude, name, country } = location;

      // 2. Fetch current weather
      const forecastRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
      const current = forecastRes.data.current;

      const weatherInfo = {
        city: name,
        country: country || "",
        temp: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        wind: Math.round(current.wind_speed_10m),
        code: current.weather_code,
        condition: getWeatherConditionText(current.weather_code),
        icon: getWeatherIcon(current.weather_code, current.temperature_2m)
      };

      setWeatherData(weatherInfo);
      setWeatherCity(name);
      localStorage.setItem("vestir_city", name);
      setShowCitySearch(false);
      setCityInput("");
    } catch (err) {
      console.error("Weather error:", err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleCitySearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      fetchWeather(cityInput.trim());
    }
  };

  const detectAutoLocation = () => {
    if (navigator.geolocation) {
      setWeatherLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const geoRes = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const cityName = geoRes.data.city || geoRes.data.locality || "Current City";
            fetchWeather(cityName);
          } catch (e) {
            fetchWeather("London");
          }
        },
        () => {
          showToast("Location access denied. Using manual city search.");
          setWeatherLoading(false);
        }
      );
    }
  };

  const getWeatherConditionText = (code) => {
    if (code === 0) return "Clear Sky";
    if (code === 1 || code === 2) return "Mainly Clear & Sunny";
    if (code === 3) return "Overcast Clouds";
    if (code >= 45 && code <= 48) return "Foggy & Cool";
    if (code >= 51 && code <= 67) return "Rain & Drizzle";
    if (code >= 71 && code <= 77) return "Snow & Frost";
    if (code >= 80 && code <= 82) return "Rain Showers";
    if (code >= 95) return "Thunderstorms";
    return "Mild & Clear";
  };

  const getWeatherIcon = (code, temp) => {
    if (code >= 71 && code <= 77) return <Snowflake size={26} className="weather-icon snow" />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) return <CloudRain size={26} className="weather-icon rain" />;
    if (code === 0 || (code <= 2 && temp > 20)) return <Sun size={26} className="weather-icon sun" />;
    return <CloudSun size={26} className="weather-icon cloud" />;
  };

  // Weather-Based Outfit Match Algorithm
  const getWeatherSuggestedOutfit = () => {
    if (!outfits.length) return null;
    if (!weatherData) return outfits[0];

    const { temp, code } = weatherData;

    // Rainy/Drizzle/Cold
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95 || temp < 14) {
      const winterLook = outfits.find(o => o.season === "Winter" || (o.occasion && o.occasion.toLowerCase().includes("formal")));
      if (winterLook) return winterLook;
    }

    // Hot & Sunny (>24°C)
    if (temp >= 24) {
      const summerLook = outfits.find(o => o.season === "Summer" || o.season === "Spring");
      if (summerLook) return summerLook;
    }

    // Moderate/Spring
    const springLook = outfits.find(o => o.season === "Spring" || o.season === "All");
    return springLook || outfits[0];
  };

  const weatherSuggestedOutfit = getWeatherSuggestedOutfit();

  const assignOutfitToDate = (outfit) => {
    const newCalendar = { ...calendar, [selectedDate]: outfit._id };
    setCalendar(newCalendar);
    showToast(`✨ "${outfit.name}" assigned to ${selectedDate}!`);
  };

  const removeOutfitFromDate = () => {
    const newCalendar = { ...calendar };
    delete newCalendar[selectedDate];
    setCalendar(newCalendar);
    showToast(`Removed scheduled look for ${selectedDate}`);
  };

  const changeDateBy = (days) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split("T")[0]);
  };

  const assignedOutfitId = calendar[selectedDate];
  const assignedOutfit = outfits.find((o) => o._id === assignedOutfitId);

  // Categories
  const categories = ["All", "Formal", "Party", "Smart Casual", "Casual"];
  const filteredOutfits = selectedCategory === "All"
    ? outfits
    : outfits.filter(o => (o.occasion && o.occasion.toLowerCase().includes(selectedCategory.toLowerCase())) || o.name.toLowerCase().includes(selectedCategory.toLowerCase()));

  // Closet Categories (Accurate)
  const closetTypes = ["All", "Dress", "Shoes", "Accessories", "Top", "Bottom"];
  const filteredClothes = closetFilter === "All"
    ? clothes
    : clothes.filter(c => c.type && c.type.toLowerCase() === closetFilter.toLowerCase());

  const formattedDate = new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="dashboard-container">
      <div className="ambient-bg" />
      <Navbar />

      {/* Toast notification */}
      {toastMessage && (
        <div className="toast-notification animate-fade-in-up">
          <Sparkles size={16} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="dashboard-main">
        {/* Welcome & Stats Header */}
        <section className="dashboard-header animate-fade-in">
          <div>
            <div className="badge badge-gold" style={{ marginBottom: "10px" }}>
              <Sparkles size={12} />
              <span>Personal Dressing Suite</span>
            </div>
            <h1 className="dashboard-title font-serif">Style Calendar & Wardrobe</h1>
            <p className="dashboard-subtitle">
              Orchestrate your looks day-by-day and explore your capsule collection.
            </p>
          </div>

          <div className="stats-row">
            <div className="stat-card glass-panel">
              <Shirt size={22} className="stat-icon gold" />
              <div>
                <span className="stat-val font-display">{clothes.length}</span>
                <span className="stat-lbl">Garment Pieces</span>
              </div>
            </div>
            <div className="stat-card glass-panel">
              <Layers size={22} className="stat-icon rose" />
              <div>
                <span className="stat-val font-display">{outfits.length}</span>
                <span className="stat-lbl">Curated Looks</span>
              </div>
            </div>
          </div>
        </section>

        {/* WEATHER & SMART RECOMMENDATION BAR */}
        <section className="weather-recommendation-bar glass-panel animate-fade-in-up">
          {/* Weather Widget Left */}
          <div className="weather-widget">
            <div className="weather-widget-top">
              <div className="weather-location-pill">
                <MapPin size={13} className="pin-icon" />
                <span className="city-name">{weatherData ? `${weatherData.city}, ${weatherData.country}` : weatherCity}</span>
                <button 
                  onClick={() => setShowCitySearch(!showCitySearch)} 
                  className="btn-change-city"
                  title="Change City"
                >
                  <Search size={12} /> Change
                </button>
                <button 
                  onClick={detectAutoLocation} 
                  className="btn-auto-loc"
                  title="Detect My Location"
                >
                  <Compass size={12} />
                </button>
              </div>

              {weatherLoading && <RefreshCw size={14} className="spin-icon" />}
            </div>

            {/* City Search Dropdown/Input */}
            {showCitySearch && (
              <form onSubmit={handleCitySearch} className="city-search-form animate-fade-in">
                <input
                  type="text"
                  placeholder="Enter city (e.g. Lahore, New York, Paris)..."
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="city-input"
                  autoFocus
                />
                <button type="submit" className="btn-primary" style={{ padding: "6px 14px", fontSize: "12px" }}>
                  Search
                </button>
              </form>
            )}

            {weatherData ? (
              <div className="weather-temp-row">
                <div className="weather-icon-wrap">
                  {weatherData.icon}
                </div>
                <div className="temp-info">
                  <div className="temp-number font-display">{weatherData.temp}°C</div>
                  <div className="temp-desc">{weatherData.condition}</div>
                </div>
                <div className="weather-meta">
                  <span>💨 {weatherData.wind} km/h wind</span>
                  <span>💧 {weatherData.humidity}% humidity</span>
                </div>
              </div>
            ) : (
              <div className="weather-loading-text">Loading live weather forecast...</div>
            )}
          </div>

          {/* Smart Weather Suggestion Right */}
          {weatherSuggestedOutfit && (
            <div className="weather-suggestion-box">
              <div className="suggestion-badge-row">
                <span className="badge badge-gold">🌤️ Weather Match Recommendation</span>
                <span className="weather-forecast-tag">
                  Ideal for {weatherData ? `${weatherData.temp}°C & ${weatherData.condition}` : "Today's Climate"}
                </span>
              </div>

              <div className="suggestion-content-row">
                <div className="suggested-thumb-collage" onClick={() => navigate(`/outfits/${weatherSuggestedOutfit._id}`, { state: weatherSuggestedOutfit })}>
                  {weatherSuggestedOutfit.items?.slice(0, 3).map((item) => (
                    <img 
                      key={item._id} 
                      src={`item.imageURL?.startsWith('http') ? item.imageURL : `${BACKEND_URL}${item.imageURL}``} 
                      alt={item.name} 
                      className="suggested-mini-img"
                    />
                  ))}
                </div>

                <div className="suggested-meta-col">
                  <h4 className="suggested-title">{weatherSuggestedOutfit.name}</h4>
                  <p className="suggested-desc">
                    {weatherSuggestedOutfit.season} • {weatherSuggestedOutfit.occasion} • {weatherSuggestedOutfit.items?.length || 0} Pieces
                  </p>
                </div>

                <button 
                  className="btn-primary btn-wear-weather"
                  onClick={() => assignOutfitToDate(weatherSuggestedOutfit)}
                >
                  <Sparkles size={14} />
                  <span>Wear Today</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Section 1: Interactive Date & Scheduled Outfit Banner */}
        <section className="calendar-section glass-panel animate-fade-in-up">
          <div className="calendar-control-bar">
            <div className="date-nav-group">
              <button onClick={() => changeDateBy(-1)} className="btn-icon" title="Previous Day">
                <ChevronLeft size={20} />
              </button>
              <div className="date-display-box">
                <CalendarIcon size={18} className="calendar-icon" />
                <span className="date-formatted-text">{formattedDate}</span>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="hidden-date-input"
                />
              </div>
              <button onClick={() => changeDateBy(1)} className="btn-icon" title="Next Day">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="quick-date-buttons">
              <button 
                onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
                className={`quick-date-btn ${selectedDate === new Date().toISOString().split("T")[0] ? "active" : ""}`}
              >
                Today
              </button>
              <button 
                onClick={() => {
                  const tm = new Date();
                  tm.setDate(tm.getDate() + 1);
                  setSelectedDate(tm.toISOString().split("T")[0]);
                }}
                className="quick-date-btn"
              >
                Tomorrow
              </button>
            </div>
          </div>

          {/* Assigned Outfit Highlight Card */}
          <div className="assigned-look-area">
            {assignedOutfit ? (
              <div className="assigned-card glass-panel animate-fade-in">
                <div className="assigned-card-left">
                  <div className="badge badge-gold" style={{ marginBottom: "8px" }}>
                    <Check size={12} /> Scheduled for {formattedDate}
                  </div>
                  <h3 className="assigned-look-title font-serif">{assignedOutfit.name}</h3>
                  <div className="assigned-tags">
                    {assignedOutfit.occasion && (
                      <span className="tag-pill"><Tag size={12} /> {assignedOutfit.occasion}</span>
                    )}
                    {assignedOutfit.season && (
                      <span className="tag-pill"><Clock size={12} /> {assignedOutfit.season}</span>
                    )}
                    <span className="tag-pill">{assignedOutfit.items?.length || 0} Pieces</span>
                  </div>

                  <div className="assigned-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => navigate(`/outfits/${assignedOutfit._id}`, { state: assignedOutfit })}
                    >
                      <Eye size={16} />
                      <span>Inspect Look Details</span>
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={removeOutfitFromDate}
                    >
                      Remove from Calendar
                    </button>
                  </div>
                </div>

                <div className="assigned-card-grid">
                  {assignedOutfit.items?.slice(0, 4).map((item) => (
                    <div key={item._id} className="assigned-item-box">
                      <img 
                        src={`item.imageURL?.startsWith('http') ? item.imageURL : `${BACKEND_URL}${item.imageURL}``} 
                        alt={item.name} 
                        className="assigned-item-img"
                      />
                      <span className="assigned-item-name">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="unassigned-placeholder">
                <Sparkles size={32} className="placeholder-icon" />
                <h4>No ensemble scheduled for {formattedDate}</h4>
                <p>Select any of your curated outfits below and click <strong>"Assign to Date"</strong> to schedule it.</p>
              </div>
            )}
          </div>
        </section>

        {/* Section 2: View Switcher (Ensembles vs Closet Pieces) */}
        <section className="tabs-header-section">
          <div className="main-tabs">
            <button 
              className={`main-tab-btn ${activeTab === "outfits" ? "active" : ""}`}
              onClick={() => setActiveTab("outfits")}
            >
              <Layers size={18} />
              <span>Curated Ensembles ({outfits.length})</span>
            </button>
            <button 
              className={`main-tab-btn ${activeTab === "closet" ? "active" : ""}`}
              onClick={() => setActiveTab("closet")}
            >
              <Shirt size={18} />
              <span>Wardrobe Vault ({clothes.length})</span>
            </button>
          </div>

          <div className="action-buttons-group">
            <button 
              className="btn-secondary"
              onClick={() => navigate("/create-outfit")}
            >
              <Palette size={16} />
              <span>Outfit Studio</span>
            </button>
            <button 
              className="btn-primary"
              onClick={() => navigate("/add-item")}
            >
              <Plus size={16} />
              <span>Add Wardrobe Piece</span>
            </button>
          </div>
        </section>

        {/* TAB 1: OUTFITS GRID */}
        {activeTab === "outfits" && (
          <section className="outfits-browser-section animate-fade-in">
            {/* Category Filter Pills */}
            <div className="category-filter-bar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Outfits Grid */}
            {filteredOutfits.length === 0 ? (
              <div className="empty-state glass-panel">
                <Layers size={40} className="empty-icon" />
                <h3>No Outfits Found</h3>
                <p>Create a new outfit in the studio to start planning your lookbook.</p>
                <button className="btn-primary" onClick={() => navigate("/create-outfit")}>
                  Open Outfit Studio
                </button>
              </div>
            ) : (
              <div className="grid-responsive-outfits">
                {filteredOutfits.map((outfit) => {
                  const isCurrentlyAssigned = calendar[selectedDate] === outfit._id;
                  return (
                    <div key={outfit._id} className="outfit-luxe-card glass-panel">
                      {/* Card Header */}
                      <div className="card-top-row">
                        <h4 className="outfit-card-name font-display">{outfit.name}</h4>
                        {isCurrentlyAssigned && (
                          <span className="badge badge-gold">Active Look</span>
                        )}
                      </div>

                      {/* 4-Item Grid Visual Collage */}
                      <div className="outfit-collage-box" onClick={() => navigate(`/outfits/${outfit._id}`, { state: outfit })}>
                        {outfit.items?.slice(0, 4).map((item) => (
                          <div key={item._id} className="collage-cell">
                            <img 
                              src={`item.imageURL?.startsWith('http') ? item.imageURL : `${BACKEND_URL}${item.imageURL}``} 
                              alt={item.name} 
                              className="collage-img"
                            />
                            <span className="collage-tooltip">{item.name}</span>
                          </div>
                        ))}
                      </div>

                      {/* Metadata */}
                      <div className="card-meta-row">
                        <span className="meta-text">{outfit.items?.length || 0} Components</span>
                        {outfit.season && <span className="meta-badge">{outfit.season}</span>}
                      </div>

                      {/* Action buttons */}
                      <div className="card-btn-group">
                        <button 
                          className={`btn-assign ${isCurrentlyAssigned ? "assigned" : ""}`}
                          onClick={() => assignOutfitToDate(outfit)}
                        >
                          {isCurrentlyAssigned ? (
                            <>
                              <Check size={14} /> Assigned
                            </>
                          ) : (
                            <>
                              <CalendarIcon size={14} /> Schedule
                            </>
                          )}
                        </button>

                        <button 
                          className="btn-inspect"
                          onClick={() => navigate(`/outfits/${outfit._id}`, { state: outfit })}
                          title="View Outfit Details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: CLOSET ITEMS GRID (WITH ACCURATE CATEGORIES & DELETE BUTTON) */}
        {activeTab === "closet" && (
          <section className="closet-browser-section animate-fade-in">
            {/* Closet filter bar */}
            <div className="category-filter-bar">
              {closetTypes.map((type) => (
                <button
                  key={type}
                  className={`filter-pill ${closetFilter === type ? "active" : ""}`}
                  onClick={() => setClosetFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="grid-responsive-clothes">
              {filteredClothes.map((item) => (
                <div key={item._id} className="closet-item-card glass-panel">
                  <div className="item-img-wrap">
                    <img 
                      src={`item.imageURL?.startsWith('http') ? item.imageURL : `${BACKEND_URL}${item.imageURL}``} 
                      alt={item.name} 
                      className="item-img"
                    />
                    <span className="item-type-badge">{item.type}</span>
                    <button 
                      onClick={() => handleDeleteItem(item._id, item.name)}
                      className="btn-delete-garment"
                      title="Delete Garment Piece"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="item-details">
                    <h5 className="item-title">{item.name}</h5>
                    <div className="item-chips">
                      <span className="item-chip">{item.color}</span>
                      {item.season && <span className="item-chip">{item.season}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <style>{`
        .dashboard-container {
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 80px;
          position: relative;
        }

        .dashboard-main {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Toast */
        .toast-notification {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: rgba(14, 16, 24, 0.92);
          border: 1px solid var(--accent-gold);
          color: #ffffff;
          padding: 14px 22px;
          border-radius: 16px;
          box-shadow: var(--shadow-lg), var(--shadow-glow);
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 14px;
          z-index: 2000;
        }

        .toast-icon {
          color: var(--accent-gold);
        }

        /* Header */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .dashboard-title {
          font-size: 40px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }

        .dashboard-subtitle {
          color: var(--text-secondary);
          font-size: 15px;
        }

        .stats-row {
          display: flex;
          gap: 16px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          border-radius: 18px;
          min-width: 170px;
        }

        .stat-icon {
          padding: 10px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
        }

        .stat-icon.gold { color: var(--accent-gold); background: rgba(212, 175, 55, 0.12); }
        .stat-icon.rose { color: var(--accent-rose); background: rgba(224, 122, 134, 0.12); }

        .stat-val {
          display: block;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
        }

        .stat-lbl {
          font-size: 11.5px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Weather Bar */
        .weather-recommendation-bar {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 24px;
          padding: 22px 26px;
          border-radius: 24px;
          margin-bottom: 32px;
          background: rgba(18, 21, 30, 0.85);
          border: 1px solid rgba(212, 175, 55, 0.2);
          align-items: center;
        }

        .weather-widget {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-right: 1px solid var(--border-subtle);
          padding-right: 24px;
        }

        .weather-widget-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .weather-location-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.06);
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12.5px;
          color: #ffffff;
        }

        .pin-icon { color: var(--accent-rose); }

        .city-name { font-weight: 700; }

        .btn-change-city {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: var(--accent-gold-light);
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 11px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-auto-loc {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .city-search-form {
          display: flex;
          gap: 8px;
        }

        .city-input {
          flex: 1;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid var(--accent-gold);
          border-radius: 8px;
          padding: 6px 10px;
          color: #fff;
          font-size: 12.5px;
          outline: none;
        }

        .weather-temp-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .weather-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .weather-icon.sun { color: #f59e0b; }
        .weather-icon.rain { color: #38bdf8; }
        .weather-icon.snow { color: #e0e7ff; }
        .weather-icon.cloud { color: #cbd5e1; }

        .temp-number {
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }

        .temp-desc {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .weather-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 11px;
          color: var(--text-muted);
          margin-left: auto;
        }

        /* Suggestion Right */
        .weather-suggestion-box {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .suggestion-badge-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .weather-forecast-tag {
          font-size: 11px;
          color: var(--text-muted);
        }

        .suggestion-content-row {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255, 255, 255, 0.03);
          padding: 10px 14px;
          border-radius: 16px;
          border: 1px solid var(--border-subtle);
        }

        .suggested-thumb-collage {
          display: flex;
          gap: 4px;
          cursor: pointer;
        }

        .suggested-mini-img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 8px;
        }

        .suggested-meta-col {
          flex: 1;
        }

        .suggested-title {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 2px;
        }

        .suggested-desc {
          font-size: 11.5px;
          color: var(--text-muted);
        }

        .btn-wear-weather {
          padding: 8px 14px;
          font-size: 12.5px;
          border-radius: 10px;
          white-space: nowrap;
        }

        /* Calendar Section */
        .calendar-section {
          padding: 28px;
          border-radius: 28px;
          margin-bottom: 40px;
          background: rgba(20, 23, 33, 0.85);
        }

        .calendar-control-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .date-nav-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-icon:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .date-display-box {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          padding: 8px 18px;
          border-radius: 999px;
          cursor: pointer;
        }

        .calendar-icon {
          color: var(--accent-gold);
        }

        .date-formatted-text {
          font-weight: 700;
          font-size: 15px;
          color: #fff;
          letter-spacing: 0.3px;
        }

        .hidden-date-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
        }

        .quick-date-buttons {
          display: flex;
          gap: 8px;
        }

        .quick-date-btn {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-date-btn.active, .quick-date-btn:hover {
          background: var(--accent-gold-gradient);
          color: #0c0d10;
          border-color: transparent;
        }

        /* Assigned Card */
        .assigned-card {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 30px;
          padding: 24px;
          border-radius: 20px;
          align-items: center;
          background: rgba(28, 31, 45, 0.85);
          border: 1px solid rgba(212, 175, 55, 0.25);
        }

        .assigned-look-title {
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 12px;
        }

        .assigned-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.06);
          font-size: 12px;
          color: var(--text-secondary);
        }

        .assigned-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .assigned-card-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .assigned-item-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(14, 16, 22, 0.6);
          padding: 8px;
          border-radius: 14px;
          border: 1px solid var(--border-subtle);
        }

        .assigned-item-img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 6px;
        }

        .assigned-item-name {
          font-size: 11px;
          color: var(--text-muted);
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        .unassigned-placeholder {
          text-align: center;
          padding: 40px 20px;
        }

        .placeholder-icon {
          color: var(--accent-gold);
          margin-bottom: 14px;
          opacity: 0.8;
        }

        .unassigned-placeholder h4 {
          font-size: 20px;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .unassigned-placeholder p {
          font-size: 14.5px;
          color: var(--text-muted);
          max-width: 500px;
          margin: 0 auto;
        }

        /* Tabs Header */
        .tabs-header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .main-tabs {
          display: flex;
          gap: 8px;
          background: rgba(20, 23, 33, 0.8);
          padding: 6px;
          border-radius: 16px;
          border: 1px solid var(--border-subtle);
        }

        .main-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .main-tab-btn.active {
          background: var(--accent-gold-gradient);
          color: #0c0d10;
          box-shadow: 0 4px 14px rgba(212, 175, 55, 0.3);
        }

        .action-buttons-group {
          display: flex;
          gap: 10px;
        }

        /* Filter Pills */
        .category-filter-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 28px;
          overflow-x: auto;
          padding-bottom: 6px;
        }

        .filter-pill {
          padding: 8px 18px;
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

        .filter-pill.active, .filter-pill:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* Outfit Luxe Card */
        .outfit-luxe-card {
          padding: 20px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
        }

        .outfit-card-name {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.3px;
        }

        .outfit-collage-box {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 16px;
          cursor: pointer;
          border-radius: 16px;
          overflow: hidden;
        }

        .collage-cell {
          position: relative;
          height: 105px;
          overflow: hidden;
          border-radius: 10px;
          background: #181b26;
        }

        .collage-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s var(--ease-smooth);
        }

        .collage-cell:hover .collage-img {
          transform: scale(1.08);
        }

        .collage-tooltip {
          position: absolute;
          bottom: 4px;
          left: 4px;
          right: 4px;
          font-size: 9.5px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          padding: 2px 4px;
          border-radius: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .collage-cell:hover .collage-tooltip {
          opacity: 1;
        }

        .card-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .meta-badge {
          background: rgba(255, 255, 255, 0.06);
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 11px;
        }

        .card-btn-group {
          display: flex;
          gap: 8px;
        }

        .btn-assign {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 14px;
          background: var(--accent-gold-gradient);
          color: #0c0d10;
          font-weight: 700;
          font-size: 13px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-assign:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .btn-assign.assigned {
          background: rgba(78, 205, 196, 0.2);
          color: var(--accent-cyan);
          border: 1px solid var(--accent-cyan);
        }

        .btn-inspect {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-inspect:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        /* Closet Grid */
        .closet-item-card {
          padding: 12px;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .item-img-wrap {
          position: relative;
          width: 100%;
          height: 180px;
          border-radius: 14px;
          overflow: hidden;
          background: #181b26;
          margin-bottom: 12px;
        }

        .item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .closet-item-card:hover .item-img {
          transform: scale(1.05);
        }

        .item-type-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(14, 16, 22, 0.85);
          backdrop-filter: blur(8px);
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 700;
          color: var(--accent-gold-light);
          text-transform: uppercase;
        }

        .btn-delete-garment {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.85);
          backdrop-filter: blur(6px);
          border: none;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0.8;
          transition: all 0.2s ease;
        }

        .btn-delete-garment:hover {
          opacity: 1;
          transform: scale(1.1);
          background: #ef4444;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .item-title {
          font-size: 13.5px;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-chips {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .item-chip {
          font-size: 11px;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
          border-radius: 24px;
        }

        .empty-icon {
          color: var(--accent-gold);
          margin-bottom: 16px;
          opacity: 0.7;
        }

        @media (max-width: 900px) {
          .weather-recommendation-bar { grid-template-columns: 1fr; }
          .weather-widget { border-right: none; padding-right: 0; border-bottom: 1px solid var(--border-subtle); padding-bottom: 18px; }
          .assigned-card { grid-template-columns: 1fr; }
          .assigned-card-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
