import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Layout from "../layout/Layout";

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // O un spinner
  }

  return isAuthenticated ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
