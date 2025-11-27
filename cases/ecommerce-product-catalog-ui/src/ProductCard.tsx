import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Rating,
} from "@mui/material";

export interface ProductCardProps {
  product: {
    id: string | number;
    name: string;
    brand: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <Card sx={{ minWidth: 260, maxWidth: 280, flex: "0 0 auto" }}>
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
  </Card>
);

export default ProductCard;
