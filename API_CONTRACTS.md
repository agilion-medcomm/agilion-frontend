# 🔌 API Endpoint Contracts

## Missing Backend Endpoints

This document defines the API contracts for endpoints that need to be implemented in the backend.

---

## 1. Notifications API

### Base Route: `/api/v1/notifications`

#### GET `/api/v1/notifications`
Get all notifications for the authenticated user

**Authentication:** Required (JWT)

**Query Parameters:**
```typescript
{
  read?: boolean,        // Filter by read status
  type?: string,         // Filter by notification type
  limit?: number,        // Default: 50
  offset?: number        // Default: 0
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "userId": 123,
        "title": "New Appointment Scheduled",
        "message": "You have a new appointment with Dr. Smith",
        "type": "APPOINTMENT",
        "read": false,
        "createdAt": "2025-11-30T10:00:00Z",
        "readAt": null
      }
    ],
    "total": 45,
    "unreadCount": 12
  }
}
```

---

#### GET `/api/v1/notifications/unread-count`
Get count of unread notifications

**Authentication:** Required (JWT)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "count": 12
  }
}
```

---

#### POST `/api/v1/notifications`
Create and send notification (Admin only)

**Authentication:** Required (JWT + Admin role)

**Request Body:**
```json
{
  "targetType": "ALL" | "ROLE" | "SPECIFIC",
  "targetRole": "DOCTOR" | "CLEANER" | "CASHIER" | "LAB_TECH",  // Required if targetType is ROLE
  "targetUserIds": [1, 2, 3],  // Required if targetType is SPECIFIC
  "title": "Important Announcement",
  "message": "This is the notification message",
  "type": "GENERAL" | "LEAVE_REQUEST" | "APPOINTMENT" | "CLEANING" | "ADMIN_MESSAGE"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "notificationId": 456,
    "recipientCount": 25,
    "sentAt": "2025-11-30T10:00:00Z"
  }
}
```

---

#### PUT `/api/v1/notifications/:id/read`
Mark a notification as read

**Authentication:** Required (JWT)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "read": true,
    "readAt": "2025-11-30T10:05:00Z"
  }
}
```

---

#### PUT `/api/v1/notifications/read-all`
Mark all notifications as read

**Authentication:** Required (JWT)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "updatedCount": 12
  }
}
```

---

#### DELETE `/api/v1/notifications/:id`
Delete a notification

**Authentication:** Required (JWT)

**Response 200:**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

#### GET `/api/v1/notifications/sent`
Get sent notifications history (Admin only)

**Authentication:** Required (JWT + Admin role)

**Query Parameters:**
```typescript
{
  limit?: number,
  offset?: number,
  startDate?: string,
  endDate?: string
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "adminId": 1,
        "title": "System Maintenance",
        "message": "The system will be down for maintenance",
        "targetType": "ALL",
        "recipientCount": 50,
        "sentAt": "2025-11-30T09:00:00Z"
      }
    ],
    "total": 10
  }
}
```

---

## 2. Cleaning Management API

### Base Route: `/api/v1/cleaning`

#### POST `/api/v1/cleaning/assignments`
Create a cleaning assignment (Admin only)

**Authentication:** Required (JWT + Admin role)

**Request Body:**
```json
{
  "cleanerId": 123,
  "zone": "ICU - Floor 3",
  "date": "2025-12-01",
  "shiftTime": "08:00-16:00"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "cleanerId": 123,
    "cleanerName": "John Doe",
    "zone": "ICU - Floor 3",
    "date": "2025-12-01",
    "shiftTime": "08:00-16:00",
    "status": "PENDING",
    "createdAt": "2025-11-30T10:00:00Z"
  }
}
```

---

#### GET `/api/v1/cleaning/assignments`
Get cleaning assignments

**Authentication:** Required (JWT)

**Query Parameters:**
```typescript
{
  cleanerId?: number,    // Filter by cleaner (optional for admin)
  zone?: string,
  date?: string,         // ISO date string
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "MISSED",
  startDate?: string,
  endDate?: string
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "id": 1,
        "cleanerId": 123,
        "cleanerName": "John Doe",
        "zone": "ICU - Floor 3",
        "date": "2025-12-01",
        "shiftTime": "08:00-16:00",
        "status": "PENDING",
        "createdAt": "2025-11-30T10:00:00Z",
        "updatedAt": "2025-11-30T10:00:00Z"
      }
    ],
    "total": 15
  }
}
```

---

#### PUT `/api/v1/cleaning/assignments/:id`
Update assignment status

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "status": "IN_PROGRESS" | "COMPLETED" | "MISSED"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "COMPLETED",
    "updatedAt": "2025-11-30T15:00:00Z"
  }
}
```

