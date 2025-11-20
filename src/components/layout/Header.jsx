import useAuth from "../../hooks/useAuth";
import { LogOut } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-primary-600">Amalitica</h1>
          {user && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-3">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
