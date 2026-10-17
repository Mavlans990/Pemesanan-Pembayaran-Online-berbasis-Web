require("dotenv").config();
const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
// Middleware buat hosting ports di vscode
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = Number(process.env.PORT) || 3000;
const apiInternal = process.env.API_BASE_URL || "http://localhost:4000";

app.set("view engine", "ejs");
app.set("views", __dirname);

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/api/pesanan/events",
  createProxyMiddleware({
    target: apiInternal,
    changeOrigin: true,
    timeout: 0,
    proxyTimeout: 0,
  })
);
app.use(
  "/api",
  createProxyMiddleware({
    target: apiInternal,
    changeOrigin: true,
    timeout: 30000,
    proxyTimeout: 30000,
  })
);
app.use(
  "/img",
  createProxyMiddleware({
    target: apiInternal,
    changeOrigin: true,
  })
);

app.use((req, res, next) => {
  res.locals.apiBase = "";
  res.locals.error = req.query.error || null;
  next();
});

async function fetchApi(pathname) {
  const res = await fetch(apiInternal + pathname);
  const json = await res.json().catch(() => ({ success: false, data: [] }));
  return json.data || [];
}

app.get("/", (req, res) => {
  res.render("user/index", { layout: false });
});

app.get("/admin", (req, res) => {
  res.render("index", {
    layout: "admin/layouts/main-layout",
    activePage: "home",
    title: "Halaman Dashboard",
  });
});

app.get("/admin/menu", (req, res) => {
  res.render("admin/menu/index", {
    layout: "admin/layouts/main-layout",
    activePage: "menu",
    title: "Halaman Dashboard",
    menus: [],
  });
});

app.get("/admin/meja", async (req, res) => {
  let mejas = [];
  try {
    mejas = await fetchApi("/api/meja");
  } catch (err) {
    console.error(err);
  }
  res.render("admin/meja/index", {
    layout: "admin/layouts/main-layout",
    activePage: "meja",
    title: "Halaman Dashboard",
    mejas,
    msg: req.query.error || "",
  });
});

app.get("/admin/pesanan", (req, res) => {
  res.render("admin/pesanan/index", {
    layout: "admin/layouts/main-layout",
    activePage: "pesanan",
    title: "Halaman Dashboard",
    pesanans: [],
  });
});

app.listen(port, () => {
  console.log(`Frontend: http://localhost:${port}`);
});
