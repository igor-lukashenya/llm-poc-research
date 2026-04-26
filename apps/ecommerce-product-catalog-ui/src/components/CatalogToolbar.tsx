import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { allCategories, allBrands } from "../data/products";
import type { SortOption } from "../hooks/useProductFilters";

interface CatalogToolbarProps {
  category: string;
  brand: string;
  search: string;
  sort: SortOption;
  onCategoryChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
}

export default function CatalogToolbar({
  category,
  brand,
  search,
  sort,
  onCategoryChange,
  onBrandChange,
  onSearchChange,
  onSortChange,
}: CatalogToolbarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1.5, sm: 3 },
        mb: 3,
        flexWrap: "wrap",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 2,
        backgroundColor: "background.paper",
        py: 2,
        pl: { xs: 6, sm: 0 },
      }}
    >
      <Typography variant="h4" sx={{ minWidth: { xs: "100%", md: 220 }, mr: 2, fontSize: { xs: "1.5rem", sm: "2.125rem" } }}>
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
            value={category}
            label="Category"
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {allCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={brand}
            label="Brand"
            onChange={(e) => onBrandChange(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {allBrands.map((b) => (
              <MenuItem key={b} value={b}>{b}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sort}
            label="Sort By"
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
            <MenuItem value="rating-desc">Rating: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
