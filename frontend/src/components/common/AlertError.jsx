import React from 'react';

const AlertError = ({ message }) => {
  return (
    <div className="alert alert-danger text-center" role="alert">
      <i className="fas fa-exclamation-circle me-2"></i>
      {message || 'Ha ocurrido un error'}
    </div>
  );
};

export default AlertError;