// server.js
const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// EJS and layout settings
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(expressLayouts);
app.set("layout", "layout");          // every page is placed inside views/layout.ejs

// Middleware 1: my own logger (prints every request)
app.use(function (req, res, next) {
  console.log(req.method + " " + req.url);
  next();
});

// Middleware 2: serve css, images and script.js from the public folder
app.use(express.static("public"));

// Product data
const products = [
  { name: "Oud Royale",     price: 3000, category: "men",    image: "perfume1.jpg" },
  { name: "Rose Whisper",   price: 3500, category: "women",  image: "perfume2.jpg" },
  { name: "Midnight Musk",  price: 4000, category: "unisex", image: "perfume3.jpg" },
  { name: "Amber Dreams",   price: 2800, category: "men",    image: "perfume4.jpg" },
  { name: "Velvet Jasmine", price: 3200, category: "women",  image: "perfume5.jpg" },
  { name: "Ocean Breeze",   price: 2500, category: "unisex", image: "perfume6.jpg" },
  { name: "Sandal Nights",  price: 3800, category: "men",    image: "perfume7.jpg" },
  { name: "Citrus Bloom",   price: 2900, category: "women",  image: "perfume8.jpg" }
];

// Routes
app.get("/", function (req, res) {
  res.render("index", { title: "Scents n Stories | Home", products: products });
});

app.get("/product", function (req, res) {
  res.render("product", { title: "Oud Royale | Scents n Stories" });
});

// Page not found
app.use(function (req, res) {
  res.status(404).send("404: Page not found");
});

app.listen(3000, function () {
  console.log("Server running at http://localhost:3000");
});