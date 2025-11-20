import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
// import Register from "./pages/Register";
import Dashboard from './pages/Dashboard'; // Crear este archivo
import ConsultationList from './pages/consultations/ConsultationList';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}

          {/* Rutas Protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/consultations' element={<ConsultationList />} />
            {/* Aquí irán las demás rutas protegidas */}
          </Route>

          <Route path='*' element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
