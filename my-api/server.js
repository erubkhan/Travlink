const express = require("express");
const app = express();
const PORT = 3001;

// Example interests data
const interests = [
  {
    category: "Travel and Adventure", 
    items: ["Backpacking", "Camping", "Solo travel", "Group tours", "Hiking", "Road trips", "Luxury travel",
            "Budget travel", "Local food exploration", "Urban exploring", "World heritage sites", "Digital nomad life"],
  },
  {
    category: "Culture & Language", 
    items: ["Multicultural experiences", "History & heritage", "Art museums", "Festivals", "Folklore & traditions", 
            "Local crafts", "Learning new languages"],
  },
  {
    category: "Food & Drink", 
    items: ["Street food", "Vegan cuisine", "Cooking classes", "Food blogging", "Farm-to-table", 
            "Global cuisines", "Baking"],
  },
  {
    category: "Arts & Creativity", 
    items: ["Painting", "Photography", "Film making", "Drawing", "Music production", 
            "Interior design", "Fashion styling", "Poetry", "Graphic design", "Animation"],
  },
  {
    category: "Learning & Personal Growth", 
    items: ["Reading", "Podcasts", "Public speaking", "Journaling", "Philosophy",
            "Psychology", "Self-development", "Meditation", "Spirituality"],
  },

];

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

// API endpoint for interests
app.get("/api/interests", (req, res) => {
  console.log("Interests API called");
  res.json({ interests });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
