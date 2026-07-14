import React from 'react';

const Spinner = ({ message = 'Cargando...' }) => {
  return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default Spinner;