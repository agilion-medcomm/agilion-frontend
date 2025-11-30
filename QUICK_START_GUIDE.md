# 🚀 Quick Start Guide - Dashboard Enhancements

## 📍 Access URLs (Development)

- **Main Site**: http://localhost:5173/
- **Personnel Login**: http://localhost:5173/personelLogin
- **Dashboard**: http://localhost:5173/dashboard

## 🔑 Test Login Credentials

Since we're using mock data, create test users in your backend with these roles:
- ADMIN
- DOCTOR
- CLEANER
- CASHIER
- LAB_TECH
- PATIENT

## 🎯 Feature Locations

### Admin Features
- `/dashboard` - Dashboard home with statistics
- `/dashboard/personnel` - Personnel management (CRUD)
- `/dashboard/appointments` - All appointments with date filters
- `/dashboard/patients` - Patient list
- `/dashboard/leave-requests` - Manage leave requests (approve/reject)
- `/dashboard/cleaning` - **NEW** Cleaning assignments & history
- `/dashboard/notifications-sender` - **NEW** Send alerts to personnel
- `/dashboard/notifications` - View all notifications

### Doctor Features
- `/dashboard` - Personal dashboard
- `/dashboard/appointments` - My appointments
- `/dashboard/patients` - My patients
- `/dashboard/leave-requests` - Submit leave requests
- `/dashboard/lab-results` - Lab results
- `/dashboard/notifications` - Notifications

### Cleaner Features
- `/dashboard` - Dashboard home
- `/dashboard/cleaning` - **NEW** My cleaning assignments with photo upload
- `/dashboard/notifications` - Notifications

### Cashier Features
- `/dashboard` - Dashboard home
- `/dashboard/payments` - **NEW** Payment management, record transactions
- `/dashboard/notifications` - Notifications

### Lab Tech Features
- `/dashboard` - Dashboard home
- `/dashboard/lab-tests` - **NEW** Manage lab tests, upload results
- `/dashboard/notifications` - Notifications

### Patient Features
- `/dashboard` - Dashboard home
- `/dashboard/my-appointments` - **NEW** My appointments (past & future)
- `/dashboard/lab-results` - My lab results with download
- Leave reviews for completed appointments
- `/dashboard/notifications` - Notifications

## 🔔 Notification System Usage

### For All Users
1. **Bell Icon** (top-right corner)
   - Shows unread count
   - Click to see recent notifications
   - Click notification to go to related page

2. **Dashboard Alert**
   - Appears when logging in with unread notifications
   - Shakes to grab attention
   - Auto-dismisses after 8 seconds
   - Manual close with X button

3. **Notifications Page**
   - View all notifications
   - Separate unread/read sections
   - Click to navigate to related feature
   - Mark all as read

### For Admins Only
4. **Send Notifications** (`/dashboard/notifications-sender`)
   - Send to all personnel
   - Send to specific role (all doctors, all cleaners, etc.)
   - Send to specific individuals
   - See recipient count before sending
   - View sent notification history

## 🧹 Cleaning System Usage

### Admin View (`/dashboard/cleaning`)
1. Click "Assign New Task"
2. Select cleaner from dropdown
3. Choose zone (ICU, Emergency, Surgery, etc.)
4. Set date
5. View assignments in table
6. Filter by zone or cleaner
7. See cleaning history with photos

### Cleaner View (`/dashboard/cleaning`)
1. See today's assignments at top
2. Each assignment shows:
   - Zone to clean
   - Assigned time
   - Status (Pending/Completed)
3. Click "Upload Photo" when done
4. Choose photo from device
5. Add optional notes
6. Submit
7. See completed tasks in history below

## 💰 Cashier Dashboard Usage

1. Access via `/dashboard/payments`
2. **Record New Payment**:
   - Click "Record New Payment"
   - Enter patient name
   - Enter amount
   - Select method (Cash/Card/Insurance/Bank Transfer)
   - Enter receipt number
   - Add description
   - Submit
3. **View Statistics**:
   - Today's revenue
   - Transaction count
   - Cash vs Card breakdown
4. **Filter Payments**:
   - By period (Today/Week/Month/All)
   - By payment method
5. **Print Receipts**:
   - Click printer icon on any payment

## 🧪 Lab Tech Dashboard Usage

1. Access via `/dashboard/lab-tests`
2. **View Pending Tests**:
   - See all pending and in-progress tests
   - Priority indicators (URGENT/NORMAL)
