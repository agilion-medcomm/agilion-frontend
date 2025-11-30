# 🔧 Implementation Checklist

## Backend API Endpoints Required

### 🧹 Cleaning Management System

#### Endpoints Needed:
```
POST /api/v1/cleaning/assignments
- Create cleaning assignment
- Body: { cleanerId, zone, date }

GET /api/v1/cleaning/assignments
- Get all cleaning assignments
- Query params: cleanerId, zone, date, status

PUT /api/v1/cleaning/assignments/:id
- Update assignment status

POST /api/v1/cleaning/records
- Submit cleaning record with photo
- Body: multipart/form-data { assignmentId, photo, notes, completedAt }

GET /api/v1/cleaning/records
- Get cleaning history
- Query params: cleanerId, zone, startDate, endDate

GET /api/v1/cleaning/records/:id/photo
- Get photo for specific cleaning record
```

#### Database Schema:
```sql
CleaningAssignment {
  id: Int
  cleanerId: Int (FK to Doctor/Personnel)
  zone: String
  date: DateTime
  status: Enum (PENDING, COMPLETED, MISSED)
  createdAt: DateTime
  updatedAt: DateTime
}

CleaningRecord {
  id: Int
  assignmentId: Int (FK)
  cleanerId: Int (FK)
  zone: String
  completedAt: DateTime
  photoUrl: String
  notes: String?
  createdAt: DateTime
}
```

---

### 🔔 Notification System

#### Endpoints Needed:
```
GET /api/v1/notifications
- Get user's notifications
- Query params: read (boolean), limit, offset

POST /api/v1/notifications
- Create/send notification (Admin only)
- Body: { 
    targetType: 'ALL'|'ROLE'|'SPECIFIC', 
    targetRole: 'DOCTOR'|'CLEANER'|etc,
    targetUserIds: [Int],
    title: String,
    message: String,
    type: String
  }

PUT /api/v1/notifications/:id/read
- Mark notification as read

PUT /api/v1/notifications/read-all
- Mark all as read

DELETE /api/v1/notifications/:id
- Delete notification
```

#### Database Schema:
```sql
Notification {
  id: Int
  userId: Int (FK to User)
  title: String
  message: String
  type: Enum (LEAVE_REQUEST, APPOINTMENT, CLEANING, GENERAL, ADMIN_MESSAGE)
  read: Boolean
  createdAt: DateTime
  readAt: DateTime?
}

NotificationTemplate {
  id: Int
  adminId: Int (FK)
  title: String
  message: String
  targetType: Enum (ALL, ROLE, SPECIFIC)
  targetRole: String?
  sentAt: DateTime
  recipientCount: Int
}
```

---

### 💰 Cashier Dashboard

#### Endpoints Needed:
```
GET /api/v1/payments
- Get all payment records
- Query params: patientId, date, status

POST /api/v1/payments
- Record new payment
- Body: { patientId, appointmentId, amount, method, receiptNumber }

GET /api/v1/payments/summary
- Get payment summary statistics
- Query params: startDate, endDate

PUT /api/v1/payments/:id
- Update payment (void, refund, etc.)
```

#### Database Schema:
```sql
Payment {
  id: Int
  patientId: Int (FK)
  appointmentId: Int? (FK)
  amount: Decimal
  method: Enum (CASH, CARD, INSURANCE, BANK_TRANSFER)
  status: Enum (COMPLETED, PENDING, REFUNDED, VOIDED)
  receiptNumber: String
  cashierId: Int (FK)
  notes: String?
  createdAt: DateTime
}
```

---

### 🧪 Lab Technician Dashboard

#### Endpoints Needed:
```
GET /api/v1/lab-tests
- Get all lab test requests
- Query params: patientId, status, date

POST /api/v1/lab-tests
- Create lab test request
- Body: { patientId, appointmentId, testType, orderedBy }

PUT /api/v1/lab-tests/:id/results
- Upload test results
- Body: multipart/form-data { results, resultFile, notes }

GET /api/v1/lab-tests/:id/results
- Get test results

GET /api/v1/lab-tests/pending
- Get pending tests
```

