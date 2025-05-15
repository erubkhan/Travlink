const express = require('express');
const app = express();
const PORT = 3001;

// Example interests data
const interests = [
  {
    category: "Outdoor",
    items: ["Hiking", "Sightseeing", "Photography", "halulu"]
  },
  {
    category: "Culture",
    items: ["Museums", "Local Culture"]
  },
  {
    category: "Food & Drink",
    items: ["Food", "Nightlife", "Shopping"]
  }
];

// API endpoint for interests
app.get('/api/interests', (req, res) => {
  res.json({ interests });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});