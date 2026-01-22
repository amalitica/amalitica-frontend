import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // Crear este archivo
import CustomersList from './pages/customers/CustomersList';
import CreateCustomer from './pages/customers/CreateCustomer';
import EditCustomer from './pages/customers/EditCustomer';
import CustomerDetails from './pages/customers/CustomerDetails';
import BranchesList from './pages/branches/BranchesList';
import CreateBranch from './pages/branches/CreateBranch';
import EditBranch from './pages/branches/EditBranch';
import UsersList from './pages/users/UsersList';
import CreateUser from './pages/users/CreateUser';
import EditUser from './pages/users/EditUser';
// import useAuth from './hooks/useAuth';
import ConsultationsList from './pages/consultations/ConsultationsList';
import CreateConsultation from './pages/consultations/CreateConsultation';
import EditConsultation from './pages/consultations/EditConsultation';
import ConsultationDetails from './pages/consultations/ConsultationDetails';
import { ProductsList, ProductForm, ProductDetail } from './pages/products';

// Compliance (LFPDPPP)
import { PrivacyNotice } from './pages/compliance';

import PrivateRoute from './components/common/PrivateRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import useFavicon from './hooks/useFavicon';
import logoAmalitica from './assets/images/amalitica_logo.png';

// ✅ NUEVO: Componente que maneja la lógica del favicon
const FaviconManager = () => {
  // const { isAuthenticated } = useAuth();
  // const location = useLocation();

  // Determinar qué favicon usar
  // Si el usuario está autenticado Y no está en la página de login, usa el logo del tenant.
  // En cualquier otro caso (no autenticado, o en la página de login), usa el logo de Amalitica.
  const faviconHref = logoAmalitica;

  // Usar el hook para actualizar el favicon
  useFavicon(faviconHref);

  // Este componente no renderiza nada, solo ejecuta la lógica
  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <FaviconManager />
          <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          
          {/* Rutas Públicas - Compliance */}
          <Route path='/aviso-de-privacidad' element={<PrivacyNotice />} />

          {/* Rutas Protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/consultations' element={<ConsultationsList />} />
            <Route path='/consultations/new' element={<CreateConsultation />} />
            <Route
              path='/consultations/:id/edit'
              element={<EditConsultation />}
            />
            <Route
              path='/consultations/:id'
              element={<ConsultationDetails />}
            />
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

            {/* Productos */}
            <Route path='/products' element={<ProductsList />} />
            <Route path='/products/new' element={<ProductForm />} />
            <Route path='/products/:id/edit' element={<ProductForm />} />
            <Route path='/products/:id' element={<ProductDetail />} />

            {/* Aquí irán las demás rutas protegidas */}
          </Route>

          <Route path='*' element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
