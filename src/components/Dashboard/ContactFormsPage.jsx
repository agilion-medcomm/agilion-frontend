import React from 'react';
import './SharedDashboard.css';

export default function ContactFormsPage() {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Contact Forms</h1>
          <p className="page-subtitle">View and manage contact form submissions</p>
        </div>
      </div>

      <div className="table-container">
        <div className="no-data" style={{padding: '60px 20px'}}>
          <p style={{fontSize: '16px', marginBottom: '8px'}}>📋 Contact Forms Management</p>
          <p style={{color: '#94a3b8'}}>This feature is not yet implemented. Contact form submissions will appear here.</p>
        </div>
      </div>
    </div>
  );
}
