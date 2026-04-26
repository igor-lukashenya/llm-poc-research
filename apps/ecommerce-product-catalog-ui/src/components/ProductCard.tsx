import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Rating,
  CardActions,
} from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import type { Product } from "../data/types";

interface ProductCardProps {
  product: Product;
  actions?: React.ReactNode;
}

const CARD_WIDTH = 280;
const CARD_HEIGHT = 390;

const ProductCard: React.FC<ProductCardProps> = ({ product, actions }) => (
  <Card
    tabIndex={0}
    aria-label={`${product.name} by ${product.brand}, $${product.price.toFixed(2)}${product.isOnSale ? " on sale" : ""}${product.isPopular ? ", popular" : ""}, ${product.rating} stars`}
    sx={{
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxSizing: "border-box",
      position: "relative",
      "&:focus-visible": {
        outline: "2px solid",
        outlineColor: "primary.main",
        outlineOffset: 2,
      },
    }}
  >
    {/* Badges */}
    <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 1, display: "flex", gap: 0.5, flexDirection: "column" }}>
      {product.isPopular && (
        <Chip
          icon={<WhatshotIcon sx={{ fontSize: 16 }} />}
          label="Popular"
          size="small"
          sx={{
            backgroundColor: "#ff6d00",
            color: "white",
            fontWeight: 600,
            "& .MuiChip-icon": { color: "white" },
          }}
        />
      )}
      {product.isOnSale && (
        <Chip
          icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
          label={product.originalPrice ? `-${Math.round((1 - product.price / product.originalPrice) * 100)}%` : "Sale"}
          size="small"
          sx={{
            backgroundColor: "#e50914",
            color: "white",
            fontWeight: 600,
            "& .MuiChip-icon": { color: "white" },
          }}
        />
      )}
    </Box>

    <Box>
      <CardMedia
        component="img"
        height="160"
        image={product.image}
        alt={product.name}
        loading="lazy"
        sx={{ objectFit: "cover", width: "100%" }}
      />
      <CardContent sx={{ pb: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          {product.name}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Chip label={product.brand} size="small" />
          <Chip label={product.category} size="small" color="info" />
        </Box>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography variant="body2" color={product.isOnSale ? "error" : "text.secondary"} fontWeight={product.isOnSale ? 700 : 400}>
            ${product.price.toFixed(2)}
          </Typography>
          {product.isOnSale && product.originalPrice && (
            <Typography variant="caption" sx={{ textDecoration: "line-through", color: "text.disabled" }}>
              ${product.originalPrice.toFixed(2)}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Rating value={product.rating} precision={0.1} readOnly size="small" />
          <Typography variant="caption" sx={{ ml: 0.5 }}>
            ({product.reviews} reviews)
          </Typography>
        </Box>
      </CardContent>
    </Box>
    {actions && <CardActions sx={{ mt: "auto", pb: 1 }}>{actions}</CardActions>}
  </Card>
);

export default ProductCard;
