# UPI Payment System - Testing Guide

## Test Scenarios & Procedures

### Scenario 1: Happy Path - Successful Payment Flow

**Objective**: Complete a full payment flow from order creation to admin approval

**Steps**:

1. **Customer Login**
   - Go to Frontend (http://localhost:5173)
   - Login with existing account or create new account
   - Verify user is authenticated

2. **Product Selection**
   - Browse Shop page
   - Add 2-3 products to cart
   - Verify cart count updates
   - Go to Cart page

3. **Checkout**
   - Click "Proceed to Checkout"
   - Fill shipping details:
     - First Name: "John"
     - Last Name: "Doe"
     - Email: "john@test.com"
     - Phone: "9876543210"
     - Address: "123 Main Street"
     - City: "Mumbai"
     - Pincode: "400001"
   - Click "Continue to Payment"

4. **Payment Method Selection**
   - Verify step shows "Payment"
   - Select "UPI Payment (GPay, PhonePe, etc.)"
   - Verify description shows UPI information
   - Click "Proceed to Payment"

5. **Order Creation & Redirect**
   - Verify "Order Confirmed" message appears
   - Wait for redirect to payment page
   - Verify URL is `/payment/{orderId}`

6. **Payment Page**
   - Verify amount displays correctly (₹XXXX)
   - Verify QR code shows (if admin configured)
   - Verify UPI ID displays
   - Copy UPI ID button works
   - Payment instructions visible

7. **Screenshot Upload**
   - Take screenshot of screen
   - Click upload area or drag & drop
   - Select screenshot file
   - Verify preview shows
   - Check terms checkbox
   - Click "Upload Screenshot"

8. **Upload Confirmation**
   - Verify "Screenshot uploaded successfully!" message
   - See "Payment Under Verification" status
   - Auto-redirect to profile page

9. **Admin Verification**
   - Login to Admin Panel (http://localhost:5174)
   - Navigate to "Payment Verification"
   - See pending payment in list
   - Click "Review"

10. **Admin Review & Approval**
    - View order details
    - See customer information
    - Preview screenshot
    - Add optional note: "Payment verified - Order #AK-XXXXX"
    - Click "Approve"

11. **Final Verification**
    - Admin sees success message
    - Payment list updates
    - Payment status changes to "verified"
    - Order status changes to "confirmed"

**Expected Results**: ✅ All steps complete successfully

---

### Scenario 2: Rejected Payment Flow

**Objective**: Test payment rejection and re-upload

**Prerequisite**: Complete steps 1-8 from Scenario 1

**Steps**:

1. **Admin Rejection**
   - In Admin Panel, go to "Payment Verification"
   - Click "Review" on pending payment
   - Fill rejection reason: "Invalid payment proof - Please try again"
   - Click "Reject"

2. **Admin Confirmation**
   - Verify success message appears
   - Payment removed from pending list

3. **Customer Experience**
   - Login to Frontend as customer
   - Go to Profile/Orders
   - Find the order
   - Payment status shows "rejected"
   - See rejection reason: "Invalid payment proof..."
   - See "Upload Again" option

4. **Re-upload**
   - Customer re-uploads screenshot
   - Repeats payment upload process

5. **Admin Re-Review**
   - Admin reviews again
   - Approves the second upload

**Expected Results**: ✅ Payment can be rejected and re-uploaded

---

### Scenario 3: Payment Settings Configuration

**Objective**: Test admin ability to configure payment settings

**Steps**:

1. **Admin Login**
   - Go to Admin Panel (http://localhost:5174)
   - Login as admin

2. **Payment Settings Page**
   - Click "Payment Settings" in sidebar
   - Verify page loads

3. **UPI Configuration**
   - Enter UPI ID: `rahulshah1976@okaxis`
   - Enter Account Holder: `Rahul Shah`
   - Click "Add" for instructions
   - Add instruction: "Open GPay, PhonePe, or any UPI app"
   - Add instruction: "Scan the QR code or enter the UPI ID"
   - Add instruction: "Enter the amount shown above"
   - Add instruction: "Complete the payment and note the reference ID"
   - Add instruction: "Take a screenshot of the successful payment confirmation"
   - Add instruction: "Upload the screenshot below for verification"

4. **QR Code Upload**
   - Click upload area under "QR Code"
   - Select a test image (JPG, PNG, or WEBP)
   - Verify preview shows

5. **Save Settings**
   - Click "Save Settings"
   - Verify success message appears

6. **Verify Settings Applied**
   - Logout and login as customer
   - Create new order
   - Go to payment page
   - Verify new UPI ID displays
   - Verify QR code shows
   - Verify instructions appear

**Expected Results**: ✅ Settings saved and applied

---

### Scenario 4: File Validation

**Objective**: Test file upload validation

**Steps**:

1. **Create Order & Go to Payment Page**
   - Complete steps 1-5 from Scenario 1

2. **Test Invalid File Type**
   - Try uploading a .txt file
   - Expect error: "Only image files are allowed"
   - ✅ Rejected

3. **Test Large File**
   - Create image > 5MB
   - Try uploading
   - Expect error: "File size exceeded"
   - ✅ Rejected

4. **Test Valid File**
   - Upload PNG image < 5MB
   - Preview appears
   - ✅ Accepted

5. **Test Multiple Uploads**
   - Upload first screenshot
   - Click "Remove Image"
   - Upload different screenshot
   - Verify new preview shows
   - ✅ Replace works

**Expected Results**: ✅ File validation working correctly

---

### Scenario 5: Authentication & Authorization

**Objective**: Test security features

**Steps**:

1. **Test Customer Can Only Upload Own Order**
   - Customer A creates order #1
   - Customer B tries to access payment for order #1
   - Expected: Redirect to login or error
   - ✅ Cannot access

2. **Test Admin Can Only Approve with Token**
   - Try accessing `/api/admin/payments/pending-payments` without token
   - Expected: 401 Unauthorized
   - ✅ Rejected

3. **Test Admin Approval Requires Token**
   - Remove authorization header
   - Try uploading screenshot
   - Expected: 401 Unauthorized
   - ✅ Rejected

4. **Test Order Owner Verification**
   - Create two customers A and B
   - A creates order and uploads screenshot
   - Try to view B's order as customer A
   - Expected: 403 Forbidden
   - ✅ Denied

**Expected Results**: ✅ Authorization working correctly

---

### Scenario 6: Edge Cases

**Objective**: Test edge cases and error handling

**Steps**:

1. **Test Without Accepting Terms**
   - Upload screenshot
   - Don't check terms checkbox
   - Try clicking "Upload Screenshot"
   - Expected: Error message "Please accept the terms"
   - ✅ Prevented

2. **Test Multiple Quick Uploads**
   - Upload screenshot
   - Immediately click upload again before first completes
   - Expected: Only one upload processes
   - ✅ Handled

3. **Test Rapid Approvals**
   - Create multiple pending payments
   - Admin rapidly approves several
   - Expected: All processed correctly
   - ✅ No conflicts

4. **Test With Minimum Data**
   - Order with single item, ₹100
   - Upload screenshot
   - Admin approves
   - Expected: Works correctly
   - ✅ Handled

5. **Test With Large Order**
   - Order with 20+ items, ₹100,000+
   - Upload screenshot
   - Admin approves
   - Expected: Works correctly
   - ✅ Handled

**Expected Results**: ✅ Edge cases handled gracefully

---

## Manual Testing Checklist

### Backend API Testing

Use Postman or cURL to test:

```bash
# Test 1: Get payment settings (public)
curl http://localhost:3000/api/payment/settings

# Test 2: Get pending payments (requires auth)
curl -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/admin/payments/pending-payments

# Test 3: Upload screenshot (requires auth)
curl -X POST \
  -H "Authorization: Bearer {token}" \
  -F "screenshot=@test.jpg" \
  http://localhost:3000/api/payment/upload-screenshot/1

# Test 4: Approve payment (requires auth)
curl -X POST \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"adminNotes":"Verified"}' \
  http://localhost:3000/api/admin/payments/approve-payment/1

# Test 5: Reject payment (requires auth)
curl -X POST \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"rejectionReason":"Invalid proof"}' \
  http://localhost:3000/api/admin/payments/reject-payment/1
```

### Frontend UI Testing

- [ ] Payment page loads correctly
- [ ] QR code displays properly
- [ ] UPI ID copy button works
- [ ] Instructions display in order
- [ ] File upload accepts images only
- [ ] Preview shows selected image
- [ ] Upload disables until terms checked
- [ ] Success message appears after upload
- [ ] Status updates to "Pending Verification"
- [ ] Rejected payments show reason
- [ ] Can re-upload after rejection
- [ ] Page is responsive on mobile

### Admin UI Testing

- [ ] Admin login works
- [ ] Payment Settings page loads
- [ ] Can enter UPI ID and save
- [ ] Can add/remove instructions
- [ ] Can upload QR code
- [ ] Settings appear on customer payment page
- [ ] Pending payments list loads
- [ ] Can click Review on payment
- [ ] Screenshot preview displays
- [ ] Can approve payment
- [ ] Can reject with reason
- [ ] Admin notes save correctly
- [ ] Payment removed from list after action

### Database Testing

- [ ] Order created with payment_status: 'pending'
- [ ] Screenshot path stored correctly
- [ ] Payment settings created/updated
- [ ] Admin approval date recorded
- [ ] Rejection reason stored
- [ ] File cleanup on rejection

---

## Browser DevTools Testing

### Console Checks
- [ ] No JavaScript errors
- [ ] No 404 errors in network tab
- [ ] Correct API endpoints called
- [ ] Auth tokens passed correctly

### Network Tab Checks
- [ ] Payment screenshot upload size reasonable
- [ ] QR code image loads quickly
- [ ] No failed requests

### Application Tab Checks
- [ ] Token stored in localStorage
- [ ] User data present
- [ ] No sensitive data exposed

---

## Performance Testing

### Load Tests
1. Create 10 orders simultaneously
2. Upload 10 screenshots simultaneously
3. Admin approves 10 payments rapidly
4. Expected: No slowdown or errors

### File Upload Tests
1. Upload 5MB maximum file
2. Upload multiple files in sequence
3. Expected: All succeed without issues

---

## Negative Testing

### Invalid Inputs
- [ ] Empty UPI ID
- [ ] Invalid email format
- [ ] Negative amount
- [ ] Special characters in fields
- [ ] Very long text (>1000 chars)
- [ ] Non-image file as QR code
- [ ] Missing required fields

### Security Tests
- [ ] SQL injection in notes field
- [ ] XSS in rejection reason
- [ ] Path traversal in file upload
- [ ] CSRF token validation
- [ ] JWT token tampering

### Boundary Tests
- [ ] Order with ₹0 amount
- [ ] Order with ₹999,999,999
- [ ] 1000+ items in order
- [ ] Very old order (1 year)
- [ ] Future date test

---

## Test Results Template

```
Test Scenario: [Name]
Date: [Date]
Tester: [Name]
Environment: [Dev/Staging/Prod]

Steps Executed:
1. ✅/❌ [Step]
2. ✅/❌ [Step]
3. ✅/❌ [Step]

Expected Result: [Description]
Actual Result: [Description]

Status: PASS/FAIL
Issues Found: [List any bugs]
Comments: [Additional notes]

Sign-off: [Tester Name] [Date]
```

---

## Known Limitations & Future Improvements

### Current Limitations
1. No automatic payment reminder emails
2. No payment receipt generation
3. No refund management
4. No payment gateway integration
5. Manual admin verification required
6. No SMS notifications

### Future Enhancements
1. [ ] Automatic email notifications
2. [ ] SMS alerts for customers
3. [ ] Payment receipt PDF download
4. [ ] Automated order fulfillment
5. [ ] Payment gateway integration (Razorpay, Stripe)
6. [ ] AI-based payment verification
7. [ ] Dispute resolution system
8. [ ] Payment analytics dashboard
9. [ ] Multi-currency support
10. [ ] Batch payment processing

---

## Support Resources

### Common Issues & Solutions

**Issue**: Screenshot upload fails
- Solution: Check file format, size < 5MB, valid image

**Issue**: Payment settings not showing
- Solution: Ensure admin configured settings first

**Issue**: Cannot see pending payments
- Solution: Verify logged in as admin with proper role

**Issue**: Screenshots not displaying
- Solution: Check uploads folder permissions

### Debug Commands
```bash
# Check upload folder
ls -la Backend/uploads/payment-screenshots/

# Check MongoDB data
db.orders.findOne({payment_status: "pending_approval"})
db.payment_settings.findOne({})

# Check server logs
tail -f Backend/logs/server.log
```

Happy testing! 🧪
