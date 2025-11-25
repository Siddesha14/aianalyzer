const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const aiRoutes = require("./routes/aiRoutes");

app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

app.listen(5000, () => console.log("Server running on port 5000"));
