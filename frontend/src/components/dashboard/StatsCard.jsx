import React from 'react';

const StatsCard = ({ title, value, icon, color = 'primary' }) => {
  return (
    <div className="col-xl-3 col-md-6 mb-4">
      <div className={`card card-stats bg-${color} text-white shadow`}>
        <div className="card-body">
          <div className="row">
            <div className="col">
              <div className="text-uppercase small">{title}</div>
              <h2 className="mb-0">{value}</h2>
            </div>
            <div className="col-auto">
              <i className={`fas ${icon} fa-2x`}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;