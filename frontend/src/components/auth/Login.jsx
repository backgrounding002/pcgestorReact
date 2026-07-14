import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Swal from 'sweetalert2';

const Login = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire('Campos incompletos', 'Por favor ingrese usuario y contraseña', 'warning');
      return;
    }
    setLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <i className="fas fa-laptop-code"></i>
          <h2>PCGestor</h2>
          <p className="text-muted">Sistema de Gestión de Equipos</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-user"></i></span>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoFocus
                disabled={loading}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-lock"></i></span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                required
                disabled={loading}
              />
              <span
                className="input-group-text toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-login"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span> Iniciando...</>
            ) : (
              <><i className="fas fa-sign-in-alt me-2"></i> Iniciar Sesión</>
            )}
          </button>
        </form>
        <div className="login-footer">
          <a href="#" onClick={(e) => e.preventDefault()}>¿No tienes cuenta? Regístrate</a>
          <span className="separator">|</span>
          <a href="#" onClick={(e) => e.preventDefault()}>¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;