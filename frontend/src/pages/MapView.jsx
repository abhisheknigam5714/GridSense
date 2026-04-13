import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { outageAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Custom icons for different outage statuses
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const markerIcons = {
  REPORTED: createCustomIcon('#ffc107'),
  CONFIRMED: createCustomIcon('#dc3545'),
  RESOLVED: createCustomIcon('#28a745')
};

// Component to handle map updates
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapView = () => {
  const { user } = useAuth();
  const [outages, setOutages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchPincode, setSearchPincode] = useState('');
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
        },
        () => {
          console.log('Could not get user location');
        }
      );
    }
  }, []);

  const fetchOutages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await outageAPI.getActive(searchPincode || null);
      setOutages(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load outages');
      console.error('Error fetching outages:', err);
    } finally {
      setLoading(false);
    }
  }, [searchPincode]);

  useEffect(() => {
    fetchOutages();
  }, [fetchOutages]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOutages();
  };

  const filteredOutages = outages.filter((outage) => {
    if (selectedStatus === 'all') return true;
    return outage.status === selectedStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      REPORTED: '#ffc107',
      CONFIRMED: '#dc3545',
      RESOLVED: '#28a745'
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Default coordinates for demo (will be replaced with actual coordinates from backend)
  const getOutageCoordinates = (outage) => {
    // In a real app, you'd store lat/lng in the outage record
    // For demo, we'll generate based on pincode or use defaults
    const pincodeNum = parseInt(outage.pincode) || 0;
    const lat = 20.5937 + (pincodeNum % 1000) * 0.01;
    const lng = 78.9629 + (pincodeNum % 1000) * 0.01;
    return [lat, lng];
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" />
          <p className="text-light">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-view py-4">
      <div className="container-fluid">
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <h4 className="text-light mb-0">
                <i className="fas fa-map-marked-alt text-warning me-2"></i>
                Outage Map
              </h4>
              
              <div className="d-flex gap-2 align-items-center">
                <form onSubmit={handleSearch} className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="Search by pincode"
                    value={searchPincode}
                    onChange={(e) => setSearchPincode(e.target.value)}
                    style={{ width: '150px' }}
                  />
                  <button type="submit" className="btn btn-outline-warning">
                    <i className="fas fa-search"></i>
                  </button>
                </form>
                
                <select
                  className="form-select bg-dark text-light border-secondary"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{ width: '150px' }}
                >
                  <option value="all">All Status</option>
                  <option value="REPORTED">Reported</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-9 mb-3">
            <div className="card bg-dark-custom border-secondary">
              <div className="card-body p-0">
                <MapContainer
                  center={mapCenter}
                  zoom={5}
                  style={{ height: '70vh', width: '100%' }}
                  className="rounded"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapUpdater center={mapCenter} />
                  
                  {userLocation && (
                    <Marker 
                      position={userLocation}
                      icon={L.divIcon({
                        className: 'custom-marker',
                        html: `<div style="
                          background-color: #007bff;
                          width: 16px;
                          height: 16px;
                          border-radius: 50%;
                          border: 3px solid white;
                          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                        "></div>`,
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                      })}
                    >
                      <Popup>
                        <strong>Your Location</strong>
                      </Popup>
                    </Marker>
                  )}

                  {filteredOutages.map((outage) => (
                    <Marker
                      key={outage.id}
                      position={getOutageCoordinates(outage)}
                      icon={markerIcons[outage.status]}
                    >
                      <Popup>
                        <div className="map-popup">
                          <h6 className="mb-1">{outage.locality}</h6>
                          <p className="mb-1 small text-muted">Pincode: {outage.pincode}</p>
                          <span
                            className="badge mb-1"
                            style={{ backgroundColor: getStatusColor(outage.status) }}
                          >
                            {outage.status}
                          </span>
                          <p className="mb-0 small">{outage.description}</p>
                          <small className="text-muted">
                            Reported: {formatDate(outage.reportedAt)}
                          </small>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="card bg-dark-custom border-secondary h-100">
              <div className="card-header bg-dark-custom border-secondary">
                <h6 className="text-light mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Map Legend
                </h6>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h6 className="text-light small mb-3">Status Markers</h6>
                  <div className="d-flex align-items-center mb-2">
                    <div style={{
                      backgroundColor: '#ffc107',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      marginRight: '10px'
                    }}></div>
                    <span className="text-light small">Reported</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <div style={{
                      backgroundColor: '#dc3545',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      marginRight: '10px'
                    }}></div>
                    <span className="text-light small">Confirmed</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <div style={{
                      backgroundColor: '#28a745',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      marginRight: '10px'
                    }}></div>
                    <span className="text-light small">Resolved</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div style={{
                      backgroundColor: '#007bff',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      marginRight: '10px'
                    }}></div>
                    <span className="text-light small">Your Location</span>
                  </div>
                </div>

                <hr className="border-secondary" />

                <div className="stats-section">
                  <h6 className="text-light small mb-3">Quick Stats</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Total Shown:</span>
                    <span className="text-light">{filteredOutages.length}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Active:</span>
                    <span className="text-warning">
                      {filteredOutages.filter(o => o.status !== 'RESOLVED').length}
                    </span>
                  </div>
                </div>

                <hr className="border-secondary" />

                <div className="outage-list-small">
                  <h6 className="text-light small mb-3">Recent Outages</h6>
                  {filteredOutages.slice(0, 5).map((outage) => (
                    <div key={outage.id} className="bg-dark rounded p-2 mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-light small">{outage.locality}</span>
                        <span
                          className="badge small"
                          style={{ backgroundColor: getStatusColor(outage.status) }}
                        >
                          {outage.status}
                        </span>
                      </div>
                      <small className="text-muted">{outage.pincode}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;