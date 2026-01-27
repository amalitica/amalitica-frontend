// src/App.jsx
/**
 * Componente principal de la aplicación Amalitica.
 *
 * Define las rutas y la estructura general de la aplicación.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Clientes/Pacientes
import CustomersList from './pages/customers/CustomersList';
import CreateCustomer from './pages/customers/CreateCustomer';
import EditCustomer from './pages/customers/EditCustomer';
import CustomerDetails from './pages/customers/CustomerDetails';

// Sucursales
import BranchesList from './pages/branches/BranchesList';
import CreateBranch from './pages/branches/CreateBranch';
import EditBranch from './pages/branches/EditBranch';

// Usuarios
import UsersList from './pages/users/UsersList';
import CreateUser from './pages/users/CreateUser';
import EditUser from './pages/users/EditUser';

// Consultas
import ConsultationsList from './pages/consultations/ConsultationsList';
import CreateConsultation from './pages/consultations/CreateConsultation';
import EditConsultation from './pages/consultations/EditConsultation';
import ConsultationDetails from './pages/consultations/ConsultationDetails';

// Inventario (módulo completo)
import {
  InventoryDashboard,
  SuppliersList,
  SupplierForm,
  BrandsList,
  BrandForm,
  ProductsList,
  ProductDetail,
  ProductForm,
  ProductsAndInventory,
} from './pages/inventory';

// Compliance (LFPDPPP)
import { PrivacyNotice } from './pages/compliance';

// Componentes comunes
import PrivateRoute from './components/common/PrivateRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Toaster } from './components/ui/toaster';
import useFavicon from './hooks/useFavicon';
import logoAmalitica from './assets/images/amalitica_logo.png';

/**
 * Componente que maneja la lógica del favicon.
 */
const FaviconManager = () => {
  const faviconHref = logoAmalitica;
  useFavicon(faviconHref);
  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <FaviconManager />
          <Routes>
            {/* Rutas Públicas */}
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/aviso-de-privacidad' element={<PrivacyNotice />} />

            {/* Rutas Protegidas */}
            <Route element={<PrivateRoute />}>
              {/* Dashboard principal */}
              <Route path='/dashboard' element={<Dashboard />} />

              {/* Consultas */}
              <Route path='/consultations' element={<ConsultationsList />} />
              <Route path='/consultations/new' element={<CreateConsultation />} />
              <Route path='/consultations/:id/edit' element={<EditConsultation />} />
              <Route path='/consultations/:id' element={<ConsultationDetails />} />

              {/* Clientes/Pacientes */}
              <Route path='/customers' element={<CustomersList />} />
              <Route path='/customers/new' element={<CreateCustomer />} />
              <Route path='/customers/:id/edit' element={<EditCustomer />} />
              <Route path='/customers/:id' element={<CustomerDetails />} />

              {/* Sucursales */}
              <Route path='/branches' element={<BranchesList />} />
              <Route path='/branches/new' element={<CreateBranch />} />
              <Route path='/branches/:id/edit' element={<EditBranch />} />

              {/* Usuarios */}
              <Route path='/users' element={<UsersList />} />
              <Route path='/users/new' element={<CreateUser />} />
              <Route path='/users/:id/edit' element={<EditUser />} />

              {/* ============================================================ */}
              {/* INVENTARIO (módulo completo) */}
              {/* ============================================================ */}
              
              {/* Dashboard de Inventario */}
              <Route path='/inventory' element={<InventoryDashboard />} />

              {/* Proveedores */}
              <Route path='/inventory/suppliers' element={<SuppliersList />} />
              <Route path='/inventory/suppliers/new' element={<SupplierForm />} />
              <Route path='/inventory/suppliers/:id/edit' element={<SupplierForm />} />

              {/* Marcas */}
              <Route path='/inventory/brands' element={<BrandsList />} />
              <Route path='/inventory/brands/new' element={<BrandForm />} />
              <Route path='/inventory/brands/:id/edit' element={<BrandForm />} />

              {/* Productos y Stock (vista unificada) */}
              <Route path='/inventory/products' element={<ProductsAndInventory />} />
              <Route path='/inventory/products/new' element={<ProductForm />} />
              <Route path='/inventory/products/:id/edit' element={<ProductForm />} />
              <Route path='/inventory/products/:id' element={<ProductDetail />} />

              {/* Rutas legacy (mantener por compatibilidad) */}
              <Route path='/products' element={<ProductsList />} />
              <Route path='/products/new' element={<ProductForm />} />
              <Route path='/products/:id/edit' element={<ProductForm />} />
              <Route path='/products/:id' element={<ProductDetail />} />
              <Route path='/suppliers' element={<SuppliersList />} />
              <Route path='/suppliers/new' element={<SupplierForm />} />
              <Route path='/suppliers/:id/edit' element={<SupplierForm />} />
              <Route path='/brands' element={<BrandsList />} />
              <Route path='/brands/new' element={<BrandForm />} />
              <Route path='/brands/:id/edit' element={<BrandForm />} />
            </Route>

            {/* Ruta por defecto */}
            <Route path='*' element={<Login />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