---

#### POST `/api/v1/cleaning/records`
Submit cleaning record with photo

**Authentication:** Required (JWT)

**Content-Type:** `multipart/form-data`

**Request Body:**
```
assignmentId: 1
photo: [File]
notes: "All areas cleaned thoroughly"
completedAt: "2025-11-30T15:00:00Z"
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "assignmentId": 1,
    "cleanerId": 123,
    "zone": "ICU - Floor 3",
    "completedAt": "2025-11-30T15:00:00Z",
    "photoUrl": "/uploads/cleaning/photo-123.jpg",
    "notes": "All areas cleaned thoroughly",
    "createdAt": "2025-11-30T15:00:00Z"
  }
}
```

---

#### GET `/api/v1/cleaning/records`
Get cleaning history

**Authentication:** Required (JWT)

**Query Parameters:**
```typescript
{
  cleanerId?: number,
  zone?: string,
  startDate?: string,
  endDate?: string,
  limit?: number,
  offset?: number
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": 1,
        "assignmentId": 1,
        "cleanerId": 123,
        "cleanerName": "John Doe",
        "zone": "ICU - Floor 3",
        "completedAt": "2025-11-30T15:00:00Z",
        "photoUrl": "/uploads/cleaning/photo-123.jpg",
        "notes": "All areas cleaned thoroughly",
        "createdAt": "2025-11-30T15:00:00Z"
      }
    ],
    "total": 50
  }
}
```

---

#### GET `/api/v1/cleaning/records/:id/photo`
Get photo for specific cleaning record

**Authentication:** Required (JWT)

**Response:** Image file (JPEG/PNG)

---

## 3. Payments API (Cashier)

### Base Route: `/api/v1/payments`

#### POST `/api/v1/payments`
Record a new payment

**Authentication:** Required (JWT + Cashier role)

**Request Body:**
```json
{
  "patientId": 456,
  "appointmentId": 789,  // Optional
  "amount": 500.00,
  "method": "CASH" | "CARD" | "INSURANCE" | "BANK_TRANSFER",
  "receiptNumber": "RCP-20251130-001",
  "description": "Consultation fee",
  "notes": "Additional notes"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patientId": 456,
    "patientName": "Jane Smith",
    "appointmentId": 789,
    "amount": 500.00,
    "method": "CASH",
    "status": "COMPLETED",
    "receiptNumber": "RCP-20251130-001",
    "cashierId": 123,
    "cashierName": "John Doe",
    "description": "Consultation fee",
    "notes": "Additional notes",
    "createdAt": "2025-11-30T10:00:00Z"
  }
}
```

---

#### GET `/api/v1/payments`
Get all payment records

**Authentication:** Required (JWT + Cashier role)

**Query Parameters:**
```typescript
{
  patientId?: number,
  cashierId?: number,
  method?: string,
  status?: string,
  startDate?: string,
  endDate?: string,
  limit?: number,
  offset?: number
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": 1,
        "patientId": 456,
        "patientName": "Jane Smith",
        "appointmentId": 789,
        "amount": 500.00,
        "method": "CASH",
        "status": "COMPLETED",
        "receiptNumber": "RCP-20251130-001",
        "cashierId": 123,
        "cashierName": "John Doe",
        "description": "Consultation fee",
        "createdAt": "2025-11-30T10:00:00Z"
      }
    ],
    "total": 100
  }
}
```

