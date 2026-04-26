import { useCallback, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import FeaturedBanner from "../components/FeaturedBanner";

function CategoryCarousel({ category, idx }: { category: string; idx: number }) {
  const catProducts = products.filter((p) => p.category === category);
  const carouselId = `carousel-${idx}`;
  const [hovered, setHovered] = useState(false);

  const scroll = useCallback((amount: number) => {
    const el = document.getElementById(carouselId);
    if (el) el.scrollBy({ left: amount, behavior: "smooth" });
  }, [carouselId]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); scroll(300); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); scroll(-300); }
  }, [scroll]);

  return (
    <Box
      role="region"
      aria-label={`${category} products`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{ mb: 5, px: { xs: 0, sm: 4 } }}
    >
      <Typography
        variant="h4"
        id={`carousel-label-${idx}`}
        sx={{ mb: 2, ml: 1, fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
      >
        {category}
      </Typography>
      <Box sx={{ position: "relative", width: "100%" }}>
        {/* Left fade gradient */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 60,
            zIndex: 1,
            pointerEvents: "none",
            background: (t) =>
              `linear-gradient(to right, ${t.palette.background.default}, transparent)`,
          }}
        />

        {/* Right fade gradient */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: 60,
            zIndex: 1,
            pointerEvents: "none",
            background: (t) =>
              `linear-gradient(to left, ${t.palette.background.default}, transparent)`,
          }}
        />

        {/* Left arrow */}
        <IconButton
          aria-label={`Scroll ${category} left`}
          onClick={() => scroll(-400)}
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 3,
            width: 44,
            height: 80,
            borderRadius: "0 8px 8px 0",
            backgroundColor: (t) => t.palette.mode === "dark"
              ? "rgba(30,30,30,0.85)"
              : "rgba(255,255,255,0.9)",
            backdropFilter: "blur(4px)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.25s",
            display: { xs: "none", sm: "flex" },
            "&:hover": {
              backgroundColor: (t) => t.palette.mode === "dark"
                ? "rgba(50,50,50,0.95)"
                : "rgba(240,240,240,0.95)",
            },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        {/* Scroll container */}
        <Box
          id={carouselId}
          tabIndex={0}
          role="list"
          aria-labelledby={`carousel-label-${idx}`}
          onKeyDown={handleKeyDown}
          sx={{
            display: "flex",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            gap: { xs: 1.5, sm: 2.5 },
            py: 2,
            px: 4,
            scrollBehavior: "smooth",
            scrollSnapType: "x mandatory",
            /* Hide scrollbar */
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 2,
              borderRadius: 1,
            },
          }}
        >
          {catProducts.map((product) => (
            <Box
              key={product.id}
              role="listitem"
              sx={{
                minWidth: { xs: 240, sm: 280 },
                width: { xs: 240, sm: 280 },
                scrollSnapAlign: "start",
                flexShrink: 0,
              }}
            >
              <ProductCard product={product} />
            </Box>
          ))}
        </Box>

        {/* Right arrow */}
        <IconButton
          aria-label={`Scroll ${category} right`}
          onClick={() => scroll(400)}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 3,
            width: 44,
            height: 80,
            borderRadius: "8px 0 0 8px",
            backgroundColor: (t) => t.palette.mode === "dark"
              ? "rgba(30,30,30,0.85)"
              : "rgba(255,255,255,0.9)",
            backdropFilter: "blur(4px)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.25s",
            display: { xs: "none", sm: "flex" },
            "&:hover": {
              backgroundColor: (t) => t.palette.mode === "dark"
                ? "rgba(50,50,50,0.95)"
                : "rgba(240,240,240,0.95)",
            },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default function HomePage() {
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 1, sm: 4 },
        py: { xs: 2, sm: 4 },
        width: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <FeaturedBanner products={products} />

      {categories.map((category, idx) => (
        <CategoryCarousel key={category} category={category} idx={idx} />
      ))}
    </Box>
  );
}
