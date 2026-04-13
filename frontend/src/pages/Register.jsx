import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.pincode.length !== 6) {
      setError('Pincode must be 6 digits');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="register-page min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card bg-dark-custom border-secondary shadow-lg">
              <div className="card-header bg-dark-custom border-secondary text-center py-4">
                <h3 className="text-light mb-1">
                  <i className="fas fa-bolt text-warning me-2"></i>
                  OutageTracker
                </h3>
                <p className="text-muted mb-0">Create your account</p>
              </div>
              <div className="card-body p-4">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label text-light">
                      Full Name
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-muted">
                        <i className="fas fa-user"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label text-light">
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-muted">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control bg-dark text-light border-secondary"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="pincode" className="form-label text-light">
                      Area Pincode
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-muted">
                        <i className="fas fa-map-marker-alt"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="Enter 6-digit pincode"
                        pattern="[0-9]{6}"
                        maxLength="6"
                        required
                      />
                    </div>
                    <div className="form-text text-muted">
                      We'll use this to show outages in your area
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label text-light">
                        Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-dark border-secondary text-muted">
                          <i className="fas fa-lock"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control bg-dark text-light border-secondary"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create password"
                          minLength="6"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmPassword" className="form-label text-light">
                        Confirm Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-dark border-secondary text-muted">
                          <i className="fas fa-lock"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control bg-dark text-light border-secondary"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm password"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-warning w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-warning text-decoration-none">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;