#### Database Schema:
```sql
LabTest {
  id: Int
  patientId: Int (FK)
  appointmentId: Int? (FK)
  testType: String
  status: Enum (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
  orderedBy: Int (FK to Doctor)
  technicianId: Int? (FK)
  orderedAt: DateTime
  completedAt: DateTime?
}

LabResult {
  id: Int
  labTestId: Int (FK)
  results: Json
  resultFileUrl: String?
  notes: String?
  technicianId: Int (FK)
  createdAt: DateTime
}
```

---

### 🏥 Patient Dashboard

#### Endpoints Needed:
```
GET /api/v1/patients/me/appointments
- Get patient's own appointments
- Query params: status, startDate, endDate

GET /api/v1/patients/me/lab-results
- Get patient's lab results
- Query params: startDate, endDate

POST /api/v1/appointments/:id/review
- Submit review for appointment
- Body: { rating, comment }

GET /api/v1/appointments/:id/review
- Get review for appointment

PUT /api/v1/appointments/:id/review
- Update review
```

#### Database Schema:
```sql
AppointmentReview {
  id: Int
  appointmentId: Int (FK)
  patientId: Int (FK)
  doctorId: Int (FK)
  rating: Int (1-5)
  comment: String?
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## Frontend Components Status

### ✅ Completed Components
- [x] Dashboard Layout with Sidebar (All roles)
- [x] Dashboard Home with Statistics
- [x] Personnel Management (Admin)
- [x] Appointments Management
- [x] Patients List
- [x] Leave Requests (with Reject button)
- [x] Date Filtering on Appointments
- [x] Cleaning Management Page (Admin)
- [x] Cleaner Dashboard
- [x] Notification Badge in Header (UI complete, needs backend)
- [x] Notification Alert on Dashboard Load (UI complete, needs backend)
- [x] Notifications Page with list view (UI complete, needs backend)
- [x] Admin Notification Sender Page (UI complete, needs backend)
- [x] Cashier Dashboard (UI complete, needs backend)
- [x] Lab Technician Dashboard (UI complete, needs backend)
- [x] Patient Dashboard (UI complete, needs backend)
- [x] Notifications Tab in Sidebar (All roles)

### 🔨 Backend Implementation Needed
- [ ] Notifications API (see API_CONTRACTS.md)
- [ ] Cleaning Records API with photo upload
- [ ] Payments API for Cashier
- [ ] Lab Tests API for Lab Tech
- [ ] Patient appointments and lab results API
- [ ] Appointment reviews API

### 📋 Components to Create

#### 1. Notification Badge (Header)
**Location:** `src/components/Dashboard/NotificationBadge.jsx`
**Features:**
- Bell icon in top-right corner
- Red badge with unread count
- Dropdown showing recent notifications
- "View All" link to notifications page

#### 2. Notification Alert (Dashboard Shake)
**Location:** `src/components/Dashboard/NotificationAlert.jsx`
**Features:**
- Appears on dashboard load if unread notifications
- Shake animation
- Dismissable with X button
- Shows notification count

#### 3. Admin Notification Sender
**Location:** `src/components/Dashboard/NotificationSenderPage.jsx`
**Features:**
- Send to: All, Specific Role, Specific Personnel
- Title and message fields
- Preview before sending
- History of sent notifications
- Recipient count display

#### 4. Cashier Dashboard
**Location:** `src/components/Dashboard/CashierDashboard.jsx`
**Features:**
- Today's payments summary
- Record new payment
- Payment history table
- Receipt generation
- Daily/monthly revenue charts

#### 5. Lab Technician Dashboard
**Location:** `src/components/Dashboard/LabTechDashboard.jsx`
**Features:**
- Pending tests queue
- Upload test results
- Test history
- Search by patient
- Result file upload

#### 6. Patient Dashboard
**Location:** `src/components/Dashboard/PatientDashboard.jsx`
**Features:**
- My appointments (past & future)
- View lab results
- Rate and review appointments
- Download lab reports
- Profile information

---

## File Upload Configuration

### Backend (Multer/Similar)
```javascript
// Example multer configuration
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/cleaning-photos/',
  filename: (req, file, cb) => {
    cb(null, `cleaning-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb('Error: Images only!');
  }
});
```

### Frontend Upload
```javascript
const handleUpload = async (photo) => {
  const formData = new FormData();
  formData.append('photo', photo);
  formData.append('assignmentId', assignmentId);
  formData.append('notes', notes);
  
  await axios.post(`${BaseURL}/cleaning/records`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  });
};
```

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="5242880" # 5MB in bytes
```

### Frontend (.env)
```
VITE_API_BASE="http://localhost:3000"
```

---

## Current Implementation Status Summary

### ✅ Fully Implemented (Frontend + Backend)
- Authentication (Login/Register/Password Reset)
- Personnel Management (CRUD)
- Appointments Management
- Patients List
- Leave Requests Management
- Dashboard Statistics

### ⚠️ Frontend Complete, Backend Missing
All UI components are built and styled. Waiting for backend API endpoints:

1. **Notifications System**
   - Frontend: NotificationBadge, NotificationAlert, NotificationsPage, AdminNotificationSender
   - Backend Needed: All endpoints in `/api/v1/notifications`

2. **Cleaning Management**
   - Frontend: CleaningManagementPage, CleanerDashboard
   - Backend Needed: `/api/v1/cleaning/records` with photo upload

3. **Cashier Dashboard**
   - Frontend: CashierDashboard with payment recording
   - Backend Needed: All endpoints in `/api/v1/payments`

4. **Lab Technician Dashboard**
   - Frontend: LabTechDashboard with result uploads
   - Backend Needed: All endpoints in `/api/v1/lab-tests`

5. **Patient Dashboard**
   - Frontend: PatientDashboard with appointments and reviews
   - Backend Needed: All endpoints in `/api/v1/patients/me/*`

### 📋 Next Steps for Backend Team

See **API_CONTRACTS.md** for complete endpoint specifications including:
- Request/response formats
- Authentication requirements
- Database schema updates
- File upload configurations
- Error handling

---

## Testing Checklist

### Cleaning System
- [ ] Admin can assign cleaner to zone
- [ ] Cleaner sees assignments
- [ ] Cleaner can upload photo
- [ ] Photo is saved and retrievable
- [ ] Filters work (zone, cleaner)
- [ ] History displays correctly

### Notifications
- [ ] Badge shows unread count
- [ ] Alert appears on login with new notifications
- [ ] Admin can send to all users
- [ ] Admin can send to specific role
- [ ] Admin can send to specific person
- [ ] Notifications mark as read
- [ ] Real-time updates (or polling)

### Additional Dashboards
- [ ] Cashier can record payments
- [ ] Lab tech can view pending tests
- [ ] Lab tech can upload results
- [ ] Patient can view appointments
- [ ] Patient can see lab results
- [ ] Patient can submit reviews

---

## Security Considerations

### Authentication
- All endpoints require JWT token
- Role-based access control (RBAC)
- Cleaners only see own assignments
- Patients only see own data

### File Uploads
- Validate file type and size
- Sanitize filenames
- Store in secure directory
- Scan for malware (optional)
- Use CDN for serving (production)

### Notifications
- Prevent spam (rate limiting)
- Validate target users exist
- Log all notification sends
- Allow users to mute notifications

---

## Performance Optimization

### Database
- Index on frequently queried fields (userId, date, status)
- Paginate large result sets
- Cache expensive queries (Redis)

### Frontend
- Lazy load notification history
- Debounce search inputs
- Virtual scrolling for large tables
- Optimize images (compression, WebP)

### Real-time Updates
- WebSocket for live notifications (Socket.io)
- Or long-polling as fallback
- Update UI optimistically

---

## Future Enhancements

### Phase 2
- [ ] Push notifications (Web Push API)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Notification preferences per user
- [ ] Notification categories
- [ ] Mute/snooze notifications

### Phase 3
- [ ] Analytics dashboard for cleaning performance
- [ ] Cleaner performance ratings
- [ ] Automated zone assignment based on workload
- [ ] QR codes for zone verification
- [ ] Cleaning checklist per zone
- [ ] Before/after photo comparison

### Phase 4
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Voice notes for cleaners
- [ ] Integration with hospital management system
- [ ] Automated report generation

---

## Documentation

### API Documentation
- Use Swagger/OpenAPI for API docs
- Document all endpoints with examples
- Include authentication requirements
- Provide sample requests/responses

### User Guides
- Admin guide for cleaning management
- Cleaner guide for photo uploads
- Cashier guide for payment processing
- Lab tech guide for result uploads
- Patient guide for dashboard usage

---

This checklist ensures full implementation of all requested features with proper backend support.
