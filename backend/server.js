const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use("/songs", express.static(path.join(__dirname, "songs")));

app.get("/server/songs", (req, res) => {
  fs.readdir(path.join(__dirname, "songs"), (err, files) => {
    if (err) return res.status(500).send("Unable to list songs");
    const mp3Files = files.filter(file => file.endsWith(".mp3"));
    res.json(mp3Files);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});