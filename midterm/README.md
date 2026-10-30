# Midterm Lab: Scents n Stories

- **Name:** Waqar Imran
- **Roll number:** FA24-BCS-112
- **N** = 12
- **BP** = 600 + 12 = 612px
- **H** = (12 x 7) mod 360 = 84, accent colour hsl(84, 70%, 45%)
- **K** = (12 mod 3) + 3 = 3 categories (Men, Women, Unisex)
- Sticky offset = (12 mod 40) + 70 = 82px
- Premium limit = 12 x 100 = 1200

## Files changed
- `index.html`: category radios, search box, sort button, "No products found" message, `data-category` on cards, script link
- `product.html`: layout rebuilt with named grid areas and a longer description
- `css/style.css`: accent variable, filter styles, product page grid
- `script.js` (new): search, sort and Premium label

## Task 1: CSS-only category filter
Each card has a `data-category`. Four radio buttons (All plus 3 categories) sit above the grid and "All" is `checked`. The CSS rule `#products:has(#f-men:checked) .col:not([data-category="men"]) { display: none; }` hides cards that do not match, and display none leaves no gaps. The checked label gets the accent colour.

## Task 2: Product page grid
`.product-layout` is a CSS Grid with `grid-template-areas`. Below 612px the areas stack as image, details, description. From 612px they become "image details" and "description description". The details box uses `position: sticky; top: 82px` and the grid has `align-items: start` so it can stay in view while scrolling.

## Task 3: Search and sort
`script.js` reads names and prices from the existing cards. Search toggles a `search-hide` class and checks the real display of each card so it works with the category filter. Sort uses `sort()` and `appendChild` to move the existing cards. Cards above Rs. 1,200 get a "Premium" badge on load.

## AI tools used
Claude