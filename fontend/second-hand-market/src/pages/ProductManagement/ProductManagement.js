import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Pagination,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  DialogActions,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  ShoppingCart,
  Visibility,
  Delete,
  Close,
} from "@mui/icons-material";
import ProductContext from "../../contexts/ProductContext";
import CategoryContext from "../../contexts/CategoryContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination as PagSwiper } from "swiper/modules"; // Import Navigation và Pagination
import "swiper/css"; // CSS cơ bản của Swiper
import "swiper/css/navigation"; // CSS cho navigation
import "swiper/css/pagination"; // CSS cho pagination

const ProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState(["Tất cả"]);
  const [products, setProducts] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productDelete, setProductDelete] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      currentTab === 0 ||
      (currentTab === 1 && product.status === "pending") ||
      (currentTab === 2 && product.status === "approved") ||
      (currentTab === 3 && product.status === "rejected");
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "low" && product.price < 5000000) ||
      (priceFilter === "medium" &&
        product.price >= 5000000 &&
        product.price <= 10000000) ||
      (priceFilter === "high" && product.price > 10000000);
    return matchesSearch && matchesTab && matchesCategory && matchesPrice;
  });
  const fetchProducts = useCallback(async () => {
    try {
      const productsData = await ProductContext.getProducts();

      setProducts(productsData);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoriesData = await CategoryContext.getCategories();

        setCategories(categoriesData);
      } catch (err) {}
    };

    fetchCategory();

    fetchProducts();
  }, []);

  // Phân trang
  const productsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Xử lý duyệt và hủy
  const handleApproveProduct = async (slug) => {
    await ProductContext.updateProductStatus(slug, "approved");
    fetchProducts();
    setSnackbar({
      open: true,
      message: "Sản phẩm đã được cập nhật",
      severity: "success",
    });
  };

  const handleRejectProduct = async (slug) => {
    await ProductContext.updateProductStatus(slug, "rejected");
    fetchProducts();
    setSnackbar({
      open: true,
      message: "Sản phẩm đã được cập nhật",
      severity: "success",
    });
  };
  // Hàm đóng thông báo
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Xem chi tiết sản phẩm
  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setOpenDetail(true);
  };

  // Đóng dialog chi tiết
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedProduct(null);
  };

  const handleDelete = async () => {
    try {
      await ProductContext.deleteProduct(productDelete._id);
      setDeleteDialogOpen(false);
      setProducts(products.filter((p) => p._id !== productDelete._id));
      setSnackbar({
        open: true,
        message: "Sản phẩm đã được xóa",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  // Thống kê
  const stats = [
    {
      label: "Tổng sản phẩm",
      value: products.length,
      icon: ShoppingCart,
      color: "primary",
    },
    {
      label: "Chờ duyệt",
      value: products.filter((p) => p.status === "pending").length,
      icon: HourglassEmpty,
      color: "warning",
    },
    {
      label: "Đã duyệt",
      value: products.filter((p) => p.status === "approved").length,
      icon: CheckCircle,
      color: "success",
    },
    {
      label: "Đã hủy",
      value: products.filter((p) => p.status === "rejected").length,
      icon: Cancel,
      color: "error",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        Quản lý sản phẩm
      </Typography>

      {/* Thanh tìm kiếm, bộ lọc và tabs */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{ startAdornment: <Search /> }}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Danh mục"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Giá</InputLabel>
              <Select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                label="Giá"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="low">Dưới 5 triệu</MenuItem>
                <MenuItem value="medium">5 - 10 triệu</MenuItem>
                <MenuItem value="high">Trên 10 triệu</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          sx={{ mt: 2 }}
        >
          <Tab label="Tất cả" icon={<ShoppingCart />} />
          <Tab label="Chờ duyệt" icon={<HourglassEmpty />} />
          <Tab label="Đã duyệt" icon={<CheckCircle />} />
          <Tab label="Đã hủy" icon={<Cancel />} />
        </Tabs>
      </Box>

      {/* Thống kê */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card sx={{ p: 2, textAlign: "center" }}>
              <stat.icon color={stat.color} />
              <Typography variant="h6">{stat.value}</Typography>
              <Typography>{stat.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Danh sách sản phẩm */}
      <Grid container spacing={3}>
        {displayedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card
              sx={{
                height: "100%",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={product.avatar}
                  alt={product.name}
                  sx={{ objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    bgcolor:
                      product.status === "pending"
                        ? "warning.main"
                        : product.status === "approved"
                        ? "success.main"
                        : "error.main",
                    color: "white",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}
                >
                  {product.status === "pending"
                    ? "Chờ duyệt"
                    : product.status === "approved"
                    ? "Đã duyệt"
                    : "Đã hủy"}
                </Box>
              </Box>

              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    mb: 1,
                    height: "2.5rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {product.name}
                </Typography>

                <Typography
                  color="primary"
                  fontWeight="bold"
                  variant="h6"
                  sx={{ mb: 1 }}
                >
                  {new Intl.NumberFormat("vi-VN").format(product.price)}₫
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    height: "3rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {product.description}
                </Typography>
              </CardContent>

              <Divider />

              <Box sx={{ p: 2 }}>
                {product.status === "pending" ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<CheckCircle />}
                      onClick={() => handleApproveProduct(product.slug)}
                      sx={{ flex: 1 }}
                    >
                      Duyệt
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Cancel />}
                      onClick={() => handleRejectProduct(product.slug)}
                      sx={{ flex: 1 }}
                    >
                      Hủy
                    </Button>
                  </Stack>
                ) : (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ justifyContent: "center" }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetail(product)}
                      fullWidth
                      startIcon={<Visibility />}
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setDeleteDialogOpen(true);
                        setProductDelete(product);
                      }}
                      fullWidth
                      startIcon={<Delete />}
                      style={{ color: "red", borderColor: "red" }}
                    >
                      Xóa sản phẩm
                    </Button>
                  </Stack>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Phân trang */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClick={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#f5f5f5",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              component="span"
              sx={{ color: "#000000", fontWeight: 600 }}
            >
              Xác nhận xóa
            </Typography>
          </Box>
          <IconButton
            onClick={() => setDeleteDialogOpen(false)}
            size="small"
            aria-label="close"
            sx={{ color: "#000000" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#ffebee",
                color: "#f44336",
                width: 70,
                height: 70,
                mb: 2,
              }}
            >
              <Delete fontSize="large" />
            </Avatar>

            <Typography
              sx={{
                color: "#000000",
                textAlign: "center",
                fontWeight: 500,
                mb: 1,
              }}
            >
              Bạn có chắc chắn muốn xóa sản phẩm này?
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#000000",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.1rem",
                mb: 1,
              }}
            >
              "{productDelete?.name || "Không xác định"}"
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#666666",
                textAlign: "center",
              }}
            >
              Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến
              người dùng này sẽ bị xóa vĩnh viễn.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: "center", gap: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              minWidth: 100,
              color: "#000000",
              borderColor: "#cccccc",
              "&:hover": {
                borderColor: "#999999",
                bgcolor: "#f5f5f5",
              },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            startIcon={<Delete />}
            sx={{
              minWidth: 100,
              fontWeight: 500,
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog chi tiết sản phẩm */}
      {selectedProduct && (
        <Dialog
          open={openDetail}
          onClose={handleCloseDetail}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Chi tiết sản phẩm</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Swiper
                  modules={[Navigation, PagSwiper]}
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                >
                  {selectedProduct.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt={`Hình ảnh ${index + 1}`}
                        style={{ width: "100%", borderRadius: "8px" }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5">{selectedProduct.name}</Typography>
                <Typography variant="h6" color="red">
                  {new Intl.NumberFormat("vi-VN").format(selectedProduct.price)}{" "}
                  ₫
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Danh mục:</strong>{" "}
                  {
                    categories.find(
                      (cate) => cate._id === selectedProduct.categoryId
                    ).name
                  }
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Danh mục con:</strong>{" "}
                  {categories
                    .flatMap((cate) => cate.subcategories)
                    .find(
                      (subCate) => subCate._id === selectedProduct.subcategoryId
                    )?.name || "Không tìm thấy subcategory"}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Vị trí:</strong> {selectedProduct.location}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Ngày đăng:</strong> {selectedProduct.createdAt}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Mô tả:</strong> {selectedProduct.description}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Trạng thái:</strong>{" "}
                  {selectedProduct.status === "pending"
                    ? "Chờ duyệt"
                    : selectedProduct.status === "approved"
                    ? "Đã duyệt"
                    : "Đã hủy"}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductManagement;
