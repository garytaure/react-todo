import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import DashboardLayout from "./components/DashboardLayout";
import PublicLayout from "./components/PublicLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      }
    ]
  },
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
])

export default router;