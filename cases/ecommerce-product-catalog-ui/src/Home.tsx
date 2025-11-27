import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Rating,
  IconButton,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { products } from "./products";

export default function Home() {
  // Get unique categories
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: 4,
        py: 4,
        width: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h2" gutterBottom align="center">
        Welcome to the E-commerce Store
      </Typography>
      <Typography
        variant="h5"
        color="text.secondary"
        align="center"
        sx={{ mb: 4 }}
      >
        Discover products, deals, and more!
      </Typography>
      {/* Netflix-style horizontal carousels for each category */}
      {categories.map((category, idx) => {
        const catProducts = products.filter((p) => p.category === category);
        const carouselId = `carousel-${idx}`;
        const scrollBy = (amount: number) => {
          const el = document.getElementById(carouselId);
          if (el) el.scrollBy({ left: amount, behavior: "smooth" });
        };
        return (
          <Box key={category} sx={{ mb: 5, px: 4 }}>
            <Typography variant="h4" sx={{ mb: 2, ml: 1 }}>
              {category}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                width: "100%",
                maxWidth: "100vw",
                overflow: "visible",
              }}
            >
              <IconButton
                aria-label="scroll left"
                onClick={() => scrollBy(-400)}
                sx={{ mr: 1, zIndex: 2, background: "rgba(255,255,255,0.8)" }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Box
                id={carouselId}
                sx={{
                  display: "flex",
                  overflowX: "hidden",
                  gap: 4,
                  py: 2,
                  px: 1,
                  scrollbarWidth: "thin",
                  "&::-webkit-scrollbar": { height: 8 },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#ccc",
                    borderRadius: 4,
                  },
                  scrollBehavior: "smooth",
                  flex: 1,
                  width: "100%",
                  maxWidth: "100vw",
                }}
              >
                {catProducts.map((product) => (
                  <Card
                    key={product.id}
                    sx={{ minWidth: 260, maxWidth: 280, flex: "0 0 auto" }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={product.image}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {product.name}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <Chip label={product.brand} size="small" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        ${product.price.toFixed(2)}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <Rating
                          value={product.rating}
                          precision={0.1}
                          readOnly
                          size="small"
                        />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          ({product.reviews} reviews)
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
              <IconButton
                aria-label="scroll right"
                onClick={() => scrollBy(400)}
                sx={{ ml: 1, zIndex: 2, background: "rgba(255,255,255,0.8)" }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
