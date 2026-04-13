import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReportForm from '../components/ReportForm';
import PredictionBadge from '../components/PredictionBadge';
import { useAuth } from '../context/AuthContext';

const Report = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="report-page py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="mb-4">
              <h4 className="text-light mb-1">
                <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                Report Power Outage
              </h4>
              <p className="text-muted">
                Help your community by reporting power outages in your area
              </p>
            </div>

            {user?.pincode && (
              <div className="mb-4">
                <PredictionBadge pincode={user.pincode} />
              </div>
            )}

            <ReportForm onSubmit={handleSubmit} onCancel={handleCancel} />

            <div className="mt-4">
              <div className="card bg-dark-custom border-secondary">
                <div className="card-body">
                  <h6 className="text-light mb-3">
                    <i className="fas fa-info-circle text-info me-2"></i>
                    Reporting Guidelines
                  </h6>
                  <ul className="text-muted small mb-0">
                    <li>Only report outages that you are currently experiencing</li>
                    <li>Provide accurate pincode and locality information</li>
                    <li>Include relevant details in the description</li>
                    <li>Avoid duplicate reports for the same outage</li>
                    <li>Your report will be reviewed and confirmed by administrators</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;