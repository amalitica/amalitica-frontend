import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  User,
  FileText,
  ShoppingCart,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard />, href: "/dashboard" },
    { name: "Clientes", icon: <Users />, href: "/customers" },
    { name: "Usuarios", icon: <User />, href: "/users" },
    { name: "Consultas", icon: <FileText />, href: "/consultations" },
    { name: "Pedidos", icon: <ShoppingCart />, href: "/orders" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
