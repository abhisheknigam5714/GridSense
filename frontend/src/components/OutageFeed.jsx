import React, { useState, useEffect, useCallback } from 'react';
import { outageAPI } from '../services/api';
import socketService from '../services/socket';
import OutageCard from './OutageCard';
import ToastAlert from './ToastAlert';

const OutageFeed = ({ pincode = null, showActions = true }) => {
  const [outages, setOutages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  const showToast = (message, variant = 'success') => {
    setToast({ show: true, message, variant });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  const fetchOutages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await outageAPI.getActive(pincode);
      setOutages(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load outages. Please try again.');
      console.error('Error fetching outages:', err);
    } finally {
      setLoading(false);
    }
  }, [pincode]);

  useEffect(() => {
    fetchOutages();

    // Connect to WebSocket
    socketService.connect(
      () => {
        console.log('WebSocket connected, subscribing to outage updates');
        socketService.subscribeToOutages(pincode, (message) => {
          console.log('Received outage update:', message);
          
          switch (message.type) {
            case 'NEW_OUTAGE':
              setOutages((prev) => [message.data, ...prev]);
              showToast('New outage reported in your area!', 'warning');
              break;
            case 'OUTAGE_CONFIRMED':
              setOutages((prev) =>
                prev.map((o) =>
                  o.id === message.data.id ? { ...o, ...message.data } : o
                )
              );
              showToast('Outage confirmed by admin', 'info');
              break;
            case 'OUTAGE_RESOLVED':
              setOutages((prev) =>
                prev.filter((o) => o.id !== message.data.id)
              );
              showToast('Outage has been resolved', 'success');
              break;
            default:
              fetchOutages();
          }
        });
      },
      (err) => {
        console.error('WebSocket connection error:', err);
      }
    );

    return () => {
      socketService.disconnect();
    };
  }, [pincode, fetchOutages]);

  const handleOutageAction = (action, errorMsg = null) => {
    if (errorMsg) {
      showToast(errorMsg, 'danger');
    } else {
      showToast(`Outage ${action} successfully`, 'success');
      fetchOutages();
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading outages...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-3" role="alert">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error}
        <button
          className="btn btn-outline-danger btn-sm ms-3"
          onClick={fetchOutages}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="outage-feed">
      <ToastAlert
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={hideToast}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-light mb-0">
          <i className="fas fa-bolt text-warning me-2"></i>
          Active Outages
          {pincode && <span className="text-muted small ms-2">in {pincode}</span>}
        </h4>
        <span className="badge bg-primary">{outages.length} Active</span>
      </div>

      {outages.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-check-circle text-success fa-3x mb-3"></i>
          <h5 className="text-light">No Active Outages</h5>
          <p className="text-muted">
            {pincode
              ? `No power outages reported in pincode ${pincode}`
              : 'No power outages reported in your area'}
          </p>
        </div>
      ) : (
        <div className="outage-list">
          {outages.map((outage) => (
            <OutageCard
              key={outage.id}
              outage={outage}
              onAction={handleOutageAction}
              showActions={showActions}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OutageFeed;