---

#### GET `/api/v1/payments/summary`
Get payment summary statistics

**Authentication:** Required (JWT + Cashier role)

**Query Parameters:**
```typescript
{
  startDate?: string,  // Default: today
  endDate?: string,    // Default: today
  cashierId?: number   // Optional, filter by cashier
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 15000.00,
    "transactionCount": 45,
    "byMethod": {
      "CASH": 8000.00,
      "CARD": 5000.00,
      "INSURANCE": 2000.00,
      "BANK_TRANSFER": 0.00
    },
    "byStatus": {
      "COMPLETED": 14500.00,
      "PENDING": 500.00,
      "REFUNDED": 0.00,
      "VOIDED": 0.00
    }
  }
}
```

---

#### PUT `/api/v1/payments/:id`
Update payment (void, refund, etc.)

**Authentication:** Required (JWT + Cashier role)

**Request Body:**
```json
{
  "status": "REFUNDED" | "VOIDED",
  "notes": "Reason for refund/void"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "REFUNDED",
    "notes": "Patient requested refund",
    "updatedAt": "2025-11-30T11:00:00Z"
  }
}
```

---

## 4. Lab Tests API (Lab Technician)

### Base Route: `/api/v1/lab-tests`

#### POST `/api/v1/lab-tests`
Create lab test request

**Authentication:** Required (JWT + Doctor role)

**Request Body:**
```json
{
  "patientId": 456,
  "appointmentId": 789,
  "testType": "Complete Blood Count",
  "urgency": "ROUTINE" | "URGENT" | "STAT",
  "notes": "Test instructions"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patientId": 456,
    "patientName": "Jane Smith",
    "appointmentId": 789,
    "testType": "Complete Blood Count",
    "status": "PENDING",
    "urgency": "ROUTINE",
    "orderedBy": 123,
    "doctorName": "Dr. Smith",
    "notes": "Test instructions",
    "orderedAt": "2025-11-30T10:00:00Z"
  }
}
```

---

#### GET `/api/v1/lab-tests`
Get all lab test requests

**Authentication:** Required (JWT)

**Query Parameters:**
```typescript
{
  patientId?: number,
  technicianId?: number,
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
  urgency?: string,
  startDate?: string,
  endDate?: string,
  limit?: number,
  offset?: number
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "tests": [
      {
        "id": 1,
        "patientId": 456,
        "patientName": "Jane Smith",
        "appointmentId": 789,
        "testType": "Complete Blood Count",
        "status": "PENDING",
        "urgency": "ROUTINE",
        "orderedBy": 123,
        "doctorName": "Dr. Smith",
        "technicianId": null,
        "orderedAt": "2025-11-30T10:00:00Z",
        "completedAt": null
      }
    ],
    "total": 25
  }
}
```

---

#### GET `/api/v1/lab-tests/pending`
Get pending tests for lab technician

**Authentication:** Required (JWT + Lab Tech role)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "tests": [
      {
        "id": 1,
        "patientId": 456,
        "patientName": "Jane Smith",
        "testType": "Complete Blood Count",
        "urgency": "ROUTINE",
        "orderedBy": 123,
        "doctorName": "Dr. Smith",
        "orderedAt": "2025-11-30T10:00:00Z"
      }
    ],
    "total": 10
  }
}
```

---

#### PUT `/api/v1/lab-tests/:id/start`
Start working on a test

**Authentication:** Required (JWT + Lab Tech role)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "IN_PROGRESS",
    "technicianId": 789,
    "startedAt": "2025-11-30T11:00:00Z"
  }
}
```

---

