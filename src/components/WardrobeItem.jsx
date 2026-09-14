import React from "react";

const WardrobeItem = ({ item }) => {
  if (!item) return null; // safeguard

  const imageURL = item.imageURL || "/placeholder.png";

  return (
    <div className="wardrobe-card">
      <div className="image-container">
        <img src={`https://wardrobe-j46j-vert.vercel.app${imageURL}`} alt={item.name || "Wardrobe Item"} />
      </div>
      <div className="item-info">
        <h4>{item.name || "Unnamed Item"}</h4>
        <p>{item.type || "Type"} | {item.color || "Color"}</p>
      </div>

      <style>{`
        .wardrobe-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 15px rgba(0,0,0,0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .wardrobe-card:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 15px 25px rgba(0,0,0,0.3);
        }

        .image-container {
          width: 100%;
          height: 180px;
          overflow: hidden;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover; /* image fits div fully without distortion */
          transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .wardrobe-card:hover .image-container img {
          transform: scale(1.1); /* subtle zoom effect */
          opacity: 0.9;
        }

        .item-info {
          padding: 10px;
          text-align: center;
        }

        .item-info h4 {
          margin: 5px 0;
          font-size: 16px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-info p {
          margin: 0;
          font-size: 14px;
          color: #555;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Optional subtle fade-in animation when cards appear */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .wardrobe-card {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default WardrobeItem;