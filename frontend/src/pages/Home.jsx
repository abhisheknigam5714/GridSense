import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OutageFeed from '../components/OutageFeed';
import PredictionBadge from '../components/PredictionBadge';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return (
      <div className="home-page">
        <div className="hero-section py-5">
          <div className="container text-center">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <h1 className="display-4 text-light fw-bold mb-4">
                  <i className="fas fa-bolt text-warning me-3"></i>
                  Smart Power Outage Tracker
                </h1>
                <p className="lead text-muted mb-4">
                  Stay informed about power outages in your area. Report outages,
                  receive real-time alerts, and track restoration progress.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/register" className="btn btn-warning btn-lg">
                    <i className="fas fa-user-plus me-2"></i>
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="features-section py-5 bg-dark-darker">
          <div className="container">
            <h2 className="text-center text-light mb-5">Key Features</h2>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card bg-dark-custom border-secondary h-100">
                  <div className="card-body text-center p-4">
                    <div className="feature-icon bg-warning-subtle rounded-circle p-3 d-inline-block mb-3">
                      <i className="fas fa-map-marked-alt text-warning fa-2x"></i>
                    </div>
                    <h5 className="text-light">Real-time Tracking</h5>
                    <p className="text-muted">
                      View active outages on an interactive map with real-time updates
                      and status changes.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-dark-custom border-secondary h-100">
                  <div className="card-body text-center p-4">
                    <div className="feature-icon bg-danger-subtle rounded-circle p-3 d-inline-block mb-3">
                      <i className="fas fa-bell text-danger fa-2x"></i>
                    </div>
                    <h5 className="text-light">Instant Alerts</h5>
                    <p className="text-muted">
                      Receive immediate notifications when outages are reported or
                      resolved in your area.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-dark-custom border-secondary h-100">
                  <div className="card-body text-center p-4">
                    <div className="feature-icon bg-success-subtle rounded-circle p-3 d-inline-block mb-3">
                      <i className="fas fa-chart-line text-success fa-2x"></i>
                    </div>
                    <h5 className="text-light">Smart Predictions</h5>
                    <p className="text-muted">
                      AI-powered risk predictions based on historical outage data
                      for your area.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="how-it-works py-5">
          <div className="container">
            <h2 className="text-center text-light mb-5">How It Works</h2>
            <div className="row g-4">
              <div className="col-md-3">
                <div className="text-center">
                  <div className="step-number bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>
                    1
                  </div>
                  <h6 className="text-light">Register</h6>
                  <p className="text-muted small">Create an account with your location</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="step-number bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>
                    2
                  </div>
                  <h6 className="text-light">Monitor</h6>
                  <p className="text-muted small">Track outages in your area</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="step-number bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>
                    3
                  </div>
                  <h6 className="text-light">Report</h6>
                  <p className="text-muted small">Report outages you experience</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="step-number bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>
                    4
                  </div>
                  <h6 className="text-light">Stay Updated</h6>
                  <p className="text-muted small">Get real-time notifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page-authenticated py-4">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <div className="welcome-banner bg-dark-custom border-secondary rounded p-4 mb-4">
              <h4 className="text-light mb-1">
                <i className="fas fa-user-circle text-warning me-2"></i>
                Welcome back, {user?.name}!
              </h4>
              <p className="text-muted mb-0">
                Stay updated with the latest outage information in your area
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 mb-4">
            <PredictionBadge pincode={user?.pincode} />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-light mb-0">
                <i className="fas fa-map-marker-alt text-danger me-2"></i>
                Outages in Your Area
              </h5>
              <Link to="/map" className="btn btn-outline-warning btn-sm">
                <i className="fas fa-map me-1"></i> View Map
              </Link>
            </div>
            <OutageFeed pincode={user?.pincode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;