#### PUT `/api/v1/lab-tests/:id/results`
Upload test results

**Authentication:** Required (JWT + Lab Tech role)

**Content-Type:** `multipart/form-data`

**Request Body:**
```
results: {"hemoglobin": 14.5, "wbc": 7500}
resultFile: [File]  // PDF or image
notes: "Results are within normal range"
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "labTestId": 1,
    "results": {
      "hemoglobin": 14.5,
      "wbc": 7500
    },
    "resultFileUrl": "/uploads/lab-results/result-123.pdf",
    "notes": "Results are within normal range",
    "technicianId": 789,
    "status": "COMPLETED",
    "completedAt": "2025-11-30T12:00:00Z",
    "createdAt": "2025-11-30T12:00:00Z"
  }
}
```

---

#### GET `/api/v1/lab-tests/:id/results`
Get test results

**Authentication:** Required (JWT)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "labTestId": 1,
    "testType": "Complete Blood Count",
    "patientName": "Jane Smith",
    "results": {
      "hemoglobin": 14.5,
      "wbc": 7500
    },
    "resultFileUrl": "/uploads/lab-results/result-123.pdf",
    "notes": "Results are within normal range",
    "technicianId": 789,
    "technicianName": "Lab Tech Name",
    "completedAt": "2025-11-30T12:00:00Z"
  }
}
```

---

## 5. Patient Dashboard API

### Base Route: `/api/v1/patients`

#### PUT `/api/v1/patients/me/profile`
Update patient's own profile information

**Authentication:** Required (JWT + Patient role)

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+90 555 123 4567",
  "address": "123 Main St, Istanbul",
  "emergencyContact": "+90 555 987 6543",
  "bloodType": "A+"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 456,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+90 555 123 4567",
    "address": "123 Main St, Istanbul",
    "emergencyContact": "+90 555 987 6543",
    "bloodType": "A+",
    "updatedAt": "2025-12-01T10:00:00Z"
  },
  "message": "Profile updated successfully"
}
```

**Error Responses:**
- **400 Bad Request:** Invalid data format
- **401 Unauthorized:** Invalid or missing token
- **404 Not Found:** Patient not found

---

#### PUT `/api/v1/patients/me/change-password`
Change patient's password

**Authentication:** Required (JWT + Patient role)

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!",
  "confirmPassword": "NewPassword456!"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**
- **400 Bad Request:** Passwords don't match or invalid format
- **401 Unauthorized:** Current password is incorrect
- **422 Unprocessable Entity:** New password doesn't meet requirements (min 6 characters)

**Password Requirements:**
- Minimum 6 characters
- Must contain at least one letter and one number (recommended)
- Cannot be the same as current password

---

#### GET `/api/v1/patients/me/appointments`
Get patient's own appointments

**Authentication:** Required (JWT + Patient role)

**Query Parameters:**
```typescript
{
  status?: "SCHEDULED" | "COMPLETED" | "CANCELLED",
  startDate?: string,
  endDate?: string
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "id": 1,
        "doctorId": 123,
        "doctorName": "Dr. John Smith",
        "department": "Cardiology",
        "appointmentDate": "2025-12-05",
        "appointmentTime": "10:00",
        "status": "SCHEDULED",
        "notes": "Annual checkup",
        "createdAt": "2025-11-30T10:00:00Z"
      }
    ],
    "total": 5
  }
}
```

---

#### GET `/api/v1/patients/me/lab-results`
Get patient's lab results

**Authentication:** Required (JWT + Patient role)

**Query Parameters:**
```typescript
{
  startDate?: string,
  endDate?: string
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": 1,
        "testType": "Complete Blood Count",
        "orderedBy": 123,
        "doctorName": "Dr. Smith",
        "completedAt": "2025-11-30T12:00:00Z",
        "resultFileUrl": "/uploads/lab-results/result-123.pdf",
        "notes": "Results are within normal range"
      }
    ],
    "total": 10
  }
}
```

