const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://wardrobeUser:Wardrobe124@cluster0.iu4shad.mongodb.net/?appName=Cluster0";

const accurateItems = [
  {
    imageURL: "/uploads/1769966918594-3.jpeg",
    name: "Royal Purple Embroidered Anarkali Maxi",
    type: "Dress",
    color: "Purple",
    season: "All",
    occasion: "Formal"
  },
  {
    imageURL: "/uploads/1769967007138-WhatsApp Image 2026-02-01 at 9.20.20 AM.jpeg",
    name: "Embellished Gold Kundan Khussa",
    type: "Shoes",
    color: "Gold",
    season: "All",
    occasion: "Formal"
  },
  {
    imageURL: "/uploads/1769967083941-8.jpeg",
    name: "Bridal Pearl & Kundan Jhumka Set",
    type: "Accessories",
    color: "Gold",
    season: "All",
    occasion: "Party"
  },
  {
    imageURL: "/uploads/1769967146171-22.jpeg",
    name: "Minimalist White & Black Cape Abaya Gown",
    type: "Dress",
    color: "White",
    season: "All",
    occasion: "Formal"
  },
  {
    imageURL: "/uploads/1769967305993-39.jpeg",
    name: "Zara Black Pointed Stiletto Bow Heels",
    type: "Shoes",
    color: "Black",
    season: "All",
    occasion: "Party"
  },
  {
    imageURL: "/uploads/1769967479246-40.jpeg",
    name: "Black Structured Leather Mini Handbag",
    type: "Accessories",
    color: "Black",
    season: "All",
    occasion: "Formal"
  },
  {
    imageURL: "/uploads/1769967522857-28.jpeg",
    name: "Victorian Crimson & Cream Corset Ballgown",
    type: "Dress",
    color: "Red",
    season: "Winter",
    occasion: "Party"
  },
  {
    imageURL: "/uploads/1769967552214-17.jpeg",
    name: "Burgundy Chunky Platform Mary Jane Heels",
    type: "Shoes",
    color: "Burgundy",
    season: "Autumn",
    occasion: "Party"
  },
  {
    imageURL: "/uploads/1769967590826-9.jpeg",
    name: "Diamond Crystal Teardrop Jewelry Set",
    type: "Accessories",
    color: "Silver",
    season: "All",
    occasion: "Formal"
  },
  {
    imageURL: "/uploads/1769967627751-21.jpeg",
    name: "White Pearl Rosette Floral Clutch Bag",
    type: "Accessories",
    color: "White",
    season: "Spring",
    occasion: "Party"
  },
  {
    imageURL: "/uploads/1769967675682-23.jpeg",
    name: "Brunette Wavy Long Hair Styling Wig",
    type: "Accessories",
    color: "Brown",
    season: "All",
    occasion: "Casual"
  },
  {
    imageURL: "/uploads/1769967730521-1.jpeg",
    name: "Shimmering Lilac Organza Princess Gown",
    type: "Dress",
    color: "Purple",
    season: "Spring",
    occasion: "Party"
  },
  {
    imageURL: "/uploads/1769967770042-6.jpeg",
    name: "Vintage Gold Pearl Bracelet Watch",
    type: "Accessories",
    color: "Gold",
    season: "All",
    occasion: "Smart Casual"
  },
  {
    imageURL: "/uploads/1769967805636-16.jpeg",
    name: "Pastel Pink Bow Platform Mary Jane Heels",
    type: "Shoes",
    color: "Pink",
    season: "Spring",
    occasion: "Party"
  },
  {
    imageURL: "/uploads/1769967855194-24.jpeg",
    name: "Ash Blonde Braided Crown Hairpiece",
    type: "Accessories",
    color: "Gold",
    season: "All",
    occasion: "Casual"
  },
  {
    imageURL: "/uploads/1769967909316-12.jpeg",
    name: "Crystal Teardrop Chandelier Earrings",
    type: "Accessories",
    color: "Silver",
    season: "All",
    occasion: "Formal"
  },
  {
    imageURL: "/uploads/1769967978710-dress.jpeg",
    name: "Embroidered Crimson Red Sharara Lehenga",
    type: "Dress",
    color: "Red",
    season: "Winter",
    occasion: "Formal"
  },
  {
    imageURL: "/uploads/1769968011217-5.jpeg",
    name: "Wide Gold Wire Layered Cuff Bracelet",
    type: "Accessories",
    color: "Gold",
    season: "All",
    occasion: "Party"
  },
  {
    imageURL: "/uploads/1769968062627-red.jpeg",
    name: "Maroon Velvet Kundan Anklet Khussa",
    type: "Shoes",
    color: "Red",
    season: "Winter",
    occasion: "Formal"
  },
  {
    imageURL: "/uploads/1769968086250-26.jpeg",
    name: "Auburn Crown Braided Ponytail Hairpiece",
    type: "Accessories",
    color: "Brown",
    season: "All",
    occasion: "Casual"
  },
  {
    imageURL: "/uploads/1769968134256-WhatsApp Image 2026-02-01 at 9.20.19 AM.jpeg",
    name: "Pink & Gold Traditional Embellished Frock Kurti",
    type: "Dress",
    color: "Pink",
    season: "Spring",
    occasion: "Party"
  },
  {
    imageURL: "/uploads/1769968158775-white.jpeg",
    name: "Embroidered Pearl & Zari Wedding Khussa",
    type: "Shoes",
    color: "White",
    season: "All",
    occasion: "Formal"
  },
  {
    imageURL: "/uploads/1769968196663-7.jpeg",
    name: "Mauve Pink & Gold Kundan Chura Bangles",
    type: "Accessories",
    color: "Pink",
    season: "All",
    occasion: "Party"
  },
  {
    imageURL: "/uploads/1769968265098-WhatsApp Image 2026-02-01 at 9.20.16 AM.jpeg",
    name: "Ivory Lace Bell-Sleeve Co-Ord Set",
    type: "Dress",
    color: "White",
    season: "Summer",
    occasion: "Smart Casual"
  },
  {
    imageURL: "/uploads/1769968309150-19.jpeg",
    name: "Pearl Ribbon Bow Pointed High Heels",
    type: "Shoes",
    color: "White",
    season: "Spring",
    occasion: "Formal"
  },
  {
    imageURL: "/uploads/1769968356588-25.jpeg",
    name: "Espresso Dark Wavy Glamour Hairpiece",
    type: "Accessories",
    color: "Black",
    season: "All",
    occasion: "Casual"
  },
  {
    imageURL: "/uploads/1769968380662-27.jpeg",
    name: "Silk Blush Pink Mermaid Evening Gown",
    type: "Dress",
    color: "Pink",
    season: "Summer",
    occasion: "Formal"
  },
  {
    imageURL: "/uploads/1769968409726-18.jpeg",
    name: "Pastel Pink Organza Bow Stiletto Heels",
    type: "Shoes",
    color: "Pink",
    season: "Summer",
    occasion: "Party"
  },
  {
    imageURL: "/uploads/1769968446708-20.jpeg",
    name: "Lilac Ruched Leather Bag with Pearl Chain",
    type: "Accessories",
    color: "Purple",
    season: "Spring",
    occasion: "Party"
  },
  {
    imageURL: "/uploads/74b98ec37d8f8f7e60e7779bf3b27aa7",
    name: "Studio Lookbook Display Backdrop",
    type: "Accessories",
    color: "Black",
    season: "All",
    occasion: "Casual"
  }
];

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;

    await db.collection('clothes').deleteMany({});
    await db.collection('outfits').deleteMany({});
    console.log("All old clothes and outfits purged.");

    const users = await db.collection('users').find().toArray();

    for (const user of users) {
      console.log(`Creating fresh collection for user: ${user.email}`);
      const userIdStr = user._id.toString();

      const clothesToInsert = accurateItems.map(item => ({
        ...item,
        userId: userIdStr
      }));

      await db.collection('clothes').insertMany(clothesToInsert);
      const insertedClothes = await db.collection('clothes').find({ userId: userIdStr }).toArray();

      const map = {};
      insertedClothes.forEach(c => {
        map[c.imageURL] = c._id.toString();
      });

      const outfitsToInsert = [
        {
          name: "Royal Crimson Gala Ensemble",
          occasion: "Formal",
          season: "Winter",
          userId: userIdStr,
          items: [
            map["/uploads/1769967978710-dress.jpeg"],
            map["/uploads/1769968062627-red.jpeg"],
            map["/uploads/1769967083941-8.jpeg"],
            map["/uploads/1769967590826-9.jpeg"]
          ].filter(Boolean)
        },
        {
          name: "Blush Mermaid Evening Glam",
          occasion: "Formal",
          season: "Summer",
          userId: userIdStr,
          items: [
            map["/uploads/1769968380662-27.jpeg"],
            map["/uploads/1769968409726-18.jpeg"],
            map["/uploads/1769968196663-7.jpeg"],
            map["/uploads/1769968011217-5.jpeg"]
          ].filter(Boolean)
        },
        {
          name: "Haute Couture White Minimalist",
          occasion: "Formal",
          season: "All",
          userId: userIdStr,
          items: [
            map["/uploads/1769967146171-22.jpeg"],
            map["/uploads/1769967305993-39.jpeg"],
            map["/uploads/1769967479246-40.jpeg"],
            map["/uploads/1769967770042-6.jpeg"]
          ].filter(Boolean)
        },
        {
          name: "Lilac Organza Fairytale Look",
          occasion: "Party",
          season: "Spring",
          userId: userIdStr,
          items: [
            map["/uploads/1769967730521-1.jpeg"],
            map["/uploads/1769968309150-19.jpeg"],
            map["/uploads/1769968446708-20.jpeg"],
            map["/uploads/1769967909316-12.jpeg"]
          ].filter(Boolean)
        },
        {
          name: "Ivory Bell-Sleeve Chic",
          occasion: "Smart Casual",
          season: "Summer",
          userId: userIdStr,
          items: [
            map["/uploads/1769968265098-WhatsApp Image 2026-02-01 at 9.20.16 AM.jpeg"],
            map["/uploads/1769968158775-white.jpeg"],
            map["/uploads/1769967627751-21.jpeg"],
            map["/uploads/1769967855194-24.jpeg"]
          ].filter(Boolean)
        },
        {
          name: "Royal Purple Anarkali Look",
          occasion: "Formal",
          season: "All",
          userId: userIdStr,
          items: [
            map["/uploads/1769966918594-3.jpeg"],
            map["/uploads/1769967007138-WhatsApp Image 2026-02-01 at 9.20.20 AM.jpeg"],
            map["/uploads/1769968011217-5.jpeg"],
            map["/uploads/1769967770042-6.jpeg"]
          ].filter(Boolean)
        },
        {
          name: "Victorian Corset Ballgown",
          occasion: "Party",
          season: "Winter",
          userId: userIdStr,
          items: [
            map["/uploads/1769967522857-28.jpeg"],
            map["/uploads/1769967552214-17.jpeg"],
            map["/uploads/1769967590826-9.jpeg"],
            map["/uploads/1769968356588-25.jpeg"]
          ].filter(Boolean)
        }
      ];

      await db.collection('outfits').insertMany(outfitsToInsert);
      console.log(`Inserted 7 accurate outfits for ${user.email}`);
    }

    console.log("COMPLETE STRING ID RE-SEED SUCCESSFUL!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

main();
