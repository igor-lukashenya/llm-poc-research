# E-commerce new requirements and changes

## November 2025: Netflix-Style UI Redesign Requirements

### 1. Netflix-Style Horizontal Category Scroll

- Replace the grid layout with horizontally scrollable product carousels for each category.
- Each category is a separate horizontal row, similar to Netflix genre rows.
- Products within each category scroll left/right.

### 2. Featured Product Banner

- Add a large banner at the top to showcase a featured product.
- Featured product is selected by popularity (most reviews/highest rating) or sale status.
- Banner includes big image, prominent title, price, and call-to-action button.

### 3. Left Sidebar Navigation

- Introduce a left sidebar for navigation and filtering.
- Sidebar includes:
  - Category selection (with icons/images if possible)
  - Brand filter
  - Search bar
  - Favorites shortcut
  - Additional navigation links (Home, Sale, Popular, etc.)

### 4. Responsive Design

- Ensure layout is fully responsive:
  - Horizontal scroll works on desktop and mobile (touch gestures).
  - Sidebar collapses or becomes a drawer on small screens.

### 5. UI/UX Enhancements

- Update styling to match Netflix dark theme, bold images, minimalistic overlays.
- Add hover effects and smooth transitions for product cards/carousels.
- Highlight "Popular" or "On Sale" products with badges/overlays.

### 6. Data & Logic Changes

- Update product data to include "isPopular" and "isOnSale" flags.
- Implement logic to select/display featured product dynamically.
- Adjust filtering/sorting for new sidebar and horizontal layout.

### 7. Accessibility & Performance

- Ensure keyboard navigation for carousels and sidebar.
- Optimize image loading (lazy loading for banners/carousels).
