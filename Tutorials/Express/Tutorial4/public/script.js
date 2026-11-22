// TASK 3: live search, sort by price, Premium label
// N = 12, so "Premium" means price above 12 x 100 = Rs. 1200

const grid = document.getElementById("productGrid");
const searchBox = document.getElementById("searchBox");
const sortBtn = document.getElementById("sortBtn");
const noResults = document.getElementById("noResults");
const radios = document.querySelectorAll('input[name="category"]');

const PREMIUM_LIMIT = 12 * 100;

// Read the price from the card itself: "Rs. 3,000" -> 3000
function getPrice(card) {
  const text = card.querySelector(".card-text").textContent;
  return parseInt(text.replace(/[^0-9]/g, ""), 10);
}

// Read the product name from the card itself, in lower case
function getName(card) {
  return card.querySelector(".card-title").textContent.toLowerCase();
}

// ---------- 1) PREMIUM LABEL (added once, when the page loads) ----------
Array.from(grid.children).forEach(function (card) {
  if (getPrice(card) > PREMIUM_LIMIT) {
    const label = document.createElement("span");
    label.className = "badge bg-warning text-dark mb-2";
    label.textContent = "Premium";
    card.querySelector(".card-title").before(label);
  }
});

// ---------- 2) LIVE SEARCH (works together with the category filter) ----------
// The category filter is done by CSS (the radio rules in style.css).
// The search is done here: cards that do not match get the class "search-hide".
// A card is really visible only if it matches BOTH the search text AND the category.
function applyFilters() {
  const text = searchBox.value.trim().toLowerCase();
  const category = document.querySelector('input[name="category"]:checked').value;
  let visibleCount = 0;

  Array.from(grid.children).forEach(function (card) {
    const matchesSearch = getName(card).includes(text);
    const matchesCategory = (category === "all") || card.classList.contains(category);

    card.classList.toggle("search-hide", !matchesSearch);

    if (matchesSearch && matchesCategory) {
      visibleCount++;
    }
  });

  // show "No products found" only when nothing is visible
  noResults.hidden = visibleCount > 0;
}

searchBox.addEventListener("input", applyFilters);      // runs on every key typed

radios.forEach(function (radio) {
  radio.addEventListener("change", applyFilters);       // runs when a category is clicked
});

// ---------- 3) SORT BY PRICE (low to high, then high to low, and so on) ----------
let lowToHigh = true;

sortBtn.addEventListener("click", function () {
  const sorted = Array.from(grid.children).sort(function (a, b) {
    return lowToHigh ? getPrice(a) - getPrice(b) : getPrice(b) - getPrice(a);
  });

  // appendChild MOVES the existing card, so nothing is rebuilt or copied
  sorted.forEach(function (card) {
    grid.appendChild(card);
  });

  sortBtn.textContent = lowToHigh ? "Sort by price: low to high" : "Sort by price: high to low";
  lowToHigh = !lowToHigh;
});

// run once on load, in case the browser remembered old search text or radio choice
applyFilters();