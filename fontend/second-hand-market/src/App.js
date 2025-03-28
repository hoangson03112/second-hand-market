import * as React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import ProductList from "./components/Product/ProductList";
import { Product } from "./components/Product/Product";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Layout from "./components/Layout/Layout";
import Cart from "./pages/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import MyOrder from "./pages/Order/MyOrder";
import PostProduct from "./pages/PostProduct/PostProduct";
import LayoutAdmin from "./components/LayoutAdmin/LayoutAdmin";
import DashBoard from "./pages/DashBoard/DashBoard";
import CategoryManagement from "./pages/CategoryManagement/CategoryManagement";
import ProductManagement from "./pages/ProductManagement/ProductManagement";
import UserProfile from "./pages/UserProfile/UserProfile";
import UserManagement from "./pages/ManageUser/ManageUser";
import OrderManage from "./pages/OrderManage/OrderManage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/eco-market/admin"
          element={
            <LayoutAdmin>
              <DashBoard />
            </LayoutAdmin>
          }
        />
        <Route
          path="/eco-market/admin/products"
          element={
            <LayoutAdmin>
              <ProductManagement />
            </LayoutAdmin>
          }
        />
        <Route
          path="/eco-market/admin/categories"
          element={
            <LayoutAdmin>
              <CategoryManagement />
            </LayoutAdmin>
          }
        />

        <Route path="/" element={<Navigate to="/eco-market/home" />} />
        <Route
          path="/eco-market/home"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/eco-market"
          element={
            <Layout>
              <ProductList />
            </Layout>
          }
        />
        <Route
          path="/eco-market/product"
          element={
            <Layout>
              <Product />
            </Layout>
          }
        />
        <Route
          path="/eco-market/user/profile"
          element={
            <Layout>
              <UserProfile />
            </Layout>
          }
        />
        <Route
          path="/eco-market/admin/customers"
          element={
            <LayoutAdmin>
              <UserManagement />
            </LayoutAdmin>
          }
        />
               <Route
          path="/eco-market/admin/orders"
          element={
            <LayoutAdmin>
              <OrderManage />
            </LayoutAdmin>
          }
        />
        <Route
          path="/eco-market/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        ></Route>
        <Route
          path="/eco-market/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        ></Route>
        <Route
          path="/eco-market/my-cart"
          element={
            <Layout>
              <Cart />
            </Layout>
          }
        ></Route>
        <Route
          path="/eco-market/checkout"
          element={
            <Layout>
              <Checkout />
            </Layout>
          }
        ></Route>
        <Route element={<Layout></Layout>}></Route>
        <Route
          path="/eco-market/customer/orders"
          element={
            <Layout>
              <MyOrder />
            </Layout>
          }
        ></Route>
        <Route
          path="/eco-market/seller/products/new"
          element={
            <Layout>
              <PostProduct />
            </Layout>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
