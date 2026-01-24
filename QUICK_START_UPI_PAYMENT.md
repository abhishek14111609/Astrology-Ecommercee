# UPI Payment System - Quick Start Guide

## Quick Setup (5 minutes)

### 1. Backend Setup
No additional setup needed! The system uses the existing backend structure with file upload capabilities already in place.

### 2. Test the Payment Flow

#### Step 1: Start Backend
```bash
cd Backend
npm start
```

#### Step 2: Start Frontend (Customer)
```bash
cd Frontend
npm run dev
```
Open: `http://localhost:5173`

#### Step 3: Start Admin Panel
```bash
cd Admin\ Auric\ Krystal
npm run dev
```
Open: `http://localhost:5174`

## Quick Test Walkthrough

### Testing as Customer

1. **Go to Frontend** (`http://localhost:5173`)
2. **Login or Register**
   - Create a test account or login
3. **Add Products to Cart**
   - Browse shop and add items
4. **Go to Checkout**
   - Click "Cart" → "Proceed to Checkout"
5. **Fill Shipping Details**
   - Enter name, email, address, etc.
   - Click "Continue to Payment"
6. **Select Payment Method**
   - Choose "UPI Payment (GPay, PhonePe, etc.)"
   - Click "Proceed to Payment"
7. **Payment Page** (`/payment/:orderId`)
   - See order total
   - See QR code placeholder (will show after admin configures)
   - See UPI ID (will show after admin configures)
   - See payment instructions

### Testing as Admin

1. **Go to Admin Panel** (`http://localhost:5174`)
2. **Login with Admin Account**
   - Use admin credentials

3. **Configure Payment Settings** (First time setup)
   - Click "Payment Settings" in left sidebar
   - Fill in:
     - **UPI ID**: `yourname@upi` or any test UPI ID
     - **Account Holder**: `Test Account`
     - **QR Code**: Upload any image as test QR code
     - **Instructions**: Add these sample instructions:
       - "Open GPay, PhonePe, or any UPI app"
       - "Scan the QR code or enter the UPI ID manually"
       - "Enter amount ₹[total amount]"
       - "Complete the payment and note the reference ID"
       - "Take a screenshot of the successful payment"
       - "Upload the screenshot below for verification"
   - Click "Save Settings"

4. **Verify Payment** (After customer uploads)
   - Click "Payment Verification" in sidebar
   - See list of pending payments
   - Click "Review" on any pending payment
   - Preview the uploaded screenshot
   - Add optional notes
   - Click "Approve" to verify payment and confirm order

## Testing with Sample Data

### Create Test Order
1. Login as customer
2. Add any product to cart
3. Proceed through checkout
4. Complete order creation
5. You'll be redirected to payment page

### Upload Test Screenshot
1. On payment page, take any screenshot
2. Upload it as payment proof
3. Checkbox appears after selecting file

### Admin Review
1. Login as admin
2. Go to "Payment Verification"
3. See pending payment
4. Review and approve/reject

## Database Collections Created Automatically

The system will automatically create:
- `orders` - Updated with payment fields
- `payment_settings` - Stores UPI configuration
- `counters` - Auto-incremented IDs

## API Endpoints Quick Reference

### For Testing with Postman/cURL

#### Get Payment Settings (Public)
```bash
GET http://localhost:3000/api/payment/settings
```

#### Upload Payment Screenshot (Authenticated)
```bash
POST http://localhost:3000/api/payment/upload-screenshot/1
Headers: Authorization: Bearer {token}
Body: form-data
  - screenshot: [file]
```

#### Admin: Get Pending Payments
```bash
GET http://localhost:3000/api/admin/payments/pending-payments
Headers: Authorization: Bearer {admin_token}
```

#### Admin: Approve Payment
```bash
POST http://localhost:3000/api/admin/payments/approve-payment/1
Headers: Authorization: Bearer {admin_token}
Body: {"adminNotes": "Payment verified"}
```

## Common Issues & Solutions

### Issue: "No file uploaded" error
**Solution**: Ensure file is selected before clicking upload button

### Issue: Payment settings not showing on customer page
**Solution**: 
1. Check admin has configured payment settings
2. Refresh page with Ctrl+F5 to clear cache
3. Check backend console for errors

### Issue: Uploaded screenshot not visible in admin
**Solution**:
1. Check `Backend/uploads/payment-screenshots/` folder exists
2. Verify file permissions on server
3. Check browser console for CORS errors

### Issue: Token/Auth errors
**Solution**:
1. Clear localStorage and login again
2. Check token is valid and not expired
3. Verify Authorization header is present in requests

## Customization Tips

### Change UPI ID
- Admin Panel → Payment Settings → UPI ID field
- Update and save

### Change QR Code
- Admin Panel → Payment Settings → Upload QR Code
- Select new image file

### Modify Instructions
- Admin Panel → Payment Settings → Payment Instructions
- Add/edit/remove steps as needed

### Change Colors
- Edit `Frontend/src/pages/PaymentPage.jsx`
- Modify Tailwind CSS classes (e.g., `bg-auric-rose` to other colors)

### Change Payment Page Layout
- Edit `Frontend/src/pages/PaymentPage.jsx`
- Modify grid, spacing, and component structure

## Success Indicators

✅ Payment page loads correctly
✅ QR code displays (after admin upload)
✅ UPI ID copies to clipboard
✅ Screenshot upload accepts image files
✅ Admin can see pending payments
✅ Admin approval updates order status
✅ Payment status updates on customer page

## Next Steps

1. **Test Full Flow**
   - Create order → Upload screenshot → Verify as admin

2. **Customize Settings**
   - Add your actual UPI ID
   - Upload real QR code
   - Modify payment instructions

3. **Send to Testing Team**
   - Provide customer and admin login credentials
   - Share payment page URL

4. **Production Deployment**
   - Update production UPI ID
   - Upload production QR code
   - Test with real payments

## Support & Help

For issues:
1. Check browser console (F12)
2. Check backend terminal for errors
3. Verify all files are created
4. Check MongoDB is running and connected
5. Verify ports (5173, 5174, 3000) are available

Happy testing! 🎉
