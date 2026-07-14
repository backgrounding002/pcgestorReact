import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: 'fa-tachometer-alt', label: 'Dashboard' },
    { path: '/equipos', icon: 'fa-laptop', label: 'Equipos' },
    { path: '/asignaciones', icon: 'fa-exchange-alt', label: 'Asignaciones' },
    { path: '/mantenimientos', icon: 'fa-tools', label: 'Mantenimientos' },
    { path: '/usuarios', icon: 'fa-users', label: 'Usuarios' },
    { path: '/ubicaciones', icon: 'fa-map-marker-alt', label: 'Ubicaciones' },
    { path: '/reportes', icon: 'fa-chart-bar', label: 'Reportes' },
  ];

  return (
    <div id="layoutSidenav_nav">
      <nav className="sb-sidenav accordion sb-sidenav-dark">
        <div className="sb-sidenav-menu">
          <div className="nav">
            <div className="sb-sidenav-menu-heading">Módulos</div>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <div className="sb-nav-link-icon">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="sb-sidenav-footer">
          <small>PCGestor v1.0</small>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;