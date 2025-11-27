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

export interface ProductCardProps {
  product: {
    id: string | number;
    name: string;
    brand: string;
    category: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
  };
  actions?: React.ReactNode;
}

const CARD_WIDTH = 280;
const CARD_HEIGHT = 390;

const ProductCard: React.FC<ProductCardProps> = ({ product, actions }) => (
  <Card
    sx={{
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxSizing: "border-box",
    }}
  >
    <Box>
      <CardMedia
        component="img"
        height="160"
        image={product.image}
        alt={product.name}
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
        <Typography variant="body2" color="text.secondary">
          ${product.price.toFixed(2)}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
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
    </Box>
    {actions && <CardActions sx={{ mt: "auto", pb: 1 }}>{actions}</CardActions>}
  </Card>
);

export default ProductCard;
