import React from 'react';

const Footer = () => {
  return (
    <footer className="py-4 bg-light mt-auto">
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center justify-content-between small">
          <div className="text-muted">Copyright &copy; PCGestor 2026</div>
          <div>
            <a href="#">Política de Privacidad</a>
            &middot;
            <a href="#">Términos y Condiciones</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;