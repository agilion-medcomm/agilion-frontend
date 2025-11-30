# New Dashboard System

## Overview
This is a comprehensive admin/doctor panel system with a modern design inspired by the Medflex dashboard. It completely replaces the old admin and doctor panel pages.

## Features

### 🏠 Dashboard Home
- Welcome screen with personalized greeting
- Statistical cards showing key metrics (patients, surgeries, discharges, etc.)
- Time filters (Today, 7d, 2w, 1m, 3m, 6m, 1y)
- Bottom statistics grid with appointments, doctors, staff, operations, etc.

### 👥 Personnel Management (Admin Only)
- View all hospital personnel
- Add new personnel with all required fields (TCKN, name, role, specialization, etc.)
- Edit existing personnel information
- Delete personnel (with confirmation)
- Search and filter by role
- Role-based badges (Doctor, Admin, Lab Tech, Cashier, Cleaner)

### 📅 Appointments Management
- **Admin**: View all appointments across all doctors
- **Doctor**: View only their own appointments
- Filter by status (Pending, Approved, Cancelled)
- Cancel appointments
- View appointment details (date, time, doctor, patient)

### 🏥 Patients Management
- View all registered patients
- Search by name, TCKN, or email
- Display patient information (name, contact, date of birth)
- (Lab results integration placeholder ready)

### 📋 Leave Requests
- **Admin**: View all leave requests, approve/reject
- **Doctor**: Create new leave requests with date range and reason
- Status tracking (Pending, Approved, Rejected)
- Automatic calendar blocking when approved

### 📧 Contact Forms (Placeholder)
- Ready for implementation
- Admin can review contact form submissions

### 🧪 Lab Results (Placeholder)
- Ready for implementation
- Doctors/Admins can view patient laboratory results

## Navigation

The dashboard features a collapsible sidebar with:
- Logo and user profile section
- Dynamic navigation based on user role
- Emergency contact display
- Logout button

### Admin Navigation:
- Dashboard
- Personnel
- Appointments
- Patients
- Leave Requests
- Contact Forms
- Lab Results

### Doctor Navigation:
- Dashboard
- My Appointments
- Patients
- Leave Requests
- Lab Results

## Technology Stack
- React with React Router
- Axios for API calls
- CSS3 with modern animations and transitions
- Responsive design for mobile/tablet/desktop

## API Endpoints Used
- `GET /api/v1/personnel` - Fetch all personnel
- `POST /api/v1/personnel` - Add new personnel
- `PUT /api/v1/personnel/:id` - Update personnel
- `DELETE /api/v1/personnel/:id` - Delete personnel
- `GET /api/v1/appointments` - Fetch appointments
- `PUT /api/v1/appointments/:id/status` - Update appointment status
- `GET /api/v1/patients` - Fetch all patients
- `GET /api/v1/leave-requests` - Fetch leave requests
- `POST /api/v1/leave-requests` - Create leave request
- `PUT /api/v1/leave-requests/:id/status` - Approve/reject leave request

## Routes
- `/dashboard` - Dashboard home
- `/dashboard/personnel` - Personnel management
- `/dashboard/appointments` - Appointments
- `/dashboard/patients` - Patients list
- `/dashboard/leave-requests` - Leave requests
- `/dashboard/contact-forms` - Contact forms
- `/dashboard/lab-results` - Lab results

## Access Control
- All routes protected by `ProtectedPersonnelRoute`
- Role-based UI rendering (Admin sees more options)
- Personnel login redirects to `/dashboard`

## Design Features
- Modern, clean interface with gradient backgrounds
- Smooth animations and transitions
- Hover effects on interactive elements
- Color-coded status badges
- Responsive data tables
- Modal dialogs for forms
- Search and filter functionality
- Loading states and error handling

## Old Panel Files (Can be deleted)
- `src/components/pages/panels/AdminPanel.jsx`
- `src/components/pages/panels/AdminPanelPage.css`
- `src/components/pages/panels/DoctorPanel.jsx`
- `src/components/pages/panels/DoctorPanelPage.css`

These are no longer used and have been completely replaced by the new dashboard system.
