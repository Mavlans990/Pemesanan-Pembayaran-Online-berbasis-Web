require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const menuRoutes = require("./routes/menuRoutes");
const mejaRoutes = require("./routes/mejaRoutes");
const pesananRoutes = require("./routes/pesananRoutes");

const app = express();
const port = Number(process.env.PORT) || 4000;
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/img", express.static(path.join(__dirname, "../frontend/public/img")));

app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "API ready" });
});

app.use("/api/menu", menuRoutes);
app.use("/api/meja", mejaRoutes);
app.use("/api/pesanan", pesananRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route API tidak ditemukan" });
});

app.listen(port, () => {
    console.log(`Backend API: http://localhost:${port}/api`);
});
