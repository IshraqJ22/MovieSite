import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/Navbar.css"

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Check if token exists
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT from localStorage
    setIsLoggedIn(false);
    alert("You have been logged out.");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Movie Media</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/favourites" className="nav-link">
          Favourites
        </Link>
        {isLoggedIn ? (
          <button className="nav-link" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login" className="nav-link">
            Login
          </Link>
        )}
        {!isLoggedIn && (
          <Link to="/register" className="nav-link">
            Register
          </Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