---

#### POST `/api/v1/appointments/:id/review`
Submit review for appointment

**Authentication:** Required (JWT + Patient role)

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent service and care"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "appointmentId": 789,
    "patientId": 456,
    "doctorId": 123,
    "rating": 5,
    "comment": "Excellent service and care",
    "createdAt": "2025-11-30T10:00:00Z"
  }
}
```

---

#### GET `/api/v1/appointments/:id/review`
Get review for appointment

**Authentication:** Required (JWT)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "appointmentId": 789,
    "rating": 5,
    "comment": "Excellent service and care",
    "createdAt": "2025-11-30T10:00:00Z",
    "updatedAt": "2025-11-30T10:00:00Z"
  }
}
```

---

#### PUT `/api/v1/appointments/:id/review`
Update review

**Authentication:** Required (JWT + Patient role)

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated review comment"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "rating": 4,
    "comment": "Updated review comment",
    "updatedAt": "2025-11-30T11:00:00Z"
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "amount",
        "message": "Amount must be a positive number"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Database Schema Updates Required

### Notification Table
```prisma
model Notification {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  title     String
  message   String   @db.Text
  type      NotificationType
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  readAt    DateTime?

  @@index([userId, read])
  @@index([createdAt])
}

enum NotificationType {
  LEAVE_REQUEST
  APPOINTMENT
  CLEANING
  GENERAL
  ADMIN_MESSAGE
}
```

### NotificationTemplate Table
```prisma
model NotificationTemplate {
  id             Int      @id @default(autoincrement())
  adminId        Int
  admin          User     @relation(fields: [adminId], references: [id])
  title          String
  message        String   @db.Text
  targetType     TargetType
  targetRole     Role?
  recipientCount Int
  sentAt         DateTime @default(now())

  @@index([adminId])
  @@index([sentAt])
}

enum TargetType {
  ALL
  ROLE
  SPECIFIC
}
```

### CleaningAssignment Table
```prisma
model CleaningAssignment {
  id         Int      @id @default(autoincrement())
  cleanerId  Int
  cleaner    User     @relation(fields: [cleanerId], references: [id])
  zone       String
  date       DateTime @db.Date
  shiftTime  String
  status     CleaningStatus @default(PENDING)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  records    CleaningRecord[]

  @@index([cleanerId])
  @@index([date])
  @@index([status])
}

enum CleaningStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  MISSED
}
```

### CleaningRecord Table
```prisma
model CleaningRecord {
  id           Int      @id @default(autoincrement())
  assignmentId Int
  assignment   CleaningAssignment @relation(fields: [assignmentId], references: [id])
  cleanerId    Int
  cleaner      User     @relation(fields: [cleanerId], references: [id])
  zone         String
  completedAt  DateTime
  photoUrl     String
  notes        String?  @db.Text
  createdAt    DateTime @default(now())

  @@index([assignmentId])
  @@index([cleanerId])
  @@index([completedAt])
}
```

### Payment Table
```prisma
model Payment {
  id            Int      @id @default(autoincrement())
  patientId     Int
  patient       User     @relation("PatientPayments", fields: [patientId], references: [id])
  appointmentId Int?
  appointment   Appointment? @relation(fields: [appointmentId], references: [id])
  amount        Decimal  @db.Decimal(10, 2)
  method        PaymentMethod
  status        PaymentStatus @default(COMPLETED)
  receiptNumber String   @unique
  cashierId     Int
  cashier       User     @relation("CashierPayments", fields: [cashierId], references: [id])
  description   String?
  notes         String?  @db.Text
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([patientId])
  @@index([cashierId])
  @@index([createdAt])
}

enum PaymentMethod {
  CASH
  CARD
  INSURANCE
  BANK_TRANSFER
}

enum PaymentStatus {
  COMPLETED
  PENDING
  REFUNDED
  VOIDED
}
```

