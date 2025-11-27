import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Box
} from "@mui/material";
import { Grid } from "@mui/material";
import { products } from "./products";
import ProductCard from "./ProductCard";

const categories = [...new Set(products.map((p) => p.category))];
const brands = [...new Set(products.map((p) => p.brand))];

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price-asc");
  const [favorites, setFavorites] = useState<number[]>([]);

  // Filtering and sorting logic
  let filtered = products.filter(
    (p) =>
      (selectedCategory ? p.category === selectedCategory : true) &&
      (selectedBrand ? p.brand === selectedBrand : true) &&
      (search ? p.name.toLowerCase().includes(search.toLowerCase()) : true)
  );
  if (sort === "price-asc")
    filtered = filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-desc")
    filtered = filtered.sort((a, b) => b.price - a.price);
  if (sort === "rating-desc")
    filtered = filtered.sort((a, b) => b.rating - a.rating);

  const handleFavorite = (id: number) => {
    setFavorites((favs) =>
      favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]
    );
  };

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        px: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          mb: 3,
          flexWrap: "wrap",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 2,
          backgroundColor: "background.paper",
          py: 2,
        }}
      >
        <Typography variant="h4" sx={{ minWidth: 220, mr: 2 }}>
          Product Catalog
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            flex: 1,
          }}
        >
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Brand</InputLabel>
            <Select
              value={selectedBrand}
              label="Brand"
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sort}
              label="Sort By"
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="rating-desc">Rating: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", width: "100%" }}>
        <Grid
          container
          spacing={3}
          sx={{
            width: "100%",
            margin: 0,
            flexGrow: 1,
            alignContent: "flex-start",
            p: "5px",
          }}
        >
          {filtered.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Box sx={{ width: 280, height: 390, display: "flex", alignItems: "stretch" }}>
                <ProductCard
                  product={product}
                  actions={
                    <Button
                      size="small"
                      variant={favorites.includes(product.id) ? "contained" : "outlined"}
                      color={favorites.includes(product.id) ? "secondary" : "primary"}
                      onClick={() => handleFavorite(product.id)}
                    >
                      {favorites.includes(product.id) ? "Favorited" : "Add to Favorites"}
                    </Button>
                  }
                />
              </Box>
            </Grid>
          ))}
        </Grid>
        {filtered.length === 0 && (
          <Typography align="center" sx={{ mt: 4 }} color="text.secondary">
            No products found.
          </Typography>
        )}
      </Box>
    </Container>
  );
}