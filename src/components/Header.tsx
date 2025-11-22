// src/components/Header.tsx
import { Link, useNavigate } from "react-router-dom";
import { USER_INFO_KEY } from "../api/client";
import type { UserInfo } from "../api/auth";
import { logout } from "../api/auth";

const Header = () => {
  const navigate = useNavigate();

  const userStr =
    typeof window !== "undefined" ? localStorage.getItem(USER_INFO_KEY) : null;
  const user: UserInfo | null = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full border-b mb-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
        <Link to="/" className="font-bold text-lg">
          🎬 Cinema Booking
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span>Xin chào, <strong>{user.hoTen}</strong></span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
