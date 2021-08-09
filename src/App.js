import React, { useEffect, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { auth } from "./firebase";
import { currentUser } from './functions/auth';
import { useDispatch } from "react-redux";
import { LOGGED_IN_USER } from './reducers/userReducer';
import { lazily } from "react-lazily";
import { LoadingOutlined } from "@ant-design/icons";
const { Home } = lazily(() => import('./pages/Home'));
const { Login } = lazily(() => import('./pages/auth/Login'));
const { Register } = lazily(() => import('./pages/auth/Register'));
const { Header } = lazily(() => import('./components/nav/Header'));
const { RegisterComplete } = lazily(() => import('./pages/auth/RegisterComplate'));
const { ForgotPassword } = lazily(() => import('./pages/auth/ForgotPassword'));
const { History } = lazily(() => import('./pages/user/History'));
const { UserRoute } = lazily(() => import('./components/routes/UserRoute'));
const { Password } = lazily(() => import('./pages/user/Password'));
const { Wishlist } = lazily(() => import('./pages/user/Wishlist'));
const { AdminDashboard } = lazily(() => import('./pages/admin/AdminDashboard'));
const { AdminRoute } = lazily(() => import('./components/routes/AdminRoute'));
const { CategoryCreate } = lazily(() => import('./pages/admin/category/CategoryCreate'));
const { CategoryUpdate } = lazily(() => import('./pages/admin/category/CategoryUpdate'));
const { SubCreate } = lazily(() => import('./pages/admin/sub/SubCreate'));
const { SubUpdate } = lazily(() => import('./pages/admin/sub/SubUpdate'));
const { ProductCreate } = lazily(() => import('./pages/product/ProductCreate'));
const { AllProducts } = lazily(() => import('./pages/product/AllProducts'));
const { ProductUpdate } = lazily(() => import('./pages/product/ProductUpdate'));
const { Product } = lazily(() => import('./pages/Product'));
const { CategoryHome } = lazily(() => import('./pages/category/CategoryHome'));
const { SubHome } = lazily(() => import('./pages/sub/SubHome'));
const { Shop } = lazily(() => import('./pages/Shop'));
const { Cart } = lazily(() => import('./pages/Cart'));
const { SideDrawer } = lazily(() => import('./components/drawer/SideDrawer'));
const { Checkout } = lazily(() => import('./pages/Checkout'));
const { CreateCouponPage } = lazily(() => import('./pages/admin/coupon/CreateCoupon'));
const { Payment } = lazily(() => import('./pages/Payment'));

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult()

        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: LOGGED_IN_USER,
              payload: {
                name: res.data.name,
                role: res.data.role,
                email: res.data.email,
                token: idTokenResult.token,
                _id: res.data._id,
              }
            })

          })
          .catch(err => console.log(err));
      }
    })

    return () => unsubscribe();

  }, [dispatch]);

  return (
    <Suspense fallback={
      <div className="col text-center p-5">
        _ React Redux EC<LoadingOutlined />MMERCE _
      </div>
    }>
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/register/complete" element={<RegisterComplete />} />
        <Route path="/forgot/password" element={<ForgotPassword />} />
        <UserRoute path="/user/history" element={<History />} />
        <UserRoute path="/user/password" element={<Password />} />
        <UserRoute path="/user/wishlist" element={<Wishlist />} />
        <AdminRoute path="/admin/dashboard" element={<AdminDashboard />} />
        <AdminRoute path="/admin/category" element={<CategoryCreate />} />
        <AdminRoute path="/admin/category/:slug" element={<CategoryUpdate />} />
        <AdminRoute path="/admin/sub" element={<SubCreate />} />
        <AdminRoute path="/admin/sub/:slug" element={<SubUpdate />} />
        <AdminRoute path="/admin/product" element={<ProductCreate />} />
        <AdminRoute path="/admin/products" element={<AllProducts />} />
        <AdminRoute path="/admin/product/:slug" element={<ProductUpdate />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/category/:slug" element={<CategoryHome />} />
        <Route path="/sub/:slug" element={<SubHome />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <AdminRoute path="/admin/coupon" element={<CreateCouponPage />} />
        <UserRoute path="/payment" element={<Payment />} />
      </Routes>
    </Suspense>
  );
}

export default App;
