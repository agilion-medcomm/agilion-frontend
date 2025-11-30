import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './SharedDashboard.css';

const BaseURL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function CashierDashboard() {
  const { user } = usePersonnelAuth();
  const [payments, setPayments] = useState([]);
  const [todayStats, setTodayStats] = useState({
    totalRevenue: 0,
    transactionCount: 0,
    cashAmount: 0,
    cardAmount: 0,
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filter, setFilter] = useState('today'); // today, week, month, all
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const [newPayment, setNewPayment] = useState({
    patientId: '',
    patientName: '',
    amount: '',
    method: 'CASH',
    receiptNumber: '',
    description: ''
  });

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API call
      // const response = await axios.get(`${BaseURL}/api/v1/payments`, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      //   params: { filter, method: paymentMethod }
      // });
      
      // Mock data
      const mockPayments = [
        {
          id: 1,
          patientName: 'John Doe',
          amount: 500,
          method: 'CASH',
          receiptNumber: 'RCP-001',
          date: new Date().toISOString(),
          description: 'Consultation fee',
          status: 'COMPLETED'
        },
        {
          id: 2,
          patientName: 'Jane Smith',
          amount: 1200,
          method: 'CARD',
          receiptNumber: 'RCP-002',
          date: new Date().toISOString(),
          description: 'Lab tests',
          status: 'COMPLETED'
        },
        {
          id: 3,
          patientName: 'Mike Johnson',
          amount: 800,
          method: 'INSURANCE',
          receiptNumber: 'RCP-003',
          date: new Date(Date.now() - 86400000).toISOString(),
          description: 'X-Ray imaging',
          status: 'COMPLETED'
        },
      ];

      setPayments(mockPayments);
      
      // Calculate stats
      const today = new Date().toDateString();
      const todayPayments = mockPayments.filter(p => 
        new Date(p.date).toDateString() === today
      );
      
      setTodayStats({
        totalRevenue: todayPayments.reduce((sum, p) => sum + p.amount, 0),
        transactionCount: todayPayments.length,
        cashAmount: todayPayments.filter(p => p.method === 'CASH').reduce((sum, p) => sum + p.amount, 0),
        cardAmount: todayPayments.filter(p => p.method === 'CARD').reduce((sum, p) => sum + p.amount, 0),
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    
    try {
      // TODO: Replace with real API call
      // await axios.post(`${BaseURL}/api/v1/payments`, newPayment, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      
      alert('Payment recorded successfully!');
      setShowPaymentModal(false);
      setNewPayment({
        patientId: '',
        patientName: '',
        amount: '',
        method: 'CASH',
        receiptNumber: '',
        description: ''
      });
      fetchPayments();
    } catch (error) {
      alert('Error recording payment: ' + error.message);
    }
  };

  const handlePrintReceipt = (payment) => {
    // In real implementation, this would generate a PDF receipt
    alert(`Printing receipt ${payment.receiptNumber}`);
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Cashier Dashboard</h1>
          <p>Manage payments and financial transactions</p>
        </div>
        <button className="btn-primary" onClick={() => setShowPaymentModal(true)}>
          Record New Payment
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Today's Revenue</h3>
            <p className="stat-value">₺{todayStats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <div className="stat-icon">🧾</div>
          <div className="stat-info">
            <h3>Transactions</h3>
            <p className="stat-value">{todayStats.transactionCount}</p>
          </div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <div className="stat-icon">💵</div>
          <div className="stat-info">
            <h3>Cash Payments</h3>
            <p className="stat-value">₺{todayStats.cashAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
          <div className="stat-icon">💳</div>
          <div className="stat-info">
            <h3>Card Payments</h3>
            <p className="stat-value">₺{todayStats.cardAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Period:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Payment Method:</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="">All Methods</option>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="INSURANCE">Insurance</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Patient</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Description</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>Loading...</td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No payments found</td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td><strong>{payment.receiptNumber}</strong></td>
                  <td>{payment.patientName}</td>
                  <td><strong>₺{payment.amount.toFixed(2)}</strong></td>
                  <td>
                    <span className={`badge badge-${payment.method.toLowerCase()}`}>
                      {payment.method}
                    </span>
                  </td>
                  <td>{payment.description}</td>
                  <td>{new Date(payment.date).toLocaleString()}</td>
                  <td>
                    <span className="badge badge-success">{payment.status}</span>
                  </td>
                  <td>
                    <button 
                      className="btn-icon" 
                      onClick={() => handlePrintReceipt(payment)}
                      title="Print Receipt"
                    >
                      🖨️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Record New Payment</h2>
              <button className="modal-close" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>

            <form onSubmit={handleRecordPayment}>
              <div className="form-group">
                <label>Patient Name</label>
                <input
                  type="text"
                  required
                  value={newPayment.patientName}
                  onChange={(e) => setNewPayment({...newPayment, patientName: e.target.value})}
                  placeholder="Enter patient name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₺)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    required
                    value={newPayment.method}
                    onChange={(e) => setNewPayment({...newPayment, method: e.target.value})}
                  >
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="INSURANCE">Insurance</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Receipt Number</label>
                <input
                  type="text"
                  required
                  value={newPayment.receiptNumber}
                  onChange={(e) => setNewPayment({...newPayment, receiptNumber: e.target.value})}
                  placeholder="RCP-XXX"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newPayment.description}
                  onChange={(e) => setNewPayment({...newPayment, description: e.target.value})}
                  placeholder="Payment description..."
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Record Payment
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
          <li>GET /api/v1/payments - Fetch all payments with filters</li>
          <li>POST /api/v1/payments - Record new payment</li>
          <li>GET /api/v1/payments/summary - Get statistics</li>
        </ul>
        <p>See IMPLEMENTATION_CHECKLIST.md for details</p>
      </div>
    </div>
  );
}
