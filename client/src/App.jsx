import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./app.scss";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ScrollToTop from "./components/scrollTop/ScrollTop";
import Add from "./pages/add/Add";
import AdminDashboard from "./pages/admin/adminDashboard";
import ErrorPage from "./pages/error/Error";
import Gig from "./pages/gig/Gig";
import Gigs from "./pages/gigs/Gigs";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Message from "./pages/message/Message";
import Messages from "./pages/messages/Messages";
import MyGigs from "./pages/myGigs/MyGigs";
import Orders from "./pages/orders/Orders";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import SelectRole from "./pages/selectRole/SelectRole";
import React from "react";

function App() {
  const Layout = () => {
    return (
      <div className="app">
        <Navbar />
        <ScrollToTop />
        <Outlet />
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/",
          element: <Profile />,
        },
        {
          path: "/gigs",
          element: <Gigs />,
        },
        {
          path: "/myGigs",
          element: (
            <ProtectedRoute requiredRole={["seller", "admin"]}>
              <MyGigs />
            </ProtectedRoute>
          ),
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/add",
          element: (
            <ProtectedRoute requiredRole={["seller", "admin"]}>
              <Add />
            </ProtectedRoute>
          ),
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/admin",
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          ), 
        },
        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/selectRole",
      element: <SelectRole />,
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
