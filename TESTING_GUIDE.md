# 🧪 Dashboard Testing Guide

## Quick Start

### 1. Start the Backend Server
```bash
cd cavus
npm install
npm run dev
```
Backend should run on `http://localhost:3000`

### 2. Start the Frontend
```bash
# In the root directory
npm install
npm run dev
```
Frontend should run on `http://localhost:5173`

## Test Credentials

### Admin Login
- **TCKN**: (Use the admin TCKN from your database)
- **Password**: (Use the admin password)

### Doctor Login
- **TCKN**: (Use a doctor TCKN from your database)
- **Password**: (Use the doctor password)

## Testing Checklist

### ✅ Login Flow
- [ ] Navigate to `/personelLogin`
- [ ] Enter admin credentials
- [ ] Verify redirect to `/dashboard`
- [ ] Check sidebar shows all admin navigation items
- [ ] Test doctor login
- [ ] Verify doctor sees limited navigation

### ✅ Dashboard Home
- [ ] Statistics cards display correctly
- [ ] Time filter buttons work (Today, 7d, 2w, 1m, 3m, 6m, 1y)
- [ ] Data updates when changing time filter
- [ ] Hero section shows correct user name
- [ ] Bottom statistics grid displays
- [ ] All numbers are reasonable (no NaN or errors)

### ✅ Personnel Page (Admin)
- [ ] Table shows all personnel
- [ ] Search box filters results
- [ ] Role filter chips work
- [ ] Click "Add Personnel" opens modal
- [ ] Fill form and submit - new personnel appears
- [ ] Click edit icon - modal opens with data
- [ ] Update personnel information
- [ ] Click delete icon - confirmation modal appears
- [ ] Confirm delete - personnel removed
- [ ] Cannot delete own account

### ✅ Appointments Page
- **As Admin:**
- [ ] See all appointments from all doctors
- [ ] Filter by status (ALL, PENDING, APPROVED, CANCELLED)
- [ ] Cancel an appointment
- [ ] Status updates correctly

- **As Doctor:**
- [ ] See only own appointments
- [ ] Cancel own appointments
- [ ] Cannot see other doctors' appointments

### ✅ Patients Page
- [ ] Table shows all registered patients
- [ ] Search by name works
- [ ] Search by TCKN works
- [ ] Search by email works
- [ ] Avatar displays initials
- [ ] Date formatting is correct

### ✅ Leave Requests Page
- **As Doctor:**
- [ ] Click "Create Request" button
- [ ] Select start date and time
- [ ] Select end date and time
- [ ] Enter reason
- [ ] Submit successfully
- [ ] New request appears in table with PENDING status

- **As Admin:**
- [ ] See all leave requests
- [ ] PENDING requests show "Approve" button
- [ ] Click approve
- [ ] Status changes to APPROVED
- [ ] Approved requests no longer show action button

### ✅ Sidebar Navigation
- [ ] All menu items are clickable
- [ ] Active page is highlighted
- [ ] Sidebar collapses on toggle button
- [ ] Icons remain visible when collapsed
- [ ] User avatar and name display
- [ ] Emergency contact shows (when expanded)
- [ ] Logout button works

### ✅ Responsive Design
- **Desktop (> 1024px):**
- [ ] Sidebar fully expanded
- [ ] All text visible
- [ ] Tables fit properly

- **Tablet (768-1024px):**
- [ ] Sidebar auto-collapses
- [ ] Content adjusts properly
- [ ] Tables scroll horizontally if needed

- **Mobile (< 768px):**
- [ ] Sidebar shows icons only
- [ ] Stats grid stacks vertically
- [ ] Modals are full width
- [ ] Buttons stack properly

### ✅ Error Handling
- [ ] Invalid login shows error message
- [ ] API errors display user-friendly messages
- [ ] Loading states show spinners
- [ ] Empty states show "No data" messages
- [ ] Form validation works (required fields)

### ✅ Visual Design
- [ ] Gradients render correctly
- [ ] Colors match design spec
- [ ] Hover effects work on buttons
- [ ] Transitions are smooth
- [ ] Badges have correct colors
- [ ] Shadows and spacing look good

## Common Issues & Solutions

### Issue: "Cannot read property 'role' of undefined"
**Solution**: Make sure you're logged in and the token is valid. Check `localStorage.getItem('personnelToken')`

### Issue: Statistics show 0 or NaN
**Solution**: 
- Check backend is running
- Verify appointments/patients data exists in database
- Check API responses in Network tab

### Issue: Sidebar doesn't show correct items
**Solution**: Verify user role in PersonnelAuthContext. Admin should see all items, Doctor should see limited.

### Issue: "404 Not Found" on API calls
**Solution**: 
- Verify backend is running on port 3000
- Check `.env` file has correct `VITE_API_BASE`
- Confirm API routes in backend

### Issue: Modal doesn't close
**Solution**: Click outside modal or use close button (X). Check console for JavaScript errors.

### Issue: Table doesn't show data
**Solution**:
- Check API response in Network tab
- Verify data format matches component expectations
- Check for console errors

## Performance Testing

### Load Time
- [ ] Dashboard loads in < 2 seconds
- [ ] API calls complete in reasonable time
- [ ] No memory leaks (check DevTools)

### Interactions
- [ ] Button clicks respond immediately
- [ ] Modals open smoothly
- [ ] Table sorting/filtering is fast
- [ ] No layout shifts during loading

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Accessibility

- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Form labels are proper
- [ ] Color contrast is sufficient

## Security Checks

- [ ] Unauthenticated users redirect to login
- [ ] JWT token is validated
- [ ] Admin-only features hidden from doctors
- [ ] No sensitive data in console logs
- [ ] HTTPS in production

## Data Validation

### Personnel Form
- [ ] TCKN must be 11 digits
- [ ] Email format validated
- [ ] Password minimum 8 characters
- [ ] All required fields enforced

### Leave Request Form
- [ ] Start date required
- [ ] End date must be after start date
- [ ] Reason field required
- [ ] Time selection works

## Edge Cases

- [ ] Empty database (no personnel, patients, appointments)
- [ ] Very long names (UI doesn't break)
- [ ] Special characters in search
- [ ] Large datasets (1000+ records)
- [ ] Simultaneous logins
- [ ] Network offline/slow

## Final Checklist

- [ ] All pages load without errors
- [ ] All CRUD operations work
- [ ] Search and filters function correctly
- [ ] Modals open and close properly
- [ ] Logout redirects to login page
- [ ] No console errors
- [ ] Design matches reference image
- [ ] Responsive on all screen sizes
- [ ] Performance is acceptable
- [ ] Code is clean and documented

## Report Issues

If you find bugs or issues:
1. Check console for errors
2. Check Network tab for failed requests
3. Note the steps to reproduce
4. Document expected vs actual behavior
5. Include screenshots if relevant

## Success Criteria

✅ **Dashboard is complete when:**
1. All pages are accessible and functional
2. CRUD operations work correctly
3. Role-based access is enforced
4. UI matches design specifications
5. No critical bugs or errors
6. Responsive design works on all devices
7. API integration is successful
8. User experience is smooth and intuitive

---

**Happy Testing! 🎉**
