import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Table,
} from "react-bootstrap";
import "./Product.css";
import ProductContext from "../DBContext/ProductContext";
import CategoryContext from "../DBContext/CategoryContext";

export const Product = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productID = queryParams.get("productID");

  const products = [
    {
      id: 1,
      image:
        "https://static.oreka.vn/250-250_8efd61a6-25e2-490f-977f-63bec8c95ca2",
      title: "(Thanh lý chính hãng) Máy sưởi điện 3 bóng Halogen",
      price: "399,000đ",
      location: "Hà Nội",
    },
    {
      id: 2,
      image:
        "https://static.oreka.vn/250-250_8efd61a6-25e2-490f-977f-63bec8c95ca2",
      title: "(Thanh lý chính hãng) Kính UNIQLO chống tia UV nội địa Nhật",
      price: "119,000đ",
      location: "Hà Nội",
    },
    {
      id: 3,
      image:
        "https://static.oreka.vn/250-250_8efd61a6-25e2-490f-977f-63bec8c95ca2",
      title: "(Thanh lý chính hãng) Máy rửa mặt Foreo Luna Mini 2",
      price: "649,000đ",
      location: "Hà Nội",
    },
    {
      id: 4,
      image:
        "https://static.oreka.vn/250-250_8efd61a6-25e2-490f-977f-63bec8c95ca2",
      title: "(Thanh lý chính hãng) Vòng tay trang sức bạc s925",
      price: "286,000đ",
      location: "Hà Nội",
    },
  ];

  const [product, setProduct] = useState({});
  const [mainImage, setMainImage] = useState(product?.images?.[0]);
  const [quantity, setQuantity] = useState(1); // State cho số lượng sản phẩm
  const [category, setCategory] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await ProductContext.getProduct(productID);
        setProduct(product);
        setMainImage(product.images?.[0]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [productID]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const category = await CategoryContext.getCategory(product.categoryId);
        setCategory(category);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategory();
  }, [product]); // Theo dõi sự thay đổi của product

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div>
      <Header />
      <div className="bg-body-secondary">
        <Container className="pt-4">
          <Row className="mb-3">
            <Col>
              <small className="text-muted">
                Oreka Đồ cũ Sách Sách Tôi của tương lai - Còn mới - Giá gốc 180k
              </small>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card style={{ transform: "none", boxShadow: "none" }}>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <img
                        src={mainImage}
                        className="img-fluid"
                        alt="Product"
                        height="500px"
                        width="600px"
                        style={{ objectFit: "contain" }}
                      />
                      <div className="d-flex mt-2">
                        {product?.images?.map((image, index) => (
                          <img
                            key={index}
                            src={image || "/api/placeholder/50/70"}
                            alt={`Thumbnail ${index + 1}`}
                            className="me-2"
                            style={{
                              width: "70px",
                              height: "90px",
                              objectFit: "cover",
                              cursor: "pointer",
                              border:
                                mainImage === image
                                  ? "2px solid orange"
                                  : "none",
                            }}
                            onClick={() => handleThumbnailClick(image)}
                          />
                        ))}
                      </div>
                    </Col>
                    <Col md={6}>
                      <p className="text-danger">
                        Đã đăng lúc {product?.createdAt}
                      </p>
                      <h4>{product?.name}</h4>
                      <h3 className="text-danger my-4">{product.price}đ</h3>
                      <p>Vận chuyển: Từ {product.location} tới</p>
                      <h5>Miễn phí vận chuyển</h5>
                      <Form.Group className="my-4">
                        <Form.Label>Số lượng:</Form.Label>
                        <div className="d-flex align-items-center ms-5">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(quantity - 1)}
                          >
                            -
                          </Button>
                          <Form.Control
                            type="text"
                            value={quantity}
                            onChange={(e) =>
                              handleQuantityChange(parseInt(e.target.value))
                            }
                            className="mx-1 text-center"
                            style={{ width: "50px" }}
                          />
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(quantity + 1)}
                          >
                            +
                          </Button>
                          <span className="ms-3 fst-italic">
                            {product.stock} sản phẩm có sẵn
                          </span>
                        </div>
                      </Form.Group>
                      <Row className="me-5 mt-5">
                        <Col>
                          {" "}
                          <Button className="btn btn-outline-orange me-2 w-75 p-3 float-end shadow btn-press-effect">
                            Thêm vào giỏ hàng
                          </Button>
                        </Col>
                        <Col>
                          {" "}
                          <Button className="forSale border-0 w-75 p-3 gradient-custom-2 btn-press-effect shadow">
                            Mua ngay
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="my-4">
            <Col md={9}>
              <Card
                className="mb-4"
                style={{ transform: "none", boxShadow: "none" }}
              >
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={2} className="text-center">
                      <img
                        src="/images/logo.png"
                        alt="Shop Logo"
                        className="img-fluid rounded-circle"
                        style={{ width: "80px", height: "80px" }}
                      />
                    </Col>
                    <Col md={10}>
                      <h5>ReU's Town - Xưởng Ký ...</h5>
                      <p className="mb-1">
                        <Badge bg="success">Đã xác minh</Badge> 4.67 (3 đánh
                        giá) - 4 sản phẩm - 3 đã bán
                      </p>
                      <Button variant="outline-primary" size="sm">
                        Xem shop
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <div className="bg-white p-4 rounded shadow-sm">
                <h5 className="mb-3">Thông tin nổi bật</h5>
                <Table className="mb-0" hover>
                  <tbody>
                    <tr>
                      <td className="text-muted" style={{ width: "30%" }}>
                        Danh mục
                      </td>
                      <td>
                        <a href="#" className="text-primary">
                          Oreka
                        </a>{" "}
                        &gt;{" "}
                        <a href="#" className="text-primary">
                          Đồ cũ
                        </a>{" "}
                        &gt;{" "}
                        <a href="#" className="text-primary">
                          {category?.name}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted">Phí vận chuyển</td>
                      <td>
                        <Badge bg="info" className="text-white">
                          Freeship
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted">Tình trạng</td>
                      <td>Mới</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Thương hiệu</td>
                      <td>{product.brand}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Màu sắc</td>
                      <td>{product.color}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              <Card
                className="my-4"
                style={{ transform: "none", boxShadow: "none" }}
              >
                <Card.Body>
                  <h5>Mô tả sản phẩm</h5>
                  <p>{product.description}</p>
                </Card.Body>
              </Card>

              <Card
                className="my-4"
                style={{ transform: "none", boxShadow: "none" }}
              >
                <Card.Body>
                  <h5>Hỏi đáp</h5>
                  <p>
                    Hiện tại chưa có câu hỏi nào. Cần thêm thông tin hãy gửi câu
                    hỏi cho người bán.
                  </p>
                  <Button variant="outline-danger">+ Hỏi ngay</Button>
                </Card.Body>
              </Card>

              <Card style={{ transform: "none", boxShadow: "none" }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Sản phẩm khác của shop</h5>
                    <Button variant="link" href="#">
                      Xem tất cả
                    </Button>
                  </div>
                  <Row>
                    {products.map((product) => (
                      <Col key={product.id} md={3} className="mb-4">
                        <Card className="h-100">
                          <Card.Img
                            variant="top"
                            src={product.image}
                            alt={product.title}
                            style={{ height: "240px", objectFit: "cover" }}
                          />
                          <Card.Body>
                            <Badge bg="success" className="mb-2">
                              Freeship
                            </Badge>
                            <Card.Title style={{ fontSize: "14px" }}>
                              {product.title}
                            </Card.Title>
                            <Card.Text>
                              <strong>{product.price}</strong>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col md={"3"}>
              {products.map((product) => (
                <div key={product.id} className="mb-4">
                  <Card className="h-100">
                    <Card.Img
                      variant="top"
                      src={product.image}
                      alt={product.title}
                      style={{ height: "240px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Badge bg="success" className="mb-2">
                        Freeship
                      </Badge>
                      <Card.Title style={{ fontSize: "14px" }}>
                        {product.title}
                      </Card.Title>
                      <Card.Text>
                        <strong>{product.price}</strong>
                      </Card.Text>
                      <Card.Text>
                        <small>{product.location}</small>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Product;
