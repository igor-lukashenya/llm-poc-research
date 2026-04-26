import { useMemo } from "react";
import { Box, Typography, Button, Chip, Rating } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import type { Product } from "../data/types";

interface FeaturedBannerProps {
  products: Product[];
}

function selectFeatured(products: Product[]): Product {
  // Prefer popular products, then on-sale, then highest popularity score
  const scored = products.map((p) => ({
    product: p,
    score: p.rating * p.reviews + (p.isPopular ? 500 : 0) + (p.isOnSale ? 300 : 0),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0].product;
}

export default function FeaturedBanner({ products }: FeaturedBannerProps) {
  const featured = useMemo(() => selectFeatured(products), [products]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 320, sm: 380, md: 420 },
        borderRadius: 3,
        overflow: "hidden",
        mb: 5,
      }}
    >
      {/* Background image */}
      <Box
        component="img"
        src={featured.image}
        alt={featured.name}
        loading="lazy"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.5)",
        }}
      />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.2) 100%)",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 3, sm: 5, md: 7 },
          color: "white",
          maxWidth: 600,
        }}
      >
        <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
          <Chip
            icon={<StarIcon sx={{ color: "#ffd700 !important" }} />}
            label="Featured"
            sx={{
              backgroundColor: "rgba(255,215,0,0.15)",
              color: "#ffd700",
              fontWeight: 600,
              border: "1px solid rgba(255,215,0,0.3)",
            }}
            size="small"
          />
          {featured.isPopular && (
            <Chip
              label="🔥 Popular"
              sx={{
                backgroundColor: "rgba(255,109,0,0.2)",
                color: "#ff9100",
                fontWeight: 600,
                border: "1px solid rgba(255,109,0,0.3)",
              }}
              size="small"
            />
          )}
          {featured.isOnSale && (
            <Chip
              label={featured.originalPrice ? `${Math.round((1 - featured.price / featured.originalPrice) * 100)}% OFF` : "Sale"}
              sx={{
                backgroundColor: "rgba(229,9,20,0.2)",
                color: "#ff4444",
                fontWeight: 600,
                border: "1px solid rgba(229,9,20,0.3)",
              }}
              size="small"
            />
          )}
          <Chip
            label={featured.category}
            sx={{
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            size="small"
          />
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" },
            lineHeight: 1.2,
          }}
        >
          {featured.name}
        </Typography>

        <Typography variant="subtitle1" sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
          by {featured.brand}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Rating value={featured.rating} precision={0.1} readOnly size="medium" sx={{
            "& .MuiRating-iconFilled": { color: "#ffd700" },
            "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.3)" },
          }} />
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
            ({featured.reviews} reviews)
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: featured.isOnSale ? "#ff4444" : "#90caf9" }}>
            ${featured.price.toFixed(2)}
          </Typography>
          {featured.isOnSale && featured.originalPrice && (
            <Typography variant="h6" sx={{ textDecoration: "line-through", color: "rgba(255,255,255,0.4)" }}>
              ${featured.originalPrice.toFixed(2)}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<ShoppingCartIcon />}
          sx={{
            alignSelf: "flex-start",
            px: 4,
            py: 1.2,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          Add to Cart
        </Button>
      </Box>
    </Box>
  );
}
