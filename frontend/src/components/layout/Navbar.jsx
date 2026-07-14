import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">PCGestor</a>
        <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle">
          <i className="fas fa-bars"></i>
        </button>
        <div className="ms-auto">
          <span className="text-white me-3" id="userName">
            {user?.nombre || 'Usuario'}
          </span>
          <span className="badge bg-primary" id="userRol">
            {user?.rol || 'Usuario'}
          </span>
          <button className="btn btn-outline-light btn-sm ms-3" onClick={logout}>
            <i className="fas fa-sign-out-alt"></i> Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;