3. **Start a Test**:
   - Click "Start Test" on pending test
   - Status changes to IN_PROGRESS
4. **Upload Results**:
   - Click "Upload Results" on in-progress test
   - Enter results in JSON format
   - Optionally upload PDF/image file
   - Add technician notes
   - Submit
5. **View Completed Tests**:
   - Switch filter to "All Tests"
   - Click "View Results"

## 🏥 Patient Dashboard Usage

1. Access via `/dashboard/my-appointments`
2. **My Appointments Tab**:
   - View all appointments
   - Filter: All / Upcoming / Past
   - See doctor, department, date, time
3. **Leave a Review** (on completed appointments):
   - Click "Leave a Review"
   - Select 1-5 stars
   - Add optional comment
   - Submit
4. **Lab Results Tab**:
   - View all test results
   - Click "Download Report" to get PDF
5. **My Reviews Tab**:
   - See all reviews you've left
   - View ratings given

## 🎨 UI Features

### Animations
- Bell rings when new notifications arrive
- Dashboard shakes on login with new alerts
- Cards lift on hover
- Smooth transitions throughout

### Color Badges
- 🔵 Blue = Confirmed, Card, Appointment
- 🟢 Green = Completed, Approved, Cash
- 🟡 Yellow = Pending, In Progress
- 🔴 Red = Rejected, Urgent, Cancelled
- 🟣 Purple = Primary actions

### Responsive
- Works on desktop, tablet, mobile
- Sidebar collapses on small screens
- Tables adapt to screen size

## 🔧 Developer Quick Reference

### Add a New Notification Programmatically
```javascript
import { useNotifications } from './context/NotificationContext';

const { addNotification } = useNotifications();

addNotification({
  title: 'New Leave Request',
  message: 'Dr. Smith has requested leave on June 15',
  type: 'LEAVE_REQUEST'
});
```

### Create a New Role Dashboard
1. Create component: `src/components/Dashboard/[Role]Dashboard.jsx`
2. Add route in `App.jsx`:
   ```jsx
   <Route path="my-route" element={<MyDashboard />} />
   ```
3. Add navigation in `DashboardLayout.jsx`:
   ```javascript
   if (user?.role === 'MY_ROLE') {
     return [...baseNav, { path: '/dashboard/my-route', icon: <Icon />, label: 'Label' }];
   }
   ```

### Mock Data Pattern
All pages use this pattern:
```javascript
// TODO: Replace with real API call
// const response = await axios.get(`${BaseURL}/api/v1/endpoint`);

// Mock data
const mockData = [...];
setData(mockData);
```

Replace mock data with real API calls following the documented endpoints.

## 📖 Documentation Files

- **COMPLETE_ENHANCEMENT_SUMMARY.md** - Full feature list and changes
- **IMPLEMENTATION_CHECKLIST.md** - Backend API requirements and schemas
- **DASHBOARD_README.md** - Original dashboard documentation
- **TESTING_GUIDE.md** - Testing instructions

## 🐛 Common Issues

### Notification Badge Not Showing
- Check if NotificationProvider is wrapping the app in `main.jsx`
- Verify user is logged in via PersonnelAuthContext

### Route Not Found
- Check `App.jsx` for route definition
- Verify role-based navigation in `DashboardLayout.jsx`

### Photo Upload Not Working
- Currently using mock - needs backend endpoint
- See `IMPLEMENTATION_CHECKLIST.md` for upload configuration

### Statistics Not Calculating
- Using mock data - implement real API calls
- Check date filtering logic

## 🎯 Next Steps for Full Functionality

1. **Implement Backend APIs**
   - See `IMPLEMENTATION_CHECKLIST.md`
   - All endpoints documented with schemas

2. **Replace Mock Data**
   - Search for "TODO: Replace with real API call"
   - Follow existing axios pattern

3. **Configure File Uploads**
   - Set up multer/similar on backend
   - Configure max file size
   - Add file type validation

4. **Add Real-time Updates**
   - Implement WebSocket for notifications
   - Add polling for dashboard statistics
   - Enable live appointment updates

5. **Testing**
   - Follow `TESTING_GUIDE.md`
   - Test each role separately
   - Verify all CRUD operations

---

**Development Server**: Running on http://localhost:5173/

**Ready to use!** All 21 requested features are implemented and working with mock data. 🎉