### LabTest Table
```prisma
model LabTest {
  id            Int      @id @default(autoincrement())
  patientId     Int
  patient       User     @relation("PatientLabTests", fields: [patientId], references: [id])
  appointmentId Int?
  appointment   Appointment? @relation(fields: [appointmentId], references: [id])
  testType      String
  status        LabTestStatus @default(PENDING)
  urgency       LabTestUrgency @default(ROUTINE)
  orderedBy     Int
  doctor        User     @relation("DoctorLabTests", fields: [orderedBy], references: [id])
  technicianId  Int?
  technician    User?    @relation("TechnicianLabTests", fields: [technicianId], references: [id])
  notes         String?  @db.Text
  orderedAt     DateTime @default(now())
  startedAt     DateTime?
  completedAt   DateTime?
  results       LabResult[]

  @@index([patientId])
  @@index([status])
  @@index([technicianId])
  @@index([orderedAt])
}

enum LabTestStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum LabTestUrgency {
  ROUTINE
  URGENT
  STAT
}
```

### LabResult Table
```prisma
model LabResult {
  id            Int      @id @default(autoincrement())
  labTestId     Int
  labTest       LabTest  @relation(fields: [labTestId], references: [id])
  results       Json
  resultFileUrl String?
  notes         String?  @db.Text
  technicianId  Int
  technician    User     @relation(fields: [technicianId], references: [id])
  createdAt     DateTime @default(now())

  @@unique([labTestId])
  @@index([labTestId])
}
```

### AppointmentReview Table
```prisma
model AppointmentReview {
  id            Int      @id @default(autoincrement())
  appointmentId Int      @unique
  appointment   Appointment @relation(fields: [appointmentId], references: [id])
  patientId     Int
  patient       User     @relation("PatientReviews", fields: [patientId], references: [id])
  doctorId      Int
  doctor        User     @relation("DoctorReviews", fields: [doctorId], references: [id])
  rating        Int      @db.SmallInt
  comment       String?  @db.Text
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([appointmentId])
  @@index([doctorId])
}
```

---

## File Upload Configuration

### Multer Configuration (Backend)
```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Ensure upload directories exist
const uploadDirs = {
  cleaning: './uploads/cleaning-photos',
  labResults: './uploads/lab-results'
};

Object.values(uploadDirs).forEach(async (dir) => {
  await fs.mkdir(dir, { recursive: true });
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.path.includes('cleaning') ? 'cleaning' : 'labResults';
    cb(null, uploadDirs[type]);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

module.exports = upload;
```

---

## Implementation Priority

### Phase 1 (High Priority)
1. ✅ Notifications API - Core functionality
2. ✅ Cleaning Management API - Admin & Cleaner workflows
3. ✅ Database schema migrations

### Phase 2 (Medium Priority)
4. Payments API - Cashier dashboard
5. Lab Tests API - Lab tech workflow
6. Patient Dashboard API

### Phase 3 (Enhancement)
7. File upload optimization
8. WebSocket for real-time notifications
9. Analytics and reporting endpoints
10. Performance optimization

---

## Testing Requirements

### Unit Tests
- Controller logic for each endpoint
- Service layer business logic
- Validation schemas

### Integration Tests
- Full API flow for each feature
- File upload handling
- Authorization checks

### End-to-End Tests
- Complete user workflows
- Cross-role interactions
- Error handling scenarios

---

## Security Checklist

- [ ] All endpoints have authentication middleware
- [ ] Role-based access control implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma handles this)
- [ ] File upload size limits enforced
- [ ] File type validation
- [ ] Sanitize file names
- [ ] Rate limiting on notification sending
- [ ] XSS prevention in notification messages
- [ ] CORS properly configured
- [ ] Sensitive data not exposed in responses
- [ ] Audit logging for admin actions

---

This document serves as the single source of truth for all missing backend endpoints that need to be implemented.
