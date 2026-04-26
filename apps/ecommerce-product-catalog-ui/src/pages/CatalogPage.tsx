import { Container, Typography, Button, Box } from "@mui/material";
import { Grid } from "@mui/material";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import CatalogToolbar from "../components/CatalogToolbar";
import { useProductFilters } from "../hooks/useProductFilters";
import { useFavorites } from "../hooks/useFavorites";

export default function CatalogPage() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { filters, filtered, setCategory, setBrand, setSearch, setSort } =
    useProductFilters(products, favorites);

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
      <CatalogToolbar
        category={filters.category}
        brand={filters.brand}
        search={filters.search}
        sort={filters.sort}
        onCategoryChange={setCategory}
        onBrandChange={setBrand}
        onSearchChange={setSearch}
        onSortChange={setSort}
      />

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
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <Box sx={{ display: "flex", justifyContent: { xs: "center", sm: "flex-start" } }}>
                <ProductCard
                  product={product}
                  actions={
                    <Button
                      size="small"
                      variant={isFavorite(product.id) ? "contained" : "outlined"}
                      color={isFavorite(product.id) ? "secondary" : "primary"}
                      onClick={() => toggleFavorite(product.id)}
                    >
                      {isFavorite(product.id) ? "Favorited" : "Add to Favorites"}
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
