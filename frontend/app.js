require("dotenv").config();
const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const port = Number(process.env.PORT);
const apiBase = process.env.API_BASE_URL;

app.set("view engine", "ejs");
app.set("views", __dirname);

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.apiBase = apiBase;
  res.locals.error = req.query.error || null;
  next();
});

// function formatRupiah(angka, withPrefix = true) {
//   if (angka === null || angka === undefined || isNaN(angka)) {
//     return withPrefix ? "Rp 0" : "0";
//   }
//   const formatted = new Intl.NumberFormat("id-ID", {
//     style: "decimal",
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   }).format(angka);
//   return withPrefix ? `Rp ${formatted}` : formatted;
// }

async function fetchApi(pathname) {
  const res = await fetch(apiBase + pathname);
  const json = await res.json().catch(() => ({ success: false, data: [] }));
  // console.log(json.data)
  return json.data || [];
}

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout",
    activePage: "home",
    title: "Halaman Dashboard",
  });
});

app.get("/menu", async (req, res) => {
  let menus = [];
  try {
    menus = await fetchApi("/api/menu");
  } catch (err) {
    console.error(err);
  }
  res.render("menu/index", {
    layout: "layouts/main-layout",
    activePage: "menu",
    title: "Halaman Dashboard",
    menus,
  });
});

app.get("/meja", async (req, res) => {
  let mejas = [];
  try {
    mejas = await fetchApi("/api/meja");
  } catch (err) {
    console.error(err);
  }
  res.render("meja/index", {
    layout: "layouts/main-layout",
    activePage: "meja",
    title: "Halaman Dashboard",
    mejas,
    msg: req.query.error || "",
  });
});

app.listen(port, () => {
  console.log(`Frontend: http://localhost:${port}`);
});
