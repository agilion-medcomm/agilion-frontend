import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SharedDashboard.css';

const BaseURL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('appointments'); // appointments, lab-results, reviews
  const [appointments, setAppointments] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all'); // past, future, all
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchAppointments();
    fetchLabResults();
  }, [timeFilter]);

  const fetchAppointments = async () => {
    try {
      // TODO: Replace with real API call
      // const response = await axios.get(`${BaseURL}/api/v1/patients/me/appointments`, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      //   params: { status: timeFilter }
      // });
      
      // Mock data
      const mockAppointments = [
        {
          id: 1,
          doctorName: 'Dr. Sarah Johnson',
          department: 'Cardiology',
          date: new Date(Date.now() + 86400000 * 2).toISOString(),
          time: '10:00',
          status: 'CONFIRMED',
          hasReview: false
        },
        {
          id: 2,
          doctorName: 'Dr. Michael Smith',
          department: 'General Medicine',
          date: new Date(Date.now() - 86400000 * 5).toISOString(),
          time: '14:30',
          status: 'COMPLETED',
          hasReview: true,
          reviewRating: 5
        },
        {
          id: 3,
          doctorName: 'Dr. Emily Williams',
          department: 'Dermatology',
          date: new Date(Date.now() - 86400000 * 10).toISOString(),
          time: '11:00',
          status: 'COMPLETED',
          hasReview: false
        },
      ];

      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchLabResults = async () => {
    try {
      // TODO: Replace with real API call
      // const response = await axios.get(`${BaseURL}/api/v1/patients/me/lab-results`, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      
      // Mock data
      const mockLabResults = [
        {
          id: 1,
          testName: 'Complete Blood Count',
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
          status: 'COMPLETED',
          doctorName: 'Dr. Johnson',
          hasFile: true
        },
        {
          id: 2,
          testName: 'Lipid Panel',
          date: new Date(Date.now() - 86400000 * 15).toISOString(),
          status: 'COMPLETED',
          doctorName: 'Dr. Smith',
          hasFile: true
        },
      ];

      setLabResults(mockLabResults);
    } catch (error) {
      console.error('Error fetching lab results:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    try {
      // TODO: Replace with real API call
      // await axios.post(`${BaseURL}/api/v1/appointments/${selectedAppointment.id}/review`, review, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      
      alert('Review submitted successfully!');
      setShowReviewModal(false);
      setSelectedAppointment(null);
      setReview({ rating: 5, comment: '' });
      fetchAppointments();
    } catch (error) {
      alert('Error submitting review: ' + error.message);
    }
  };

  const handleDownloadReport = (labResult) => {
    // In real implementation, this would download the PDF
    alert(`Downloading report for ${labResult.testName}`);
  };

  const filteredAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const now = new Date();
    
    if (timeFilter === 'past') return aptDate < now;
    if (timeFilter === 'future') return aptDate >= now;
    return true;
  });

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>My Health Dashboard</h1>
          <p>Manage your appointments, view lab results, and provide feedback</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          📅 My Appointments
        </button>
        <button 
          className={`tab-button ${activeTab === 'lab-results' ? 'active' : ''}`}
          onClick={() => setActiveTab('lab-results')}
        >
          🧪 Lab Results
        </button>
        <button 
          className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          ⭐ My Reviews
        </button>
      </div>

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <>
          <div className="filters-bar">
            <div className="filter-group">
              <label>Show:</label>
              <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                <option value="all">All Appointments</option>
                <option value="future">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>

          <div className="appointments-grid">
            {filteredAppointments.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                No appointments found
              </p>
            ) : (
              filteredAppointments.map((apt) => (
                <div key={apt.id} className="appointment-card">
                  <div className="appointment-header">
                    <h3>{apt.doctorName}</h3>
                    <span className={`badge badge-${apt.status.toLowerCase()}`}>
                      {apt.status}
                    </span>
                  </div>
                  
                  <div className="appointment-details">
                    <p><strong>Department:</strong> {apt.department}</p>
                    <p><strong>Date:</strong> {new Date(apt.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {apt.time}</p>
                  </div>

                  {apt.status === 'COMPLETED' && !apt.hasReview && (
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setShowReviewModal(true);
                      }}
                    >
                      Leave a Review
                    </button>
                  )}

                  {apt.hasReview && (
                    <div className="review-indicator">
                      ⭐ You rated this {apt.reviewRating}/5
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Lab Results Tab */}
      {activeTab === 'lab-results' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Date</th>
                <th>Ordered By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {labResults.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No lab results found</td>
                </tr>
              ) : (
                labResults.map((result) => (
                  <tr key={result.id}>
                    <td><strong>{result.testName}</strong></td>
                    <td>{new Date(result.date).toLocaleDateString()}</td>
                    <td>{result.doctorName}</td>
                    <td>
                      <span className="badge badge-success">{result.status}</span>
                    </td>
                    <td>
                      <button 
                        className="btn-small btn-primary"
                        onClick={() => handleDownloadReport(result)}
                      >
                        📥 Download Report
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="reviews-container">
          {appointments.filter(apt => apt.hasReview).length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              You haven't left any reviews yet
            </p>
          ) : (
            appointments.filter(apt => apt.hasReview).map((apt) => (
              <div key={apt.id} className="review-card">
                <div className="review-header">
                  <h3>{apt.doctorName}</h3>
                  <div className="rating-stars">
                    {'⭐'.repeat(apt.reviewRating)}
                  </div>
                </div>
                <p className="review-date">{new Date(apt.date).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Leave a Review</h2>
              <button className="modal-close" onClick={() => setShowReviewModal(false)}>×</button>
            </div>

            <div className="appointment-info">
              <p><strong>Doctor:</strong> {selectedAppointment?.doctorName}</p>
              <p><strong>Department:</strong> {selectedAppointment?.department}</p>
              <p><strong>Date:</strong> {new Date(selectedAppointment?.date).toLocaleDateString()}</p>
            </div>

            <form onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-button ${star <= review.rating ? 'active' : ''}`}
                      onClick={() => setReview({...review, rating: star})}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Your Review (Optional)</label>
                <textarea
                  value={review.comment}
                  onChange={(e) => setReview({...review, comment: e.target.value})}
                  placeholder="Share your experience..."
                  rows="4"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* API Notice */}
      <div className="api-notice">
        <p><strong>⚠️ Backend API Required:</strong></p>
        <ul>
          <li>GET /api/v1/patients/me/appointments - Get patient's appointments</li>
          <li>GET /api/v1/patients/me/lab-results - Get patient's lab results</li>
          <li>POST /api/v1/appointments/:id/review - Submit appointment review</li>
          <li>GET /api/v1/lab-results/:id/download - Download lab report PDF</li>
        </ul>
        <p>See IMPLEMENTATION_CHECKLIST.md for database schema</p>
      </div>
    </div>
  );
}
