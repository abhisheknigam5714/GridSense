import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <>
      <style>{`
        .navbar-custom {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          border-bottom: 1px solid rgba(229, 57, 53, 0.3);
          padding: 0.75rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }
        .brand-logo {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff !important;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .brand-logo .bolt {
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 1.4rem;
        }
        .nav-link-custom {
          color: rgba(255,255,255,0.8) !important;
          text-decoration: none;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-link-custom:hover {
          background: rgba(255,255,255,0.1);
          color: #fff !important;
        }
        .nav-link-admin {
          color: #f59e0b !important;
        }
        .nav-link-admin:hover {
          background: rgba(245,158,11,0.15) !important;
        }
        .btn-logout {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #fff;
          border: none;
          padding: 0.4rem 1rem;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .btn-logout:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239,68,68,0.4);
        }
        .user-chip {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          padding: 0.3rem 0.75rem;
          color: #fff;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .admin-badge {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #1a1a1a;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 10px;
        }
        .btn-login {
          background: transparent;
          color: rgba(255,255,255,0.85);
          border: 1px solid rgba(255,255,255,0.3);
          padding: 0.4rem 1rem;
          border-radius: 8px;
          font-size: 0.88rem;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-login:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.5);
          color: #fff;
        }
        .btn-register {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          border: none;
          padding: 0.4rem 1rem;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-register:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-1px);
        }
        .hamburger {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 6px;
          padding: 4px 8px;
          cursor: pointer;
          display: none;
        }
        .hamburger span {
          display: block;
          width: 20px;
          height: 2px;
          background: #fff;
          margin: 4px 0;
          border-radius: 2px;
          transition: all 0.2s;
        }
        @media (max-width: 768px) {
          .hamburger { display: block; }
          .nav-menu {
            display: ${`none`};
            flex-direction: column;
            width: 100%;
            padding: 0.5rem 0;
            gap: 4px;
          }
          .nav-menu.open { display: flex; }
          .nav-right { flex-direction: column; align-items: flex-start !important; gap: 8px !important; }
        }
      `}</style>

      <nav className="navbar-custom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <Link
              to="/"
              className="brand-logo"
              onClick={() => setIsOpen(false)}
            >
              <span className="bolt">⚡</span>
              OutageTracker
            </Link>

            <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div
              className={`d-flex align-items-center gap-2 nav-menu ${isOpen ? "open" : ""}`}
              style={{ flexDirection: "row", flexWrap: "wrap" }}
            >
              <Link
                to="/"
                className="nav-link-custom"
                onClick={() => setIsOpen(false)}
              >
                🏠 Home
              </Link>

              {user && (
                <>
                  <Link
                    to="/map"
                    className="nav-link-custom"
                    onClick={() => setIsOpen(false)}
                  >
                    🗺️ Map View
                  </Link>
                  <Link
                    to="/report"
                    className="nav-link-custom"
                    onClick={() => setIsOpen(false)}
                  >
                    ⚡ Report Outage
                  </Link>
                </>
              )}

              {user && isAdmin() && (
                <Link
                  to="/admin"
                  className="nav-link-custom nav-link-admin"
                  onClick={() => setIsOpen(false)}
                >
                  ⚙️ Admin Dashboard
                </Link>
              )}
            </div>

            <div className="d-flex align-items-center gap-2 nav-right">
              {user ? (
                <>
                  <div className="user-chip">
                    👤 {user.name}
                    {isAdmin() && <span className="admin-badge">ADMIN</span>}
                  </div>
                  <button className="btn-logout" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn-login"
                    onClick={() => setIsOpen(false)}
                  >
                    🔑 Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-register"
                    onClick={() => setIsOpen(false)}
                  >
                    ✨ Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
